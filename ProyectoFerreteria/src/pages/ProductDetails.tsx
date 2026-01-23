import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    ShoppingCart,
    Plus,
    Minus,
    Truck,
    Undo,
    ShieldCheck,
    ChevronRight,
    Share2,
    Heart,
    Check
} from 'lucide-react';
import type { Producto } from '../types';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import '../styles/ProductDetails.css';

export const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Producto | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string>('');
    const [cantidad, setCantidad] = useState(1);
    const [selectedTab, setSelectedTab] = useState('detail');
    const [isAdded, setIsAdded] = useState(false);

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

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, cantidad);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        }
    };

    if (loading) return (
        <div className="product-details-container">
            {/* Skeleton Breadcrumb */}
            <div className="container">
                <div className="skeleton-box sk-breadcrumb"></div>
            </div>

            <div className="container">
                <main className="product-layout">
                    {/* Left: Skeleton Gallery */}
                    <div className="left-column">
                        <div className="sk-gallery-area">
                            <div className="sk-thumbs">
                                {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-box sk-thumb-item"></div>)}
                            </div>
                            <div className="skeleton-box sk-main-img"></div>
                        </div>
                        <div className="skeleton-box sk-trust"></div>
                    </div>

                    {/* Right: Skeleton Info */}
                    <div className="product-content">
                        <div className="product-sticky">
                            <div className="sk-meta">
                                <div className="skeleton-box sk-cat"></div>
                                <div className="skeleton-box sk-icons"></div>
                            </div>

                            <div className="skeleton-box sk-title"></div>
                            <div className="skeleton-box sk-rating"></div>

                            <div className="skeleton-box sk-price"></div>
                            <div className="skeleton-box sk-promo"></div>

                            <div className="sk-desc-lines">
                                <div className="skeleton-box sk-line"></div>
                                <div className="skeleton-box sk-line"></div>
                                <div className="skeleton-box sk-line"></div>
                                <div className="skeleton-box sk-line short"></div>
                            </div>

                            <div className="sk-actions">
                                <div className="skeleton-box sk-btn"></div>
                                <div className="skeleton-box sk-btn"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );

    if (!product) return (
        <div style={{ minHeight: '80vh', textAlign: 'center', padding: '5rem' }}>
            <h2>Producto no encontrado</h2>
            <button onClick={() => navigate('/productos')} className="btn-primary" style={{ marginTop: '2rem', padding: '12px 24px', borderRadius: '12px', color: '#000' }}>Seguir comprando</button>
        </div>
    );

    const allImages = [product.imagen, ...(product.imagenesAdicionales || []).filter(img => img)];

    return (
        <div className="product-details-container">
            {/* Breadcrumb Navigation */}
            <nav className="breadcrumb">
                <div className="container">
                    <Link to="/">Inicio</Link>
                    <ChevronRight size={14} />
                    <Link to="/productos">Tienda</Link>
                    <ChevronRight size={14} />
                    <span className="current">{product.categoria?.nombre || 'General'}</span>
                </div>
            </nav>

            <div className="container">
                <main className="product-layout">
                    {/* Left: Gallery Section */}
                    <div className="left-column">
                        <div className="product-gallery">
                            <div className="thumb-carousel">
                                {allImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`thumb-item ${activeImage === img ? 'active' : ''}`}
                                        onMouseEnter={() => setActiveImage(img)}
                                    >
                                        <img src={img} alt={`${product.nombre} view ${idx}`} />
                                    </div>
                                ))}
                            </div>
                            <div className="main-display">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeImage}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="main-image-container"
                                    >
                                        <img src={activeImage} alt={product.nombre} />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="trust-ribbon">
                            <div className="trust-card">
                                <Truck size={28} />
                                <div className="card-text">
                                    <strong>Envío Gratis</strong>
                                    <span>Desde S/. 200</span>
                                </div>
                            </div>
                            <div className="trust-card">
                                <Undo size={28} />
                                <div className="card-text">
                                    <strong>Cambios</strong>
                                    <span>30 días</span>
                                </div>
                            </div>
                            <div className="trust-card">
                                <ShieldCheck size={28} />
                                <div className="card-text">
                                    <strong>Garantía</strong>
                                    <span>100% Original</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Info Section */}
                    <div className="product-content">
                        <div className="content-sticky">
                            <div className="meta-info">
                                <span className="category-label">{product.categoria?.nombre || 'General'}</span>
                                <div className="utility-buttons">
                                    <button className="icon-btn"><Heart size={20} /></button>
                                    <button className="icon-btn"><Share2 size={20} /></button>
                                </div>
                            </div>

                            <h1 className="title-text">{product.nombre}</h1>

                            <div className="rating-summary">
                                <div className="stars-group">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            size={18}
                                            fill={s <= product.puntuacion ? "var(--primary)" : "none"}
                                            stroke={s <= product.puntuacion ? "var(--primary)" : "#ddd"}
                                        />
                                    ))}
                                </div>
                                <span className="review-count">{product.puntuacion} / 5.0</span>
                            </div>

                            <div className="price-display">
                                <div className="current-price">
                                    <span className="symbol">S/.</span>
                                    <span className="value">{product.precio.toFixed(2)}</span>
                                </div>
                                {product.precioAnterior && (
                                    <div className="discount-block">
                                        <span className="was-price">S/. {product.precioAnterior.toFixed(2)}</span>
                                        <span className="save-badge">
                                            Ahorra S/. {(product.precioAnterior - product.precio).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="short-desc">
                                <p>
                                    {(product.descripcion && product.descripcion.length > 150) ? (
                                        <>
                                            {product.descripcion.substring(0, 150)}...
                                            <button
                                                className="see-more-link"
                                                onClick={() => {
                                                    document.getElementById('details-anchor')?.scrollIntoView({ behavior: 'smooth' });
                                                    setSelectedTab('detail');
                                                }}
                                            >
                                                Ver más
                                            </button>
                                        </>
                                    ) : (
                                        product.descripcion || `Herramienta profesional ${product.marca} diseñada para ofrecer el máximo rendimiento en tus proyectos mas exigentes.`
                                    )}
                                </p>
                            </div>

                            <div className="buying-actions">
                                <div className="quantity-control">
                                    <span className="label">Cantidad</span>
                                    <div className="control-box">
                                        <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}><Minus size={18} /></button>
                                        <span className="count">{cantidad}</span>
                                        <button onClick={() => setCantidad(cantidad + 1)}><Plus size={18} /></button>
                                    </div>
                                </div>

                                <button
                                    className={`add-button ${isAdded ? 'success' : ''}`}
                                    onClick={handleAddToCart}
                                    disabled={isAdded}
                                >
                                    {isAdded ? (
                                        <><Check size={22} /> ¡Añadido!</>
                                    ) : (
                                        <><ShoppingCart size={22} /> Añadir al Carrito</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Tabs / Detailed Specs */}
                <section id="details-anchor" className="details-tabs">
                    <div className="tabs-nav">
                        {['Detalles', 'Características'].map(t => (
                            <button
                                key={t}
                                className={selectedTab === (t === 'Detalles' ? 'detail' : 'specs') ? 'active' : ''}
                                onClick={() => setSelectedTab(t === 'Detalles' ? 'detail' : 'specs')}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="tabs-body">
                        {selectedTab === 'detail' ? (
                            <div className="description-rich">
                                <h3>Descripción del Producto</h3>
                                <p>{product.descripcion || "Este producto ha sido diseñado bajo los más altos estándares de calidad para profesionales exigentes."}</p>
                                <div className="brand-highlight">
                                    <strong>Marca:</strong> {product.marca}
                                </div>
                            </div>
                        ) : (
                            <div className="specs-table-wrapper">
                                <table className="specs-table">
                                    <tbody>
                                        <tr>
                                            <th>Marca</th>
                                            <td>{product.marca}</td>
                                        </tr>
                                        <tr>
                                            <th>Categoría</th>
                                            <td>{product.categoria?.nombre}</td>
                                        </tr>
                                        <tr>
                                            <th>Estado de Stock</th>
                                            <td className="stock-status">
                                                {product.stock > 0 ? (
                                                    <span className="in-stock"><Check size={14} /> Disponible ({product.stock} unids)</span>
                                                ) : 'Agotado'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Modelo</th>
                                            <td>Industrial Series 2024</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};
