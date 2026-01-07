package com.ferreteria.repository;

import com.ferreteria.entity.Testimonio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestimonioRepository extends JpaRepository<Testimonio, Long> {
}
