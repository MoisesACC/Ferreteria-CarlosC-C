package com.ferreteria.controller;

import com.ferreteria.entity.DetallePedido;
import com.ferreteria.service.DetallePedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalles-pedido")
@RequiredArgsConstructor
public class DetallePedidoController {

    private final DetallePedidoService service;

    @PostMapping
    public ResponseEntity<DetallePedido> createDetalle(@Valid @RequestBody DetallePedido detalle) {
        return new ResponseEntity<>(service.createDetalle(detalle), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetallePedido> getDetalleById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getDetalleById(id));
    }

    @GetMapping
    public ResponseEntity<List<DetallePedido>> getAllDetalles() {
        return ResponseEntity.ok(service.getAllDetalles());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DetallePedido> updateDetalle(@PathVariable Long id, @Valid @RequestBody DetallePedido detalle) {
        return ResponseEntity.ok(service.updateDetalle(id, detalle));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDetalle(@PathVariable Long id) {
        service.deleteDetalle(id);
        return ResponseEntity.noContent().build();
    }
}