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
    Save,
    Download,
    Eye,
    Receipt
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { comprobanteService } from '../api/comprobanteService';
import type { Producto, Categoria, Pedido, Usuario } from '../types';
import { ThemeToggle } from '../components/ThemeToggle';
import { Logo } from '../components/Logo';
import { GenerarComprobanteModal } from '../components/GenerarComprobanteModal';
import Swal from 'sweetalert2';

interface Comprobante {
    id: string;
    pedidoId: string;
    numeroComprobante: string;
    tipo: 'BOLETA' | 'FACTURA';
    fechaEmision: string;
    clienteNombre: string;
    clienteDocumento: string;
    total: number;
    urlPublica: string;
    estado: string;
}

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
    const [orderSearchTerm, setOrderSearchTerm] = useState('');
    const [billingSearchTerm, setBillingSearchTerm] = useState('');
    const [userSearchTerm, setUserSearchTerm] = useState('');

    // Billing States
    const [comprobantes, setComprobantes] = useState<Comprobante[]>([]);
    const [isGenerarComprobanteModalOpen, setIsGenerarComprobanteModalOpen] = useState(false);
    const [selectedOrderForBilling, setSelectedOrderForBilling] = useState<string | null>(null);
    const [selectedComprobanteForView, setSelectedComprobanteForView] = useState<Comprobante | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes, orderRes, userRes, compRes] = await Promise.all([
                api.get('/productos'),
                api.get('/categorias'),
                api.get('/pedidos').catch(() => ({ data: [] })),
                api.get('/usuarios').catch(() => ({ data: [] })),
                comprobanteService.listar().catch(() => [])
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
            setOrders(orderRes.data);
            setUsers(userRes.data);
            setComprobantes(compRes);
        } catch (error) {
            console.error("Error fetching admin data", error);
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day).toLocaleDateString('es-PE');
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

    // Comprobante Actions
    const handleDescargarPDF = async (comprobante: Comprobante) => {
        try {
            const blob = await comprobanteService.descargarPDF(comprobante.id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${comprobante.numeroComprobante}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            Swal.fire({
                icon: 'success',
                title: '¡Descargado!',
                text: 'El comprobante se ha descargado correctamente',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            console.error("Error al descargar PDF", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo descargar el PDF',
                confirmButtonColor: '#FFCC00'
            });
        }
    };

    const handleAnularComprobante = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción anulará el comprobante y no se puede revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, anular',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await comprobanteService.anular(id);
                fetchData();
                Swal.fire({
                    icon: 'success',
                    title: 'Anulado',
                    text: 'El comprobante ha sido anulado',
                    confirmButtonColor: '#FFCC00'
                });
            } catch (err) {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error inesperado',
                    confirmButtonColor: '#FFCC00'
                });
            }
        }
    };

    const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const handleDeleteUser = async (userEmail: string) => {
        if (userEmail === user?.email) {
            Swal.fire({
                icon: 'error',
                title: 'No permitido',
                text: 'No puedes eliminarte a ti mismo.'
            });
            return;
        }

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Se eliminará el usuario permanentemente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/usuarios/${userEmail}`);
                fetchData();
                Swal.fire('¡Eliminado!', 'El usuario ha sido removido.', 'success');
            } catch (err) {
                Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
            }
        }
    };

    // Pagination for Products Tab
    const [productPage, setProductPage] = useState(1);
    const productsPerPage = 7;

    const [orderPage, setOrderPage] = useState(1);
    const ordersPerPage = 10;

    const [billingPage, setBillingPage] = useState(1);
    const billingPerPage = 10;

    const [userPage, setUserPage] = useState(1);
    const usersPerPage = 10;

    const filteredProducts = React.useMemo(() => {
        return products.filter(p =>
            p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.marca.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const filteredOrders = React.useMemo(() => {
        let result = orders.filter(o => {
            const searchLower = orderSearchTerm.toLowerCase();
            const matchesId = o.id.toLowerCase().includes(searchLower);
            const matchesClient = (o.clienteNombre || o.usuario?.nombre || '').toLowerCase().includes(searchLower);
            return matchesId || matchesClient;
        });

        // Ordenar por fecha (más reciente primero)
        return result.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }, [orders, orderSearchTerm]);

    const filteredBilling = React.useMemo(() => {
        let result = comprobantes.filter(c => {
            const searchLower = billingSearchTerm.toLowerCase();
            const matchesNum = c.numeroComprobante.toLowerCase().includes(searchLower);
            const matchesClient = c.clienteNombre.toLowerCase().includes(searchLower);
            return matchesNum || matchesClient;
        });

        // Ordenar por fecha de emisión (más reciente primero) - fechaEmision es ISO string
        return result.sort((a, b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime());
    }, [comprobantes, billingSearchTerm]);

    const filteredUsers = React.useMemo(() => {
        return users.filter(u =>
            u.nombre.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(userSearchTerm.toLowerCase())
        );
    }, [users, userSearchTerm]);

    useEffect(() => {
        setProductPage(1);
    }, [searchTerm]);

    useEffect(() => {
        setOrderPage(1);
    }, [orderSearchTerm]);

    useEffect(() => {
        setBillingPage(1);
    }, [billingSearchTerm]);

    useEffect(() => {
        setUserPage(1);
    }, [userSearchTerm]);

    const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage);
    const currentAdminProducts = filteredProducts.slice((productPage - 1) * productsPerPage, productPage * productsPerPage);

    const totalOrderPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const currentAdminOrders = filteredOrders.slice((orderPage - 1) * ordersPerPage, orderPage * ordersPerPage);

    const totalBillingPages = Math.ceil(filteredBilling.length / billingPerPage);
    const currentAdminBilling = filteredBilling.slice((billingPage - 1) * billingPerPage, billingPage * billingPerPage);

    const totalUserPages = Math.ceil(filteredUsers.length / usersPerPage);
    const currentAdminUsers = filteredUsers.slice((userPage - 1) * usersPerPage, userPage * usersPerPage);

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
                        icon={<Receipt size={20} />}
                        label="Facturación"
                        active={activeTab === 'billing'}
                        onClick={() => { setActiveTab('billing'); setIsMobileMenuOpen(false); }}
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
                            {activeTab === 'billing' && 'Facturación Electrónica'}
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
                                                    <td style={{ padding: '12px 5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(o.fecha)}</td>
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

                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '2rem' }}>
                            <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
                                <input
                                    placeholder="Buscar por ID de pedido o cliente..."
                                    value={orderSearchTerm}
                                    onChange={(e) => setOrderSearchTerm(e.target.value)}
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
                        </div>

                        {currentAdminOrders.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No se encontraron pedidos con esos criterios.</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID Pedido</th>
                                            <th>Cliente</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                            <th>Comprobante</th>
                                            <th style={{ textAlign: 'right' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentAdminOrders.map(o => (
                                            <tr key={o.id}>
                                                <td>
                                                    <span style={{ fontWeight: '800', fontFamily: 'monospace' }}>#{o.id.slice(0, 8)}</span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                            {o.usuario?.nombre.charAt(0)}
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ fontWeight: '600' }}>{o.clienteNombre || o.usuario?.nombre || 'Anónimo'}</span>
                                                            {o.clienteNombre && o.usuario?.nombre && o.clienteNombre !== o.usuario.nombre && (
                                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cuenta: {o.usuario.nombre}</span>
                                                            )}
                                                        </div>

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
                                                <td>
                                                    {(() => {
                                                        const comp = comprobantes.find(c => c.pedidoId === o.id);
                                                        if (comp) {
                                                            return (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <span style={{
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: '700',
                                                                        color: comp.estado === 'EMITIDO' ? '#34C759' : '#FF3B30'
                                                                    }}>
                                                                        {comp.numeroComprobante}
                                                                    </span>
                                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                                        <button onClick={() => setSelectedComprobanteForView(comp)} style={{ padding: '4px', background: 'transparent', color: 'var(--text-main)', border: 'none', cursor: 'pointer' }} title="Ver PDF"><Eye size={14} /></button>
                                                                        <button onClick={() => handleDescargarPDF(comp)} style={{ padding: '4px', background: 'transparent', color: 'var(--primary)', border: 'none', cursor: 'pointer' }} title="Descargar PDF"><Download size={14} /></button>
                                                                        {comp.estado === 'EMITIDO' && (
                                                                            <button onClick={() => handleAnularComprobante(comp.id)} style={{ padding: '4px', background: 'transparent', color: '#FF3B30', border: 'none', cursor: 'pointer' }} title="Anular"><X size={14} /></button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return (
                                                            <button
                                                                onClick={() => { setSelectedOrderForBilling(o.id); setIsGenerarComprobanteModalOpen(true); }}
                                                                style={{
                                                                    padding: '4px 10px',
                                                                    borderRadius: '6px',
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: '800',
                                                                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                                                    color: 'var(--primary)',
                                                                    border: '1px solid var(--primary)',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px'
                                                                }}
                                                            >
                                                                <Receipt size={12} /> Generar
                                                            </button>
                                                        );
                                                    })()}
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

                        {/* Paginación Pedidos */}
                        {totalOrderPages > 1 && (
                            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                    Página {orderPage} de {totalOrderPages} ({filteredOrders.length} resultados)
                                </span>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        disabled={orderPage === 1}
                                        onClick={() => setOrderPage(p => p - 1)}
                                        style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-dark)', color: orderPage === 1 ? 'var(--text-muted)' : 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        disabled={orderPage === totalOrderPages}
                                        onClick={() => setOrderPage(p => p + 1)}
                                        style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-dark)', color: orderPage === totalOrderPages ? 'var(--text-muted)' : 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {
                    activeTab === 'billing' && (
                        <div className="glass-card no-hover-move" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '2rem' }}>
                                <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
                                    <input
                                        placeholder="Buscar por N° Comprobante o Cliente..."
                                        value={billingSearchTerm}
                                        onChange={(e) => setBillingSearchTerm(e.target.value)}
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
                            </div>

                            <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th style={{ padding: '1.2rem 1.5rem' }}>N° Comprobante</th>
                                            <th>Tipo</th>
                                            <th>Cliente</th>
                                            <th>Fecha</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                            <th style={{ textAlign: 'right', padding: '1.2rem 1.5rem' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentAdminBilling.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                    <Receipt size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                                                    <p>No se encontraron comprobantes.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            currentAdminBilling.map(comp => (
                                                <tr key={comp.id}>
                                                    <td style={{ padding: '1.2rem 1.5rem' }}><span style={{ fontWeight: '800', fontFamily: 'monospace' }}>{comp.numeroComprobante}</span></td>
                                                    <td>
                                                        <span style={{
                                                            padding: '4px 10px',
                                                            borderRadius: '6px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '700',
                                                            backgroundColor: comp.tipo === 'FACTURA' ? 'rgba(108, 71, 255, 0.1)' : 'rgba(255, 149, 0, 0.1)',
                                                            color: comp.tipo === 'FACTURA' ? '#6C47FF' : '#FF9500'
                                                        }}>
                                                            {comp.tipo}
                                                        </span>
                                                    </td>
                                                    <td>{comp.clienteNombre}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{formatDate(comp.fechaEmision.split('T')[0])}</span>
                                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(comp.fechaEmision).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </td>
                                                    <td><span style={{ fontWeight: '800' }}>S/. {comp.total.toFixed(2)}</span></td>
                                                    <td>
                                                        <span style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '700',
                                                            color: comp.estado === 'EMITIDO' ? '#34C759' : '#FF3B30'
                                                        }}>
                                                            {comp.estado === 'EMITIDO' ? '✓ Emitido' : '✕ Anulado'}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'right', padding: '1.2rem 1.5rem' }}>
                                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                            <button onClick={() => setSelectedComprobanteForView(comp)} style={{ padding: '8px', background: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px' }} title="Ver"><Eye size={16} /></button>
                                                            <button onClick={() => handleDescargarPDF(comp)} style={{ padding: '8px', background: 'var(--bg-dark)', color: 'var(--primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }} title="Descargar"><Download size={16} /></button>
                                                            {comp.estado === 'EMITIDO' && (
                                                                <button onClick={() => handleAnularComprobante(comp.id)} style={{ padding: '8px', background: 'rgba(255, 59, 48, 0.1)', color: '#FF3B30', border: '1px solid rgba(255, 59, 48, 0.2)', borderRadius: '8px' }} title="Anular"><X size={16} /></button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación Facturación */}
                            {totalBillingPages > 1 && (
                                <div style={{ padding: '1.5rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                        Página {billingPage} de {totalBillingPages}
                                    </span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            disabled={billingPage === 1}
                                            onClick={() => setBillingPage(p => p - 1)}
                                            style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-dark)', color: billingPage === 1 ? 'var(--text-muted)' : 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                                        >
                                            Anterior
                                        </button>
                                        <button
                                            disabled={billingPage === totalBillingPages}
                                            onClick={() => setBillingPage(p => p + 1)}
                                            style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-dark)', color: billingPage === totalBillingPages ? 'var(--text-muted)' : 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }

                {
                    activeTab === 'users' && (
                        <div className="glass-card no-hover-move" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '2rem' }}>
                                <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
                                    <input
                                        placeholder="Buscar usuario o email..."
                                        value={userSearchTerm}
                                        onChange={(e) => setUserSearchTerm(e.target.value)}
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
                            </div>

                            <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th>Rol</th>
                                            <th style={{ textAlign: 'right' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentAdminUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay usuarios.</td>
                                            </tr>
                                        ) : (
                                            currentAdminUsers.map(u => (
                                                <tr key={u.email}>
                                                    <td style={{ padding: '1.2rem 1.5rem', fontWeight: 'bold' }}>{u.nombre}</td>
                                                    <td style={{ padding: '1.2rem 1.5rem' }}>{u.email}</td>
                                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                                        <span style={{
                                                            padding: '4px 12px',
                                                            backgroundColor: u.rol === 'ADMIN' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255,255,255,0.05)',
                                                            color: u.rol === 'ADMIN' ? 'var(--primary)' : 'inherit',
                                                            borderRadius: '8px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: '800',
                                                            border: u.rol === 'ADMIN' ? '1px solid var(--primary)' : 'none'
                                                        }}>
                                                            {u.rol}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'right', padding: '1.2rem 1.5rem' }}>
                                                        <button
                                                            onClick={() => handleDeleteUser(u.email)}
                                                            style={{
                                                                padding: '8px',
                                                                color: '#FF3B30',
                                                                background: 'rgba(255, 59, 48, 0.1)',
                                                                border: '1px solid rgba(255, 59, 48, 0.2)',
                                                                borderRadius: '8px',
                                                                cursor: 'pointer'
                                                            }}
                                                            title="Eliminar usuario"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación Usuarios */}
                            {totalUserPages > 1 && (
                                <div style={{ padding: '1.5rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                        Página {userPage} de {totalUserPages}
                                    </span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            disabled={userPage === 1}
                                            onClick={() => setUserPage(p => p - 1)}
                                            style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-dark)', color: userPage === 1 ? 'var(--text-muted)' : 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                                        >
                                            Anterior
                                        </button>
                                        <button
                                            disabled={userPage === totalUserPages}
                                            onClick={() => setUserPage(p => p + 1)}
                                            style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-dark)', color: userPage === totalUserPages ? 'var(--text-muted)' : 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                </div>
                            )}
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
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>CLIENTE FACTURACIÓN</p>
                                        <p style={{ fontWeight: '700' }}>{selectedOrder.clienteNombre || selectedOrder.usuario?.nombre}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>DNI / RUC</p>
                                        <p style={{ fontWeight: '700' }}>{selectedOrder.clienteDocumento || 'No registrado'}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>EMAIL CUENTA</p>
                                        <p style={{ fontWeight: '700' }}>{selectedOrder.usuario?.email}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>TELÉFONO</p>
                                        <p style={{ fontWeight: '700' }}>{selectedOrder.clienteTelefono || 'Sin registro'}</p>
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>DIRECCIÓN</p>
                                        <p style={{ fontWeight: '700' }}>{selectedOrder.clienteDireccion || 'No registrada'}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>FECHA</p>
                                        <p style={{ fontWeight: '700' }}>{formatDate(selectedOrder.fecha)}</p>
                                    </div>
                                </div>
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

                            {/* Billing integration in Order Detail */}
                            {(() => {
                                const comp = comprobantes.find(c => c.pedidoId === selectedOrder.id);
                                if (comp) {
                                    return (
                                        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(52,199,89,0.05)', borderRadius: '12px', border: '1px solid rgba(52,199,89,0.1)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>COMPROBANTE EMITIDO</p>
                                                    <p style={{ fontWeight: '700' }}>{comp.numeroComprobante} ({comp.tipo})</p>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => setSelectedComprobanteForView(comp)} style={{ padding: '8px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} title="Ver"><Eye size={18} /></button>
                                                    <button onClick={() => handleDescargarPDF(comp)} style={{ padding: '8px', backgroundColor: 'var(--primary)', borderRadius: '8px', border: 'none', color: '#000' }} title="Descargar"><Download size={18} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return (
                                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                        <button
                                            onClick={() => {
                                                setIsOrderModalOpen(false);
                                                setSelectedOrderForBilling(selectedOrder.id);
                                                setIsGenerarComprobanteModalOpen(true);
                                            }}
                                            style={{
                                                padding: '10px 20px',
                                                borderRadius: '10px',
                                                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                                color: 'var(--primary)',
                                                border: '1px solid var(--primary)',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                width: '100%',
                                                height: '48px'
                                            }}
                                        >
                                            <Receipt size={18} /> Generar Comprobante de Pago
                                        </button>
                                    </div>
                                );
                            })()}

                            <button onClick={() => setIsOrderModalOpen(false)} className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', height: '48px', borderRadius: '12px' }}>Cerrar</button>
                        </div>
                    </div>
                )
            }

            {/* Generar Comprobante Modal */}
            {
                isGenerarComprobanteModalOpen && selectedOrderForBilling && (
                    <GenerarComprobanteModal
                        pedidoId={selectedOrderForBilling}
                        onClose={() => {
                            setIsGenerarComprobanteModalOpen(false);
                            setSelectedOrderForBilling(null);
                        }}
                        onSuccess={() => {
                            fetchData();
                        }}
                    />
                )
            }

            {/* Visualizar Comprobante Modal */}
            {
                selectedComprobanteForView && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '2rem',
                        backdropFilter: 'blur(5px)'
                    }}>
                        <div style={{
                            backgroundColor: 'var(--bg-main)',
                            borderRadius: '24px',
                            width: '95%',
                            maxWidth: '1000px',
                            height: '90vh',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div style={{
                                padding: '1.2rem 2rem',
                                borderBottom: '1px solid var(--border-color)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: 'var(--bg-main)'
                            }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                        {selectedComprobanteForView.tipo}: {selectedComprobanteForView.numeroComprobante}
                                    </h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID Pedido: {selectedComprobanteForView.pedidoId.slice(0, 8)}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        onClick={() => handleDescargarPDF(selectedComprobanteForView)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '10px',
                                            backgroundColor: 'var(--primary)',
                                            color: '#000',
                                            border: 'none',
                                            fontWeight: '700',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Download size={18} /> Descargar PDF
                                    </button>
                                    <button
                                        onClick={() => setSelectedComprobanteForView(null)}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--bg-dark)',
                                            border: '1px solid var(--border-color)',
                                            color: 'var(--text-main)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                            <iframe
                                src={comprobanteService.obtenerUrlPDF(selectedComprobanteForView.id)}
                                style={{
                                    width: '100%',
                                    height: 'calc(90vh - 70px)',
                                    border: 'none',
                                    backgroundColor: '#fff'
                                }}
                                title="Vista del comprobante"
                            />
                        </div>
                    </div>
                )
            }
        </div >
    );
};
