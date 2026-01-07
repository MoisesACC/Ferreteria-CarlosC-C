import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    ShoppingCart,
    Plus,
    Minus,
    Truck,
    Undo,
    ShieldCheck,
    ArrowLeft,
    Share2,
    Heart
} from 'lucide-react';
import type { Producto } from '../types';
import api from '../api/api';
import { useCart } from '../context/CartContext';

export const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Producto | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string>('');
    const [cantidad, setCantidad] = useState(1);
    const [selectedTab, setSelectedTab] = useState('detail');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/productos/${id}`);
                setProduct(res.data);
                setActiveImage(res.data.imagen);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loader"></div>
        </div>
    );

    if (!product) return (
        <div style={{ minHeight: '80vh', textAlign: 'center', padding: '5rem' }}>
            <h2>Producto no encontrado</h2>
            <button onClick={() => navigate('/productos')} className="btn-primary" style={{ marginTop: '2rem' }}>Regresar a tienda</button>
        </div>
    );

    const allImages = [product.imagen, ...(product.imagenesAdicionales || []).filter(img => img)];

    return (
        <div style={{ padding: '3rem 5%', backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
            <div className="container">
                {/* Header / Breadcrumbs */}
                <button
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--text-muted)', fontWeight: '600' }}
                >
                    <ArrowLeft size={18} /> Volver
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
                    {/* Image Gallery */}
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onMouseEnter={() => setActiveImage(img)}
                                    onClick={() => setActiveImage(img)}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        border: activeImage === img ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                        padding: '5px',
                                        backgroundColor: '#fff'
                                    }}
                                >
                                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </button>
                            ))}
                        </div>
                        <div className="glass-card" style={{ flex: 1, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '600px', backgroundColor: '#fff', borderRadius: '30px' }}>
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    src={activeImage}
                                    alt={product.nombre}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <span style={{ backgroundColor: 'var(--bg-dark)', padding: '6px 15px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px' }}>
                                {product.categoria?.nombre || 'General'}
                            </span>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="glass-button" style={{ padding: '10px' }}><Heart size={20} /></button>
                                <button className="glass-button" style={{ padding: '10px' }}><Share2 size={20} /></button>
                            </div>
                        </div>

                        <h1 style={{ fontSize: '3rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '1rem' }}>{product.nombre}</h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', color: '#FFB800' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill={i < Math.floor(product.puntuacion) ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>({product.puntuacion} de 5 estrellas)</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '3.5rem', color: 'var(--primary)', fontWeight: '950' }}>S/. {product.precio.toFixed(2)}</h2>
                            {product.precioAnterior && (
                                <span style={{ fontSize: '1.5rem', textDecoration: 'line-through', color: 'var(--text-muted)', fontWeight: '600' }}>
                                    S/. {product.precioAnterior.toFixed(2)}
                                </span>
                            )}
                            {product.esOferta && (
                                <div style={{ backgroundColor: '#FF3B30', color: '#fff', padding: '5px 12px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '900' }}>
                                    -{Math.round((1 - product.precio / (product.precioAnterior || 1)) * 100)}%
                                </div>
                            )}
                        </div>

                        <div style={{ backgroundColor: 'var(--bg-dark)', borderRadius: '24px', padding: '2.5rem', marginBottom: '3rem' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                                {product.descripcion || "Este producto de alta calidad de la marca " + product.marca + " es ideal para tus proyectos industriales y del hogar."}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                backgroundColor: 'var(--bg-main)',
                                padding: '10px 20px',
                                borderRadius: '16px',
                                border: '1px solid var(--border-color)'
                            }}>
                                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} style={{ background: 'transparent' }}><Minus size={20} /></button>
                                <span style={{ fontSize: '1.2rem', fontWeight: '900', minWidth: '40px', textAlign: 'center' }}>{cantidad}</span>
                                <button onClick={() => setCantidad(cantidad + 1)} style={{ background: 'transparent' }}><Plus size={20} /></button>
                            </div>

                            <button
                                onClick={() => addToCart(product, cantidad)}
                                className="btn-primary"
                                style={{ flex: 1, height: '64px', fontSize: '1.1rem', fontWeight: '900', borderRadius: '20px' }}
                            >
                                <ShoppingCart size={24} style={{ marginRight: '0.8rem' }} /> Añadir al Carrito
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', textAlign: 'center' }}>
                                <Truck size={30} color="var(--primary)" />
                                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Envío Gratis</span>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>En compras mayores a S/. 200</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', textAlign: 'center' }}>
                                <Undo size={30} color="var(--primary)" />
                                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Devalución Fácil</span>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hasta 30 días para cambios</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', textAlign: 'center' }}>
                                <ShieldCheck size={30} color="var(--primary)" />
                                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Garantía Carlos C&C</span>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100% Calidad Asegurada</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section for specs, etc */}
                <div style={{ marginTop: '5rem' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '3rem' }}>
                        <button
                            onClick={() => setSelectedTab('detail')}
                            style={{
                                padding: '1rem 0.5rem',
                                background: 'transparent',
                                fontWeight: '800',
                                color: selectedTab === 'detail' ? 'var(--primary)' : 'var(--text-muted)',
                                borderBottom: selectedTab === 'detail' ? '3px solid var(--primary)' : '3px solid transparent'
                            }}
                        >
                            Especificaciones
                        </button>
                        <button
                            onClick={() => setSelectedTab('shipping')}
                            style={{
                                padding: '1rem 0.5rem',
                                background: 'transparent',
                                fontWeight: '800',
                                color: selectedTab === 'shipping' ? 'var(--primary)' : 'var(--text-muted)',
                                borderBottom: selectedTab === 'shipping' ? '3px solid var(--primary)' : '3px solid transparent'
                            }}
                        >
                            Política de Envío
                        </button>
                    </div>

                    <div style={{ padding: '3rem 0' }}>
                        {selectedTab === 'detail' ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div className="glass-card" style={{ padding: '2rem' }}>
                                    <h4 style={{ marginBottom: '1.5rem' }}>Ficha Técnica</h4>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '12px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Marca</td>
                                                <td style={{ padding: '12px 0', fontSize: '0.9rem', fontWeight: '700', textAlign: 'right' }}>{product.marca}</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '12px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Categoría</td>
                                                <td style={{ padding: '12px 0', fontSize: '0.9rem', fontWeight: '700', textAlign: 'right' }}>{product.categoria?.nombre}</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '12px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Disponibilidad</td>
                                                <td style={{ padding: '12px 0', fontSize: '0.9rem', fontWeight: '700', textAlign: 'right', color: '#34C759' }}>{product.stock > 0 ? 'En Stock (' + product.stock + ')' : 'Próximamente'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '1.5rem' }}>Información del Producto</h4>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                                        {product.descripcion || "Adquiere este producto original Carlos C&C. Diseñado bajo los más estrictos estándares de calidad para ofrecer durabilidad y rendimiento en cada uso. Ideal para profesionales y aficionados al bricolaje que buscan excelencia."}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h4 style={{ marginBottom: '1.5rem' }}>Información de despacho</h4>
                                <p style={{ color: 'var(--text-muted)', maxWidth: '800px' }}>Realizamos envíos a todo el Perú. En Lima metropolitana el tiempo de entrega es de 24 a 48 horas hábiles. Para provincias, el tiempo estimado es de 3 a 5 días hábiles dependiendo de la zona.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
