import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import type { Pedido, Comprobante } from '../types';
import { Package, Clock, CheckCircle, Truck, ArrowLeft, Download, Receipt, QrCode, X, CreditCard, MapPin, Calendar, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { comprobanteService } from '../api/comprobanteService';
import '../styles/MyOrders.css';

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

    const formatDate = (dateStr: string) => {
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
        <div className="my-orders-page">
            <div className="container orders-container">
                <div className="orders-header">
                    <button onClick={() => navigate(-1)} className="btn-back-header">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="orders-title">Mis Pedidos</h1>
                </div>

                {loading ? (
                    <div className="loading-message">Cargando tus compras...</div>
                ) : orders.length === 0 ? (
                    <div className="glass-card empty-orders-card">
                        <Package size={64} className="empty-icon" />
                        <h3>Aún no has realizado ninguna compra</h3>
                        <p className="empty-text">¡Tus herramientas favoritas te esperan!</p>
                        <button onClick={() => navigate('/productos')} className="btn-primary">Explorar Productos</button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map(order => {
                            const comp = comprobantes.find(c => c.pedidoId === order.id);
                            return (
                                <div key={order.id} className="glass-card no-hover-move order-card">
                                    <div className="order-main-info">
                                        <div className="order-icon-box">
                                            <Package size={28} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <div className="order-id-row">
                                                <span className="order-id-text">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                <div className="status-badge">
                                                    {getStatusIcon(order.estado)}
                                                    <span className="status-text">{order.estado}</span>
                                                </div>
                                            </div>
                                            <h3 className="order-total">S/. {order.total.toFixed(2)}</h3>
                                            <p className="order-date">
                                                <Calendar size={14} /> {formatDate(order.fecha)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="order-actions">
                                        {comp && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => setSelectedCompForView(comp)}
                                                    className="btn-glass btn-icon-glass"
                                                    title="Ver Comprobante"
                                                >
                                                    <Receipt size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDescargarPDF(comp)}
                                                    className="btn-glass btn-icon-glass text-primary"
                                                    title="Descargar PDF"
                                                >
                                                    <Download size={18} />
                                                </button>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => { setSelectedOrder(order); setIsDetailModalOpen(true); }}
                                            className="btn-primary btn-details"
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
                <div className="modal-overlay">
                    <div className="glass-card no-hover-move modal-card">
                        {/* Header Modal */}
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">Detalle de Compra</h2>
                                <p className="modal-subtitle">Pedido #{selectedOrder.id.toUpperCase()}</p>
                            </div>
                            <button onClick={() => setIsDetailModalOpen(false)} className="btn-close">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Scrollable */}
                        <div className="modal-scroll-content">
                            <div className="modal-info-grid">
                                <div className="info-item">
                                    <label className="info-label">Facturado a:</label>
                                    <p className="info-value-strong"><MapPin size={14} style={{ marginRight: '5px' }} /> {selectedOrder.clienteNombre || user?.nombre}</p>
                                    <p className="info-value-sub">{selectedOrder.clienteDocumento || 'DNI/RUC no registrado'}</p>
                                </div>
                                <div className="info-item text-right">
                                    <label className="info-label">Método de Pago:</label>
                                    <p className="info-value-strong" style={{ justifyContent: 'flex-end' }}><CreditCard size={14} style={{ marginRight: '5px' }} /> Pago Online</p>
                                </div>
                            </div>

                            <table className="details-table">
                                <thead className="desktop-table-header">
                                    <tr>
                                        <th className="th-cell align-left">PRODUCTO</th>
                                        <th className="th-cell align-center">CANT.</th>
                                        <th className="th-cell align-right">TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody className="details-table-body">
                                    {selectedOrder.detalles?.map((d, i) => (
                                        <tr key={i} className="tr-border">
                                            <td className="product-cell">
                                                <p className="product-name">{d.producto.nombre}</p>
                                                <p className="product-brand">{d.producto.marca}</p>
                                            </td>
                                            <td className="qty-cell">{d.cantidad}</td>
                                            <td className="price-cell">S/. {(d.precioUnitario * d.cantidad).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="totals-box">
                                <div className="total-row">
                                    <span className="label-muted">Subtotal</span>
                                    <span className="value-bold">S/. {(selectedOrder.total / 1.18).toFixed(2)}</span>
                                </div>
                                <div className="total-row" style={{ marginBottom: '1rem' }}>
                                    <span className="label-muted">IGV (18%)</span>
                                    <span className="value-bold">S/. {(selectedOrder.total - (selectedOrder.total / 1.18)).toFixed(2)}</span>
                                </div>
                                <div className="total-row-last">
                                    <span className="total-final-text">Total Pagado</span>
                                    <span className="total-final-text text-primary">S/. {selectedOrder.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Modal Acciones */}
                        <div className="modal-footer-actions">
                            {(() => {
                                const comp = comprobantes.find(c => c.pedidoId === selectedOrder.id);
                                if (comp) {
                                    return (
                                        <>
                                            <button
                                                onClick={() => { setSelectedCompForView(comp); setIsDetailModalOpen(false); }}
                                                className="btn-primary btn-view-receipt"
                                            >
                                                <Receipt size={18} style={{ marginRight: '8px' }} /> Ver Comprobante
                                            </button>
                                            <button
                                                onClick={() => handleDescargarPDF(comp)}
                                                className="btn-glass btn-download-icon"
                                                title="Descargar PDF"
                                            >
                                                <Download size={20} />
                                            </button>
                                        </>
                                    );
                                }
                                return (
                                    <div className="pending-receipt">
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
                <div className="modal-overlay pdf-modal-overlay">
                    <div className="glass-card no-hover-move comprobante-modal-card">
                        <div className="comprobante-header">
                            <div>
                                <h3 style={{ fontWeight: '800' }}>{selectedCompForView.tipo}: {selectedCompForView.numeroComprobante}</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Emitido el {new Date(selectedCompForView.fechaEmision).toLocaleDateString()}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                <button
                                    onClick={() => handleDescargarPDF(selectedCompForView)}
                                    className="btn-primary pdf-btn-download"
                                >
                                    <Download size={16} style={{ marginRight: '6px' }} /> PDF
                                </button>
                                <button onClick={() => setSelectedCompForView(null)} className="btn-close">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="pdf-viewer-container">
                            {loadingPdf ? (
                                <div className="pdf-loading">
                                    <div className="spinner"></div>
                                    <p style={{ color: 'var(--text-muted)' }}>Cargando documento...</p>
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

                        <div className="comprobante-footer">
                            <div className="qr-section">
                                <div style={{ textAlign: 'left' }} className="qr-text">
                                    <p style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '5px' }}>Validación Sunat</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Puedes validar este documento escaneando el código QR oficial desde tu celular.</p>
                                </div>
                                <div className="qr-image">
                                    <QrCode size={80} color="black" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
