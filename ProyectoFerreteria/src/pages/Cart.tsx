import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Cart: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();

    const total = cart.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);

    if (cart.length === 0) {
        return (
            <div style={{
                padding: '5rem 5%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2rem'
            }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)'
                }}>
                    <ShoppingBag size={64} />
                </div>
                <h2 style={{ fontSize: '2rem' }}>Tu carrito está vacío</h2>
                <p style={{ color: 'var(--text-muted)' }}>¡Parece que aún no has añadido nada a tu caja de herramientas!</p>
                <Link to="/productos" className="btn-primary" style={{ textDecoration: 'none' }}>
                    Explorar Productos
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem 5%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '2.5rem' }}>Tu Carrito</h1>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 350px',
                gap: '2rem'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <AnimatePresence>
                        {cart.map((item) => (
                            <motion.div
                                key={item.producto.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="glass-card"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.5rem',
                                    padding: '1rem'
                                }}
                            >
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '8px',
                                    backgroundColor: '#252525',
                                    overflow: 'hidden'
                                }}>
                                    <img
                                        src={item.producto.imagen}
                                        alt={item.producto.nombre}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem' }}>{item.producto.nombre}</h3>
                                    <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                                        S/. {item.producto.precio.toFixed(2)} c/u
                                    </p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '4px' }}>
                                    <button
                                        onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                                        style={{ background: 'transparent', color: 'white', padding: '4px' }}
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{item.cantidad}</span>
                                    <button
                                        onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                                        style={{ background: 'transparent', color: 'white', padding: '4px' }}
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <div style={{ minWidth: '100px', textAlign: 'right' }}>
                                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                        S/. {(item.producto.precio * item.cantidad).toFixed(2)}
                                    </p>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.producto.id)}
                                    style={{ background: 'transparent', color: '#FF3B30', padding: '8px' }}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Resumen</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                <span>Subtotal</span>
                                <span>S/. {total.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                <span>Envío</span>
                                <span>Gratis</span>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            borderTop: '1px solid var(--border-color)',
                            paddingTop: '1rem'
                        }}>
                            <span>Total</span>
                            <span>S/. {total.toFixed(2)}</span>
                        </div>

                        <Link to="/finalizar-compra" className="btn-primary" style={{ width: '100%', fontSize: '1.1rem', marginTop: '1rem', textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            Finalizar Compra
                        </Link>

                        <button
                            onClick={clearCart}
                            style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '0.9rem' }}
                        >
                            Vaciar Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
