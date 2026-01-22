package com.ferreteria.service;

import com.ferreteria.dto.ComprobanteDTO;
import com.ferreteria.dto.GenerarComprobanteRequest;
import com.ferreteria.entity.Comprobante;
import com.ferreteria.entity.TipoComprobante;
import com.ferreteria.entity.Pedido;
import com.ferreteria.repository.ComprobanteRepository;
import com.ferreteria.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComprobanteService {

    private final ComprobanteRepository comprobanteRepository;
    private final PedidoRepository pedidoRepository;
    private final com.ferreteria.repository.ProductoRepository productoRepository;
    private final PDFService pdfService;

    @Value("${app.base-url:https://ferrecarlos.vercel.app/}")
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

        // Asegurar que cada detalle tenga la información completa del producto
        // (Failsafe)
        if (pedido.getDetalles() != null) {
            for (com.ferreteria.entity.DetallePedido detalle : pedido.getDetalles()) {
                if (detalle.getProducto() != null && detalle.getProducto().getNombre() == null) {
                    com.ferreteria.entity.Producto full = productoRepository.findById(detalle.getProducto().getId())
                            .orElse(null);
                    if (full != null) {
                        detalle.setProducto(full);
                    }
                }
            }
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
                .fechaEmision(LocalDateTime.now(ZoneId.of("America/Lima")))
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
     * Genera un comprobante automáticamente tras la confirmación del pago
     */
    @Transactional
    public void generarComprobanteAutomatico(Pedido pedidoLazy) {
        // Recargar el pedido para asegurar que todas las relaciones (Detalles ->
        // Producto) estén cargadas
        // Esto evita que iText reciba nombres de productos nulos si no se han
        // refrescado desde el save inicial.
        Pedido pedido = pedidoRepository.findByIdWithDetails(pedidoLazy.getId())
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado al generar comprobante"));

        // Asegurar que cada detalle tenga la información completa del producto
        // (Failsafe)
        if (pedido.getDetalles() != null) {
            for (com.ferreteria.entity.DetallePedido detalle : pedido.getDetalles()) {
                if (detalle.getProducto() != null && detalle.getProducto().getNombre() == null) {
                    com.ferreteria.entity.Producto full = productoRepository.findById(detalle.getProducto().getId())
                            .orElse(null);
                    if (full != null) {
                        detalle.setProducto(full);
                    }
                }
            }
        }

        // Evitar duplicados
        if (comprobanteRepository.findByPedidoId(pedido.getId()).isPresent()) {
            return;
        }

        // Lógica de Negocio: Si el documento tiene 11 dígitos, es FACTURA. Si no,
        // BOLETA.
        TipoComprobante tipo = TipoComprobante.BOLETA;
        if (pedido.getClienteDocumento() != null && pedido.getClienteDocumento().trim().length() == 11) {
            tipo = TipoComprobante.FACTURA;
        }

        String numero = generarNumeroComprobante(tipo);
        BigDecimal subtotal = calcularSubtotal(pedido.getTotal());
        BigDecimal igv = calcularIGV(subtotal);

        Comprobante comprobante = Comprobante.builder()
                .pedido(pedido)
                .numeroComprobante(numero)
                .tipo(tipo)
                .fechaEmision(LocalDateTime.now(ZoneId.of("America/Lima")))
                .clienteNombre(pedido.getClienteNombre() != null ? pedido.getClienteNombre()
                        : (pedido.getUsuario() != null ? pedido.getUsuario().getNombre() : "Cliente General"))
                .clienteDocumento(pedido.getClienteDocumento() != null ? pedido.getClienteDocumento() : "")
                .clienteDireccion(pedido.getClienteDireccion())
                .clienteTelefono(pedido.getClienteTelefono())
                .subtotal(subtotal)
                .igv(igv)
                .total(pedido.getTotal())
                .estado("EMITIDO")
                .build();

        comprobante = comprobanteRepository.save(comprobante);

        String url = baseUrl + "/comprobantes/ver/" + comprobante.getId();
        comprobante.setUrlPublica(url);
        comprobante.setQrCodeUrl(url);
        comprobante.setPdfData(pdfService.generateComprobantePDF(comprobante));

        comprobante = comprobanteRepository.save(comprobante);
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
     * Lista comprobantes de un usuario específico
     */
    public List<ComprobanteDTO> listarPorUsuario(String usuarioId) {
        return comprobanteRepository.findByPedidoUsuarioId(usuarioId).stream()
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
        int proximoNumero = 1;
        Optional<Comprobante> ultimo = comprobanteRepository.findFirstByTipoOrderByNumeroComprobanteDesc(tipo);

        if (ultimo.isPresent()) {
            String numCompleto = ultimo.get().getNumeroComprobante();
            try {
                String[] partes = numCompleto.split("-");
                if (partes.length > 1) {
                    proximoNumero = Integer.parseInt(partes[1]) + 1;
                }
            } catch (Exception e) {
                proximoNumero = (int) comprobanteRepository.count() + 1;
            }
        } else {
            proximoNumero = (int) comprobanteRepository.count() + 1;
        }

        String prefijo = tipo == TipoComprobante.FACTURA ? "F" : "B";
        String serie = "001";
        String finalNum;

        // Bucle de seguridad para evitar colisiones
        do {
            finalNum = prefijo + serie + "-" + String.format("%05d", proximoNumero);
            proximoNumero++;
        } while (comprobanteRepository.findByNumeroComprobante(finalNum).isPresent());

        return finalNum;
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
