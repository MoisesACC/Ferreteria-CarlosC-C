import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';

export const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const response = await api.post('/usuarios/login', {
                    email,
                    contrasena: password
                });
                login(response.data);
                if (response.data.rol === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                await api.post('/usuarios', {
                    nombre,
                    email,
                    contrasena: password,
                    rol: 'CLIENT'
                });
                setIsLogin(true);
                alert('Registro exitoso. Por favor inicia sesión.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <Logo width={250} />
                    </div>
                    <h2 style={{ fontSize: '2rem' }}>{isLogin ? 'Bienvenido' : 'Únete a nosotros'}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isLogin ? 'Ingresa para gestionar tus proyectos' : 'Crea una cuenta para compras más rápidas'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(255, 59, 48, 0.1)',
                        color: '#FF3B30',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {!isLogin && (
                        <div className="input-group">
                            <label><User size={18} /> Nombre</label>
                            <input
                                type="text"
                                placeholder="Tu nombre completo"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label><Mail size={18} /> Email</label>
                        <input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label><Lock size={18} /> Contraseña</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{
                            marginTop: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {isLogin ? (
                        <p>¿No tienes cuenta? <button type="button" style={{ background: 'transparent', color: 'var(--primary)', fontWeight: 'bold' }} onClick={() => setIsLogin(false)}>Regístrate</button></p>
                    ) : (
                        <p>¿Ya tienes cuenta? <button type="button" style={{ background: 'transparent', color: 'var(--primary)', fontWeight: 'bold' }} onClick={() => setIsLogin(true)}>Inicia sesión</button></p>
                    )}
                </div>

                <style>{`
          .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .input-group label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            color: var(--text-muted);
          }
          .input-group input {
            padding: 12px;
            background-color: var(--input-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--input-text);
            transition: var(--transition);
          }
          .input-group input:focus {
            outline: none;
            border-color: var(--primary);
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          @media (max-width: 480px) {
            .glass-card {
                padding: 1.5rem !important;
            }
            h2 {
                font-size: 1.5rem !important;
            }
          }
        `}</style>
            </motion.div>
        </div>
    );
};
