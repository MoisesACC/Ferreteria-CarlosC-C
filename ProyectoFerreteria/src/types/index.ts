export interface Usuario {
    id?: string;
    nombre: string;
    email: string;
    rol: string;
    contrasena?: string;
}

export interface Categoria {
    id: string;
    nombre: string;
    descripcion: string;
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    precioAnterior?: number;
    marca: string;
    stock: number;
    imagen: string;
    esOferta: boolean;
    esNuevo: boolean;
    esMasVendido: boolean;
    puntuacion: number;
    categoria?: Categoria;
    imagenesAdicionales?: string[];
}

export interface Testimonio {
    id: number;
    cliente: string;
    comentario: string;
    estrellas: number;
    imagen: string;
}

export interface Carrito {
    id?: number;
    usuario?: Usuario;
    producto: Producto;
    cantidad: number;
}

export interface DetallePedido {
    producto: Producto;
    cantidad: number;
    precioUnitario: number;
}

export interface Pedido {
    id: string;
    fecha: string;
    total: number;
    estado: string;
    usuario?: Usuario;
    detalles?: DetallePedido[];
}
