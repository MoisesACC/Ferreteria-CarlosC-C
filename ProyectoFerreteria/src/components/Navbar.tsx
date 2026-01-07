import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, LogOut, Package } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
    const { user, logout, isAdmin } = useAuth();
    const { totalItems, total } = useCart();
    const navigate = useNavigate();

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            width: '100%',
            backgroundColor: '#000',
            color: '#fff',
            padding: '1rem 2rem',
            borderBottom: '1px solid #333'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
                {/* Logo */}
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                }}>
                    <Logo width={180} variant="dark" />
                </Link>

                {/* Search Bar */}
                <div style={{ flex: 1, maxWidth: '600px', position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Estoy buscando..."
                        style={{
                            width: '100%',
                            padding: '10px 20px 10px 45px',
                            borderRadius: '99px',
                            border: 'none',
                            backgroundColor: '#fff',
                            color: '#000',
                            fontSize: '0.9rem'
                        }}
                    />
                    <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} size={20} />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <ThemeToggle />

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Hola, <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{user.nombre}</span></span>
                                <Link to="/mis-pedidos" style={{ fontSize: '0.7rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Package size={12} /> Mis Pedidos
                                </Link>
                            </div>
                            {isAdmin && (
                                <Link to="/admin" style={{
                                    backgroundColor: 'var(--primary)',
                                    color: '#000',
                                    padding: '4px 12px',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    fontSize: '0.8rem',
                                    fontWeight: '700'
                                }}>ADMIN</Link>
                            )}
                            <button onClick={() => { logout(); navigate('/'); }} style={{ color: '#fff', background: 'transparent', padding: '5px' }}><LogOut size={22} /></button>
                        </div>
                    ) : (
                        <Link to="/login" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={24} />
                            <span>Acceso Cuenta</span>
                        </Link>
                    )}

                    <Link to="/carrito" style={{
                        color: '#fff',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        position: 'relative'
                    }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <ShoppingCart size={24} />
                            {totalItems > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: 'var(--primary)',
                                    color: '#000',
                                    borderRadius: '50%',
                                    minWidth: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}>{totalItems}</span>
                            )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Mi Carrito</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>S/. {total.toFixed(2)}</span>
                        </div>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
