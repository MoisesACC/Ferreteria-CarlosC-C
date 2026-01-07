package com.ferreteria.controller;

import com.ferreteria.entity.Testimonio;
import com.ferreteria.repository.TestimonioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/testimonios")
@RequiredArgsConstructor
public class TestimonioController {
    private final TestimonioRepository testimonioRepository;

    @GetMapping
    public ResponseEntity<List<Testimonio>> getAllTestimonios() {
        return ResponseEntity.ok(testimonioRepository.findAll());
    }
}
