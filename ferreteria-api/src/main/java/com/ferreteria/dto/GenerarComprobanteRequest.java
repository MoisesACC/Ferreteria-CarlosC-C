package com.ferreteria.dto;

import com.ferreteria.entity.TipoComprobante;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerarComprobanteRequest {

    @NotBlank(message = "El ID del pedido es obligatorio")
    private String pedidoId;

    @NotNull(message = "El tipo de comprobante es obligatorio")
    private TipoComprobante tipo;

    @NotBlank(message = "El nombre del cliente es obligatorio")
    private String clienteNombre;

    @NotBlank(message = "El documento del cliente es obligatorio")
    private String clienteDocumento;

    private String clienteDireccion;
    private String clienteTelefono;
}
