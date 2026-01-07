package com.ferreteria.service;

import com.ferreteria.dto.LoginRequest;
import com.ferreteria.entity.Usuario;
import java.util.List;

public interface UsuarioService {
    Usuario createUsuario(Usuario usuario);

    Usuario getUsuarioById(String id);

    List<Usuario> getAllUsuarios();

    Usuario updateUsuario(String id, Usuario usuario);

    void deleteUsuario(String id);

    Usuario login(LoginRequest loginRequest);
}