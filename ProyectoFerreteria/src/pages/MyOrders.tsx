import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import type { Pedido, Comprobante } from '../types';
import { Package, Clock, CheckCircle, Truck, ArrowLeft, Download, Receipt, QrCode, X, CreditCard, MapPin, Calendar, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { comprobanteService } from '../api/comprobanteService';

export const MyOrders: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Pedido[]>([]);
    const [comprobantes, setComprobantes] = useState<Comprobante[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedCompForView, setSelectedCompForView] = useState<Comprobante | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const navigate = useNavigate();

    // ... (rest of standard hooks)

    useEffect(() => {
        if (selectedCompForView) {
            setLoadingPdf(true);
            comprobanteService.verPDF(selectedCompForView.id)
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    setPdfUrl(url);
                })
                .catch(err => {
                    console.error("Error loading PDF", err);
                    setPdfUrl(null);
                })
                .finally(() => setLoadingPdf(false));
        } else {
            if (pdfUrl) {
                window.URL.revokeObjectURL(pdfUrl);
                setPdfUrl(null);
            }
        }
    }, [selectedCompForView]);

    const formatDate = (dateStr: string) => { //... rest of file
        //...
        // ... (skip to render)
        // ...

        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const fetchData = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const [pedidosRes, compsRes] = await Promise.all([
                api.get(`/pedidos/usuario/${user.id}`),
                comprobanteService.listarPorUsuario(user.id)
            ]);
            setOrders(pedidosRes.data);
            setComprobantes(Array.isArray(compsRes) ? compsRes : (compsRes as any).data || []);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleDescargarPDF = async (comp: Comprobante) => {
        try {
            const blob = await comprobanteService.descargarPDF(comp.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${comp.numeroComprobante}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("No se pudo descargar el PDF");
        }
    };

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
                        {orders.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map(order => {
                            const comp = comprobantes.find(c => c.pedidoId === order.id);
                            return (
                                <div key={order.id} className="glass-card no-hover-move order-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="order-main-info" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                        <div style={{
                                            padding: '1.2rem',
                                            backgroundColor: 'var(--bg-dark)',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid var(--border-color)'
                                        }}>
                                            <Package size={28} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>#{order.id.slice(0, 8).toUpperCase()}</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255, 215, 0, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                                                    {getStatusIcon(order.estado)}
                                                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)' }}>{order.estado}</span>
                                                </div>
                                            </div>
                                            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.3rem', fontWeight: '800' }}>S/. {order.total.toFixed(2)}</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Calendar size={14} /> {formatDate(order.fecha)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="order-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        {comp && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => setSelectedCompForView(comp)}
                                                    className="btn-glass"
                                                    style={{ padding: '10px', borderRadius: '10px' }}
                                                    title="Ver Comprobante"
                                                >
                                                    <Receipt size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDescargarPDF(comp)}
                                                    className="btn-glass"
                                                    style={{ padding: '10px', borderRadius: '10px', color: 'var(--primary)' }}
                                                    title="Descargar PDF"
                                                >
                                                    <Download size={18} />
                                                </button>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => { setSelectedOrder(order); setIsDetailModalOpen(true); }}
                                            className="btn-primary"
                                            style={{
                                                padding: '10px 20px',
                                                fontSize: '0.8rem',
                                                borderRadius: '12px',
                                                fontWeight: '800'
                                            }}
                                        >
                                            Ver Detalles
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal de Detalles del Pedido */}
            {isDetailModalOpen && selectedOrder && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2000, backdropFilter: 'blur(10px)', padding: '1rem'
                }}>
                    <div className="glass-card no-hover-move" style={{
                        width: '100%', maxWidth: '600px', padding: '0',
                        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'
                    }}>
                        {/* Header Modal */}
                        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Detalle de Compra</h2>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pedido #{selectedOrder.id.toUpperCase()}</p>
                            </div>
                            <button onClick={() => setIsDetailModalOpen(false)} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '50%', padding: '8px', color: 'var(--text-main)' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Scrollable */}
                        <div className="modal-scroll-content" style={{ padding: '2rem', overflowY: 'auto' }}>
                            <div className="modal-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div className="info-item">
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Facturado a:</label>
                                    <p style={{ fontWeight: '700' }}><MapPin size={14} style={{ marginRight: '5px' }} /> {selectedOrder.clienteNombre || user?.nombre}</p>
                                    <p style={{ fontSize: '0.8rem', marginLeft: '1.2rem' }}>{selectedOrder.clienteDocumento || 'DNI/RUC no registrado'}</p>
                                </div>
                                <div className="info-item" style={{ textAlign: 'right' }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Método de Pago:</label>
                                    <p style={{ fontWeight: '700' }}><CreditCard size={14} style={{ marginRight: '5px' }} /> Pago Online</p>
                                </div>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                                <thead className="desktop-table-header" style={{ borderBottom: '2px solid var(--border-color)' }}>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '10px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>PRODUCTO</th>
                                        <th style={{ textAlign: 'center', padding: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>CANT.</th>
                                        <th style={{ textAlign: 'right', padding: '10px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody className="details-table-body">
                                    {selectedOrder.detalles?.map((d, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '15px 0' }} className="product-cell">
                                                <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{d.producto.nombre}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.producto.marca}</p>
                                            </td>
                                            <td style={{ textAlign: 'center', fontWeight: '800' }} className="qty-cell">{d.cantidad}</td>
                                            <td style={{ textAlign: 'right', fontWeight: '800' }} className="price-cell">S/. {(d.precioUnitario * d.cantidad).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={{ backgroundColor: 'var(--bg-dark)', padding: '1.5rem', borderRadius: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Subtotal</span>
                                    <span style={{ fontWeight: '600' }}>S/. {(selectedOrder.total / 1.18).toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>IGV (18%)</span>
                                    <span style={{ fontWeight: '600' }}>S/. {(selectedOrder.total - (selectedOrder.total / 1.18)).toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>Total Pagado</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>S/. {selectedOrder.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Modal Acciones */}
                        <div className="modal-footer-actions" style={{ padding: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
                            {(() => {
                                const comp = comprobantes.find(c => c.pedidoId === selectedOrder.id);
                                if (comp) {
                                    return (
                                        <>
                                            <button
                                                onClick={() => { setSelectedCompForView(comp); setIsDetailModalOpen(false); }}
                                                className="btn-primary"
                                                style={{ flex: 1, borderRadius: '12px', height: '50px' }}
                                            >
                                                <Receipt size={18} style={{ marginRight: '8px' }} /> Ver Comprobante
                                            </button>
                                            <button
                                                onClick={() => handleDescargarPDF(comp)}
                                                className="btn-glass"
                                                style={{ borderRadius: '12px', width: '50px', height: '50px' }}
                                                title="Descargar PDF"
                                            >
                                                <Download size={20} />
                                            </button>
                                        </>
                                    );
                                }
                                return (
                                    <div style={{ flex: 1, padding: '12px', backgroundColor: 'rgba(255,149,0,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', color: '#FF9500' }}>
                                        <Info size={18} />
                                        <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>Comprobante en proceso de emisión</span>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Visualizador de Comprobante / QR */}
            {selectedCompForView && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2100, backdropFilter: 'blur(15px)', padding: '2rem'
                }}>
                    <div className="glass-card no-hover-move comprobante-modal-card" style={{
                        width: '100%', maxWidth: '800px', height: '85vh', padding: '0',
                        display: 'flex', flexDirection: 'column', position: 'relative'
                    }}>
                        <div className="comprobante-header" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontWeight: '800' }}>{selectedCompForView.tipo}: {selectedCompForView.numeroComprobante}</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Emitido el {new Date(selectedCompForView.fechaEmision).toLocaleDateString()}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                <button
                                    onClick={() => handleDescargarPDF(selectedCompForView)}
                                    className="btn-primary"
                                    style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem' }}
                                >
                                    <Download size={16} style={{ marginRight: '6px' }} /> PDF
                                </button>
                                <button onClick={() => setSelectedCompForView(null)} style={{ background: 'var(--bg-dark)', border: 'none', borderRadius: '50%', padding: '8px', color: 'var(--text-main)' }}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {loadingPdf ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                    <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(0,0,0,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                    <p style={{ color: 'var(--text-muted)' }}>Cargando documento...</p>
                                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                                </div>
                            ) : pdfUrl ? (
                                <iframe
                                    src={pdfUrl}
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                    title="Factura Digital"
                                />
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <p>No se pudo visualizar el documento.</p>
                                    <button onClick={() => selectedCompForView && handleDescargarPDF(selectedCompForView)} className="btn-primary" style={{ marginTop: '1rem' }}>Descargar Manualmente</button>
                                </div>
                            )}
                        </div>

                        <div className="comprobante-footer" style={{ padding: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
                            <div className="qr-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                                <div style={{ textAlign: 'left' }} className="qr-text">
                                    <p style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '5px' }}>Validación Sunat</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Puedes validar este documento escaneando el código QR oficial desde tu celular.</p>
                                </div>
                                <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '12px' }} className="qr-image">
                                    <QrCode size={80} color="black" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .order-card {
                        flex-direction: column;
                        align-items: stretch !important;
                        gap: 1.5rem;
                        padding: 1.5rem !important;
                    }

                    .order-main-info {
                        gap: 1rem !important;
                    }

                    .order-actions {
                        width: 100%;
                        justify-content: space-between;
                        border-top: 1px solid var(--border-color);
                        padding-top: 1rem;
                    }

                    .modal-info-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1.5rem !important;
                    }

                    .info-item {
                        text-align: left !important;
                    }

                    .modal-footer-actions {
                        flex-direction: column-reverse;
                        padding: 1.5rem !important;
                    }

                    .modal-footer-actions button {
                        width: 100% !important;
                        flex: none !important;
                    }
                }

                @media (max-width: 480px) {
                    h1 {
                        font-size: 1.8rem !important;
                    }

                    .order-card {
                        padding: 1.2rem !important;
                    }

                    .order-actions {
                        flex-direction: column;
                        gap: 0.8rem !important;
                    }

                    .order-actions button {
                        width: 100% !important;
                        justify-content: center;
                    }

                    .comprobante-header {
                        padding: 1rem !important;
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 1rem;
                    }

                    .comprobante-modal-card {
                        height: 95vh !important;
                    }

                    .comprobante-footer {
                        padding: 1rem !important;
                    }

                    .qr-section {
                        gap: 1rem !important;
                    }

                    .qr-text {
                        display: none;
                    }

                    .qty-cell {
                        display: none;
                    }

                    .desktop-table-header th:nth-child(2) {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};
