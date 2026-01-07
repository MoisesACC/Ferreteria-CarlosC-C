import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import type { Pedido } from '../types';
import { Package, Clock, CheckCircle, Truck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyOrders: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id) {
            api.get(`/pedidos/usuario/${user.id}`).then(res => {
                setOrders(res.data);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, [user]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PAGADO': return <CheckCircle size={18} color="#34C759" />;
            case 'ENVIADO': return <Truck size={18} color="#007AFF" />;
            default: return <Clock size={18} color="#FF9500" />;
        }
    };

    return (
        <div style={{ padding: '4rem 5%', backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 style={{ fontSize: '2.5rem' }}>Mis Pedidos</h1>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>Cargando tus compras...</div>
                ) : orders.length === 0 ? (
                    <div className="glass-card" style={{ padding: '5rem', textAlign: 'center' }}>
                        <Package size={64} style={{ opacity: 0.2, marginBottom: '2rem' }} />
                        <h3>Aún no has realizado ninguna compra</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>¡Tus herramientas favoritas te esperan!</p>
                        <button onClick={() => navigate('/productos')} className="btn-primary">Explorar Productos</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {orders.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map(order => (
                            <div key={order.id} className="glass-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-dark)', borderRadius: '12px' }}>
                                        <Package size={30} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>PEDIDO #{order.id.slice(0, 8)}</p>
                                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>S/. {order.total.toFixed(2)}</h3>
                                        <p style={{ fontSize: '0.85rem' }}>Fecha: {new Date(order.fecha).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-dark)', padding: '8px 16px', borderRadius: '99px' }}>
                                        {getStatusIcon(order.estado)}
                                        <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>{order.estado}</span>
                                    </div>
                                    <button style={{ color: 'var(--primary)', background: 'transparent', fontSize: '0.9rem', fontWeight: '700' }}>Ver detalles</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
