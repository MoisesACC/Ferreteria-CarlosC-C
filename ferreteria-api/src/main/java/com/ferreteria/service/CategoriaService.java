package com.ferreteria.service;

import com.ferreteria.entity.Categoria;
import java.util.List;

public interface CategoriaService {
    Categoria createCategoria(Categoria categoria);
    Categoria getCategoriaById(String id);
    List<Categoria> getAllCategorias();
    Categoria updateCategoria(String id, Categoria categoria);
    void deleteCategoria(String id);
}