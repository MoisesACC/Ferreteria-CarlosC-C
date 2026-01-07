import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Producto, Categoria } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

export const Shop: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState<string>('all');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        Promise.all([
            api.get('/productos'),
            api.get('/categorias')
        ]).then(([prodRes, catRes]) => {
            setProductos(prodRes.data);
            setFilteredProductos(prodRes.data);
            setCategorias(catRes.data);
        }).catch(err => console.error("Error fetching data", err));
    }, []);

    useEffect(() => {
        let result = productos;
        if (searchTerm) {
            result = result.filter(p =>
                p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.descripcion && p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
                p.marca.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedCategoria !== 'all') {
            result = result.filter(p => p.categoria?.id === selectedCategoria);
        }
        setFilteredProductos(result);
        setCurrentPage(1); // Reset to page 1 on filter
    }, [searchTerm, selectedCategoria, productos]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProductos.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '4rem 0' }}>
            <div className="container">
                <div className="shop-header">
                    <div className="shop-title">
                        <h1 className="h1-title">Catálogo Profesional</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Explora nuestra selección de herramientas de alta calidad.</p>
                    </div>
                    <div className="shop-stats">
                        <SlidersHorizontal size={20} />
                        <span>Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProductos.length)} de {filteredProductos.length} resultados</span>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="filters-bar">
                    <div className="search-wrapper">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, marca o tipo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="category-select-wrapper">
                        <Filter size={20} style={{ color: 'var(--primary)' }} />
                        <select
                            value={selectedCategoria}
                            onChange={(e) => setSelectedCategoria(e.target.value)}
                        >
                            <option value="all">Todas las categorías</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <style>{`
                    .shop-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        margin-bottom: 4rem;
                    }
                    .h1-title { font-size: 3rem; margin-bottom: 0.5rem; }
                    .shop-stats {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        color: var(--text-muted);
                        font-size: 0.9rem;
                    }
                    .filters-bar {
                        display: flex;
                        gap: 1.5rem;
                        margin-bottom: 4rem;
                        padding: 1.5rem;
                        background-color: var(--bg-dark);
                        border-radius: 16px;
                        align-items: center;
                        flex-wrap: wrap;
                    }
                    .search-wrapper { position: relative; flex: 1; min-width: 300px; }
                    .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
                    .search-wrapper input {
                        width: 100%;
                        padding: 12px 15px 12px 45px;
                        border: 1px solid var(--border-color);
                        border-radius: 99px;
                        background-color: var(--bg-main);
                        font-size: 1rem;
                        color: var(--text-main);
                    }
                    .category-select-wrapper { display: flex; gap: 1rem; alignItems: center; flex: 0 0 auto; }
                    .category-select-wrapper select {
                        padding: 12px 20px;
                        border-radius: 99px;
                        border: 1px solid var(--border-color);
                        background-color: var(--bg-main);
                        min-width: 200px;
                        color: var(--text-main);
                    }

                    @media (max-width: 768px) {
                        .shop-header {
                            flex-direction: column;
                            align-items: flex-start;
                            margin-bottom: 2rem;
                            gap: 1.5rem;
                        }
                        .h1-title { font-size: 2.2rem; }
                        .shop-stats { width: 100%; justify-content: flex-start; }
                        
                        .filters-bar {
                            padding: 1rem;
                            margin-bottom: 2rem;
                        }
                        .search-wrapper { min-width: 100%; }
                        .category-select-wrapper { width: 100%; }
                        .category-select-wrapper select { flex: 1; min-width: 0; }
                    }
                `}</style>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {currentItems.length > 0 ? (
                        currentItems.map(p => <ProductCard key={p.id} producto={p} />)
                    ) : (
                        <div style={{
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            padding: '10rem 2rem',
                            color: 'var(--text-muted)',
                            backgroundColor: 'var(--bg-dark)',
                            borderRadius: '24px',
                            border: '2px dashed var(--border-color)'
                        }}>
                            <SlidersHorizontal size={48} style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>No se encontraron productos</h3>
                            <p>Intenta ajustar tus filtros o buscar algo diferente.</p>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '5rem' }}>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => {
                                    setCurrentPage(i + 1);
                                    window.scrollTo(0, 0);
                                }}
                                style={{
                                    width: '45px',
                                    height: '45px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    transition: 'var(--transition)',
                                    backgroundColor: currentPage === i + 1 ? 'var(--primary)' : 'var(--bg-dark)',
                                    color: currentPage === i + 1 ? '#000' : 'var(--text-main)',
                                    border: '1px solid var(--border-color)'
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
