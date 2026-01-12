import React, { useState } from 'react';
import { FileText, User, CreditCard, MapPin, Phone, X, Loader2 } from 'lucide-react';
import { comprobanteService } from '../api/comprobanteService';
import api from '../api/api';
import Swal from 'sweetalert2';

interface GenerarComprobanteModalProps {
    pedidoId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const GenerarComprobanteModal: React.FC<GenerarComprobanteModalProps> = ({
    pedidoId,
    onClose,
    onSuccess
}) => {
    const [formData, setFormData] = useState({
        tipo: 'BOLETA' as 'BOLETA' | 'FACTURA',
        clienteNombre: '',
        clienteDocumento: '',
        clienteDireccion: '',
        clienteTelefono: ''
    });

    const [generando, setGenerando] = useState(false);
    const [cargandoPedido, setCargandoPedido] = useState(true);

    React.useEffect(() => {
        const cargarDatosPedido = async () => {
            try {
                setCargandoPedido(true);
                const response = await api.get(`/pedidos/${pedidoId}`);
                const pedido = response.data;

                setFormData(prev => ({
                    ...prev,
                    clienteNombre: pedido.clienteNombre || pedido.usuario?.nombre || '',
                    clienteDocumento: pedido.clienteDocumento || '',
                    clienteDireccion: pedido.clienteDireccion || '',
                    clienteTelefono: pedido.clienteTelefono || ''
                }));
            } catch (error) {
                console.error("Error al cargar datos del pedido", error);
            } finally {
                setCargandoPedido(false);
            }
        };

        cargarDatosPedido();
    }, [pedidoId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.clienteNombre || !formData.clienteDocumento) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos requeridos',
                text: 'Por favor completa todos los campos obligatorios',
                confirmButtonColor: '#FFD700'
            });
            return;
        }

        setGenerando(true);

        try {
            const comprobante = await comprobanteService.generar({
                pedidoId,
                tipo: formData.tipo,
                clienteNombre: formData.clienteNombre,
                clienteDocumento: formData.clienteDocumento,
                clienteDireccion: formData.clienteDireccion || undefined,
                clienteTelefono: formData.clienteTelefono || undefined
            });

            // Descarga automática del PDF
            const blob = await comprobanteService.descargarPDF(comprobante.id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${comprobante.numeroComprobante}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            setGenerando(false);

            await Swal.fire({
                icon: 'success',
                title: '¡Comprobante Generado!',
                html: `
                    <div style="text-align: left; padding: 1rem;">
                        <p style="margin-bottom: 1rem;"><strong>Número:</strong> ${comprobante.numeroComprobante}</p>
                        <p style="margin-bottom: 1rem;"><strong>Tipo:</strong> ${comprobante.tipo}</p>
                        <p style="margin-bottom: 1rem;"><strong>Total:</strong> S/. ${comprobante.total.toFixed(2)}</p>
                        <p style="margin-bottom: 1rem; color: #666;">El PDF ha sido descargado automáticamente</p>
                        <div style="margin-top: 1.5rem; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                            <p style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">
                                <strong>¿Necesitas verlo de nuevo?</strong>
                            </p>
                            <p style="font-size: 0.85rem; color: #999;">
                                Ve a tu panel de pedidos y descarga el comprobante cuando lo necesites.
                            </p>
                        </div>
                    </div>
                `,
                confirmButtonColor: '#FFD700',
                width: '600px'
            });

            onSuccess();
            onClose();
        } catch (error: any) {
            setGenerando(false);
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error al generar comprobante',
                text: error.response?.data?.message || 'Ocurrió un error inesperado',
                confirmButtonColor: '#FFD700'
            });
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '2rem'
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    padding: '2rem',
                    borderRadius: '24px 24px 0 0',
                    position: 'relative'
                }}>
                    <button
                        onClick={onClose}
                        disabled={generando}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'rgba(0,0,0,0.2)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            cursor: generando ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={20} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#000' }}>
                        <div style={{
                            background: 'rgba(0,0,0,0.1)',
                            padding: '1rem',
                            borderRadius: '16px'
                        }}>
                            {cargandoPedido ? <Loader2 className="spinning" size={32} /> : <FileText size={32} />}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.3rem' }}>
                                {cargandoPedido ? 'Cargando Datos...' : 'Generar Comprobante'}
                            </h2>
                            <p style={{ opacity: 0.8 }}>
                                {cargandoPedido ? 'Obteniendo información del pedido...' : 'Complete los datos para emitir el documento'}
                            </p>
                        </div>
                    </div>
                </div>

                {cargandoPedido ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Loader2 className="spinning" size={48} style={{ margin: '0 auto 1.5rem' }} />
                        <p style={{ fontWeight: '600' }}>Recuperando datos del cliente...</p>
                    </div>
                ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                        {/* Tipo de Comprobante */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                color: '#333'
                            }}>
                                Tipo de Comprobante *
                            </label>
                            <select
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleChange}
                                disabled={generando}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '2px solid #eee',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    backgroundColor: '#fff'
                                }}
                            >
                                <option value="BOLETA">Boleta de Venta</option>
                                <option value="FACTURA">Factura</option>
                            </select>
                        </div>

                        {/* Nombre del Cliente */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                color: '#333'
                            }}>
                                <User size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                Nombre Completo *
                            </label>
                            <input
                                type="text"
                                name="clienteNombre"
                                value={formData.clienteNombre}
                                onChange={handleChange}
                                disabled={generando}
                                placeholder="Ej: Juan Pérez López"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '2px solid #eee',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {/* Documento */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                color: '#333'
                            }}>
                                <CreditCard size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                {formData.tipo === 'FACTURA' ? 'RUC' : 'DNI/CE'} *
                            </label>
                            <input
                                type="text"
                                name="clienteDocumento"
                                value={formData.clienteDocumento}
                                onChange={handleChange}
                                disabled={generando}
                                placeholder={formData.tipo === 'FACTURA' ? '20123456789' : '12345678'}
                                required
                                maxLength={formData.tipo === 'FACTURA' ? 11 : 12}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '2px solid #eee',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {/* Dirección (Opcional) */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                color: '#333'
                            }}>
                                <MapPin size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                Dirección (Opcional)
                            </label>
                            <input
                                type="text"
                                name="clienteDireccion"
                                value={formData.clienteDireccion}
                                onChange={handleChange}
                                disabled={generando}
                                placeholder="Av. Los Constructores 123, Lima"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '2px solid #eee',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {/* Teléfono (Opcional) */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                color: '#333'
                            }}>
                                <Phone size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                Teléfono (Opcional)
                            </label>
                            <input
                                type="tel"
                                name="clienteTelefono"
                                value={formData.clienteTelefono}
                                onChange={handleChange}
                                disabled={generando}
                                placeholder="+51 981 182 158"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '2px solid #eee',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {/* Botones */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={generando}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: '2px solid #ddd',
                                    background: '#fff',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    cursor: generando ? 'not-allowed' : 'pointer',
                                    opacity: generando ? 0.5 : 1
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={generando}
                                style={{
                                    flex: 2,
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: generando
                                        ? '#ccc'
                                        : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                    color: '#000',
                                    fontWeight: '900',
                                    fontSize: '1rem',
                                    cursor: generando ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {generando ? (
                                    <>
                                        <div className="spinner-small"></div>
                                        Generando...
                                    </>
                                ) : (
                                    <>
                                        <FileText size={20} />
                                        Generar Comprobante
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                <style>{`
                    .spinner-small {
                        border: 3px solid #f3f3f3;
                        border-top: 3px solid #000;
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        animation: spin 1s linear infinite;
                    }
                `}</style>
            </div>
        </div>
    );
};
