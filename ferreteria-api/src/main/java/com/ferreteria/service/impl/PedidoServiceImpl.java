package com.ferreteria.service.impl;

import com.ferreteria.entity.Pedido;
import com.ferreteria.exception.ResourceNotFoundException;
import com.ferreteria.repository.PedidoRepository;
import com.ferreteria.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;

    @Override
    @Transactional
    public Pedido createPedido(Pedido pedido) {
        if (pedido.getDetalles() != null) {
            pedido.getDetalles().forEach(detalle -> detalle.setPedido(pedido));
        }
        return pedidoRepository.save(pedido);
    }

    @Override
    @Transactional(readOnly = true)
    public Pedido getPedidoById(String id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pedido> getAllPedidos() {
        return pedidoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pedido> getPedidosByUsuario(String usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    @Override
    @Transactional
    public Pedido updatePedido(String id, Pedido details) {
        Pedido pedido = getPedidoById(id);
        if (details.getFecha() != null)
            pedido.setFecha(details.getFecha());
        if (details.getEstado() != null)
            pedido.setEstado(details.getEstado());
        if (details.getTotal() != null)
            pedido.setTotal(details.getTotal());
        if (details.getUsuario() != null)
            pedido.setUsuario(details.getUsuario());
        return pedidoRepository.save(pedido);
    }

    @Override
    @Transactional
    public void deletePedido(String id) {
        Pedido pedido = getPedidoById(id);
        pedidoRepository.delete(pedido);
    }
}