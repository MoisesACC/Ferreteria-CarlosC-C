import React from 'react';
import type { Testimonio } from '../types';
import { Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
    // Semi-static list for visual excellence as per requirement
    const fallbackTestimonios: Testimonio[] = [
        { id: 1, cliente: 'Raúl T.', comentario: 'Buenos productos en tienda, la atención fue rápida y encontré lo que buscaba.', estrellas: 5, imagen: 'https://images.unsplash.com/photo-1544717304-a2db4a7b16ee?q=80&w=400' },
        { id: 2, cliente: 'José M.', comentario: 'Justo a tiempo. El envío llegó el mismo día tal como prometieron. Muy recomendable.', estrellas: 5, imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400' },
        { id: 3, cliente: 'Jose C.', comentario: 'Buena compra para mi taller. Las herramientas son de calidad industrial y muy resistentes.', estrellas: 5, imagen: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400' },
        { id: 4, cliente: 'Matías O.', comentario: 'Llegó rápido y todo ok. La amoladora Uyustools es potente y muy ergonómica.', estrellas: 4, imagen: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400' },
    ];

    return (
        <section style={{ padding: '6rem 0', backgroundColor: '#F9FAFB' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
                    <h2 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '0.8rem', letterSpacing: '-1px' }}>Nuestros clientes nos aman</h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>4.8</span>
                        <div style={{ display: 'flex', color: '#FF9500' }}>
                            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < 4 ? "currentColor" : "none"} stroke="currentColor" />)}
                        </div>
                        <span style={{ color: '#666', fontWeight: '500' }}>basado en 24 reseñas</span>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {fallbackTestimonios.map((t) => (
                        <div key={t.id} style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                            border: '1px solid #f0f0f0',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{ height: '360px', overflow: 'hidden' }}>
                                <img src={t.imagen} alt={t.cliente} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: '2rem', textAlign: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '1rem', color: '#FF9500' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} fill={i < t.estrellas ? "currentColor" : "none"} stroke="currentColor" />
                                    ))}
                                </div>
                                <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem', color: '#111' }}>{t.cliente}</h4>
                                <p style={{ color: '#555', fontSize: '1rem', fontStyle: 'italic', lineHeight: '1.6' }}>"{t.comentario}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
