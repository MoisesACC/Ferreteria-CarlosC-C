import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: "ASPIRADORAS",
        subtitle: "Potencia Industrial para tu negocio",
        image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=1200",
        color: "#FFD700",
        items: [
            { price: 185, label: "15 LITROS", oldPrice: 245 },
            { price: 210, label: "20 LITROS", oldPrice: 259 },
            { price: 269, label: "30 LITROS", oldPrice: 315 },
        ]
    },
    {
        id: 2,
        title: "HERRAMIENTAS ELÉCTRICAS",
        subtitle: "Equipos de alto rendimiento",
        image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1200",
        color: "#000000",
        items: [
            { price: 229, label: "TALADRO 20V", oldPrice: 299 },
        ]
    }
];

export const HeroSlider: React.FC = () => {
    const [current, setCurrent] = React.useState(0);

    const next = () => setCurrent((current + 1) % slides.length);
    const prev = () => setCurrent((current - 1 + slides.length) % slides.length);

    return (
        <div style={{ position: 'relative', height: '500px', backgroundColor: slides[current].color, overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
                        <div style={{ color: current === 0 ? '#000' : '#fff' }}>
                            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>{slides[current].title}</h1>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {slides[current].items.map((item, idx) => (
                                    <div key={idx} style={{ background: '#000', color: '#fff', padding: '1.5rem', textAlign: 'center', borderRadius: '8px' }}>
                                        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>S/. {item.oldPrice}</p>
                                        <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>S/. {item.price}</h2>
                                        <p style={{ fontWeight: 'bold' }}>{item.label}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="btn-primary" style={{ marginTop: '2rem', padding: '15px 40px', fontSize: '1.2rem' }}>
                                Comprar ahora
                            </button>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <img src={slides[current].image} alt={slides[current].title} style={{ maxWidth: '100%', borderRadius: '20px' }} />
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <button onClick={prev} style={{ position: 'absolute', left: '20px', top: '50%', background: 'rgba(0,0,0,0.3)', color: '#fff', padding: '10px', borderRadius: '50%' }}>
                <ChevronLeft />
            </button>
            <button onClick={next} style={{ position: 'absolute', right: '20px', top: '50%', background: 'rgba(0,0,0,0.3)', color: '#fff', padding: '10px', borderRadius: '50%' }}>
                <ChevronRight />
            </button>
        </div>
    );
};
