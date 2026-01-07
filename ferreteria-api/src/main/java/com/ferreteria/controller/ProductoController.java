package com.ferreteria.controller;

import com.ferreteria.entity.Producto;
import com.ferreteria.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @PostMapping
    public ResponseEntity<Producto> createProducto(@Valid @RequestBody Producto producto) {
        return new ResponseEntity<>(productoService.createProducto(producto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.getProductoById(id));
    }

    @GetMapping
    public ResponseEntity<List<Producto>> getAllProductos() {
        return ResponseEntity.ok(productoService.getAllProductos());
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<Producto>> getProductosByCategoria(@PathVariable String categoriaId) {
        return ResponseEntity.ok(productoService.getProductosByCategoria(categoriaId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @Valid @RequestBody Producto producto) {
        return ResponseEntity.ok(productoService.updateProducto(id, producto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        productoService.deleteProducto(id);
        return ResponseEntity.noContent().build();
    }
}