import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    ShoppingCart,
    Plus,
    Minus,
    Truck,
    Undo,
    ShieldCheck,
    ArrowLeft,
    Share2,
    Heart
} from 'lucide-react';
import type { Producto } from '../types';
import api from '../api/api';
import { useCart } from '../context/CartContext';

export const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Producto | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string>('');
    const [cantidad, setCantidad] = useState(1);
    const [selectedTab, setSelectedTab] = useState('detail');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/productos/${id}`);
                setProduct(res.data);
                setActiveImage(res.data.imagen);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loader"></div>
        </div>
    );

    if (!product) return (
        <div style={{ minHeight: '80vh', textAlign: 'center', padding: '5rem' }}>
            <h2>Producto no encontrado</h2>
            <button onClick={() => navigate('/productos')} className="btn-primary" style={{ marginTop: '2rem' }}>Regresar a tienda</button>
        </div>
    );

    const allImages = [product.imagen, ...(product.imagenesAdicionales || []).filter(img => img)];

    return (
        <div className="product-details-page">
            <div className="container">
                {/* Header / Breadcrumbs */}
                <button
                    onClick={() => navigate(-1)}
                    className="back-btn"
                >
                    <ArrowLeft size={18} /> Volver
                </button>

                <div className="product-main-grid">
                    {/* Image Gallery */}
                    <div className="gallery-container">
                        <div className="thumbnails-wrapper">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onMouseEnter={() => setActiveImage(img)}
                                    onClick={() => setActiveImage(img)}
                                    className={`thumb-btn ${activeImage === img ? 'active' : ''}`}
                                >
                                    <img src={img} alt="" />
                                </button>
                            ))}
                        </div>
                        <div className="main-image-wrapper glass-card">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    src={activeImage}
                                    alt={product.nombre}
                                    className="main-img"
                                />
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="info-container">
                        <div className="info-header">
                            <span className="category-tag">
                                {product.categoria?.nombre || 'General'}
                            </span>
                            <div className="header-actions">
                                <button className="glass-button action-btn"><Heart size={20} /></button>
                                <button className="glass-button action-btn"><Share2 size={20} /></button>
                            </div>
                        </div>

                        <h1 className="product-title">{product.nombre}</h1>

                        <div className="rating-row">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill={i < Math.floor(product.puntuacion) ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <span className="rating-text">({product.puntuacion} de 5 estrellas)</span>
                        </div>

                        <div className="price-row">
                            <h2 className="main-price">S/. {product.precio.toFixed(2)}</h2>
                            {product.precioAnterior && (
                                <span className="old-price">
                                    S/. {product.precioAnterior.toFixed(2)}
                                </span>
                            )}
                            {product.esOferta && (
                                <div className="discount-badge">
                                    -{Math.round((1 - product.precio / (product.precioAnterior || 1)) * 100)}%
                                </div>
                            )}
                        </div>

                        <div className="description-box">
                            <p>
                                {product.descripcion || "Este producto de alta calidad de la marca " + product.marca + " es ideal para tus proyectos industriales y del hogar."}
                            </p>
                        </div>

                        <div className="purchase-row">
                            <div className="qty-selector">
                                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="qty-btn"><Minus size={20} /></button>
                                <span className="qty-val">{cantidad}</span>
                                <button onClick={() => setCantidad(cantidad + 1)} className="qty-btn"><Plus size={20} /></button>
                            </div>

                            <button
                                onClick={() => addToCart(product, cantidad)}
                                className="btn-primary add-to-cart-btn"
                            >
                                <ShoppingCart size={24} /> <span>Añadir al Carrito</span>
                            </button>
                        </div>

                        <div className="trust-badges-grid-mini">
                            <div className="trust-item">
                                <Truck size={30} className="badge-icon" />
                                <span className="badge-text">Envío Gratis</span>
                                <p className="badge-subtext">En compras mayores a S/. 200</p>
                            </div>
                            <div className="trust-item">
                                <Undo size={30} className="badge-icon" />
                                <span className="badge-text">Devalución Fácil</span>
                                <p className="badge-subtext">Hasta 30 días</p>
                            </div>
                            <div className="trust-item">
                                <ShieldCheck size={30} className="badge-icon" />
                                <span className="badge-text">Garantía</span>
                                <p className="badge-subtext">100% Calidad Asegurada</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="tabs-section">
                    <div className="tabs-header">
                        <button
                            onClick={() => setSelectedTab('detail')}
                            className={`tab-btn ${selectedTab === 'detail' ? 'active' : ''}`}
                        >
                            Especificaciones
                        </button>
                        <button
                            onClick={() => setSelectedTab('shipping')}
                            className={`tab-btn ${selectedTab === 'shipping' ? 'active' : ''}`}
                        >
                            Política de Envío
                        </button>
                    </div>

                    <div className="tabs-content">
                        {selectedTab === 'detail' ? (
                            <div className="specs-grid">
                                <div className="glass-card spec-card">
                                    <h4>Ficha Técnica</h4>
                                    <table className="spec-table">
                                        <tbody>
                                            <tr><td>Marca</td><td>{product.marca}</td></tr>
                                            <tr><td>Categoría</td><td>{product.categoria?.nombre}</td></tr>
                                            <tr><td>Disponibilidad</td><td className="in-stock">{product.stock > 0 ? 'En Stock (' + product.stock + ')' : 'Próximamente'}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="info-text">
                                    <h4>Información del Producto</h4>
                                    <p>{product.descripcion || "Adquiere este producto original Carlos C&C. Diseñado bajo los más estrictos estándares de calidad..."}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="shipping-info">
                                <h4>Información de despacho</h4>
                                <p>Realizamos envíos a todo el Perú. En Lima metropolitana el tiempo de entrega es de 24 a 48 horas hábiles...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .product-details-page { padding: 3rem 5%; background-color: var(--bg-main); min-height: 100vh; }
                .back-btn { margin-bottom: 2rem; display: flex; align-items: center; gap: 0.5rem; background: transparent; color: var(--text-muted); font-weight: 600; cursor: pointer; }
                
                .product-main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
                
                .gallery-container { display: flex; gap: 1.5rem; }
                .thumbnails-wrapper { display: flex; flexDirection: column; gap: 1rem; }
                .thumb-btn { width: 80px; height: 80px; borderRadius: 12px; overflow: hidden; border: 1px solid var(--border-color); padding: 5px; backgroundColor: #fff; cursor: pointer; }
                .thumb-btn.active { border-color: var(--primary); border-width: 2px; }
                .thumb-btn img { width: 100%; height: 100%; object-fit: contain; }
                .main-image-wrapper { flex: 1; padding: 2rem; display: flex; alignItems: center; justifyContent: center; height: 600px; backgroundColor: #fff; borderRadius: 30px; }
                .main-img { width: 100%; height: 100%; object-fit: contain; }

                .info-header { display: flex; justifyContent: space-between; alignItems: center; marginBottom: 1rem; }
                .category-tag { background: var(--bg-dark); padding: 6px 15px; borderRadius: 99px; fontSize: 0.75rem; fontWeight: 800; color: var(--primary); letterSpacing: '1px'; }
                .header-actions { display: flex; gap: 1rem; }
                .action-btn { padding: 10px; cursor: pointer; }
                .product-title { fontSize: 3rem; fontWeight: 900; lineHeight: 1.1; marginBottom: 1rem; }
                .rating-row { display: flex; alignItems: center; gap: 1.5rem; marginBottom: 2.5rem; }
                .stars { display: flex; color: #FFB800; }
                .rating-text { color: var(--text-muted); fontSize: 0.9rem; fontWeight: 600; }
                .price-row { display: flex; alignItems: baseline; gap: 1.5rem; marginBottom: 3rem; }
                .main-price { fontSize: 3.5rem; color: var(--primary); fontWeight: 950; }
                .old-price { fontSize: 1.5rem; text-decoration: line-through; color: var(--text-muted); fontWeight: 600; }
                .discount-badge { backgroundColor: #FF3B30; color: #fff; padding: 5px 12px; borderRadius: 10px; fontSize: 0.9rem; fontWeight: 900; }

                .description-box { backgroundColor: var(--bg-dark); borderRadius: 24px; padding: 2.5rem; marginBottom: 3rem; }
                .description-box p { color: var(--text-muted); fontSize: 1.1rem; lineHeight: 1.6; }

                .purchase-row { display: flex; gap: 2rem; marginBottom: 3rem; }
                .qty-selector { display: flex; alignItems: center; gap: 1rem; backgroundColor: var(--bg-main); padding: 10px 20px; borderRadius: 16px; border: 1px solid var(--border-color); }
                .qty-btn { background: transparent; cursor: pointer; color: var(--text-main); }
                .qty-val { fontSize: 1.2rem; fontWeight: 900; minWidth: 40px; textAlign: center; }
                .add-to-cart-btn { flex: 1; height: 64px; fontSize: 1.1rem; fontWeight: 900; borderRadius: 20px; display: flex; align-items: center; justify-content: center; gap: 1rem; }

                .trust-badges-grid-mini { display: grid; gridTemplateColumns: repeat(3, 1fr); gap: 1.5rem; borderTop: 1px solid var(--border-color); paddingTop: 3rem; }
                .trust-item { display: flex; flexDirection: column; alignItems: center; gap: 0.8rem; textAlign: center; }
                .badge-icon { color: var(--primary); }
                .badge-text { fontSize: 0.85rem; fontWeight: 700; }
                .badge-subtext { fontSize: 0.75rem; color: var(--text-muted); }

                .tabs-section { marginTop: 5rem; }
                .tabs-header { display: flex; borderBottom: 1px solid var(--border-color); gap: 3rem; }
                .tab-btn { padding: 1rem 0.5rem; background: transparent; fontWeight: 800; color: var(--text-muted); borderBottom: 3px solid transparent; cursor: pointer; }
                .tab-btn.active { color: var(--primary); borderBottom-color: var(--primary); }
                .specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 3rem 0; }
                .spec-card { padding: 2rem; }
                .spec-table { width: 100%; border-collapse: collapse; }
                .spec-table td { padding: 12px 0; font-size: 0.9rem; border-bottom: 1px solid var(--border-color); }
                .spec-table td:last-child { font-weight: 700; text-align: right; }
                .in-stock { color: #34C759 !important; }

                @media (max-width: 992px) {
                    .product-main-grid { grid-template-columns: 1fr; gap: 2rem; }
                    .main-image-wrapper { height: 400px; }
                    .product-title { font-size: 2.2rem; }
                    .main-price { font-size: 2.5rem; }
                    .specs-grid { grid-template-columns: 1fr; }
                }

                @media (max-width: 768px) {
                    .gallery-container { flex-direction: column-reverse; }
                    .thumbnails-wrapper { flex-direction: row; overflow-x: auto; padding-bottom: 5px; }
                    .thumb-btn { flex-shrink: 0; }
                    .purchase-row { flex-direction: column; }
                    .qty-selector { justify-content: space-between; }
                    .trust-badges-grid-mini { grid-template-columns: 1fr; gap: 2rem; }
                }
            `}</style>
        </div>
    );
};
