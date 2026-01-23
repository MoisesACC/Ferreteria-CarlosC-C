import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    CreditCard,
    Lock,
    ShieldCheck,
    ChevronLeft,
    CheckCircle2,
    Loader2,
    AlertCircle
} from 'lucide-react';
import api from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Checkout.css';

export const Checkout: React.FC = () => {
    const { cart, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);

    const [form, setForm] = useState({
        direccion: '',
        ciudad: 'Lima',
        telefono: '',
        clienteNombre: user?.nombre || '',
        clienteDocumento: '',
        tarjetaNombre: user?.nombre || '',
        tarjetaNumero: '**** **** **** 4242',
        exp: '12/26',
        cvv: '***'
    });

    if (cart.length === 0 && step !== 3) {
        return (
            <div className="empty-cart-container">
                <h2 className="empty-cart-title">Tu carrito está vacío</h2>
                <Link to="/productos" className="btn-primary btn-continue-shopping">Seguir comprando</Link>
            </div>
        );
    }

    const handleProcessPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simulated delay to feel like Stripe processing
        setTimeout(async () => {
            try {
                const pedidoData = {
                    usuario: { id: user?.id },
                    fecha: new Date().toLocaleDateString('en-CA'),
                    estado: 'PAGADO',
                    total: total,
                    clienteNombre: form.clienteNombre,
                    clienteDocumento: form.clienteDocumento,
                    clienteDireccion: form.direccion,
                    clienteTelefono: form.telefono,
                    detalles: cart.map(item => ({
                        producto: { id: item.producto.id },
                        cantidad: item.cantidad,
                        precioUnitario: item.producto.precio
                    }))
                };

                const response = await api.post('/pedidos', pedidoData);
                setOrderId(response.data.id);
                setStep(3);
                clearCart();
            } catch (err) {
                setError("Hubo un inconveniente con el procesador de pagos. Inténtalo de nuevo.");
            } finally {
                setLoading(false);
            }
        }, 2500);
    };

    return (
        <div className="checkout-page">
            <div className="container checkout-container">

                {/* Steps Indicator */}
                <div className="steps-indicator">
                    {[
                        { n: 1, l: 'Envío' },
                        { n: 2, l: 'Pago' },
                        { n: 3, l: 'Confirmación' }
                    ].map(s => (
                        <div key={s.n} className={`step-item ${step >= s.n ? 'active' : 'inactive'}`}>
                            <div className={`step-circle ${step > s.n ? 'done' : (step === s.n ? 'current' : '')}`}>
                                {step > s.n ? <CheckCircle2 size={18} /> : s.n}
                            </div>
                            <span className="step-label">{s.l}</span>
                        </div>
                    ))}
                </div>

                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="loading-overlay"
                        >
                            <div className="loader-shield-wrapper">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="loader-ring"
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="loader-icon-center"
                                >
                                    <ShieldCheck size={50} />
                                </motion.div>
                            </div>
                            <div className="loader-text">
                                <h3>Procesando Tu Compra</h3>
                                <p>Estamos verificando tu pago y generando tu comprobante electrónico...</p>
                            </div>
                            <div className="loader-dots">
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="dot" />
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="dot" />
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="dot" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="checkout-layout"
                        >
                            <div className="glass-card" style={{ padding: '3rem' }}>
                                <h2 className="checkout-header-title">📍 Información de Envío</h2>
                                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                    <div className="form-grid">
                                        <div className="form-group-full">
                                            <label className="form-label">Nombre del Cliente (Para la factura/boleta) *</label>
                                            <input required value={form.clienteNombre} onChange={e => setForm({ ...form, clienteNombre: e.target.value })} placeholder="Juan Pérez" />
                                        </div>
                                        <div className="form-group-full">
                                            <label className="form-label">DNI / RUC *</label>
                                            <input required value={form.clienteDocumento} onChange={e => setForm({ ...form, clienteDocumento: e.target.value })} placeholder="12345678 o 20123456789" />
                                        </div>
                                        <div className="form-group-full">
                                            <label className="form-label">Dirección de Entrega *</label>
                                            <input required value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} placeholder="Av. Las Malvinas 123" />
                                        </div>
                                        <div>
                                            <label className="form-label">Ciudad</label>
                                            <input required value={form.ciudad} readOnly placeholder="Lima" />
                                        </div>
                                        <div>
                                            <label className="form-label">Teléfono de Contacto</label>
                                            <input required value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="999 999 999" />
                                        </div>
                                        <div className="btn-submit-wrapper">
                                            <button type="submit" className="btn-primary btn-full-width">
                                                Continuar al Pago
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <OrderSummary total={total} cart={cart} />
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="checkout-layout"
                        >
                            <div className="glass-card" style={{ padding: '3rem' }}>
                                <div className="checkout-section-header">
                                    <h2 className="checkout-header-title">💳 Pago con Tarjeta</h2>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" height="20" alt="Visa" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" height="20" alt="Mastercard" />
                                    </div>
                                </div>

                                <form onSubmit={handleProcessPayment}>
                                    <div className="credit-card-box">
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label className="form-label">Nombre en la tarjeta</label>
                                            <div className="form-input-wrapper">
                                                <input required value={form.tarjetaNombre} onChange={e => setForm({ ...form, tarjetaNombre: e.target.value })} />
                                                <CreditCard className="form-icon" size={20} />
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label className="form-label">Número de Tarjeta (Stripe Test)</label>
                                            <input required value={form.tarjetaNumero} readOnly style={{ letterSpacing: '2px' }} />
                                        </div>
                                        <div className="card-row-2col">
                                            <div>
                                                <label className="form-label">Fecha Exp.</label>
                                                <input required value={form.exp} readOnly />
                                            </div>
                                            <div>
                                                <label className="form-label">CVC / CVV</label>
                                                <div className="form-input-wrapper">
                                                    <input required value={form.cvv} readOnly />
                                                    <Lock className="form-icon" size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="error-message">
                                            <AlertCircle size={20} />
                                            <span className="error-text">{error}</span>
                                        </div>
                                    )}

                                    <div className="payment-actions">
                                        <button disabled={loading} type="submit" className="btn-primary btn-full-width btn-payment-submit">
                                            {loading ? <Loader2 className="spinning" /> : <ShieldCheck />}
                                            {loading ? 'Procesando Pago...' : `Pagar S/. ${total.toFixed(2)}`}
                                        </button>
                                        <button type="button" onClick={() => setStep(1)} className="btn-back">
                                            <ChevronLeft size={18} /> Regresar a envío
                                        </button>
                                    </div>
                                </form>

                                <p className="secure-badge">
                                    Pagos encriptados por <strong>Stripe Secure 🔒</strong>
                                </p>
                            </div>
                            <OrderSummary total={total} cart={cart} />
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="success-container"
                        >
                            <div className="success-header">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className="success-icon-wrapper"
                                >
                                    <CheckCircle2 size={50} strokeWidth={3} />
                                </motion.div>
                                <h2 className="success-title">¡Gracias por tu compra!</h2>
                                <p className="success-subtitle">
                                    Tu pedido <strong>#{orderId?.slice(0, 8)}</strong> ha sido procesado exitosamente.
                                </p>
                            </div>

                            <div className="glass-card confirmation-card">
                                <div className="conf-card-content">
                                    <div className="conf-icon-box">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div className="conf-text">
                                        <h4>Pedido Confirmado.</h4>
                                        <p>
                                            Estamos preparando tu pedido. Puedes ver el estado y descargar tu comprobante desde la sección:
                                            <br />
                                            <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>Mis Pedidos</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card summary-card-success">
                                <h4 className="summary-header">Resumen de Compra</h4>
                                <div className="summary-row">
                                    <span>Total Pagado:</span>
                                    <strong style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>S/. {total.toFixed(2)}</strong>
                                </div>
                                <div className="summary-row">
                                    <span>Método de Pago:</span>
                                    <span>Tarjeta de Crédito (Visa-4242)</span>
                                </div>
                                <div className="summary-total">
                                    <span>Estado del Pedido:</span>
                                    <span className="status-confirmed">CONFIRMADO</span>
                                </div>
                            </div>

                            <div className="success-actions">
                                <button onClick={() => navigate('/productos')} className="btn-primary btn-full-width" style={{ color: '#000' }}>
                                    Seguir Comprando
                                </button>
                                <button onClick={() => navigate('/mis-pedidos')} className="btn-view-orders">
                                    Ver mis pedidos recientes
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const OrderSummary = ({ total, cart }: { total: number, cart: any[] }) => (
    <div className="glass-card order-summary-card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Resumen del pedido</h3>
        <div className="order-summary-items">
            {cart.map(item => (
                <div key={item.producto.id} className="cart-item-mini">
                    <div className="cart-item-img-box">
                        <img src={item.producto.imagen} alt="" className="cart-item-img" />
                    </div>
                    <div className="cart-item-info">
                        <p className="cart-item-name">{item.producto.nombre}</p>
                        <p className="cart-item-qty">Cant: {item.cantidad}</p>
                    </div>
                    <span className="cart-item-price">S/. {(item.producto.precio * item.cantidad).toFixed(2)}</span>
                </div>
            ))}
        </div>
        <div className="order-summary-footer">
            <div className="summary-row-muted">
                <span>Subtotal</span>
                <span>S/. {total.toFixed(2)}</span>
            </div>
            <div className="summary-row-muted" style={{ marginBottom: '1rem' }}>
                <span>Envío</span>
                <span className="text-free">Gratis</span>
            </div>
            <div className="summary-total-large">
                <span>Total</span>
                <span className="text-primary">S/. {total.toFixed(2)}</span>
            </div>
        </div>
    </div>
);
