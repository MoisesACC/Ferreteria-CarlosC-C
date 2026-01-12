package com.ferreteria.entity;

import jakarta.persistence.*;
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
@Entity
@Table(name = "comprobantes")
public class Comprobante {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @Column(nullable = false, unique = true)
    private String numeroComprobante; // F001-00001 o B001-00001

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoComprobante tipo; // BOLETA, FACTURA

    @Column(nullable = false)
    private LocalDateTime fechaEmision;

    // Datos del cliente
    @Column(nullable = false)
    private String clienteNombre;

    @Column(nullable = false)
    private String clienteDocumento;

    private String clienteDireccion;
    private String clienteTelefono;

    // Montos
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal igv; // 18%

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    // QR y URL
    @Column(length = 500)
    private String qrCodeUrl;

    @Column(length = 500)
    private String urlPublica;

    // PDF almacenado
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] pdfData;

    private String estado; // EMITIDO, ANULADO
}
