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
        <div className="cart-page-container">
            <div className="cart-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="cart-title">Tu Carrito</h1>
            </div>

            <div className="cart-grid">
                <div className="cart-items-list">
                    <AnimatePresence>
                        {cart.map((item) => (
                            <motion.div
                                key={item.producto.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="glass-card cart-item"
                            >
                                <div className="cart-item-image">
                                    <img
                                        src={item.producto.imagen}
                                        alt={item.producto.nombre}
                                    />
                                </div>

                                <div className="cart-item-info">
                                    <h3 className="item-name">{item.producto.nombre}</h3>
                                    <p className="item-price">
                                        S/. {item.producto.precio.toFixed(2)} c/u
                                    </p>
                                </div>

                                <div className="cart-item-actions">
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                                            className="qty-btn"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="qty-val">{item.cantidad}</span>
                                        <button
                                            onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                                            className="qty-btn"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <div className="item-total">
                                        <p>S/. {(item.producto.precio * item.cantidad).toFixed(2)}</p>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.producto.id)}
                                        className="remove-btn"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="cart-summary-container">
                    <div className="glass-card cart-summary">
                        <h3 className="summary-title">Resumen</h3>

                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>S/. {total.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Envío</span>
                                <span>Gratis</span>
                            </div>
                        </div>

                        <div className="summary-total-row">
                            <span>Total</span>
                            <span>S/. {total.toFixed(2)}</span>
                        </div>

                        <Link to="/finalizar-compra" className="btn-primary checkout-btn">
                            Finalizar Compra
                        </Link>

                        <button onClick={clearCart} className="clear-cart-btn">
                            Vaciar Carrito
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .cart-page-container { padding: 2rem 5%; }
                .cart-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
                .back-btn { background: transparent; color: var(--text-muted); cursor: pointer; }
                .cart-title { fontSize: 2.5rem; }
                
                .cart-grid {
                    display: grid;
                    gridTemplateColumns: 1fr 350px;
                    gap: 2rem;
                }
                .cart-items-list { display: flex; flexDirection: column; gap: 1rem; }
                .cart-item {
                    display: flex;
                    alignItems: center;
                    gap: 1.5rem;
                    padding: 1rem;
                }
                .cart-item-image {
                    width: 100px;
                    height: 100px;
                    borderRadius: 8px;
                    backgroundColor: #252525;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .cart-item-image img { width: 100%; height: 100%; object-fit: cover; }
                .cart-item-info { flex: 1; }
                .item-name { fontSize: 1.1rem; }
                .item-price { color: var(--primary); fontWeight: bold; }
                
                .cart-item-actions { display: flex; alignItems: center; gap: 1.5rem; }
                .quantity-controls {
                    display: flex;
                    alignItems: center;
                    gap: 0.8rem;
                    backgroundColor: rgba(0,0,0,0.2);
                    borderRadius: 8px;
                    padding: 4px;
                }
                .qty-btn { background: transparent; color: white; padding: 4px; cursor: pointer; }
                .qty-val { minWidth: 20px; textAlign: center; fontWeight: bold; }
                .item-total { minWidth: 100px; textAlign: right; }
                .item-total p { fontWeight: bold; fontSize: 1.2rem; }
                .remove-btn { background: transparent; color: #FF3B30; padding: 8px; cursor: pointer; }

                .cart-summary-container { position: sticky; top: 100px; height: fit-content; }
                .cart-summary { display: flex; flexDirection: column; gap: 1.5rem; }
                .summary-title { fontSize: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
                .summary-details { display: flex; flexDirection: column; gap: 0.5rem; }
                .summary-row { display: flex; justifyContent: space-between; color: var(--text-muted); }
                .summary-total-row {
                    display: flex;
                    justifyContent: space-between;
                    fontSize: 1.5rem;
                    fontWeight: bold;
                    border-top: 1px solid var(--border-color);
                    paddingTop: 1rem;
                }
                .checkout-btn { width: 100%; fontSize: 1.1rem; marginTop: 1rem; textDecoration: none; display: flex; justifyContent: center; alignItems: center; }
                .clear-cart-btn { background: transparent; color: var(--text-muted); fontSize: 0.9rem; align-self: center; cursor: pointer; }

                @media (max-width: 992px) {
                    .cart-grid { grid-template-columns: 1fr; }
                    .cart-summary-container { position: static; }
                }

                @media (max-width: 768px) {
                    .cart-page-container { padding: 1rem; }
                    .cart-title { font-size: 1.8rem; }
                    .cart-item {
                        flex-direction: column;
                        align-items: stretch;
                        text-align: center;
                    }
                    .cart-item-image { align-self: center; }
                    .cart-item-actions {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: center;
                    }
                    .item-total { text-align: center; min-width: 0; }
                }
            `}</style>
        </div>
    );
};
