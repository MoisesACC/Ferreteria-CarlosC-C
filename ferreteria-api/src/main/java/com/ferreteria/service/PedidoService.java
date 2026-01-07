package com.ferreteria.service;

import com.ferreteria.entity.Pedido;
import java.util.List;

public interface PedidoService {
    Pedido createPedido(Pedido pedido);

    Pedido getPedidoById(String id);

    List<Pedido> getAllPedidos();

    List<Pedido> getPedidosByUsuario(String usuarioId);

    Pedido updatePedido(String id, Pedido pedido);

    void deletePedido(String id);
}