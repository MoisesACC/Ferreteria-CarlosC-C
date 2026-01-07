package com.ferreteria.service.impl;

import com.ferreteria.entity.Admin;
import com.ferreteria.exception.ResourceNotFoundException;
import com.ferreteria.repository.AdminRepository;
import com.ferreteria.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;

    @Override
    @Transactional
    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    @Override
    @Transactional(readOnly = true)
    public Admin getAdminById(String id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin config not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    @Transactional
    public Admin updateAdmin(String id, Admin details) {
        Admin admin = getAdminById(id);
        admin.setNombreRol(details.getNombreRol());
        admin.setPermisos(details.getPermisos());
        return adminRepository.save(admin);
    }

    @Override
    @Transactional
    public void deleteAdmin(String id) {
        Admin admin = getAdminById(id);
        adminRepository.delete(admin);
    }
}