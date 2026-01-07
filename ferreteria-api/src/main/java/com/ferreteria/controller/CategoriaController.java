package com.ferreteria.controller;

import com.ferreteria.entity.Categoria;
import com.ferreteria.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    @PostMapping
    public ResponseEntity<Categoria> createCategoria(@Valid @RequestBody Categoria categoria) {
        return new ResponseEntity<>(categoriaService.createCategoria(categoria), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> getCategoriaById(@PathVariable String id) {
        return ResponseEntity.ok(categoriaService.getCategoriaById(id));
    }

    @GetMapping
    public ResponseEntity<List<Categoria>> getAllCategorias() {
        return ResponseEntity.ok(categoriaService.getAllCategorias());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categoria> updateCategoria(@PathVariable String id, @Valid @RequestBody Categoria categoria) {
        return ResponseEntity.ok(categoriaService.updateCategoria(id, categoria));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoria(@PathVariable String id) {
        categoriaService.deleteCategoria(id);
        return ResponseEntity.noContent().build();
    }
}