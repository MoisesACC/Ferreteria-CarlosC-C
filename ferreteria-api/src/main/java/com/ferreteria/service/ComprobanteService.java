package com.ferreteria.service;

import com.ferreteria.dto.ComprobanteDTO;
import com.ferreteria.dto.GenerarComprobanteRequest;
import com.ferreteria.entity.Comprobante;
import com.ferreteria.entity.TipoComprobante;
import com.ferreteria.entity.Pedido;
import com.ferreteria.repository.ComprobanteRepository;
import com.ferreteria.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComprobanteService {

    private final ComprobanteRepository comprobanteRepository;
    private final PedidoRepository pedidoRepository;
    private final PDFService pdfService;

    @Value("${app.base-url:https://ferrecarlos.up.railway.app/}")
    private String baseUrl;

    /**
     * Genera un comprobante (Boleta o Factura) para un pedido
     */
    @Transactional
    public ComprobanteDTO generarComprobante(GenerarComprobanteRequest request) {
        // Validar que el pedido existe
        Pedido pedido = pedidoRepository.findById(request.getPedidoId())
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Validar que no exista ya un comprobante para este pedido
        if (comprobanteRepository.findByPedidoId(request.getPedidoId()).isPresent()) {
            throw new RuntimeException("Ya existe un comprobante para este pedido");
        }

        // Generar número de comprobante
        String numeroComprobante = generarNumeroComprobante(request.getTipo());

        // Calcular montos
        BigDecimal subtotal = calcularSubtotal(pedido.getTotal());
        BigDecimal igv = calcularIGV(subtotal);
        BigDecimal total = pedido.getTotal();

        // Crear entidad comprobante
        Comprobante comprobante = Comprobante.builder()
                .pedido(pedido)
                .numeroComprobante(numeroComprobante)
                .tipo(request.getTipo())
                .fechaEmision(LocalDateTime.now())
                .clienteNombre(request.getClienteNombre())
                .clienteDocumento(request.getClienteDocumento())
                .clienteDireccion(request.getClienteDireccion())
                .clienteTelefono(request.getClienteTelefono())
                .subtotal(subtotal)
                .igv(igv)
                .total(total)
                .estado("EMITIDO")
                .build();

        // Guardar para obtener ID
        comprobante = comprobanteRepository.save(comprobante);

        // Generar URL pública
        String urlPublica = baseUrl + "/comprobantes/ver/" + comprobante.getId();
        comprobante.setUrlPublica(urlPublica);
        comprobante.setQrCodeUrl(urlPublica);

        // Generar PDF
        byte[] pdfBytes = pdfService.generateComprobantePDF(comprobante);
        comprobante.setPdfData(pdfBytes);

        // Guardar con PDF y URL
        comprobante = comprobanteRepository.save(comprobante);

        return convertToDTO(comprobante);
    }

    /**
     * Obtiene un comprobante por ID
     */
    public ComprobanteDTO obtenerComprobante(String id) {
        Comprobante comprobante = comprobanteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado"));
        return convertToDTO(comprobante);
    }

    /**
     * Obtiene el comprobante de un pedido
     */
    public ComprobanteDTO obtenerComprobantePorPedido(String pedidoId) {
        Comprobante comprobante = comprobanteRepository.findByPedidoId(pedidoId)
                .orElseThrow(() -> new RuntimeException("No se encontró comprobante para este pedido"));
        return convertToDTO(comprobante);
    }

    /**
     * Obtiene el PDF de un comprobante
     */
    public byte[] obtenerPDF(String comprobanteId) {
        Comprobante comprobante = comprobanteRepository.findById(comprobanteId)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado"));
        return comprobante.getPdfData();
    }

    /**
     * Lista todos los comprobantes
     */
    public List<ComprobanteDTO> listarComprobantes() {
        return comprobanteRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Anula un comprobante
     */
    @Transactional
    public ComprobanteDTO anularComprobante(String comprobanteId) {
        Comprobante comprobante = comprobanteRepository.findById(comprobanteId)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado"));

        if ("ANULADO".equals(comprobante.getEstado())) {
            throw new RuntimeException("El comprobante ya está anulado");
        }

        comprobante.setEstado("ANULADO");
        comprobante = comprobanteRepository.save(comprobante);

        return convertToDTO(comprobante);
    }

    /**
     * Genera el número de comprobante según el tipo
     */
    private String generarNumeroComprobante(TipoComprobante tipo) {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime inicioDia = ahora.toLocalDate().atStartOfDay();
        LocalDateTime finDia = ahora.toLocalDate().atTime(23, 59, 59);

        Long contador = comprobanteRepository.countByTipoAndFechaEmisionBetween(
                tipo, inicioDia, finDia);

        String prefijo = tipo == TipoComprobante.FACTURA ? "F" : "B";
        String serie = "001";
        String numero = String.format("%05d", contador + 1);

        return prefijo + serie + "-" + numero;
    }

    /**
     * Calcula el subtotal (sin IGV)
     */
    private BigDecimal calcularSubtotal(BigDecimal total) {
        return total.divide(new BigDecimal("1.18"), 2, RoundingMode.HALF_UP);
    }

    /**
     * Calcula el IGV (18%)
     */
    private BigDecimal calcularIGV(BigDecimal subtotal) {
        return subtotal.multiply(new BigDecimal("0.18"))
                .setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Convierte entidad a DTO
     */
    private ComprobanteDTO convertToDTO(Comprobante comprobante) {
        return ComprobanteDTO.builder()
                .id(comprobante.getId())
                .pedidoId(comprobante.getPedido().getId())
                .numeroComprobante(comprobante.getNumeroComprobante())
                .tipo(comprobante.getTipo())
                .fechaEmision(comprobante.getFechaEmision())
                .clienteNombre(comprobante.getClienteNombre())
                .clienteDocumento(comprobante.getClienteDocumento())
                .clienteDireccion(comprobante.getClienteDireccion())
                .clienteTelefono(comprobante.getClienteTelefono())
                .subtotal(comprobante.getSubtotal())
                .igv(comprobante.getIgv())
                .total(comprobante.getTotal())
                .urlPublica(comprobante.getUrlPublica())
                .qrCodeUrl(comprobante.getQrCodeUrl())
                .estado(comprobante.getEstado())
                .build();
    }
}
