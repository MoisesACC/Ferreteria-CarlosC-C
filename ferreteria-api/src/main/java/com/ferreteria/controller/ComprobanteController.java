package com.ferreteria.controller;

import com.ferreteria.dto.ComprobanteDTO;
import com.ferreteria.dto.GenerarComprobanteRequest;
import com.ferreteria.service.ComprobanteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comprobantes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ComprobanteController {

    private final ComprobanteService comprobanteService;

    /**
     * Genera un nuevo comprobante
     * POST /api/comprobantes/generar
     */
    @PostMapping("/generar")
    public ResponseEntity<ComprobanteDTO> generarComprobante(
            @Valid @RequestBody GenerarComprobanteRequest request) {
        ComprobanteDTO comprobante = comprobanteService.generarComprobante(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(comprobante);
    }

    /**
     * Obtiene un comprobante por ID
     * GET /api/comprobantes/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ComprobanteDTO> obtenerComprobante(@PathVariable String id) {
        ComprobanteDTO comprobante = comprobanteService.obtenerComprobante(id);
        return ResponseEntity.ok(comprobante);
    }

    /**
     * Obtiene el comprobante de un pedido
     * GET /api/comprobantes/pedido/{pedidoId}
     */
    @GetMapping("/pedido/{pedidoId}")
    public ResponseEntity<ComprobanteDTO> obtenerComprobantePorPedido(@PathVariable String pedidoId) {
        ComprobanteDTO comprobante = comprobanteService.obtenerComprobantePorPedido(pedidoId);
        return ResponseEntity.ok(comprobante);
    }

    /**
     * Descarga el PDF de un comprobante
     * GET /api/comprobantes/{id}/pdf
     */
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> descargarPDF(@PathVariable String id) {
        byte[] pdfBytes = comprobanteService.obtenerPDF(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "comprobante-" + id + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    /**
     * Visualiza el PDF en el navegador (sin descargar)
     * GET /api/comprobantes/{id}/ver-pdf
     */
    @GetMapping("/{id}/ver-pdf")
    public ResponseEntity<byte[]> verPDF(@PathVariable String id) {
        byte[] pdfBytes = comprobanteService.obtenerPDF(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.set("Content-Disposition", "inline; filename=comprobante-" + id + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    /**
     * Lista todos los comprobantes (ADMIN)
     * GET /api/comprobantes
     */
    @GetMapping
    public ResponseEntity<List<ComprobanteDTO>> listarComprobantes() {
        List<ComprobanteDTO> comprobantes = comprobanteService.listarComprobantes();
        return ResponseEntity.ok(comprobantes);
    }

    /**
     * Anula un comprobante (ADMIN)
     * PUT /api/comprobantes/{id}/anular
     */
    @PutMapping("/{id}/anular")
    public ResponseEntity<ComprobanteDTO> anularComprobante(@PathVariable String id) {
        ComprobanteDTO comprobante = comprobanteService.anularComprobante(id);
        return ResponseEntity.ok(comprobante);
    }
}
