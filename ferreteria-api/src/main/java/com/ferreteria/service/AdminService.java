package com.ferreteria.service;

import com.ferreteria.entity.Admin;
import java.util.List;

public interface AdminService {
    Admin createAdmin(Admin admin);
    Admin getAdminById(String id);
    List<Admin> getAllAdmins();
    Admin updateAdmin(String id, Admin admin);
    void deleteAdmin(String id);
}