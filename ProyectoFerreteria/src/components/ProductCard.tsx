import React from 'react';
import type { Producto } from '../types';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
    producto: Producto;
}

export const ProductCard: React.FC<ProductCardProps> = ({ producto }) => {
    const { addToCart } = useCart();
    const [added, setAdded] = React.useState(false);

    const handleAdd = () => {
        addToCart(producto, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="product-card"
            style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: 'var(--shadow)',
                border: '1px solid var(--border-color)',
                padding: '1rem'
            }}
        >
            {/* Badges */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 2 }}>
                {producto.esNuevo && (
                    <span style={{ backgroundColor: '#6C47FF', color: '#fff', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>NUEVO</span>
                )}
                {producto.esMasVendido && (
                    <span style={{ backgroundColor: '#FF9500', color: '#fff', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>TOP VENTAS</span>
                )}
            </div>

            <Link to={`/producto/${producto.id}`} className="img-container" style={{
                width: '100%',
                height: '240px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                cursor: 'pointer'
            }}>
                <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                />
            </Link>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{producto.marca}</h4>
                <Link to={`/producto/${producto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem', lineHeight: '1.2' }}>{producto.nombre}</h3>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ color: '#FFB800', display: 'flex', gap: '2px' }}>
                        <Star size={14} fill="#FFB800" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{producto.puntuacion || 5.0}</span>
                    </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                    {producto.precioAnterior && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'line-through' }}>S/. {producto.precioAnterior.toFixed(2)}</p>
                    )}
                    <p className="price-text" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>S/. {producto.precio.toFixed(2)}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                    onClick={handleAdd}
                    className="btn-text"
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '99px',
                        border: '1px solid var(--border-color)',
                        background: added ? '#34C759' : 'transparent',
                        color: added ? '#fff' : 'var(--text-main)',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {added ? <Check size={18} /> : <ShoppingCart size={18} />}
                    {added ? 'Añadido' : 'Añadir al carrito'}
                </button>

                <button
                    className="btn-text"
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '99px',
                        background: 'var(--primary)',
                        color: '#000',
                        fontWeight: '900',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Zap size={18} fill="#000" />
                    Pago ContraEntrega
                </button>
            </div>

            {producto.stock === 0 && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5
                }}>
                    <span style={{ background: '#000', color: '#fff', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold' }}>AGOTADO</span>
                </div>
            )}

            <style>{`
                @media (max-width: 480px) {
                    .product-card {
                        padding: 0.8rem !important;
                    }
                    .img-container {
                        height: 180px !important;
                    }
                    .price-text {
                        font-size: 1.2rem !important;
                    }
                    .btn-text {
                        font-size: 0.8rem !important;
                        padding: 10px !important;
                    }
                }
            `}</style>
        </motion.div>
    );
};
