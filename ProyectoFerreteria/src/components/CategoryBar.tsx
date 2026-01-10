import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutGrid,
    Hammer,
    PaintBucket,
    Ruler,
    Zap,
    ChevronDown,
    Droplets,
    HardHat,
    Wind,
    Scissors,
    Lightbulb,
    ChevronRight,
    HelpCircle,
    Star,
    ShoppingBag
} from 'lucide-react';
import api from '../api/api';
import type { Categoria } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// Datos de ejemplo para subcategorías (esto podría venir del backend en el futuro)
const SUB_CATEGORIES: Record<string, string[]> = {
    "Herramientas Eléctricas": [
        "Taladros y Rotomartillos",
        "Amoladoras y Esmeriles",
        "Sierras y Cortadoras",
        "Lijadoras y Cepillos",
        "Soldadoras e Inversores",
        "Compresoras de Aire"
    ],
    "Herramientas Manuales": [
        "Juegos de Herramientas",
        "Martillos y Mazos",
        "Destornilladores y Puntas",
        "Llaves y Dados",
        "Pinzas y Alicates",
        "Cajas de Herramientas"
    ],
    "Pintura y Accesorios": [
        "Pintura Látex Interior",
        "Pintura para Fachadas",
        "Esmaltes y Barnices",
        "Brochas y Rodillos",
        "Cintas y Enmascarado",
        "Diluyentes y Solventes"
    ]
};

