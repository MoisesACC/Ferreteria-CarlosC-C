package com.ferreteria.service.impl;

import com.ferreteria.entity.Categoria;
import com.ferreteria.exception.ResourceNotFoundException;
import com.ferreteria.repository.CategoriaRepository;
import com.ferreteria.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Override
    @Transactional
    public Categoria createCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @Override
    @Transactional(readOnly = true)
    public Categoria getCategoriaById(String id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    @Override
    @Transactional
    public Categoria updateCategoria(String id, Categoria categoriaDetails) {
        Categoria categoria = getCategoriaById(id);
        categoria.setNombre(categoriaDetails.getNombre());
        categoria.setDescripcion(categoriaDetails.getDescripcion());
        return categoriaRepository.save(categoria);
    }

    @Override
    @Transactional
    public void deleteCategoria(String id) {
        Categoria categoria = getCategoriaById(id);
        categoriaRepository.delete(categoria);
    }
}