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
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loader"></div>
        </div>
    );

    if (!product) return (
        <div style={{ minHeight: '80vh', textAlign: 'center', padding: '5rem' }}>
            <h2>Producto no encontrado</h2>
            <button onClick={() => navigate('/productos')} className="btn-primary" style={{ marginTop: '2rem', padding: '12px 24px', borderRadius: '12px' }}>Regresar a tienda</button>
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
                                <p>{product.descripcion || `Herramienta profesional ${product.marca} diseñada para ofrecer el máximo rendimiento en tus proyectos mas exigentes.`}</p>
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

                            <div className="trust-ribbon">
                                <div className="trust-card">
                                    <Truck size={24} />
                                    <div className="card-text">
                                        <strong>Envío Gratis</strong>
                                        <span>Desde S/. 200</span>
                                    </div>
                                </div>
                                <div className="trust-card">
                                    <Undo size={24} />
                                    <div className="card-text">
                                        <strong>Cambios</strong>
                                        <span>30 días</span>
                                    </div>
                                </div>
                                <div className="trust-card">
                                    <ShieldCheck size={24} />
                                    <div className="card-text">
                                        <strong>Garantía</strong>
                                        <span>100% Original</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Tabs / Detailed Specs */}
                <section className="details-tabs">
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

            <style>{`
                .product-details-container { padding-bottom: 5rem; background: #fff; }
                
                /* Breadcrumb */
                .breadcrumb { background: #f8f9fa; padding: 1rem 0; margin-bottom: 2rem; border-bottom: 1px solid #eee; }
                .breadcrumb .container { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; }
                .breadcrumb a { color: #666; text-decoration: none; transition: 0.2s; }
                .breadcrumb a:hover { color: var(--primary); }
                .breadcrumb .current { color: #aaa; font-weight: 500; }

                /* Main Layout */
                .product-layout { display: grid; grid-template-columns: 1fr 450px; gap: 4rem; margin-bottom: 5rem; }
                
                /* Gallery */
                .product-gallery { display: flex; gap: 1.5rem; }
                .thumb-carousel { display: flex; flex-direction: column; gap: 1rem; width: 80px; }
                .thumb-item { width: 80px; height: 80px; border-radius: 12px; border: 1px solid #eee; padding: 8px; cursor: pointer; transition: 0.3s; background: #fff; overflow: hidden; }
                .thumb-item.active { border-color: var(--primary); box-shadow: 0 0 0 2px var(--primary-light); }
                .thumb-item img { width: 100%; height: 100%; object-fit: contain; }
                .main-display { flex: 1; background: #fff; border-radius: 24px; border: 1px solid #f0f0f0; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 550px; }
                .main-image-container { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 2rem; }
                .main-image-container img { max-width: 100%; max-height: 100%; object-fit: contain; }

                /* Content */
                .content-sticky { position: sticky; top: 100px; }
                .meta-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .category-label { text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; font-weight: 800; color: #888; border-left: 3px solid var(--primary); padding-left: 10px; }
                .utility-buttons { display: flex; gap: 10px; }
                .icon-btn { background: #f8f9fa; border: none; padding: 10px; border-radius: 50%; cursor: pointer; color: #444; transition: 0.2s; }
                .icon-btn:hover { background: #eee; color: var(--primary); }

                .title-text { font-size: 2.8rem; font-weight: 950; line-height: 1.1; margin-bottom: 1rem; color: #1a1a1a; }
                .rating-summary { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
                .review-count { font-size: 1rem; color: #777; font-weight: 600; }
                
                .price-display { margin-bottom: 2.5rem; }
                .current-price { display: flex; align-items: flex-start; color: var(--primary); font-weight: 950; }
                .current-price .symbol { font-size: 1.5rem; margin-top: 10px; margin-right: 5px; }
                .current-price .value { font-size: 4rem; line-height: 1; }
                
                .discount-block { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
                .was-price { font-size: 1.2rem; color: #999; text-decoration: line-through; }
                .save-badge { background: #e6fffa; color: #008080; font-size: 0.8rem; font-weight: 800; padding: 4px 10px; border-radius: 6px; }

                .short-desc { margin-bottom: 3rem; color: #666; line-height: 1.6; font-size: 1.05rem; }

                .buying-actions { display: grid; grid-template-columns: 150px 1fr; gap: 1rem; margin-bottom: 3rem; }
                .quantity-control .label { display: block; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #999; margin-bottom: 8px; }
                .control-box { display: flex; align-items: center; justify-content: space-between; border: 2px solid #eee; border-radius: 12px; padding: 10px; }
                .control-box button { background: none; border: none; cursor: pointer; color: #1a1a1a; display: flex; align-items: center; }
                .control-box .count { font-weight: 900; font-size: 1.1rem; }
                
                .add-button { background: #000; color: #fff; border: none; border-radius: 12px; font-weight: 900; font-size: 1.1rem; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; }
                .add-button:hover { background: var(--primary); color: #000; transform: translateY(-2px); }
                .add-button.success { background: #34C759; color: #fff; }

                .trust-ribbon { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; padding-top: 2rem; border-top: 1px solid #f0f0f0; }
                .trust-card { display: flex; flex-direction: column; gap: 5px; color: #666; }
                .trust-card svg { color: var(--primary); }
                .trust-card strong { font-size: 0.8rem; font-weight: 800; color: #1a1a1a; }
                .trust-card span { font-size: 0.7rem; }

                /* Tabs Section */
                .details-tabs { border-top: 1px solid #eee; padding-top: 3rem; }
                .tabs-nav { display: flex; gap: 4rem; border-bottom: 1px solid #eee; margin-bottom: 3rem; }
                .tabs-nav button { background: none; border: none; padding: 1.5rem 0; font-weight: 800; font-size: 1.1rem; color: #999; cursor: pointer; border-bottom: 4px solid transparent; transition: 0.3s; }
                .tabs-nav button.active { color: #1a1a1a; border-bottom-color: var(--primary); }
                
                .tabs-body { min-height: 200px; padding-bottom: 4rem; }
                .description-rich h3 { font-size: 1.8rem; margin-bottom: 1.5rem; font-weight: 900; }
                .description-rich p { color: #555; line-height: 1.8; font-size: 1.1rem; }
                .brand-highlight { margin-top: 2rem; font-size: 1.1rem; }
                
                .specs-table { width: 100%; max-width: 600px; border-collapse: collapse; }
                .specs-table th { text-align: left; padding: 1.5rem 0; border-bottom: 1px solid #eee; color: #888; font-weight: 600; }
                .specs-table td { text-align: right; padding: 1.5rem 0; border-bottom: 1px solid #eee; font-weight: 800; color: #1a1a1a; }
                .stock-status .in-stock { color: #34C759; display: flex; align-items: center; justify-content: flex-end; gap: 4px; }

                @media (max-width: 1024px) {
                    .product-layout { grid-template-columns: 1fr; gap: 3rem; }
                    .content-sticky { position: static; }
                    .main-display { height: 450px; }
                }

                @media (max-width: 768px) {
                    .product-gallery { flex-direction: column-reverse; }
                    .thumb-carousel { flex-direction: row; width: 100%; overflow-x: auto; }
                    .title-text { font-size: 2.2rem; }
                    .current-price .value { font-size: 3rem; }
                    .buying-actions { grid-template-columns: 1fr; }
                    .tabs-nav { gap: 2rem; overflow-x: auto; }
                    .tabs-nav button { font-size: 1rem; }
                }
            `}</style>
        </div>
    );
};
