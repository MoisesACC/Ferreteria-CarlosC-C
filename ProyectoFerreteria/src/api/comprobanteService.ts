import api from './api';

interface GenerarComprobanteRequest {
    pedidoId: string;
    tipo: 'BOLETA' | 'FACTURA';
    clienteNombre: string;
    clienteDocumento: string;
    clienteDireccion?: string;
    clienteTelefono?: string;
}

interface ComprobanteDTO {
    id: string;
    pedidoId: string;
    numeroComprobante: string;
    tipo: 'BOLETA' | 'FACTURA';
    fechaEmision: string;
    clienteNombre: string;
    clienteDocumento: string;
    clienteDireccion?: string;
    clienteTelefono?: string;
    subtotal: number;
    igv: number;
    total: number;
    urlPublica: string;
    qrCodeUrl: string;
    estado: string;
}

export const comprobanteService = {
    /**
     * Genera un nuevo comprobante
     */
    generar: async (data: GenerarComprobanteRequest): Promise<ComprobanteDTO> => {
        const response = await api.post('/comprobantes/generar', data);
        return response.data;
    },

    /**
     * Obtiene un comprobante por ID
     */
    obtenerPorId: async (id: string): Promise<ComprobanteDTO> => {
        const response = await api.get(`/comprobantes/${id}`);
        return response.data;
    },

    /**
     * Obtiene el comprobante de un pedido
     */
    obtenerPorPedido: async (pedidoId: string): Promise<ComprobanteDTO> => {
        const response = await api.get(`/comprobantes/pedido/${pedidoId}`);
        return response.data;
    },

    /**
     * Descarga el PDF del comprobante
     */
    descargarPDF: async (id: string): Promise<Blob> => {
        const response = await api.get(`/comprobantes/${id}/pdf`, {
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Obtiene la URL para visualizar el PDF
     */
    obtenerUrlPDF: (id: string): string => {
        return `${api.defaults.baseURL}/comprobantes/${id}/ver-pdf`;
    },

    /**
     * Lista todos los comprobantes (ADMIN)
     */
    listar: async (): Promise<ComprobanteDTO[]> => {
        const response = await api.get('/comprobantes');
        return response.data;
    },

    /**
     * Anula un comprobante (ADMIN)
     */
    anular: async (id: string): Promise<ComprobanteDTO> => {
        const response = await api.put(`/comprobantes/${id}/anular`);
        return response.data;
    }
};
