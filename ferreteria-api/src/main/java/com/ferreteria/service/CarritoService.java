package com.ferreteria.service;

import com.ferreteria.entity.Carrito;
import java.util.List;

public interface CarritoService {
    Carrito createCarrito(Carrito carrito);

    Carrito getCarritoById(Long id);

    List<Carrito> getAllCarritos();

    List<Carrito> getCarritoByUsuario(String usuarioId);

    Carrito updateCarrito(Long id, Carrito carrito);

    void deleteCarrito(Long id);
}