export const CategoryBar: React.FC = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    useEffect(() => {
        api.get('/categorias').then(res => setCategorias(res.data));
    }, []);

    const getIcon = (nombre: string) => {
        const n = nombre.toLowerCase();
        if (n.includes('eléctrica')) return <Zap size={20} />;
        if (n.includes('manual')) return <Hammer size={20} />;
        if (n.includes('pintura')) return <PaintBucket size={20} />;
        if (n.includes('medición')) return <Ruler size={20} />;
        if (n.includes('plomería')) return <Droplets size={20} />;
        if (n.includes('seguridad')) return <HardHat size={20} />;
        if (n.includes('jardín')) return <Wind size={20} />;
        if (n.includes('corte')) return <Scissors size={20} />;
        if (n.includes('iluminación')) return <Lightbulb size={20} />;
        return <LayoutGrid size={20} />;
    };

    return (
        <div className="cat-bar-wrapper">
            <div className="container cat-bar-container">

                {/* 1. Botón "Todas las Categorías" (Estilo Sodimac/Promart) */}
                <div
                    className="mega-menu-trigger"
                    onMouseEnter={() => setIsMegaMenuOpen(true)}
                    onMouseLeave={() => setIsMegaMenuOpen(false)}
                >
                    <button className="mega-btn">
                        <LayoutGrid size={20} />
                        <span>VER CATEGORÍAS</span>
                        <ChevronDown size={16} className={`arrow ${isMegaMenuOpen ? 'open' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isMegaMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="mega-menu-panel"
                            >
                                <div className="mega-menu-grid">
                                    {/* Sidebar de categorías dentro del menú */}
                                    <div className="mega-sidebar">
                                        {categorias.map(cat => (
                                            <div
                                                key={cat.id}
                                                className={`mega-sidebar-item ${hoveredCategory === cat.id ? 'active' : ''}`}
                                                onMouseEnter={() => setHoveredCategory(cat.id)}
                                            >
                                                <div className="item-content">
                                                    {getIcon(cat.nombre)}
                                                    <span>{cat.nombre}</span>
                                                </div>
                                                <ChevronRight size={16} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Panel de subcategorías/materiales */}
                                    <div className="mega-content">
                                        {hoveredCategory ? (
                                            <div className="subcat-content">
                                                <h4 className="subcat-title">
                                                    {categorias.find(c => c.id === hoveredCategory)?.nombre}
                                                </h4>
                                                <div className="subcat-grid">
                                                    {(SUB_CATEGORIES[categorias.find(c => c.id === hoveredCategory)?.nombre || ""] || [
                                                        "Ver todos los productos",
                                                        "Novedades de la semana",
                                                        "Marcas destacadas",
                                                        "Ofertas especiales"
                                                    ]).map((sub, i) => (
                                                        <Link
                                                            key={i}
                                                            to={`/productos?categoria=${hoveredCategory}`}
                                                            className="subcat-link"
                                                            onClick={() => setIsMegaMenuOpen(false)}
                                                        >
                                                            {sub}
                                                        </Link>
                                                    ))}
                                                </div>
                                                <div className="mega-banner">
                                                    <div className="banner-text">
                                                        <span>Hasta 30% DCTO</span>
                                                        <p>En herramientas seleccionadas</p>
                                                    </div>
                                                    <ShoppingBag size={40} opacity={0.2} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mega-placeholder">
                                                <LayoutGrid size={48} opacity={0.1} />
                                                <p>Selecciona una categoría para ver materiales</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 2. Enlaces Principales (Centro) */}
                <nav className="main-links">
                    <Link to="/" className="nav-link">Inicio</Link>
                    {categorias.slice(0, 3).map(cat => (
                        <Link key={cat.id} to={`/productos?categoria=${cat.id}`} className="nav-link desktop-only">
                            {cat.nombre}
                        </Link>
                    ))}
                    <Link to="/productos" className="nav-link accent">Ver Todo</Link>
                </nav>

                {/* 3. Enlaces de Soporte y Ayuda (Derecha) */}
                <div className="support-links">
                    <Link to="/preguntas" className="nav-link support-btn">
                        <HelpCircle size={18} />
                        <span>Preguntas Frecuentes</span>
                    </Link>
                    <Link to="/testimonios" className="nav-link support-btn desktop-only">
                        <Star size={18} />
                        <span>Testimonios</span>
                    </Link>
                </div>

            </div>

            <style>{`
                .cat-bar-wrapper {
                    background-color: #fff;
                    border-bottom: 1px solid #e0e0e0;
                    position: sticky;
                    top: 60px; /* Ajustado para coincidir con el nuevo padding del navbar */
                    z-index: 990;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .cat-bar-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 54px;
                }

                /* Mega Button */
                .mega-menu-trigger {
                    position: relative;
                    height: 100%;
                }
                .mega-btn {
                    height: 100%;
                    border: none;
                    background: var(--primary);
                    color: #000;
                    font-weight: 800;
                    font-size: 0.85rem;
                    padding: 0 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .mega-btn:hover {
                    background: #f0ae11;
                }
                .mega-btn .arrow {
                    transition: transform 0.3s ease;
                }
                .mega-btn .arrow.open {
                    transform: rotate(180deg);
                }

                /* Mega Menu Panel */
                .mega-menu-panel {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 850px;
                    background: #fff;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                    border: 1px solid #eee;
                    border-radius: 0 0 16px 16px;
                    overflow: hidden;
                    z-index: 1000;
                }
                .mega-menu-grid {
                    display: grid;
                    grid-template-columns: 300px 1fr;
                    min-height: 450px;
                }

                .mega-sidebar {
                    background-color: #fcfcfc;
                    border-right: 1px solid #eee;
                    padding: 1rem 0;
                }
                .mega-sidebar-item {
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: #444;
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                .mega-sidebar-item:hover, .mega-sidebar-item.active {
                    background-color: #fff;
                    color: var(--primary);
                    padding-left: 25px;
                }
                .mega-sidebar-item .item-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .mega-content {
                    padding: 2.5rem;
                }
                .subcat-title {
                    font-size: 1.4rem;
                    font-weight: 900;
                    color: #111;
                    margin-bottom: 2rem;
                    border-bottom: 2px solid var(--primary);
                    display: inline-block;
                }
                .subcat-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem 2rem;
                }
                .subcat-link {
                    text-decoration: none;
                    color: #666;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: color 0.2s ease;
                }
                .subcat-link:hover {
                    color: #000;
                    font-weight: 700;
                }

                .mega-banner {
                    margin-top: 3rem;
                    background: #f8f8f8;
                    padding: 1.5rem;
                    border-radius: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border: 1px dashed #ddd;
                }
                .banner-text span { color: #d32f2f; font-weight: 900; font-size: 1.2rem; }
                .banner-text p { color: #888; margin: 0; font-size: 0.85rem; }

                .mega-placeholder {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #aaa;
                    gap: 1rem;
                }

                /* Main Links */
                .main-links {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    flex: 1;
                    padding: 0 1rem;
                }
                .nav-link {
                    text-decoration: none;
                    color: #333;
                    font-size: 0.85rem;
                    font-weight: 700;
                    padding: 8px 12px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }
                .nav-link:hover {
                    background-color: #f5f5f5;
                    color: var(--primary);
                }
                .nav-link.accent {
                    color: #d32f2f;
                }

                /* Right Support Links */
                .support-links {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .support-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background-color: #f9f9f9;
                    border: 1px solid #eee;
                }
                .support-btn:hover {
                    border-color: var(--primary);
                    background-color: #fff;
                }

                @media (max-width: 1200px) {
                    .mega-menu-panel { width: 700px; }
                    .mega-menu-grid { grid-template-columns: 250px 1fr; }
                }

                @media (max-width: 992px) {
                    .desktop-only { display: none; }
                    .mega-btn span { display: none; }
                    .mega-btn { padding: 0 1rem; }
                    .cat-bar-container { height: 48px; }
                    .mega-menu-panel { width: 100vw; left: 0; border-radius: 0; }
                    .mega-menu-grid { grid-template-columns: 1fr; height: 80vh; overflow-y: auto; }
                    .mega-content { display: none; } /* On mobile, we only show top-level cats */
                    .support-btn span { display: none; }
                }
            `}</style>
        </div>
    );
};
