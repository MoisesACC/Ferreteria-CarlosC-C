import React, { createContext, useContext, useState } from 'react';
import type { Usuario } from '../types';

interface AuthContextType {
    user: Usuario | null;
    login: (userData: Usuario) => void;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Usuario | null>(() => {
        const savedUser = localStorage.getItem('proferret_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData: Usuario) => {
        setUser(userData);
        localStorage.setItem('proferret_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('proferret_user');
    };

    const isAdmin = user?.rol === 'ADMIN';

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
