import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Download, CheckCircle, Calendar, User, CreditCard } from 'lucide-react';
import { comprobanteService } from '../api/comprobanteService';
import Swal from 'sweetalert2';

interface Comprobante {
    id: string;
    numeroComprobante: string;
    tipo: 'BOLETA' | 'FACTURA';
    fechaEmision: string;
    clienteNombre: string;
    clienteDocumento: string;
    subtotal: number;
    igv: number;
    total: number;
    estado: string;
}

export const VerComprobante: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [comprobante, setComprobante] = useState<Comprobante | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarComprobante = async () => {
            try {
                setLoading(true);
                const data = await comprobanteService.obtenerPorId(id!);
                setComprobante(data);
            } catch (err) {
                console.error("Error al cargar comprobante", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar el comprobante',
                    confirmButtonColor: '#FFD700'
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            cargarComprobante();
        }
    }, [id]);

    const descargarPDF = async () => {
        try {
            const blob = await comprobanteService.descargarPDF(id!);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${comprobante?.numeroComprobante}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            Swal.fire({
                icon: 'success',
                title: '¡Descargado!',
                text: 'El comprobante se descargó correctamente',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            console.error("Error al descargar PDF", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo descargar el PDF',
                confirmButtonColor: '#FFD700'
            });
        }
    };

    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div className="spinner-large"></div>
                <style>{`
                    .spinner-large {
                        border: 6px solid #f3f3f3;
                        border-top: 6px solid #FFD700;
                        border-radius: 50%;
                        width: 60px;
                        height: 60px;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (!comprobante) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '2rem'
            }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '3rem',
                    textAlign: 'center',
                    maxWidth: '500px'
                }}>
                    <FileText size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem' }}>
                        Comprobante no encontrado
                    </h2>
                    <p style={{ color: '#666' }}>
                        El comprobante que buscas no existe o ha sido eliminado.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '3rem 1rem'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                    padding: '1rem',
                                    borderRadius: '16px'
                                }}>
                                    <FileText size={32} color="#000" />
                                </div>
                                <div>
                                    <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.3rem' }}>
                                        {comprobante.tipo}
                                    </h1>
                                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                                        {comprobante.numeroComprobante}
                                    </p>
                                </div>
                            </div>

                            {comprobante.estado === 'EMITIDO' ? (
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: '#34C759',
                                    color: '#fff',
                                    padding: '8px 16px',
                                    borderRadius: '99px',
                                    fontWeight: '700',
                                    fontSize: '0.9rem'
                                }}>
                                    <CheckCircle size={18} />
                                    Comprobante Válido
                                </div>
                            ) : (
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: '#FF3B30',
                                    color: '#fff',
                                    padding: '8px 16px',
                                    borderRadius: '99px',
                                    fontWeight: '700',
                                    fontSize: '0.9rem'
                                }}>
                                    Anulado
                                </div>
                            )}
                        </div>

                        <button
                            onClick={descargarPDF}
                            style={{
                                padding: '14px 28px',
                                borderRadius: '99px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                color: '#000',
                                fontWeight: '900',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)'
                            }}
                        >
                            <Download size={20} />
                            Descargar PDF
                        </button>
                    </div>
                </div>

                {/* Información del Comprobante */}
                <div style={{
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>
                        Información del Comprobante
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div style={{
                            padding: '1.5rem',
                            background: '#f9f9f9',
                            borderRadius: '16px',
                            borderLeft: '4px solid #FFD700'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                <Calendar size={20} color="#666" />
                                <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>Fecha de Emisión</span>
                            </div>
                            <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                                {formatFecha(comprobante.fechaEmision)}
                            </p>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            background: '#f9f9f9',
                            borderRadius: '16px',
                            borderLeft: '4px solid #6C47FF'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                <User size={20} color="#666" />
                                <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>Cliente</span>
                            </div>
                            <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                                {comprobante.clienteNombre}
                            </p>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            background: '#f9f9f9',
                            borderRadius: '16px',
                            borderLeft: '4px solid #FF9500'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                <CreditCard size={20} color="#666" />
                                <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>Documento</span>
                            </div>
                            <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                                {comprobante.clienteDocumento}
                            </p>
                        </div>
                    </div>

                    {/* Totales */}
                    <div style={{
                        marginTop: '2rem',
                        padding: '1.5rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px',
                        color: '#fff'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                            <span>Subtotal:</span>
                            <span style={{ fontWeight: '700' }}>S/. {comprobante.subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                            <span>IGV (18%):</span>
                            <span style={{ fontWeight: '700' }}>S/. {comprobante.igv.toFixed(2)}</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingTop: '0.8rem',
                            borderTop: '2px solid rgba(255,255,255,0.3)',
                            fontSize: '1.5rem',
                            fontWeight: '900'
                        }}>
                            <span>TOTAL:</span>
                            <span>S/. {comprobante.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Vista del PDF */}
                <div style={{
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '2rem',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>
                        Vista Previa del Documento
                    </h2>
                    <div style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}>
                        <iframe
                            src={comprobanteService.obtenerUrlPDF(comprobante.id)}
                            style={{
                                width: '100%',
                                height: '800px',
                                border: 'none'
                            }}
                            title="Vista del comprobante"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    marginTop: '3rem',
                    textAlign: 'center',
                    color: '#fff',
                    opacity: 0.8
                }}>
                    <p style={{ fontSize: '0.9rem' }}>
                        © 2024 Ferretería Carlos C&C - Todos los derechos reservados
                    </p>
                </div>
            </div>
        </div>
    );
};
