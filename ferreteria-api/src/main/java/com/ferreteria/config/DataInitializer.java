package com.ferreteria.config;

import com.ferreteria.entity.Usuario;
import com.ferreteria.repository.UsuarioRepository;
import com.ferreteria.repository.CategoriaRepository;
import com.ferreteria.repository.ProductoRepository;
import com.ferreteria.repository.TestimonioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final TestimonioRepository testimonioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Initialize default admin ONLY. Products and Categories will be managed via
        // Admin Panel.
        if (usuarioRepository.findByEmail("admin@ferreteria.com").isEmpty()) {
            Usuario admin = Usuario.builder()
                    .nombre("Administrador")
                    .email("admin@ferreteria.com")
                    .contrasena(passwordEncoder.encode("admin123"))
                    .rol("ADMIN")
                    .build();
            usuarioRepository.save(admin);
            System.out.println("Default admin created: admin@ferreteria.com / admin123");
        }

        System.out.println("Data initialization complete. System ready for Admin management.");
    }
}
