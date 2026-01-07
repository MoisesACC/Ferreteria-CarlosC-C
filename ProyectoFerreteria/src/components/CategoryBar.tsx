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
        <div style={{
            backgroundColor: 'var(--bg-main)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            padding: '0.8rem 2rem',
            flexWrap: 'wrap'
        }}>
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
                .nav-item {
                    text-decoration: none;
                    color: var(--text-main);
                    font-size: 0.9rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: var(--transition);
                }
                .nav-item:hover {
                    color: var(--primary);
                }
            `}</style>
        </div>
    );
};
