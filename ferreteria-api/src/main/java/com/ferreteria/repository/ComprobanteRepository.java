package com.ferreteria.repository;

import com.ferreteria.entity.Comprobante;
import com.ferreteria.entity.TipoComprobante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComprobanteRepository extends JpaRepository<Comprobante, String> {

    Optional<Comprobante> findByPedidoId(String pedidoId);

    Optional<Comprobante> findByNumeroComprobante(String numeroComprobante);

    List<Comprobante> findByFechaEmisionBetween(LocalDateTime desde, LocalDateTime hasta);

    List<Comprobante> findByTipo(TipoComprobante tipo);

    List<Comprobante> findByEstado(String estado);

    Long countByTipoAndFechaEmisionBetween(
            TipoComprobante tipo,
            LocalDateTime desde,
            LocalDateTime hasta);
}
