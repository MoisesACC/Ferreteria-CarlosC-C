import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import '../styles/Login.css';

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

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/usuarios/login/google', {
                tokenId: credentialResponse.credential
            });
            login(response.data);
            if (response.data.rol === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            setError('Error al iniciar sesión con Google');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card login-card"
            >
                <div className="auth-header">
                    <div className="logo-container">
                        <Logo width={250} />
                    </div>
                    <h2 className="auth-title">{isLogin ? 'Bienvenido' : 'Únete a nosotros'}</h2>
                    <p className="auth-subtitle">
                        {isLogin ? 'Ingresa para gestionar tus proyectos' : 'Crea una cuenta para compras más rápidas'}
                    </p>
                </div>

                {error && (
                    <div className="error-alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
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
                        className="btn-primary btn-auth-submit"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="loader-spin" size={20} /> : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                        {!loading && <ArrowRight size={20} />}
                    </button>

                    <div className="divider-container">
                        <div className="divider-line"></div>
                        <span className="divider-text">O continúa con</span>
                        <div className="divider-line"></div>
                    </div>

                    <div className="google-container">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Error en la autenticación de Google')}
                            useOneTap
                            theme="filled_blue"
                            shape="pill"
                            width="100%"
                        />
                    </div>
                </form>

                <div className="auth-footer">
                    {isLogin ? (
                        <p>¿No tienes cuenta? <button type="button" className="btn-link" onClick={() => setIsLogin(false)}>Regístrate</button></p>
                    ) : (
                        <p>¿Ya tienes cuenta? <button type="button" className="btn-link" onClick={() => setIsLogin(true)}>Inicia sesión</button></p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
