import React, { useState, useEffect } from 'react';
import {
    Package,
    Layers,
    Users,
    ShoppingCart as Orders,
    LogOut,
    TrendingUp,
    Plus,
    Edit,
    Trash2,
    X,
    Save,
    LayoutDashboard,
    Search as SearchIcon
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

    // Total sales mock calculation if no real sum from API
    const totalSales = orders.reduce((acc, curr) => acc + curr.total, 0);

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

    const filteredProducts = products.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.marca.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setProductPage(1);
    }, [searchTerm]);

    const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = productPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentAdminProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                backgroundColor: 'var(--bg-main)',
                borderRight: '1px solid var(--border-color)',
                padding: '2rem 1.2rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ marginBottom: '3rem', padding: '0 0.5rem' }}>
                    <Logo width={200} />
                </div>

                <nav style={{ flex: 1 }}>
                    <SidebarItem
                        icon={<LayoutDashboard size={20} />}
                        label="Dashboard"
                        active={activeTab === 'dashboard'}
                        onClick={() => setActiveTab('dashboard')}
                    />
                    <SidebarItem
                        icon={<Package size={20} />}
                        label="Productos"
                        active={activeTab === 'products'}
                        onClick={() => setActiveTab('products')}
                    />
                    <SidebarItem
                        icon={<Layers size={20} />}
                        label="Categorías"
                        active={activeTab === 'categories'}
                        onClick={() => setActiveTab('categories')}
                    />
                    <SidebarItem
                        icon={<Orders size={20} />}
                        label="Pedidos"
                        active={activeTab === 'orders'}
                        onClick={() => setActiveTab('orders')}
                    />
                    <SidebarItem
                        icon={<Users size={20} />}
                        label="Usuarios"
                        active={activeTab === 'users'}
                        onClick={() => setActiveTab('users')}
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
            <main style={{ flex: 1, padding: '2.5rem 3.5rem', marginLeft: '280px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
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

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <ThemeToggle />
                        {(activeTab === 'products' || activeTab === 'categories') && (
                            <button
                                onClick={() => {
                                    if (activeTab === 'products') {
                                        setEditingProduct({});
                                        setIsEditingProduct(false);
                                        setIsProductModalOpen(true);
                                    } else {
                                        setEditingCategory({});
                                        setIsEditingCategory(false);
                                        setIsCategoryModalOpen(true);
                                    }
                                }}
                                className="btn-primary"
                                style={{ padding: '12px 24px', borderRadius: '14px', fontSize: '0.95rem' }}
                            >
                                <Plus size={20} /> Nuevo {activeTab === 'products' ? 'Producto' : 'Categoría'}
                            </button>
                        )}
                    </div>
                </header>

                {/* Dashboard Stats */}
                {activeTab === 'dashboard' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        {[
                            { label: 'Productos', value: products.length, icon: <Package />, color: '#6C47FF' },
                            { label: 'Categorías', value: categories.length, icon: <Layers />, color: '#FF9500' },
                            { label: 'Ingresos Totales', value: `S/. ${totalSales.toFixed(2)}`, icon: <TrendingUp />, color: '#34C759' },
                            { label: 'Pedidos Realizados', value: orders.length, icon: <Orders />, color: '#FF3B30' },
                            { label: 'Clientes Registrados', value: users.length, icon: <Users />, color: '#007AFF' }
                        ].map((stat, i) => (
                            <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                <div style={{ padding: '1rem', borderRadius: '14px', backgroundColor: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>{stat.label}</p>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stat.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Table Area */}
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    {activeTab === 'products' && (
                        <>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
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
                                            border: '1px solid var(--border-color)'
                                        }}
                                    />
                                    <SearchIcon size={18} style={{ position: 'absolute', left: '15px', top: '13px', color: 'var(--text-muted)' }} />
                                </div>
                            </div>
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
                        </>
                    )}

                    {activeTab === 'categories' && (
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
                    )}

                    {activeTab === 'orders' && (
                        <div style={{ padding: '4rem', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Lista de Pedidos</h2>
                            {orders.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)' }}>Aún no hay pedidos registrados en el sistema.</p>
                            ) : (
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
                                                            border: 'none'
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
                            )}
                        </div>
                    )}

                    {activeTab === 'users' && (
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
                                            <td>{u.nombre}</td>
                                            <td>{u.email}</td>
                                            <td><span style={{ padding: '4px 8px', backgroundColor: u.rol === 'ADMIN' ? 'var(--primary)' : 'var(--bg-dark)', color: u.rol === 'ADMIN' ? '#000' : 'inherit', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{u.rol}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'dashboard' && (
                        <div style={{ padding: '4rem', textAlign: 'center' }}>
                            <img src="https://illustrations.popsy.co/amber/working-from-home.svg" alt="Empty" style={{ width: '300px', marginBottom: '2rem', opacity: 0.8 }} />
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>¡Hola {user?.nombre}!</h2>
                            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>Estas son las métricas reales de tu negocio. Tienes {products.length} productos publicados y {categories.length} categorías activas.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Product Modal */}
            {isProductModalOpen && (
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
            )}

            {/* Category Modal */}
            {isCategoryModalOpen && (
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
            )}

            {/* Order Detail Modal */}
            {isOrderModalOpen && selectedOrder && (
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
            )}
        </div>
    );
};
