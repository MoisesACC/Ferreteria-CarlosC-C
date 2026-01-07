import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Carrito, Producto } from '../types';

interface CartContextType {
    cart: Carrito[];
    addToCart: (producto: Producto, cantidad: number) => void;
    removeFromCart: (productoId: number) => void;
    updateQuantity: (productoId: number, cantidad: number) => void;
    clearCart: () => void;
    totalItems: number;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Carrito[]>(() => {
        const savedCart = localStorage.getItem('ferreteria_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('ferreteria_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (producto: Producto, cantidad: number) => {
        setCart(prev => {
            const existing = prev.find(item => item.producto.id === producto.id);
            if (existing) {
                return prev.map(item =>
                    item.producto.id === producto.id
                        ? { ...item, cantidad: item.cantidad + cantidad }
                        : item
                );
            }
            return [...prev, { producto, cantidad }];
        });
    };

    const removeFromCart = (productoId: number) => {
        setCart(prev => prev.filter(item => item.producto.id !== productoId));
    };

    const updateQuantity = (productoId: number, cantidad: number) => {
        if (cantidad <= 0) {
            removeFromCart(productoId);
            return;
        }
        setCart(prev => prev.map(item =>
            item.producto.id === productoId ? { ...item, cantidad } : item
        ));
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const total = cart.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, total }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
