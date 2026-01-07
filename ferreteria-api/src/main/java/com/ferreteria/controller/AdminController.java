package com.ferreteria.controller;

import com.ferreteria.entity.Admin;
import com.ferreteria.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping
    public ResponseEntity<Admin> createAdmin(@Valid @RequestBody Admin admin) {
        return new ResponseEntity<>(adminService.createAdmin(admin), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getAdminById(id));
    }

    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable String id, @Valid @RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.updateAdmin(id, admin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable String id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }
}