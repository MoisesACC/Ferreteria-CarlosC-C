package com.ferreteria.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    private String nombre;

    @Column(unique = true)
    private String email;

    @NotNull
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String contrasena;

    private String rol;

    private String documento;
    private String direccion;
    private String telefono;
}