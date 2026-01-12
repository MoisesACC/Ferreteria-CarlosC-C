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
    private final com.ferreteria.service.ComprobanteService comprobanteService;

    @Override
    @Transactional
    public Pedido createPedido(Pedido pedido) {
        if (pedido.getDetalles() != null) {
            pedido.getDetalles().forEach(detalle -> detalle.setPedido(pedido));
        }
        Pedido nuevo = pedidoRepository.save(pedido);
        if ("PAGADO".equals(nuevo.getEstado())) {
            comprobanteService.generarComprobanteAutomatico(nuevo);
        }
        return nuevo;
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
        String anterior = pedido.getEstado();

        if (details.getFecha() != null)
            pedido.setFecha(details.getFecha());
        if (details.getEstado() != null)
            pedido.setEstado(details.getEstado());
        if (details.getTotal() != null)
            pedido.setTotal(details.getTotal());
        if (details.getUsuario() != null)
            pedido.setUsuario(details.getUsuario());
        if (details.getClienteNombre() != null)
            pedido.setClienteNombre(details.getClienteNombre());
        if (details.getClienteDocumento() != null)
            pedido.setClienteDocumento(details.getClienteDocumento());
        if (details.getClienteDireccion() != null)
            pedido.setClienteDireccion(details.getClienteDireccion());
        if (details.getClienteTelefono() != null)
            pedido.setClienteTelefono(details.getClienteTelefono());

        Pedido actualizado = pedidoRepository.save(pedido);

        if ("PAGADO".equals(actualizado.getEstado()) && !"PAGADO".equals(anterior)) {
            comprobanteService.generarComprobanteAutomatico(actualizado);
        }

        return actualizado;
    }

    @Override
    @Transactional
    public void deletePedido(String id) {
        Pedido pedido = getPedidoById(id);
        pedidoRepository.delete(pedido);
    }
}