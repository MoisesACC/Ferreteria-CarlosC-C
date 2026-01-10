import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Producto, Categoria } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';

export const Shop: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('newest');

    const [viewMode, setViewMode] = useState<'grid-2' | 'grid-3' | 'grid-4' | 'list'>('grid-3');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = viewMode === 'list' ? 8 : (viewMode === 'grid-4' ? 16 : 12);

    useEffect(() => {
        Promise.all([
            api.get('/productos'),
            api.get('/categorias')
        ]).then(([prodRes, catRes]) => {
            setProductos(prodRes.data);
            setCategorias(catRes.data);
        }).catch(err => console.error("Error fetching data", err));
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
        setCurrentPage(1);
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
                        </div>

                        <div className="filter-group">
                            <h4>Marcas</h4>
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
                                    <span style={{ color: '#000', fontWeight: '900' }}>{filteredProductos.length}</span> resultados
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
                            {currentItems.length > 0 ? (
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
                        {totalPages > 1 && (
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

            <style>{`
                .shop-page { background-color: #fcfcfc; min-height: 100vh; padding: 3rem 0; }
                .shop-top-header { margin-bottom: 3rem; }
                .breadcrumb { font-size: 0.85rem; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
                
                .view-actions-bar { display: flex; align-items: center; gap: 1rem; }
                .stats-text { font-size: 0.95rem; color: #666; font-weight: 500; }
                
                /* View Switcher Controls */
                .view-switcher { display: flex; align-items: center; gap: 4px; background: #fff; padding: 4px; border-radius: 12px; border: 1px solid #eee; }
                .view-btn { border: none; background: transparent; cursor: pointer; padding: 8px; border-radius: 8px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
                .view-btn:hover { background: #f5f5f5; }
                .view-btn.active { background: #000; color: #fff; }
                .view-btn.active .layout-icon span { background: #fff !important; }
                
                .divider-v { width: 1px; height: 20px; background: #eee; margin: 0 4px; }
                
                /* Layout Icons */
                .layout-icon { display: flex; gap: 2px; }
                .layout-icon span { background: #999; border-radius: 1px; transition: all 0.2s; }
                .grid-2 span { width: 10px; height: 16px; }
                .grid-3 span { width: 6px; height: 16px; }
                .grid-4 span { width: 4px; height: 16px; }
                .list { flex-direction: column; gap: 3px; }
                .list span { width: 18px; height: 3px; }

                .shop-layout { display: grid; grid-template-columns: 280px 1fr; gap: 3rem; }
                
                /* Sidebar styles ... */
                .shop-sidebar { position: sticky; top: 150px; height: fit-content; }
                .filter-group { margin-bottom: 2.5rem; }
                .filter-group h4 { font-size: 1rem; font-weight: 800; color: #000; margin-bottom: 1.2rem; text-transform: uppercase; }
                
                .search-box { display: flex; align-items: center; gap: 10px; background: #fff; padding: 12px 15px; border-radius: 12px; border: 1px solid #eee; }
                .search-box input { border: none; outline: none; font-size: 0.9rem; width: 100%; }
                
                .sidebar-list { display: flex; flex-direction: column; gap: 0.5rem; }
                .list-item { padding: 10px 15px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; font-weight: 600; color: #555; }
                .list-item:hover { background: #f5f5f5; color: #000; }
                .list-item.active { background: #000; color: #fff; }
                
                /* Brand Checks Redesign */
                .brand-checks { display: flex; flex-direction: column; gap: 12px; max-height: 350px; overflow-y: auto; padding-right: 15px; }
                .check-container { 
                    display: flex; 
                    align-items: center; 
                    gap: 12px; 
                    font-size: 0.95rem; 
                    cursor: pointer; 
                    color: #444; 
                    font-weight: 600;
                    user-select: none;
                    transition: all 0.2s;
                    position: relative;
                }
                .check-container:hover { color: #000; }
                .check-container input { cursor: pointer; width: 18px; height: 18px; accent-color: #000; border-radius: 4px; }
                
                .price-input { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid #eee; font-size: 0.9rem; font-weight: 700; background: #fff; }

                /* Main Shop Area - Unified Bar */
                .sorting-bar { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-bottom: 2.5rem; 
                    padding: 0.8rem 1.5rem; 
                    background: #fff;
                    border-radius: 14px;
                    border: 1px solid #eee; 
                    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                }
                .sorting-bar-right { display: flex; align-items: center; gap: 2rem; }
                .stats-text-main { font-size: 0.95rem; color: #777; font-weight: 600; }
                .sort-controls { display: flex; align-items: center; gap: 0.8rem; }
                .sort-label { font-size: 0.7rem; font-weight: 900; color: #999; letter-spacing: 0.8px; }
                .sort-select { padding: 8px 12px; border-radius: 8px; border: 1px solid #f0f0f0; font-weight: 800; font-size: 0.85rem; cursor: pointer; background: #fafafa; }
                
                /* Mini View Switcher */
                .view-switcher-mini { display: flex; align-items: center; gap: 2px; background: #f8f8f8; padding: 3px; border-radius: 10px; border: 1px solid #eee; }
                .view-btn-mini { border: none; background: transparent; cursor: pointer; padding: 6px; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; color: #999; }
                .view-btn-mini:hover { background: #eee; }
                .view-btn-mini.active { background: #000; color: #fff; }
                .view-btn-mini.active .layout-icon-mini span { background: #fff !important; }
                
                .divider-v-mini { width: 1px; height: 16px; background: #ddd; margin: 0 4px; }
                .layout-icon-mini { display: flex; gap: 2px; }
                .layout-icon-mini span { background: #aaa; border-radius: 1px; transition: all 0.2s; }
                .layout-icon-mini.grid-2 span { width: 8px; height: 12px; }
                .layout-icon-mini.grid-3 span { width: 5px; height: 12px; }
                .layout-icon-mini.grid-4 span { width: 3px; height: 12px; }
                .layout-icon-mini.list { flex-direction: column; gap: 2px; }
                .layout-icon-mini.list span { width: 14px; height: 2px; }

                /* Dynamic Grid Layouts */
                .product-grid { display: grid; gap: 2rem; transition: all 0.4s ease; }
                .product-grid.mode-grid-2 { grid-template-columns: repeat(2, 1fr); }
                .product-grid.mode-grid-3 { grid-template-columns: repeat(3, 1fr); }
                .product-grid.mode-grid-4 { grid-template-columns: repeat(4, 1fr); }
                .product-grid.mode-list { grid-template-columns: 1fr; gap: 1.5rem; }
                
                .no-results { grid-column: 1 / -1; text-align: center; padding: 8rem 2rem; background: #fff; border-radius: 24px; border: 1px dashed #eee; }
                .btn-reset { margin-top: 1.5rem; padding: 14px 30px; background: #000; color: #fff; border: none; border-radius: 99px; font-weight: 800; cursor: pointer; transition: all 0.3s ease; }
                .btn-reset:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
                
                .pagination { display: flex; justify-content: center; gap: 12px; margin-top: 5rem; }
                .page-btn { width: 48px; height: 48px; border-radius: 14px; border: 1px solid #eee; background: #fff; font-weight: 800; cursor: pointer; transition: all 0.2s; color: #555; }
                .page-btn:hover:not(.active) { border-color: #000; color: #000; }
                .page-btn.active { background: #000; color: #fff; border-color: #000; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }

                @media (max-width: 992px) {
                    .shop-layout { grid-template-columns: 1fr; }
                    .shop-sidebar { display: none; }
                    .sorting-bar { flex-direction: column; gap: 1rem; padding: 1.2rem; align-items: flex-start; }
                    .sorting-bar-right { width: 100%; justify-content: space-between; }
                }
            `}</style>
        </div>
    );
};
