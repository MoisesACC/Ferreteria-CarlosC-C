import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Package,
    Layers,
    Users,
    ShoppingBag,
    LogOut,
    Plus,
    Search as SearchIcon,
    Edit,
    Trash2,
    Menu,
    X,
    TrendingUp,
    Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import type { Producto, Categoria, Pedido, Usuario } from '../types';
import { ThemeToggle } from '../components/ThemeToggle';
import { Logo } from '../components/Logo';

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 1.2rem',
            backgroundColor: active ? 'var(--primary)' : 'transparent',
            color: active ? '#000' : 'var(--text-main)',
            borderRadius: '12px',
            marginBottom: '0.5rem',
            fontWeight: '600',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            textAlign: 'left'
        }}
    >
        {icon}
        <span style={{ flex: 1 }}>{label}</span>
    </button>
);

export const AdminPanel: React.FC = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [products, setProducts] = useState<Producto[]>([]);
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [orders, setOrders] = useState<Pedido[]>([]);
    const [users, setUsers] = useState<Usuario[]>([]);

    // UI States
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Producto> | null>(null);
    const [editingCategory, setEditingCategory] = useState<Partial<Categoria> | null>(null);
    const [isEditingProduct, setIsEditingProduct] = useState(false);
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes, orderRes, userRes] = await Promise.all([
                api.get('/productos'),
                api.get('/categorias'),
                api.get('/pedidos').catch(() => ({ data: [] })), // Graceful handle if endpoint fails
                api.get('/usuarios').catch(() => ({ data: [] }))
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
            setOrders(orderRes.data);
            setUsers(userRes.data);
        } catch (error) {
            console.error("Error fetching admin data", error);
        }
    };

    // Statistics Calculation (Optimized with useMemo)
    const stats = React.useMemo(() => {
        const totalSales = orders.reduce((acc, curr) => acc + curr.total, 0);
        const avgOrderValue = orders.length > 0 ? totalSales / orders.length : 0;
        const lowStockProducts = products.filter(p => p.stock < 10);
        const pendingOrders = orders.filter(o => o.estado === 'PENDIENTE' || o.estado === 'PAGADO').length;
        const recentOrders = [...orders]
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
            .slice(0, 5);
        return { totalSales, avgOrderValue, lowStockProducts, pendingOrders, recentOrders };
    }, [orders, products]);

    // Product CRUD
    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditingProduct) {
                await api.put(`/productos/${editingProduct?.id}`, editingProduct);
            } else {
                await api.post('/productos', editingProduct);
            }
            setIsProductModalOpen(false);
            setEditingProduct(null);
            fetchData();
        } catch (error) {
            alert("Error al guardar producto");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            try {
                await api.delete(`/productos/${id}`);
                fetchData();
            } catch (error) {
                alert("Error al eliminar");
            }
        }
    };

    // Category CRUD
    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditingCategory) {
                await api.put(`/categorias/${editingCategory?.id}`, editingCategory);
            } else {
                await api.post('/categorias', editingCategory);
            }
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
            fetchData();
        } catch (error) {
            alert("Error al guardar categoría");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
            try {
                await api.delete(`/categorias/${id}`);
                fetchData();
            } catch (error) {
                alert("Error al eliminar categoría");
            }
        }
    };

    const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
        try {
            await api.put(`/pedidos/${id}`, { estado: newStatus });
            fetchData();
        } catch (error) {
            alert("Error al actualizar estado");
        }
    };

    const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    // Pagination for Products Tab
    const [productPage, setProductPage] = useState(1);
    const productsPerPage = 7;

    const filteredProducts = React.useMemo(() => {
        return products.filter(p =>
            p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.marca.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    useEffect(() => {
        setProductPage(1);
    }, [searchTerm]);

    const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = productPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentAdminProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
            {/* Mobile Header */}
            <div className="mobile-admin-header">
                <Logo width={150} />
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}
                style={{
                    width: '280px',
                    backgroundColor: 'var(--bg-main)',
                    borderRight: '1px solid var(--border-color)',
                    padding: '2rem 1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    height: '100vh',
                    zIndex: 1000,
                    transition: 'transform 0.3s ease'
                }}
            >
                <div style={{ marginBottom: '3rem', padding: '0 0.5rem' }}>
                    <Logo width={200} />
                </div>

                <nav style={{ flex: 1 }}>
                    <SidebarItem
                        icon={<LayoutDashboard size={20} />}
                        label="Dashboard"
                        active={activeTab === 'dashboard'}
                        onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={<Package size={20} />}
                        label="Productos"
                        active={activeTab === 'products'}
                        onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={<Layers size={20} />}
                        label="Categorías"
                        active={activeTab === 'categories'}
                        onClick={() => { setActiveTab('categories'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={<ShoppingBag size={20} />}
                        label="Pedidos"
                        active={activeTab === 'orders'}
                        onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={<Users size={20} />}
                        label="Usuarios"
                        active={activeTab === 'users'}
                        onClick={() => { setActiveTab('users'); setIsMobileMenuOpen(false); }}
                    />
                </nav>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#000' }}>
                            {user?.nombre.charAt(0)}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ fontWeight: '700', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.nombre}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.rol}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.8rem 1rem',
                            color: '#FF3B30',
                            background: 'rgba(255, 59, 48, 0.05)',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                        }}
                    >
                        <LogOut size={18} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <div>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                            {activeTab === 'products' && 'Gestión de Productos'}
                            {activeTab === 'categories' && 'Gestión de Categorías'}
                            {activeTab === 'dashboard' && 'Panel de Resumen'}
                            {activeTab === 'orders' && 'Gestión de Pedidos'}
                            {activeTab === 'users' && 'Gestión de Usuarios'}
                        </h1>
                        <nav style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                            <span>Admin</span> / <span>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
                        </nav>
                    </div>
                    <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <ThemeToggle />
                    </div>
                </header>

                <style>{`
                    .admin-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 2.5rem;
                    }

                    .no-hover-move:hover {
                        transform: none !important;
                    }

                    .mobile-admin-header {
                        display: none;
                        background: var(--bg-main);
                        padding: 1rem;
                        border-bottom: 1px solid var(--border-color);
                        justify-content: space-between;
                        align-items: center;
                        position: sticky;
                        top: 0;
                        z-index: 2000;
                    }

                    .admin-main {
                        flex: 1;
                        padding: 2.5rem 3.5rem;
                        margin-left: 280px;
                        transition: 0.3s;
                    }

                    @media (max-width: 992px) {
                        .admin-sidebar {
                            transform: translateX(-100%);
                        }
                        .admin-sidebar.open {
                            transform: translateX(0);
                        }
                        .admin-main {
                            margin-left: 0;
                            padding: 1.5rem;
                        }
                        .mobile-admin-header {
                            display: flex;
                        }
                        .admin-header {
                            flex-direction: column;
                            align-items: flex-start !important;
                            gap: 1.5rem;
                            margin-bottom: 1.5rem;
                        }
                        .admin-header button {
                            width: auto;
                        }
                        .hide-on-mobile { display: none; }
                        .desktop-only { display: none; }
                    }
                `}</style>

                {/* Dashboard Stats */}
                {activeTab === 'dashboard' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            {
                                [
                                    { label: 'Ventas Totales', value: `S/. ${stats.totalSales.toFixed(2)}`, icon: <TrendingUp />, color: '#34C759', description: 'Ingresos brutos acumulados' },
                                    { label: 'Ticket Promedio', value: `S/. ${stats.avgOrderValue.toFixed(2)}`, icon: <ShoppingBag />, color: '#007AFF', description: 'Valor medio por pedido' },
                                    { label: 'Pedidos Pendientes', value: stats.pendingOrders, icon: <ShoppingBag />, color: '#FF9500', description: 'Por procesar o enviar' },
                                    { label: 'Bajo Stock', value: stats.lowStockProducts.length, icon: <Package />, color: '#FF3B30', description: 'Productos con < 10 unid.' },
                                    { label: 'Clientes', value: users.length, icon: <Users />, color: '#6C47FF', description: 'Usuarios registrados' }
                                ].map((stat, i) => (
                                    <div key={i} className="glass-card no-hover-move" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ padding: '0.8rem', borderRadius: '12px', backgroundColor: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.2rem' }}>{stat.value}</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '700' }}>{stat.label}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.description}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                            {/* Recent Activity */}
                            <div className="glass-card no-hover-move" style={{ padding: '1.5rem', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Ventas Recientes</h2>
                                    <button onClick={() => setActiveTab('orders')} style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', background: 'transparent' }}>Ver todas</button>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                                <th style={{ padding: '10px 5px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>CLIENTE</th>
                                                <th style={{ padding: '10px 5px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>FECHA</th>
                                                <th style={{ padding: '10px 5px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL</th>
                                                <th style={{ padding: '10px 5px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>ESTADO</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.recentOrders.map(o => (
                                                <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <td style={{ padding: '12px 5px', fontSize: '0.85rem', fontWeight: '600' }}>{o.usuario?.nombre}</td>
                                                    <td style={{ padding: '12px 5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(o.fecha).toLocaleDateString()}</td>
                                                    <td style={{ padding: '12px 5px', fontSize: '0.85rem', fontWeight: '700' }}>S/. {o.total.toFixed(2)}</td>
                                                    <td style={{ padding: '12px 5px' }}>
                                                        <span style={{
                                                            fontSize: '0.7rem',
                                                            padding: '2px 8px',
                                                            borderRadius: '4px',
                                                            backgroundColor: o.estado === 'PAGADO' ? 'rgba(52,199,89,0.1)' : 'rgba(255,149,0,0.1)',
                                                            color: o.estado === 'PAGADO' ? '#34C759' : '#FF9500',
                                                            fontWeight: '800'
                                                        }}>{o.estado}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Low Stock Alerts */}
                            <div className="glass-card no-hover-move" style={{ padding: '1.5rem', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Alertas de Stock</h2>
                                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', backgroundColor: '#FF3B30', color: '#fff', borderRadius: '4px', fontWeight: '800' }}>{stats.lowStockProducts.length}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {stats.lowStockProducts.slice(0, 6).map(p => (
                                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(255,59,48,0.05)' }}>
                                            <img src={p.imagen} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain', backgroundColor: '#fff', borderRadius: '4px' }} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: '0.8rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nombre}</p>
                                                <p style={{ fontSize: '0.7rem', color: '#FF3B30', fontWeight: '600' }}>Quedan {p.stock} unidades</p>
                                            </div>
                                        </div>
                                    ))}
                                    {stats.lowStockProducts.length === 0 && (
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>Todo bajo control. Stock saludable.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Area - Restructured to move filters outside */}
                {activeTab === 'products' && (
                    <>
                        <div className="glass-card no-hover-move" style={{ padding: '1.2rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <input
                                    placeholder="Buscar por nombre o marca..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        paddingLeft: '45px',
                                        borderRadius: '12px',
                                        backgroundColor: 'var(--input-bg)',
                                        color: 'var(--input-text)',
                                        border: '1px solid var(--border-color)',
                                        width: '100%',
                                        height: '48px'
                                    }}
                                />
                                <SearchIcon size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--text-muted)' }} />
                            </div>
                            <button
                                className="btn-primary"
                                style={{ padding: '0 24px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
                                onClick={() => { setIsEditingProduct(false); setEditingProduct(null); setIsProductModalOpen(true); }}
                            >
                                <Plus size={20} /> <span className="hide-on-mobile">Nuevo Producto</span>
                            </button>
                        </div>

                        <div className="glass-card no-hover-move" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Marca</th>
                                            <th>Categoría</th>
                                            <th>Precio</th>
                                            <th>Stock</th>
                                            <th style={{ textAlign: 'right' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentAdminProducts.map(p => (
                                            <tr key={p.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <img src={p.imagen} alt={p.nombre} style={{ width: '45px', height: '45px', objectFit: 'contain', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '4px' }} />
                                                        <div>
                                                            <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>{p.nombre}</p>
                                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{p.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>{p.marca}</span></td>
                                                <td><span style={{ fontSize: '0.85rem', padding: '4px 8px', backgroundColor: 'var(--bg-dark)', borderRadius: '6px' }}>{p.categoria?.nombre || 'Sin Cat'}</span></td>
                                                <td><span style={{ fontWeight: '800', fontSize: '1.1rem' }}>S/. {p.precio.toFixed(2)}</span></td>
                                                <td>
                                                    <span style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '8px',
                                                        backgroundColor: p.stock > 10 ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                                                        color: p.stock > 10 ? '#34C759' : '#FF3B30',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '700'
                                                    }}>
                                                        {p.stock} units
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                                                        <button
                                                            onClick={() => {
                                                                setEditingProduct(p);
                                                                setIsEditingProduct(true);
                                                                setIsProductModalOpen(true);
                                                            }}
                                                            style={{
                                                                padding: '8px',
                                                                color: 'var(--text-main)',
                                                                background: 'var(--bg-dark)',
                                                                border: '1px solid var(--border-color)',
                                                                borderRadius: '10px'
                                                            }}
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => p.id && handleDeleteProduct(p.id)}
                                                            style={{
                                                                padding: '8px',
                                                                color: '#FF3B30',
                                                                background: 'rgba(255, 59, 48, 0.1)',
                                                                border: '1px solid rgba(255, 59, 48, 0.2)',
                                                                borderRadius: '10px'
                                                            }}
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Footer */}
                            {totalProductPages > 1 && (
                                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-main)' }}>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Página {productPage} de {totalProductPages}</p>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            disabled={productPage === 1}
                                            onClick={() => setProductPage(p => p - 1)}
                                            style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-dark)', color: productPage === 1 ? 'var(--text-muted)' : 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                                        >
                                            Anterior
                                        </button>
                                        <button
                                            disabled={productPage === totalProductPages}
                                            onClick={() => setProductPage(p => p + 1)}
                                            style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-dark)', color: productPage === totalProductPages ? 'var(--text-muted)' : 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'categories' && (
                    <>
                        <div className="glass-card no-hover-move" style={{ padding: '1.2rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                className="btn-primary"
                                style={{ padding: '0 24px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
                                onClick={() => { setIsEditingCategory(false); setEditingCategory(null); setIsCategoryModalOpen(true); }}
                            >
                                <Plus size={20} /> <span className="hide-on-mobile">Nueva Categoría</span>
                            </button>
                        </div>
                        <div className="glass-card no-hover-move" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre de Categoría</th>
                                            <th>Descripción</th>
                                            <th style={{ textAlign: 'right' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map(c => (
                                            <tr key={c.id}>
                                                <td style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>#{c.id}</td>
                                                <td style={{ fontWeight: '700' }}>{c.nombre}</td>
                                                <td style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{c.descripcion}</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                                                        <button
                                                            onClick={() => {
                                                                setEditingCategory(c);
                                                                setIsEditingCategory(true);
                                                                setIsCategoryModalOpen(true);
                                                            }}
                                                            style={{
                                                                padding: '8px',
                                                                color: 'var(--text-main)',
                                                                background: 'var(--bg-dark)',
                                                                border: '1px solid var(--border-color)',
                                                                borderRadius: '10px'
                                                            }}
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCategory(c.id)}
                                                            style={{
                                                                padding: '8px',
                                                                color: '#FF3B30',
                                                                background: 'rgba(255, 59, 48, 0.1)',
                                                                border: '1px solid rgba(255, 59, 48, 0.2)',
                                                                borderRadius: '10px'
                                                            }}
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'orders' && (
                    <div className="glass-card no-hover-move" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>Lista de Pedidos</h2>
                        {orders.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Aún no hay pedidos registrados en el sistema.</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID Pedido</th>
                                            <th>Cliente</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                            <th style={{ textAlign: 'right' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(o => (
                                            <tr key={o.id}>
                                                <td>
                                                    <span style={{ fontWeight: '800', fontFamily: 'monospace' }}>#{o.id.slice(0, 8)}</span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                            {o.usuario?.nombre.charAt(0)}
                                                        </div>
                                                        <span>{o.usuario?.nombre || 'Anonimo'}</span>
                                                    </div>
                                                </td>
                                                <td><span style={{ fontWeight: '700' }}>S/. {o.total.toFixed(2)}</span></td>
                                                <td>
                                                    <select
                                                        value={o.estado}
                                                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                                        style={{
                                                            padding: '4px 8px',
                                                            borderRadius: '6px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: '700',
                                                            backgroundColor: o.estado === 'PAGADO' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 149, 0, 0.1)',
                                                            color: o.estado === 'PAGADO' ? '#34C759' : '#FF9500',
                                                            border: 'none',
                                                            width: 'auto',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <option value="PENDIENTE">PENDIENTE</option>
                                                        <option value="PAGADO">PAGADO</option>
                                                        <option value="ENVIADO">ENVIADO</option>
                                                        <option value="ENTREGADO">ENTREGADO</option>
                                                        <option value="CANCELADO">CANCELADO</option>
                                                    </select>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <button
                                                        onClick={() => { setSelectedOrder(o); setIsOrderModalOpen(true); }}
                                                        style={{
                                                            padding: '8px 16px',
                                                            background: 'var(--bg-dark)',
                                                            color: 'var(--text-main)',
                                                            border: '1px solid var(--border-color)',
                                                            borderRadius: '8px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: '700'
                                                        }}
                                                    >
                                                        Ver Detalle
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="glass-card no-hover-move" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Rol</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.email}>
                                            <td style={{ padding: '1.2rem 1.5rem' }}>{u.nombre}</td>
                                            <td style={{ padding: '1.2rem 1.5rem' }}>{u.email}</td>
                                            <td style={{ padding: '1.2rem 1.5rem' }}><span style={{ padding: '4px 12px', backgroundColor: u.rol === 'ADMIN' ? 'var(--primary)' : 'var(--bg-dark)', color: u.rol === 'ADMIN' ? '#000' : 'inherit', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>{u.rol}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Product Modal */}
            {
                isProductModalOpen && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2000, backdropFilter: 'blur(10px)'
                    }}>
                        <div className="glass-card" style={{ width: '90%', maxWidth: '750px', padding: '2.5rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                            <button onClick={() => { setIsProductModalOpen(false); setEditingProduct(null); }} style={{ position: 'absolute', top: '25px', right: '25px', background: 'transparent', color: 'var(--text-muted)', zIndex: 10 }}><X /></button>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>{editingProduct?.id ? '✏️ Editar Producto' : '🛠️ Nuevo Producto'}</h2>

                            <form onSubmit={handleSaveProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'block' }}>Nombre Completo</label>
                                    <input required value={editingProduct?.nombre || ''} onChange={e => setEditingProduct({ ...editingProduct, nombre: e.target.value })} placeholder="Ej: Aspiradora Industrial 20L" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'block' }}>Marca</label>
                                    <input required value={editingProduct?.marca || ''} onChange={e => setEditingProduct({ ...editingProduct, marca: e.target.value })} placeholder="Ej: TOTAL" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'block' }}>Categoría</label>
                                    <select required value={editingProduct?.categoria?.id || ''} onChange={e => setEditingProduct({ ...editingProduct, categoria: categories.find(c => c.id === e.target.value) })}>
                                        <option value="">Seleccionar...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'block' }}>Precio (S/.)</label>
                                    <input required type="number" step="0.01" value={editingProduct?.precio || ''} onChange={e => setEditingProduct({ ...editingProduct, precio: parseFloat(e.target.value) })} placeholder="0.00" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'block' }}>Stock Disponible</label>
                                    <input required type="number" value={editingProduct?.stock || ''} onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })} placeholder="0" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'block' }}>Precio Anterior (S/.)</label>
                                    <input type="number" step="0.01" value={editingProduct?.precioAnterior || ''} onChange={e => setEditingProduct({ ...editingProduct, precioAnterior: parseFloat(e.target.value) })} placeholder="0.00" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'block' }}>Puntuación (0-5)</label>
                                    <input type="number" step="0.1" max="5" min="0" value={editingProduct?.puntuacion || ''} onChange={e => setEditingProduct({ ...editingProduct, puntuacion: parseFloat(e.target.value) })} placeholder="4.5" />
                                </div>
                                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '2rem', padding: '1rem', backgroundColor: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                                        <input type="checkbox" checked={editingProduct?.esNuevo || false} onChange={e => setEditingProduct({ ...editingProduct, esNuevo: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                                        Es Nuevo
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                                        <input type="checkbox" checked={editingProduct?.esMasVendido || false} onChange={e => setEditingProduct({ ...editingProduct, esMasVendido: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                                        Más Vendido
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                                        <input type="checkbox" checked={editingProduct?.esOferta || false} onChange={e => setEditingProduct({ ...editingProduct, esOferta: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                                        En Oferta
                                    </label>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'block' }}>URL Imagen Principal</label>
                                    <input required value={editingProduct?.imagen || ''} onChange={e => setEditingProduct({ ...editingProduct, imagen: e.target.value })} placeholder="https://..." />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'block' }}>Descripción Detallada</label>
                                    <textarea
                                        rows={4}
                                        value={editingProduct?.descripcion || ''}
                                        onChange={e => setEditingProduct({ ...editingProduct, descripcion: e.target.value })}
                                        placeholder="Detalles del producto, especificaciones, etc..."
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                    />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem', display: 'block' }}>Imágenes Adicionales (Galería)</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        {[0, 1, 2, 3].map(index => (
                                            <input
                                                key={index}
                                                value={editingProduct?.imagenesAdicionales?.[index] || ''}
                                                onChange={e => {
                                                    const newImgs = [...(editingProduct?.imagenesAdicionales || [])];
                                                    newImgs[index] = e.target.value;
                                                    setEditingProduct({ ...editingProduct, imagenesAdicionales: newImgs });
                                                }}
                                                placeholder={`Imagen ${index + 1} (URL)`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, height: '55px', borderRadius: '14px' }}>
                                        {loading ? 'Guardando...' : <><Save size={20} /> Guardar Cambios</>}
                                    </button>
                                    <button type="button" onClick={() => setIsProductModalOpen(false)} style={{ flex: 1, backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', borderRadius: '14px', fontWeight: '700' }}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Category Modal */}
            {
                isCategoryModalOpen && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2000, backdropFilter: 'blur(10px)'
                    }}>
                        <div className="glass-card" style={{ width: '90%', maxWidth: '500px', padding: '3rem', position: 'relative' }}>
                            <button onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }} style={{ position: 'absolute', top: '25px', right: '25px', background: 'transparent', color: 'var(--text-muted)' }}><X /></button>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '2.5rem' }}>{editingCategory?.id ? '✏️ Editar Categoría' : '📂 Nueva Categoría'}</h2>

                            <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'block' }}>ID Único (ej: cat-pintura)</label>
                                    <input required disabled={isEditingCategory} value={editingCategory?.id || ''} onChange={e => setEditingCategory({ ...editingCategory, id: e.target.value })} placeholder="cat-nombre" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'block' }}>Nombre de Categoría</label>
                                    <input required value={editingCategory?.nombre || ''} onChange={e => setEditingCategory({ ...editingCategory, nombre: e.target.value })} placeholder="Ej: Pintura y Acabados" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'block' }}>Descripción Breve</label>
                                    <textarea rows={3} value={editingCategory?.descripcion || ''} onChange={e => setEditingCategory({ ...editingCategory, descripcion: e.target.value })} placeholder="Describe brevemente los productos de esta categoría..." />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, height: '55px', borderRadius: '14px' }}>
                                        {loading ? 'Guardando...' : <><Save size={20} /> Guardar</>}
                                    </button>
                                    <button type="button" onClick={() => setIsCategoryModalOpen(false)} style={{ flex: 1, backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', borderRadius: '14px', fontWeight: '700' }}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Order Detail Modal */}
            {
                isOrderModalOpen && selectedOrder && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2000, backdropFilter: 'blur(10px)'
                    }}>
                        <div className="glass-card" style={{ width: '90%', maxWidth: '600px', padding: '3rem', position: 'relative' }}>
                            <button onClick={() => setIsOrderModalOpen(false)} style={{ position: 'absolute', top: '25px', right: '25px', background: 'transparent', color: 'var(--text-muted)' }}><X /></button>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>📦 Detalle del Pedido</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>ID: #{selectedOrder.id}</p>

                            <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-dark)', borderRadius: '12px' }}>
                                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>Cliente:</strong> {selectedOrder.usuario?.nombre}</p>
                                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>Email:</strong> {selectedOrder.usuario?.email}</p>
                                <p style={{ fontSize: '0.9rem' }}><strong>Fecha:</strong> {new Date(selectedOrder.fecha).toLocaleDateString()}</p>
                            </div>

                            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '2rem' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <tr>
                                            <th style={{ textAlign: 'left', padding: '10px' }}>Producto</th>
                                            <th style={{ textAlign: 'center', padding: '10px' }}>Cant</th>
                                            <th style={{ textAlign: 'right', padding: '10px' }}>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.detalles?.map((d, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '12px', fontSize: '0.9rem', fontWeight: '600' }}>{d.producto.nombre}</td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>{d.cantidad}</td>
                                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700' }}>S/. {(d.precioUnitario * d.cantidad).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--primary)', paddingTop: '1.5rem' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>Total del Pedido</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>S/. {selectedOrder.total.toFixed(2)}</span>
                            </div>

                            <button onClick={() => setIsOrderModalOpen(false)} className="btn-primary" style={{ width: '100%', marginTop: '2rem' }}>Cerrar</button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
