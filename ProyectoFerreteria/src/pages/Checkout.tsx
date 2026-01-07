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
        tarjetaNombre: user?.nombre || '',
        tarjetaNumero: '**** **** **** 4242',
        exp: '12/26',
        cvv: '***'
    });

    if (cart.length === 0 && step !== 3) {
        return (
            <div style={{ padding: '8rem 5%', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Tu carrito está vacío</h2>
                <Link to="/productos" className="btn-primary">Ir de compras</Link>
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
                    fecha: new Date().toISOString().split('T')[0],
                    estado: 'PAGADO',
                    total: total,
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
        <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '4rem 5%' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>

                {/* Steps Indicator */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem', gap: '3rem' }}>
                    {[
                        { n: 1, l: 'Envío' },
                        { n: 2, l: 'Pago' },
                        { n: 3, l: 'Confirmación' }
                    ].map(s => (
                        <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: step >= s.n ? 1 : 0.4 }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%', border: `2px solid ${step >= s.n ? 'var(--primary)' : 'var(--text-muted)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '800',
                                backgroundColor: step > s.n ? 'var(--primary)' : 'transparent',
                                color: step > s.n ? '#000' : 'inherit'
                            }}>
                                {step > s.n ? <CheckCircle2 size={18} /> : s.n}
                            </div>
                            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{s.l}</span>
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem' }}
                        >
                            <div className="glass-card" style={{ padding: '3rem' }}>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '2.5rem' }}>📍 Información de Envío</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label className="form-label">Dirección de Entrega</label>
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
                                    <div style={{ gridColumn: 'span 2', marginTop: '2rem' }}>
                                        <button onClick={() => setStep(2)} className="btn-primary" style={{ width: '100%', height: '60px', fontSize: '1.1rem' }}>
                                            Continuar al Pago
                                        </button>
                                    </div>
                                </div>
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
                            style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem' }}
                        >
                            <div className="glass-card" style={{ padding: '3rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                    <h2 style={{ fontSize: '1.8rem' }}>💳 Pago con Tarjeta</h2>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" height="20" alt="Visa" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" height="20" alt="Mastercard" />
                                    </div>
                                </div>

                                <form onSubmit={handleProcessPayment}>
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label className="form-label">Nombre en la tarjeta</label>
                                            <div style={{ position: 'relative' }}>
                                                <input required value={form.tarjetaNombre} onChange={e => setForm({ ...form, tarjetaNombre: e.target.value })} />
                                                <CreditCard style={{ position: 'absolute', right: '15px', top: '12px', opacity: 0.3 }} size={20} />
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label className="form-label">Número de Tarjeta (Stripe Test)</label>
                                            <input required value={form.tarjetaNumero} readOnly style={{ letterSpacing: '2px' }} />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                            <div>
                                                <label className="form-label">Fecha Exp.</label>
                                                <input required value={form.exp} readOnly />
                                            </div>
                                            <div>
                                                <label className="form-label">CVC / CVV</label>
                                                <div style={{ position: 'relative' }}>
                                                    <input required value={form.cvv} readOnly />
                                                    <Lock style={{ position: 'absolute', right: '15px', top: '12px', opacity: 0.3 }} size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div style={{ backgroundColor: 'rgba(255, 59, 48, 0.1)', color: '#FF3B30', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                            <AlertCircle size={20} />
                                            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{error}</span>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <button disabled={loading} type="submit" className="btn-primary" style={{ width: '100%', height: '60px', fontSize: '1.1rem', gap: '1rem' }}>
                                            {loading ? <Loader2 className="spinning" /> : <ShieldCheck />}
                                            {loading ? 'Procesando Pago...' : `Pagar S/. ${total.toFixed(2)}`}
                                        </button>
                                        <button type="button" onClick={() => setStep(1)} style={{ background: 'transparent', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                            <ChevronLeft size={18} /> Regresar a envío
                                        </button>
                                    </div>
                                </form>

                                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
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
                            style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}
                        >
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{
                                    width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(52, 199, 89, 0.1)',
                                    color: '#34C759', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem'
                                }}>
                                    <CheckCircle2 size={60} />
                                </div>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>¡Pago Exitoso!</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                                    Tu pedido <strong>#{orderId?.slice(0, 8)}</strong> ha sido procesado correctamente. <br />
                                    Recibirás un correo de confirmación en breve.
                                </p>
                            </div>

                            <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem', textAlign: 'left' }}>
                                <h4 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Resumen de Compra</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>Total Pagado:</span>
                                    <strong style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>S/. {total.toFixed(2)}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>Método:</span>
                                    <span>Stripe Test (Visa-4242)</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Estado:</span>
                                    <span style={{ color: '#34C759', fontWeight: '800' }}>CONFIRMADO</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => navigate('/productos')} className="btn-primary" style={{ flex: 1 }}>Seguir Comprando</button>
                                <button onClick={() => navigate('/')} style={{ flex: 1, background: 'var(--bg-dark)', color: 'white', borderRadius: '12px' }}>Volver al Inicio</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const OrderSummary = ({ total, cart }: { total: number, cart: any[] }) => (
    <div className="glass-card" style={{ height: 'fit-content', padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Resumen del pedido</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {cart.map(item => (
                <div key={item.producto.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#fff', borderRadius: '8px', padding: '5px' }}>
                        <img src={item.producto.imagen} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: '700', lineHeight: 1.2 }}>{item.producto.nombre}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cant: {item.cantidad}</p>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>S/. {(item.producto.precio * item.cantidad).toFixed(2)}</span>
                </div>
            ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>S/. {total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                <span>Envío</span>
                <span style={{ color: '#34C759' }}>Gratis</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: '800', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>S/. {total.toFixed(2)}</span>
            </div>
        </div>
    </div>
);
