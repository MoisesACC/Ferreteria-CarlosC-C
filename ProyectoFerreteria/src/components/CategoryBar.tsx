import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Laptop as Tool, Hammer, PaintBucket, Ruler, Zap } from 'lucide-react';
import api from '../api/api';
import type { Categoria } from '../types';

export const CategoryBar: React.FC = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    useEffect(() => {
        api.get('/categorias').then(res => setCategorias(res.data));
    }, []);

    const getIcon = (nombre: string) => {
        if (nombre.toLowerCase().includes('eléctrica')) return <Zap size={18} />;
        if (nombre.toLowerCase().includes('manual')) return <Hammer size={18} />;
        if (nombre.toLowerCase().includes('pintura')) return <PaintBucket size={18} />;
        if (nombre.toLowerCase().includes('medición')) return <Ruler size={18} />;
        return <Tool size={18} />;
    };

    return (
        <div className="category-bar-container">
            <Link to="/productos" className="nav-item">Inicio</Link>
            {categorias.map(cat => (
                <Link key={cat.id} to={`/productos?categoria=${cat.id}`} className="nav-item">
                    {getIcon(cat.nombre)}
                    {cat.nombre}
                </Link>
            ))}
            <Link to="#" className="nav-item">Preguntas Frecuentes</Link>
            <Link to="#" className="nav-item">Clientes satisfechos</Link>

            <style>{`
                .category-bar-container {
                    background-color: var(--bg-main);
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    padding: 0.8rem 2rem;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                }
                .category-bar-container::-webkit-scrollbar {
                    display: none;
                }
                .nav-item {
                    text-decoration: none;
                    color: var(--text-main);
                    font-size: 0.9rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: var(--transition);
                    white-space: nowrap;
                }
                .nav-item:hover {
                    color: var(--primary);
                }
                
                @media (max-width: 992px) {
                    .category-bar-container {
                        justify-content: flex-start;
                        padding: 0.8rem 1rem;
                        gap: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};
