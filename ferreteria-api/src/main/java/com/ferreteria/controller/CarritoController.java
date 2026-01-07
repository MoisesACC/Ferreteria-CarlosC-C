package com.ferreteria.controller;

import com.ferreteria.entity.Carrito;
import com.ferreteria.service.CarritoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carritos")
@RequiredArgsConstructor
public class CarritoController {

    private final CarritoService carritoService;

    @PostMapping
    public ResponseEntity<Carrito> createCarrito(@Valid @RequestBody Carrito carrito) {
        return new ResponseEntity<>(carritoService.createCarrito(carrito), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Carrito> getCarritoById(@PathVariable Long id) {
        return ResponseEntity.ok(carritoService.getCarritoById(id));
    }

    @GetMapping
    public ResponseEntity<List<Carrito>> getAllCarritos() {
        return ResponseEntity.ok(carritoService.getAllCarritos());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Carrito>> getCarritoByUsuario(@PathVariable String usuarioId) {
        return ResponseEntity.ok(carritoService.getCarritoByUsuario(usuarioId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Carrito> updateCarrito(@PathVariable Long id, @Valid @RequestBody Carrito carrito) {
        return ResponseEntity.ok(carritoService.updateCarrito(id, carrito));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCarrito(@PathVariable Long id) {
        carritoService.deleteCarrito(id);
        return ResponseEntity.noContent().build();
    }
}