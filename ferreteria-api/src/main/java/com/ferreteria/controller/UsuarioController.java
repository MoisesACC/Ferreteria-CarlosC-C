package com.ferreteria.controller;

import com.ferreteria.dto.LoginRequest;
import com.ferreteria.entity.Usuario;
import com.ferreteria.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(usuarioService.login(loginRequest));
    }

    @PostMapping
    public ResponseEntity<Usuario> createUsuario(@Valid @RequestBody Usuario usuario) {
        return new ResponseEntity<>(usuarioService.createUsuario(usuario), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable String id) {
        return ResponseEntity.ok(usuarioService.getUsuarioById(id));
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioService.getAllUsuarios());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable String id, @RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.updateUsuario(id, usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable String id) {
        usuarioService.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }
}