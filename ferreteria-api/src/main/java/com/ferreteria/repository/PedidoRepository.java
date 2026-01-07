package com.ferreteria.repository;

import com.ferreteria.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, String> {
    List<Pedido> findByUsuarioId(String usuarioId);
}