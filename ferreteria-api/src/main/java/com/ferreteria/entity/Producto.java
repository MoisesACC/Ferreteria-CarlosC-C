package com.ferreteria.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private BigDecimal precio;
    private BigDecimal precioAnterior;
    private String marca;
    private Integer stock;
    private String imagen; // Principal image

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "producto_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<ProductoImagen> imagenes = new java.util.ArrayList<>();

    @Transient
    public List<String> getImagenesAdicionales() {
        if (imagenes == null)
            return new java.util.ArrayList<>();
        return imagenes.stream().map(ProductoImagen::getUrl).collect(java.util.stream.Collectors.toList());
    }

    public void setImagenesAdicionales(List<String> urls) {
        if (this.imagenes == null)
            this.imagenes = new java.util.ArrayList<>();
        this.imagenes.clear();
        if (urls != null) {
            this.imagenes.addAll(urls.stream()
                    .map(url -> ProductoImagen.builder().url(url).build())
                    .collect(java.util.stream.Collectors.toList()));
        }
    }

    private Boolean esOferta;
    private Boolean esNuevo;
    private Boolean esMasVendido;
    private Double puntuacion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
}