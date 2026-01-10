import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    User,
    Search,
    LogOut,
    Package,
    Menu,
    X,
    Zap,
    Hammer,
    ChevronRight,
    HelpCircle
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
    const { user, logout, isAdmin } = useAuth();
    const { totalItems, total } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <nav className="navbar" style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                width: '100%',
                backgroundColor: '#000',
                color: '#fff',
                padding: '0.6rem 0',
                borderBottom: '1px solid #333'
            }}>
                <div className="container nav-content">
                    {/* Burger Menu for Mobile */}
                    <button className="mobile-menu-btn" onClick={toggleMenu}>
                        <Menu size={28} />
                    </button>

                    {/* Logo - Centered on Mobile */}
                    <Link to="/" className="nav-logo">
                        <Logo width={160} variant="dark" />
                    </Link>

                    {/* Desktop Search Bar - Moved inside central grouping to avoid floating theme toggle */}
                    <div className="desktop-actions-group desktop-only">
                        <div className="nav-search">
                            <input type="text" placeholder="Estoy buscando..." />
                            <Search className="search-icon" size={20} />
                        </div>
                    </div>

                    {/* Right side Actions */}
                    <div className="nav-actions">
                        {/* Theme Toggle centered vertically with other items */}
                        <div className="desktop-only action-item"><ThemeToggle /></div>

                        {/* Mobile Only: Search Icon and Cart with Badge */}
                        <div className="mobile-actions">
                            <button className="mobile-action-btn"><Search size={24} /></button>
                            <Link to="/carrito" className="mobile-action-btn cart-mobile">
                                <ShoppingCart size={24} />
                                {totalItems > 0 && <span className="cart-badge-mobile">{totalItems}</span>}
                            </Link>
                        </div>

                        {/* Desktop User & Cart Actions */}
                        <div className="desktop-user-cart desktop-only">
                            {user ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div className="user-info">
                                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Hola, <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{user.nombre}</span></span>
                                        <Link to="/mis-pedidos" style={{ fontSize: '0.7rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Package size={12} /> Mis Pedidos
                                        </Link>
                                    </div>
                                    {isAdmin && (
                                        <Link to="/admin" className="admin-badge">ADMIN</Link>
                                    )}
                                    <button onClick={() => { logout(); navigate('/'); }} style={{ color: '#fff', background: 'transparent', padding: '5px' }}><LogOut size={22} /></button>
                                </div>
                            ) : (
                                <Link to="/login" className="login-link">
                                    <User size={24} />
                                    <span className="text-nowrap">Acceso Cuenta</span>
                                </Link>
                            )}

                            <Link to="/carrito" className="cart-link">
                                <div className="cart-icon-wrapper">
                                    <ShoppingCart size={24} />
                                    {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                                </div>
                                <div className="cart-text">
                                    <span className="cart-label">Mi Carrito</span>
                                    <span className="cart-total">S/. {total.toFixed(2)}</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                <style>{`
                    .navbar {
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        transition: all 0.3s ease;
                    }
                    .nav-content {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 1.5rem;
                        max-width: 1400px !important;
                    }
                    .mobile-menu-btn {
                        display: none;
                        background: transparent;
                        color: #fff;
                        border: none;
                        cursor: pointer;
                        padding: 5px;
                        transition: transform 0.2s ease;
                    }
                    .mobile-menu-btn:active { transform: scale(0.9); }
                    
                    .mobile-actions {
                        display: none;
                        align-items: center;
                        gap: 1.2rem;
                    }
                    .mobile-action-btn {
                        background: transparent;
                        color: #fff;
                        border: none;
                        position: relative;
                    }
                    .cart-mobile { position: relative; }
                    .cart-badge-mobile {
                        position: absolute;
                        top: -5px;
                        right: -5px;
                        background: var(--primary);
                        color: #000;
                        border-radius: 50%;
                        width: 18px;
                        height: 18px;
                        font-size: 0.65rem;
                        font-weight: 900;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 2px solid #000;
                    }
                    .desktop-actions-group {
                        flex: 1;
                        max-width: 600px;
                        margin: 0 2rem;
                    }
                    .nav-search {
                        position: relative;
                        width: 100%;
                    }
                    .nav-search input {
                        width: 100%;
                        padding: 12px 20px 12px 50px;
                        border-radius: 99px;
                        border: 1px solid #ddd;
                        background-color: #fff;
                        color: #000;
                        font-size: 0.95rem;
                        transition: all 0.3s ease;
                    }
                    .nav-search input:focus {
                        background-color: #fff;
                        color: #000;
                        outline: none;
                        box-shadow: 0 0 0 4px rgba(253, 185, 19, 0.2);
                        border-color: var(--primary);
                    }
                    .search-icon {
                        position: absolute;
                        left: 18px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #666;
                        transition: color 0.3s ease;
                    }
                    .nav-search input:focus + .search-icon {
                        color: var(--primary);
                    }
                    .nav-actions {
                        display: flex;
                        align-items: center;
                        gap: 2rem;
                    }
                    .desktop-user-cart {
                        display: flex;
                        align-items: center;
                        gap: 2rem;
                    }
                    .cart-icon-wrapper {
                        position: relative;
                        transition: transform 0.2s ease;
                    }
                    .cart-link:hover .cart-icon-wrapper {
                        transform: translateY(-2px);
                    }
                    .cart-badge {
                        position: absolute;
                        top: -8px;
                        right: -8px;
                        background: var(--primary);
                        color: #000;
                        border-radius: 50%;
                        min-width: 18px;
                        height: 18px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.7rem;
                        font-weight: 900;
                        border: 2px solid #000;
                    }
                    .login-link, .cart-link {
                        color: #fff;
                        text-decoration: none;
                        display: flex;
                        align-items: center;
                        gap: 0.8rem;
                        transition: opacity 0.2s ease;
                    }
                    .login-link:hover, .cart-link:hover {
                        opacity: 0.8;
                    }
                    .admin-badge {
                        background: var(--primary);
                        color: #000;
                        padding: 4px 12px;
                        border-radius: 6px;
                        font-size: 0.7rem;
                        font-weight: 900;
                        letter-spacing: 0.5px;
                    }
                    .cart-text { display: flex; flex-direction: column; }
                    .cart-label { font-size: 0.65rem; opacity: 0.6; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; }
                    .cart-total { font-size: 0.95rem; font-weight: 900; color: var(--primary); }
                    .text-nowrap { white-space: nowrap; }

                    @media (max-width: 1200px) {
                        .desktop-actions-group { margin: 0 1rem; }
                        .nav-actions { gap: 1rem; }
                    }

                    @media (max-width: 992px) {
                        .mobile-menu-btn { display: block; }
                        .mobile-actions { display: flex; }
                        .desktop-only { display: none; }
                        .nav-logo {
                            position: absolute;
                            left: 50%;
                            transform: translateX(-50%);
                        }
                    }
                `}</style>
            </nav>

            {/* Mobile Drawer Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'rgba(0,0,0,0.5)',
                                zIndex: 1100
                            }}
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '85%',
                                maxWidth: '320px',
                                height: '100%',
                                background: '#fff',
                                zIndex: 1200,
                                boxShadow: '5px 0 15px rgba(0,0,0,0.1)'
                            }}
                        >
                            {/* Drawer Header */}
                            <div style={{
                                backgroundColor: '#FDB913',
                                padding: '1rem 1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                color: '#000'
                            }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: '900' }}>Menú</span>
                                <button onClick={toggleMenu} style={{ background: 'transparent', border: 'none', color: '#000' }}>
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Drawer Items */}
                            <div className="drawer-content" style={{ padding: '1rem 0' }}>
                                <div className="drawer-item" onClick={() => { navigate('/'); toggleMenu(); }}>
                                    <span>Inicio</span>
                                </div>
                                <div className="divider" />
                                <div className="drawer-item" onClick={() => { navigate('/productos?categoria=electrica'); toggleMenu(); }}>
                                    <div className="item-left">
                                        <Zap size={20} />
                                        <span>Herramientas eléctricas</span>
                                    </div>
                                    <ChevronRight size={18} opacity={0.5} />
                                </div>
                                <div className="divider" />
                                <div className="drawer-item" onClick={() => { navigate('/productos?categoria=manual'); toggleMenu(); }}>
                                    <div className="item-left">
                                        <Hammer size={20} />
                                        <span>Herramientas Manuales</span>
                                    </div>
                                    <ChevronRight size={18} opacity={0.5} />
                                </div>
                                <div className="divider" />
                                <div className="drawer-item" onClick={() => { navigate('/preguntas'); toggleMenu(); }}>
                                    <div className="item-left">
                                        <HelpCircle size={20} />
                                        <span>Preguntas Frecuentes</span>
                                    </div>
                                    <ChevronRight size={18} opacity={0.5} />
                                </div>
                                <div className="divider" />
                                <div className="drawer-item" onClick={() => { navigate('/testimonios'); toggleMenu(); }}>
                                    <span>Clientes satisfechos</span>
                                </div>
                                <div className="divider" />
                                <div className="drawer-item" onClick={() => { navigate('/login'); toggleMenu(); }}>
                                    <div className="item-left">
                                        <User size={20} />
                                        <span>{user ? user.nombre : 'Iniciar sesión / Registrarse'}</span>
                                    </div>
                                </div>
                                {user && (
                                    <>
                                        <div className="divider" />
                                        <div className="drawer-item" onClick={() => { logout(); toggleMenu(); }}>
                                            <div className="item-left">
                                                <LogOut size={20} />
                                                <span>Cerrar Sesión</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style>{`
                .drawer-content .drawer-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.2rem 1.5rem;
                    font-weight: 600;
                    color: #000;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .drawer-content .drawer-item:active {
                    background-color: #f5f5f5;
                }
                .item-left {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .divider {
                    height: 1px;
                    background-color: #eee;
                    margin: 0 1.5rem;
                }
            `}</style>
        </>
    );
};
