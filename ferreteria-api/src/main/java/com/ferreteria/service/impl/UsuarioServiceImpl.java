package com.ferreteria.service.impl;

import com.ferreteria.dto.LoginRequest;
import com.ferreteria.entity.Usuario;
import com.ferreteria.exception.ResourceNotFoundException;
import com.ferreteria.repository.UsuarioRepository;
import com.ferreteria.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Usuario createUsuario(Usuario usuario) {
        // Encrypt password before saving
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        return usuarioRepository.save(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public Usuario getUsuarioById(String id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    @Override
    @Transactional
    public Usuario updateUsuario(String id, Usuario details) {
        Usuario usuario = getUsuarioById(id);
        usuario.setNombre(details.getNombre());
        usuario.setEmail(details.getEmail());
        usuario.setRol(details.getRol());
        usuario.setDocumento(details.getDocumento());
        usuario.setDireccion(details.getDireccion());
        usuario.setTelefono(details.getTelefono());

        // Solo actualizar contraseña si se proporciona una nueva y es diferente al hash
        // actual
        if (details.getContrasena() != null && !details.getContrasena().isBlank()) {
            // Si la contraseña recibida es diferente al hash actual, asumimos que es una
            // nueva contraseña en texto plano
            if (!details.getContrasena().equals(usuario.getContrasena())) {
                usuario.setContrasena(passwordEncoder.encode(details.getContrasena()));
            }
        }

        return usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public void deleteUsuario(String id) {
        Usuario usuario = getUsuarioById(id);
        usuarioRepository.delete(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public Usuario login(LoginRequest loginRequest) {
        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Email o contraseña incorrectos"));

        if (!passwordEncoder.matches(loginRequest.getContrasena(), usuario.getContrasena())) {
            throw new ResourceNotFoundException("Email o contraseña incorrectos");
        }

        return usuario;
    }
}