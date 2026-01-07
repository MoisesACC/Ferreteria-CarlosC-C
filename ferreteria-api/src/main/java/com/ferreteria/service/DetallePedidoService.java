package com.ferreteria.service;

import com.ferreteria.entity.DetallePedido;
import java.util.List;

public interface DetallePedidoService {
    DetallePedido createDetalle(DetallePedido detalle);
    DetallePedido getDetalleById(Long id);
    List<DetallePedido> getAllDetalles();
    DetallePedido updateDetalle(Long id, DetallePedido detalle);
    void deleteDetalle(Long id);
}