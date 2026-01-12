/**
 * EJEMPLO DE INTEGRACIÓN DEL MODAL DE COMPROBANTES EN CHECKOUT
 * 
 * Este archivo muestra cómo integrar el GenerarComprobanteModal
 * en el flujo de checkout después de confirmar un pago exitoso.
 */

import React, { useState } from 'react';
import { GenerarComprobanteModal } from '../components/GenerarComprobanteModal';
import Swal from 'sweetalert2';

export const CheckoutExample: React.FC = () => {
    const [pedidoId, setPedidoId] = useState<string | null>(null);
    const [mostrarModalComprobante, setMostrarModalComprobante] = useState(false);

    /**
     * Función que se ejecuta después de confirmar un pago exitoso
     */
    const handlePagoExitoso = async (pedidoCreado: any) => {
        // Guardar el ID del pedido
        setPedidoId(pedidoCreado.id);

        // Preguntar si desea generar comprobante inmediatamente
        const result = await Swal.fire({
            title: '¡Pago Confirmado! 🎉',
            html: `
                <div style="text-align: left; padding: 1rem;">
                    <p style="margin-bottom: 1rem;">Tu pedido ha sido procesado correctamente.</p>
                    <p style="margin-bottom: 1rem;"><strong>¿Deseas generar tu comprobante de pago?</strong></p>
                    <ul style="text-align: left; color: #666; font-size: 0.9rem;">
                        <li>Boleta de Venta</li>
                        <li>Factura (si tienes RUC)</li>
                    </ul>
                </div>
            `,
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Sí, generar comprobante',
            cancelButtonText: 'Más tarde',
            confirmButtonColor: '#FFD700',
            cancelButtonColor: '#999'
        });

        if (result.isConfirmed) {
            // Mostrar modal para generar comprobante
            setMostrarModalComprobante(true);
        } else {
            // Redirigir a "Mis Pedidos" o mostrar mensaje
            Swal.fire({
                title: 'Perfecto',
                text: 'Puedes generar tu comprobante más tarde desde "Mis Pedidos"',
                icon: 'info',
                confirmButtonColor: '#FFD700'
            });
        }
    };

    /**
     * Cuando se genera exitosamente el comprobante
     */
    const handleComprobanteGenerado = () => {
        // Opcional: redirigir a mis pedidos o mostrar mensaje final
        console.log('Comprobante generado exitosamente');
    };

    return (
        <div>
            {/* Tu formulario de checkout aquí */}

            <button onClick={() => {
                // Simular pago exitoso
                handlePagoExitoso({ id: 'pedido-123' });
            }}>
                Confirmar Pago
            </button>

            {/* Modal de generación de comprobante */}
            {mostrarModalComprobante && pedidoId && (
                <GenerarComprobanteModal
                    pedidoId={pedidoId}
                    onClose={() => setMostrarModalComprobante(false)}
                    onSuccess={handleComprobanteGenerado}
                />
            )}
        </div>
    );
};

/**
 * EJEMPLO 2: Integrar en la página de "Mis Pedidos"
 * 
 * Permite generar comprobante para pedidos pasados
 */

export const MisPedidosExample: React.FC = () => {
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<string | null>(null);

    const pedidos = [
        { id: 'pedido-1', total: 150.00, fecha: '2024-01-10', tieneComprobante: false },
        { id: 'pedido-2', total: 250.00, fecha: '2024-01-09', tieneComprobante: true },
    ];

    return (
        <div>
            <h2>Mis Pedidos</h2>

            {pedidos.map(pedido => (
                <div key={pedido.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
                    <p>Total: S/. {pedido.total}</p>
                    <p>Fecha: {pedido.fecha}</p>

                    {!pedido.tieneComprobante && (
                        <button onClick={() => setPedidoSeleccionado(pedido.id)}>
                            Generar Comprobante
                        </button>
                    )}
                </div>
            ))}

            {pedidoSeleccionado && (
                <GenerarComprobanteModal
                    pedidoId={pedidoSeleccionado}
                    onClose={() => setPedidoSeleccionado(null)}
                    onSuccess={() => {
                        setPedidoSeleccionado(null);
                        // Recargar pedidos...
                    }}
                />
            )}
        </div>
    );
};

/**
 * EJEMPLO 3: Uso de SweetAlert2 para confirmaciones
 */

export const EjemplosSweetAlert = {

    // Confirmación simple
    confirmarAccion: async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar'
        });

        return result.isConfirmed;
    },

    // Notificación de éxito
    mostrarExito: () => {
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La operación se completó correctamente',
            timer: 2000,
            showConfirmButton: false
        });
    },

    // Error con detalles
    mostrarError: (mensaje: string) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: mensaje,
            confirmButtonColor: '#FFD700'
        });
    },

    // Modal con HTML personalizado
    mostrarInfo: () => {
        Swal.fire({
            title: 'Información',
            html: `
                <div style="text-align: left;">
                    <p><strong>Tipos de comprobante:</strong></p>
                    <ul>
                        <li>Boleta: Para clientes con DNI</li>
                        <li>Factura: Para empresas con RUC</li>
                    </ul>
                </div>
            `,
            icon: 'info',
            confirmButtonColor: '#FFD700'
        });
    },

    // Loading mientras se procesa
    mostrarCargando: () => {
        Swal.fire({
            title: 'Procesando...',
            html: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    },

    // Cerrar loading
    cerrarCargando: () => {
        Swal.close();
    }
};
