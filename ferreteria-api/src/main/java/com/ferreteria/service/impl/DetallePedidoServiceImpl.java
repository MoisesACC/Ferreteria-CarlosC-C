package com.ferreteria.service.impl;

import com.ferreteria.entity.DetallePedido;
import com.ferreteria.exception.ResourceNotFoundException;
import com.ferreteria.repository.DetallePedidoRepository;
import com.ferreteria.service.DetallePedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DetallePedidoServiceImpl implements DetallePedidoService {

    private final DetallePedidoRepository repository;

    @Override
    @Transactional
    public DetallePedido createDetalle(DetallePedido detalle) {
        return repository.save(detalle);
    }

    @Override
    @Transactional(readOnly = true)
    public DetallePedido getDetalleById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DetallePedido not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DetallePedido> getAllDetalles() {
        return repository.findAll();
    }

    @Override
    @Transactional
    public DetallePedido updateDetalle(Long id, DetallePedido details) {
        DetallePedido existing = getDetalleById(id);
        existing.setCantidad(details.getCantidad());
        existing.setPrecioUnitario(details.getPrecioUnitario());
        existing.setPedido(details.getPedido());
        existing.setProducto(details.getProducto());
        return repository.save(existing);
    }

    @Override
    @Transactional
    public void deleteDetalle(Long id) {
        DetallePedido existing = getDetalleById(id);
        repository.delete(existing);
    }
}