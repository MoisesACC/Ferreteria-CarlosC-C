package com.ferreteria.service.impl;

import com.ferreteria.entity.Producto;
import com.ferreteria.exception.ResourceNotFoundException;
import com.ferreteria.repository.ProductoRepository;
import com.ferreteria.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;

    @Override
    @Transactional
    public Producto createProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    @Transactional(readOnly = true)
    public Producto getProductoById(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> getProductosByCategoria(String categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId);
    }

    @Override
    @Transactional
    public Producto updateProducto(Long id, Producto details) {
        Producto producto = getProductoById(id);
        producto.setNombre(details.getNombre());
        producto.setDescripcion(details.getDescripcion());
        producto.setPrecio(details.getPrecio());
        producto.setPrecioAnterior(details.getPrecioAnterior());
        producto.setMarca(details.getMarca());
        producto.setStock(details.getStock());
        producto.setImagen(details.getImagen());
        producto.setEsOferta(details.getEsOferta());
        producto.setEsNuevo(details.getEsNuevo());
        producto.setEsMasVendido(details.getEsMasVendido());
        producto.setPuntuacion(details.getPuntuacion());
        producto.setCategoria(details.getCategoria());
        producto.setImagenesAdicionales(details.getImagenesAdicionales());
        return productoRepository.save(producto);
    }

    @Override
    @Transactional
    public void deleteProducto(Long id) {
        Producto producto = getProductoById(id);
        productoRepository.delete(producto);
    }
}