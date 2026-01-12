import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { User, Mail, MapPin, Phone, CreditCard, Save, CheckCircle, AlertCircle } from 'lucide-react';

export const Profile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        nombre: user?.nombre || '',
        email: user?.email || '',
        documento: user?.documento || '',
        direccion: user?.direccion || '',
        telefono: user?.telefono || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                nombre: user.nombre || '',
                email: user.email || '',
                documento: user.documento || '',
                direccion: user.direccion || '',
                telefono: user.telefono || ''
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await api.put(`/usuarios/${user.id}`, {
                ...user,
                ...formData
            });
            updateUser(response.data);
            setMessage({ type: 'success', text: '¡Perfil actualizado correctamente!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al actualizar el perfil. Inténtalo de nuevo.' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    return (
        <div style={{ padding: '4rem 5%', backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Mi Perfil</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Gestiona tu información personal y datos de facturación para compras rápidas.</p>
                </div>

                <div className="glass-card" style={{ padding: '3rem' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {/* Información Básica */}
                            <div>
                                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <User size={20} color="var(--primary)" /> Datos Personales
                                </h3>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nombre Completo</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Ej. Juan Pérez"
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Correo Electrónico</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            readOnly
                                            className="form-control"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.2)', cursor: 'not-allowed' }}
                                        />
                                        <Mail size={16} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                    </div>
                                </div>
                            </div>

                            {/* Datos de Envío y Facturación */}
                            <div>
                                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CreditCard size={20} color="var(--primary)" /> Facturación y Envío
                                </h3>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Documento (DNI o RUC)</label>
                                    <input
                                        type="text"
                                        name="documento"
                                        value={formData.documento}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Tu número de documento"
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Dirección Predeterminada</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Tu dirección completa"
                                        />
                                        <MapPin size={16} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Teléfono de Contacto</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Ej. 987654321"
                                        />
                                        <Phone size={16} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {message.text && (
                            <div style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                backgroundColor: message.type === 'success' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                                color: message.type === 'success' ? '#34C759' : '#FF3B30',
                                marginBottom: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                border: `1px solid ${message.type === 'success' ? '#34C75955' : '#FF3B3055'}`
                            }}>
                                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{message.text}</span>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '12px 30px' }}
                            >
                                {loading ? 'Guardando...' : <><Save size={18} /> Guardar Cambios</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
