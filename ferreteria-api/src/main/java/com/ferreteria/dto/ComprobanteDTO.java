package com.ferreteria.dto;

import com.ferreteria.entity.TipoComprobante;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComprobanteDTO {
    private String id;
    private String pedidoId;
    private String numeroComprobante;
    private TipoComprobante tipo;
    private LocalDateTime fechaEmision;

    // Datos del cliente
    private String clienteNombre;
    private String clienteDocumento;
    private String clienteDireccion;
    private String clienteTelefono;

    // Montos
    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;

    // URLs
    private String urlPublica;
    private String qrCodeUrl;

    private String estado;
}
