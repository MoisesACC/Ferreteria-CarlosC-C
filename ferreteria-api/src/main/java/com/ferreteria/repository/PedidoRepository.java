package com.ferreteria.repository;

import com.ferreteria.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, String> {
    List<Pedido> findByUsuarioId(String usuarioId);

    @Query("SELECT p FROM Pedido p JOIN FETCH p.detalles d JOIN FETCH d.producto WHERE p.id = :id")
    Optional<Pedido> findByIdWithDetails(@Param("id") String id);
}