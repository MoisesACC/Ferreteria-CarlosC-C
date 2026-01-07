package com.ferreteria.controller;

import com.ferreteria.entity.Pedido;
import com.ferreteria.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<Pedido> createPedido(@Valid @RequestBody Pedido pedido) {
        return new ResponseEntity<>(pedidoService.createPedido(pedido), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getPedidoById(@PathVariable String id) {
        return ResponseEntity.ok(pedidoService.getPedidoById(id));
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> getAllPedidos() {
        return ResponseEntity.ok(pedidoService.getAllPedidos());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Pedido>> getPedidosByUsuario(@PathVariable String usuarioId) {
        return ResponseEntity.ok(pedidoService.getPedidosByUsuario(usuarioId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pedido> updatePedido(@PathVariable String id, @Valid @RequestBody Pedido pedido) {
        return ResponseEntity.ok(pedidoService.updatePedido(id, pedido));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePedido(@PathVariable String id) {
        pedidoService.deletePedido(id);
        return ResponseEntity.noContent().build();
    }
}