package com.ferreteria.service.impl;

import com.ferreteria.entity.Carrito;
import com.ferreteria.exception.ResourceNotFoundException;
import com.ferreteria.repository.CarritoRepository;
import com.ferreteria.service.CarritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarritoServiceImpl implements CarritoService {

    private final CarritoRepository carritoRepository;

    @Override
    @Transactional
    public Carrito createCarrito(Carrito carrito) {
        return carritoRepository.save(carrito);
    }

    @Override
    @Transactional(readOnly = true)
    public Carrito getCarritoById(Long id) {
        return carritoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito item not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Carrito> getAllCarritos() {
        return carritoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Carrito> getCarritoByUsuario(String usuarioId) {
        return carritoRepository.findByUsuarioId(usuarioId);
    }

    @Override
    @Transactional
    public Carrito updateCarrito(Long id, Carrito details) {
        Carrito carrito = getCarritoById(id);
        carrito.setCantidad(details.getCantidad());
        carrito.setUsuario(details.getUsuario());
        carrito.setProducto(details.getProducto());
        return carritoRepository.save(carrito);
    }

    @Override
    @Transactional
    public void deleteCarrito(Long id) {
        Carrito carrito = getCarritoById(id);
        carritoRepository.delete(carrito);
    }
}