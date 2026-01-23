import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Cart.css';

export const Cart: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();

    const subtotal = cart.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
    const shipping = 0;
    const total = subtotal + shipping;

    return (
        <div className="cart-viewport">
            <div className="container">
                {cart.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="empty-state-full-wrapper"
                    >
                        <div className="empty-state-card glass-panel">
                            <div className="empty-visual-cluster">
                                <div className="icon-circle">
                                    <ShoppingBag size={48} strokeWidth={1.5} />
                                </div>
                                <div className="pulse-ring"></div>
                            </div>

                            <div className="empty-text-stack">
                                <h1>Tu cesta está vacía</h1>
                                <p>Parece que aún no has añadido productos a tu carrito. ¡Explora nuestras categorías y encuentra lo que necesitas!</p>
                            </div>

                            <Link to="/productos" className="cta-button-glamor">
                                <span>SEGUIR COMPRANDO</span>
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <div className="cart-grid-master">
                        {/* Main Content Area */}
                        <div className="cart-content-flow">
                            <header className="cart-flow-header">
                                <button onClick={() => navigate(-1)} className="nav-back-button">
                                    <ArrowLeft size={16} /> Seguir comprando
                                </button>
                                <div className="title-stack">
                                    <h1>Cesta de Compras</h1>
                                    <div className="status-pill">
                                        <Sparkles size={12} />
                                        <span>{cart.length} {cart.length === 1 ? 'artículo' : 'artículos'}</span>
                                    </div>
                                </div>
                            </header>

                            <div className="items-river">
                                <AnimatePresence mode='popLayout'>
                                    {cart.map((item) => (
                                        <motion.div
                                            key={item.producto.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="item-row-card glass-panel"
                                        >
                                            <div className="item-visual">
                                                <div className="img-frame">
                                                    <img src={item.producto.imagen} alt={item.producto.nombre} />
                                                </div>
                                            </div>

                                            <div className="item-core-info">
                                                <div className="name-price-group">
                                                    <h3>{item.producto.nombre}</h3>
                                                    <div className="unit-label">S/. {item.producto.precio.toFixed(2)} c/u</div>
                                                </div>

                                                <div className="actions-cluster">
                                                    <div className="qty-stepper">
                                                        <button
                                                            onClick={() => updateQuantity(item.producto.id, Math.max(1, item.cantidad - 1))}
                                                            className="step-btn"
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="qty-digit">{item.cantidad}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                                                            className="step-btn"
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>

                                                    <div className="total-bracket">
                                                        S/. {(item.producto.precio * item.cantidad).toFixed(2)}
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item.producto.id)}
                                                        className="delete-trash-btn"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="cart-utility-footer">
                                <button onClick={clearCart} className="danger-text-btn">Eliminar todo el carrito</button>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <aside className="summary-orbital">
                            <div className="sticky-summary-card summary-responsive-card">
                                <h2 className="summary-headline">Resumen de Orden</h2>

                                <div className="breakdown-ledger">
                                    <div className="ledger-entry">
                                        <span className="label">Base Imponible</span>
                                        <span className="val">S/. {(subtotal * 0.82).toFixed(2)}</span>
                                    </div>
                                    <div className="ledger-entry">
                                        <span className="label">IGV (18%)</span>
                                        <span className="val">S/. {(subtotal * 0.18).toFixed(2)}</span>
                                    </div>
                                    <div className="ledger-entry">
                                        <span className="label">Costos de Envío</span>
                                        <span className="val-accent">GRATUITO</span>
                                    </div>
                                    <div className="ledger-divider"></div>
                                    <div className="ledger-entry grand-total">
                                        <span className="label">Total a Pagar</span>
                                        <span className="val-highlight">S/. {total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Link to="/finalizar-compra" className="primary-checkout-btn">
                                    <span>PROCESAR PAGO</span>
                                    <ArrowRight size={20} />
                                </Link>

                                <div className="security-ribbon">
                                    <div className="ribbon-item">
                                        <ShieldCheck size={16} />
                                        <span>Transacción Protegida</span>
                                    </div>
                                    <div className="ribbon-item">
                                        <Truck size={16} />
                                        <span>Entrega Prioritaria</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
};
