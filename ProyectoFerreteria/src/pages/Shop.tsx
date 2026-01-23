import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Producto, Categoria } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import '../styles/Shop.css';

export const Shop: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('newest');

    const [loading, setLoading] = useState(true);

    const [viewMode, setViewMode] = useState<'grid-2' | 'grid-3' | 'grid-4' | 'list'>('grid-3');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = viewMode === 'list' ? 8 : (viewMode === 'grid-4' ? 16 : 12);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.get('/productos'),
            api.get('/categorias')
        ]).then(([prodRes, catRes]) => {
            setProductos(prodRes.data);
            setCategorias(catRes.data);
        }).catch(err => console.error("Error fetching data", err))
            .finally(() => {
                // Pequeño delay artificial opcional para evitar parpadeos muy rápidos si la API es instantánea (opcional)
                setTimeout(() => setLoading(false), 500);
            });
    }, []);

    const brands = React.useMemo(() => {
        const b = Array.from(new Set(productos.map(p => p.marca)));
        return b.sort();
    }, [productos]);

    const filteredProductos = React.useMemo(() => {
        let result = [...productos];

        if (searchTerm) {
            result = result.filter(p =>
                p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.marca.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategoria !== 'all') {
            result = result.filter(p => p.categoria?.id === selectedCategoria);
        }

        if (selectedBrands.length > 0) {
            result = result.filter(p => selectedBrands.includes(p.marca));
        }

        result = result.filter(p => p.precio >= priceRange[0] && p.precio <= priceRange[1]);

        if (sortBy === 'price-asc') result.sort((a, b) => a.precio - b.precio);
        else if (sortBy === 'price-desc') result.sort((a, b) => b.precio - a.precio);
        else if (sortBy === 'top-rated') result.sort((a, b) => (b.puntuacion || 0) - (a.puntuacion || 0));

        return result;
    }, [searchTerm, selectedCategoria, selectedBrands, priceRange, sortBy, productos]);

    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [searchTerm, selectedCategoria, selectedBrands, priceRange, sortBy, viewMode]);

    const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProductos.slice(indexOfFirstItem, indexOfLastItem);

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    // Skeleton Component
    const ProductSkeleton = () => (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden', height: '380px', display: 'flex', flexDirection: 'column' }}>
            <div className="skeleton-pulse" style={{ width: '100%', height: '220px', background: '#f5f5f5' }}></div>
            <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
                <div className="skeleton-pulse" style={{ width: '30%', height: '14px', borderRadius: '4px', background: '#f5f5f5' }}></div>
                <div className="skeleton-pulse" style={{ width: '80%', height: '24px', borderRadius: '4px', background: '#f5f5f5' }}></div>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="skeleton-pulse" style={{ width: '40%', height: '28px', borderRadius: '6px', background: '#f5f5f5' }}></div>
                    <div className="skeleton-pulse" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f5f5f5' }}></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="shop-page">
            <div className="container">
                {/* Header Section */}
                <div className="shop-top-header">
                    <div className="breadcrumb">Inicio • Productos</div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#000', marginTop: '1rem' }}>
                        {selectedCategoria === 'all' ? 'Catálogo General' : categorias.find(c => c.id === selectedCategoria)?.nombre}
                    </h1>
                </div>

                <div className="shop-layout">
                    {/* Sidebar Filters */}
                    <aside className="shop-sidebar">
                        <div className="filter-group">
                            <h4>Búsqueda Directa</h4>
                            <div className="search-box">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="¿Qué buscas hoy?"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4>Categorías</h4>
                            {loading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-pulse" style={{ height: '35px', width: '100%', borderRadius: '8px', background: '#eee' }}></div>)}
                                </div>
                            ) : (
                                <div className="sidebar-list">
                                    <div
                                        className={`list-item ${selectedCategoria === 'all' ? 'active' : ''}`}
                                        onClick={() => setSelectedCategoria('all')}
                                    >
                                        Todos los productos
                                    </div>
                                    {categorias.map(cat => (
                                        <div
                                            key={cat.id}
                                            className={`list-item ${selectedCategoria === cat.id ? 'active' : ''}`}
                                            onClick={() => setSelectedCategoria(cat.id)}
                                        >
                                            {cat.nombre}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="filter-group">
                            <h4>Marcas</h4>
                            {loading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton-pulse" style={{ height: '20px', width: '70%', borderRadius: '4px', background: '#eee' }}></div>)}
                                </div>
                            ) : (
                                <div className="brand-checks">
                                    {brands.map(brand => (
                                        <label key={brand} className="check-container">
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.includes(brand)}
                                                onChange={() => toggleBrand(brand)}
                                            />
                                            <span className="checkmark"></span>
                                            {brand}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="filter-group">
                            <h4>Rango de Precio</h4>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input
                                    type="number"
                                    className="price-input"
                                    placeholder="Min"
                                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    className="price-input"
                                    placeholder="Max"
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 10000])}
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="shop-main">
                        {/* Sorting Bar - Unified Catalog Controls */}
                        <div className="sorting-bar">
                            <div className="sorting-bar-left">
                                <span className="stats-text-main">
                                    {loading ? (
                                        <div className="skeleton-pulse" style={{ width: '120px', height: '20px', background: '#eee', borderRadius: '4px' }}></div>
                                    ) : (
                                        <><span style={{ color: '#000', fontWeight: '900' }}>{filteredProductos.length}</span> resultados</>
                                    )}
                                </span>
                            </div>
                            <div className="view-switcher-mini desktop-only">
                                <button className={`view-btn-mini ${viewMode === 'grid-2' ? 'active' : ''}`} onClick={() => setViewMode('grid-2')} title="2 Columnas">
                                    <div className="layout-icon-mini grid-2"><span></span><span></span></div>
                                </button>
                                <button className={`view-btn-mini ${viewMode === 'grid-3' ? 'active' : ''}`} onClick={() => setViewMode('grid-3')} title="3 Columnas">
                                    <div className="layout-icon-mini grid-3"><span></span><span></span><span></span></div>
                                </button>
                                <button className={`view-btn-mini ${viewMode === 'grid-4' ? 'active' : ''}`} onClick={() => setViewMode('grid-4')} title="4 Columnas">
                                    <div className="layout-icon-mini grid-4"><span></span><span></span><span></span><span></span></div>
                                </button>
                                <div className="divider-v-mini"></div>
                                <button className={`view-btn-mini ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} title="Vista Lista">
                                    <div className="layout-icon-mini list"><span></span><span></span><span></span></div>
                                </button>
                            </div>

                            <div className="sorting-bar-right">
                                <div className="sort-controls">
                                    <span className="sort-label">ORDENAR POR:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="sort-select"
                                    >
                                        <option value="newest">Lo más nuevo</option>
                                        <option value="price-asc">Precio: Menor a Mayor</option>
                                        <option value="price-desc">Precio: Mayor a Menor</option>
                                        <option value="top-rated">Mejor calificados</option>
                                    </select>
                                </div>


                            </div>
                        </div>

                        {/* Product Grid - Dynamic Columns */}
                        <div className={`product-grid mode-${viewMode}`}>
                            {loading ? (
                                // Render 9 Skeletons while loading
                                [...Array(9)].map((_, i) => <ProductSkeleton key={i} />)
                            ) : currentItems.length > 0 ? (
                                currentItems.map(p => <ProductCard key={p.id} producto={p} />)
                            ) : (
                                <div className="no-results">
                                    <SlidersHorizontal size={48} opacity={0.2} />
                                    <h3>No encontramos lo que buscas</h3>
                                    <p>Intenta cambiar los filtros o el término de búsqueda.</p>
                                    <button onClick={() => {
                                        setSelectedCategoria('all');
                                        setSearchTerm('');
                                        setSelectedBrands([]);
                                        setPriceRange([0, 5000]);
                                    }} className="btn-reset">Limpiar todos los filtros</button>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="pagination">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => {
                                            setCurrentPage(i + 1);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};
