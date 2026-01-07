package com.ferreteria.service;

import com.ferreteria.entity.Producto;
import java.util.List;

public interface ProductoService {
    Producto createProducto(Producto producto);

    Producto getProductoById(Long id);

    List<Producto> getAllProductos();

    List<Producto> getProductosByCategoria(String categoriaId);

    Producto updateProducto(Long id, Producto producto);

    void deleteProducto(Long id);
}