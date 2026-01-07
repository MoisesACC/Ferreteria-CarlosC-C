import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
                                <span>IR A LA TIENDA</span>
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
                                    <ArrowLeft size={16} /> Continuar comprando
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

            <style>{`
                .cart-viewport { 
                    padding: 60px 0; 
                    background: var(--bg-main); 
                    min-height: 100vh;
                }
                
                .glass-panel {
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
                }

                .summary-responsive-card {
                    background: var(--bg-card);
                    color: var(--text-main);
                    border: 1px solid var(--border-color);
                    border-radius: 20px;
                    padding: 30px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                }

                /* Empty State Redesign */
                .empty-state-full-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 0;
                    min-height: 50vh;
                }
                .empty-state-card {
                    text-align: center;
                    max-width: 550px;
                    width: 100%;
                    padding: 80px 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                }
                .empty-visual-cluster {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .icon-circle {
                    width: 90px;
                    height: 90px;
                    background: var(--primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #000;
                    z-index: 2;
                    box-shadow: 0 10px 25px rgba(255, 204, 0, 0.2);
                }
                .pulse-ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border: 2px solid var(--primary);
                    border-radius: 50%;
                    animation: pulse-ring 2s infinite;
                    opacity: 0;
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    100% { transform: scale(1.3); opacity: 0; }
                }

                .empty-text-stack h1 { 
                    font-size: 2.2rem; 
                    font-weight: 850; 
                    color: var(--text-main); 
                    margin-bottom: 12px; 
                    letter-spacing: -1px;
                }
                .empty-text-stack p { 
                    color: var(--text-muted); 
                    font-size: 1.1rem; 
                    line-height: 1.6; 
                    max-width: 420px; 
                    margin: 0 auto;
                }

                .cta-button-glamor {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 40px;
                    background: var(--primary);
                    color: #000;
                    font-weight: 800;
                    border-radius: 14px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    letter-spacing: 0.5px;
                    box-shadow: 0 8px 20px rgba(255, 204, 0, 0.2);
                }
                .cta-button-glamor:hover { 
                    transform: translateY(-5px); 
                    box-shadow: 0 12px 25px rgba(255, 204, 0, 0.4);
                    background: #fff;
                }

                /* Header */
                .cart-flow-header { margin-bottom: 30px; }
                .nav-back-button {
                    background: none; border: none; display: flex; align-items: center; gap: 8px;
                    color: var(--text-muted); font-weight: 700; cursor: pointer; margin-bottom: 12px;
                    transition: 0.2s;
                    font-size: 0.9rem;
                }
                .nav-back-button:hover { color: var(--primary); }
                .title-stack h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 5px; color: var(--text-main); }
                .status-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: var(--primary-light);
                    color: var(--primary-dark);
                    padding: 4px 12px;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: 800;
                }

                /* Grid */
                .cart-grid-master {
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    gap: 40px;
                    align-items: start;
                }
                
                /* Items */
                .items-river { display: flex; flex-direction: column; gap: 15px; }
                .item-row-card {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    transition: 0.2s;
                }
                .item-row-card:hover { border-color: var(--primary); }
                
                .item-visual .img-frame {
                    width: 100px;
                    height: 100px;
                    background: #fff;
                    border-radius: 12px;
                    padding: 10px;
                    border: 1px solid var(--border-color);
                }
                .img-frame img { width: 100%; height: 100%; object-fit: contain; }
                
                .item-core-info { flex: 1; display: flex; justify-content: space-between; align-items: center; }
                .name-price-group h3 { font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-bottom: 2px; }
                .unit-label { color: var(--text-muted); font-weight: 600; font-size: 0.85rem; }
                
                .actions-cluster { display: flex; align-items: center; gap: 25px; }
                .qty-stepper {
                    display: flex;
                    align-items: center;
                    background: var(--bg-main);
                    padding: 4px;
                    border-radius: 10px;
                    border: 1px solid var(--border-color);
                }
                .step-btn {
                    width: 28px; height: 28px;
                    border-radius: 6px;
                    border: none;
                    background: var(--bg-card);
                    color: var(--text-main);
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: 0.2s;
                }
                .step-btn:hover { background: var(--primary); color: #000; }
                .qty-digit { min-width: 30px; text-align: center; font-weight: 800; font-size: 1rem; color: var(--text-main); }
                
                .total-bracket { font-size: 1.25rem; font-weight: 800; color: var(--text-main); min-width: 120px; text-align: right; }
                .delete-trash-btn {
                    background: none; border: none; color: var(--text-muted);
                    padding: 8px; border-radius: 8px; cursor: pointer; transition: 0.2s;
                }
                .delete-trash-btn:hover { color: #FF3B30; background: rgba(255, 59, 48, 0.05); }
                
                .cart-utility-footer { margin-top: 20px; display: flex; justify-content: flex-end; }
                .danger-text-btn { background: none; border: none; color: var(--text-muted); font-size: 0.85rem; cursor: pointer; }
                .danger-text-btn:hover { color: #FF3B30; text-decoration: underline; }

                /* Summary Sidebar */
                .sticky-summary-card { position: sticky; top: 100px; }
                .summary-headline {
                    font-size: 1.4rem;
                    font-weight: 800;
                    margin-bottom: 25px;
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: 15px;
                }
                
                .breakdown-ledger { display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px; }
                .ledger-entry { display: flex; justify-content: space-between; font-size: 0.95rem; }
                .ledger-entry .label { color: var(--text-muted); }
                .ledger-entry.grand-total { font-size: 1.5rem; margin-top: 10px; }
                .ledger-entry.grand-total .label { color: var(--text-main); font-weight: 800; }
                .val-highlight { color: var(--primary); font-weight: 850; }
                .val-accent { color: #34C759; font-weight: 700; }
                .ledger-divider { height: 1px; background: var(--border-color); margin: 5px 0; }
                
                .primary-checkout-btn {
                    width: 100%; padding: 18px; background: var(--primary); color: #000; border: none;
                    border-radius: 12px; font-weight: 800; font-size: 1rem; display: flex; align-items: center;
                    justify-content: center; gap: 10px; text-decoration: none; transition: 0.2s;
                }
                .primary-checkout-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(255, 204, 0, 0.3); }
                
                .security-ribbon { display: flex; gap: 15px; margin-top: 25px; border-top: 1px solid var(--border-color); padding-top: 20px; justify-content: center; }
                .ribbon-item { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--text-muted); font-weight: 700; }
                .ribbon-item svg { color: var(--primary); }

                @media (max-width: 1100px) {
                    .cart-grid-master { grid-template-columns: 1fr; }
                    .summary-orbital { max-width: 450px; width: 100%; margin: 0 auto; }
                }
                
                @media (max-width: 768px) {
                    .cart-viewport { padding: 40px 0; }
                    .item-row-card { flex-direction: column; text-align: center; }
                    .item-core-info { flex-direction: column; gap: 15px; }
                    .actions-cluster { flex-direction: column; gap: 15px; width: 100%; }
                    .total-bracket { text-align: center; width: 100%; }
                }
            `}</style>
        </div>
    );
};
