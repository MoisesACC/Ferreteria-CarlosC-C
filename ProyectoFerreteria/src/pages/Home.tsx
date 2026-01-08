import React, { useEffect, useState } from 'react';
import {
    ShieldCheck,
    Truck,
    Clock,
    MessageCircle
} from 'lucide-react';
import api from '../api/api';
import type { Producto } from '../types';
import { ProductCard } from '../components/ProductCard';
import { HeroSlider } from '../components/HeroSlider';
import { BrandsSection } from '../components/BrandsSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { CategoryBar } from '../components/CategoryBar';
import { Logo } from '../components/Logo';

export const Home: React.FC = () => {
    const [offers, setOffers] = useState<Producto[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [transitionEnabled, setTransitionEnabled] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // Persistent Countdown Logic
        let endDate = localStorage.getItem('offer_end_date');
        if (!endDate) {
            const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
            endDate = (Date.now() + threeDaysInMs).toString();
            localStorage.setItem('offer_end_date', endDate);
        }

        const targetDate = parseInt(endDate);

        const updateTimer = () => {
            const now = Date.now();
            const difference = targetDate - now;

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        };

        updateTimer();
        const timerId = setInterval(updateTimer, 1000);
        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        // Fetch products by new fields
        api.get('/productos').then(res => {
            const all = res.data;
            setOffers(all.filter((p: Producto) => p.esOferta));
        });
    }, []);

    const nextSlide = () => {
        setTransitionEnabled(true);
        setCurrentIndex((prev) => prev + 1);
    };

    const prevSlide = () => {
        setTransitionEnabled(true);
        setCurrentIndex((prev) => prev - 1);
    };

    useEffect(() => {
        if (!transitionEnabled) {
            // Re-enable transition after the silent jump
            const timeout = setTimeout(() => setTransitionEnabled(true), 50);
            return () => clearTimeout(timeout);
        }
    }, [transitionEnabled]);

    useEffect(() => {
        if (offers.length === 0) return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [offers.length]);

    return (
        <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
            {/* Promotional Banner */}
            <div className="marquee">
                <div className="marquee-content">
                    <span>⚡ ENVÍOS A TODO EL PERÚ</span>
                    <span>🔒 PAGOS 100% SEGUROS</span>
                    <span>📦 ENVÍAMOS TU PEDIDO EL MISMO DÍA</span>
                    <span>📞 CONTACTANOS: 981 182 158</span>
                    {/* Repeat for continuous effect */}
                    <span>⚡ ENVÍOS A TODO EL PERÚ</span>
                    <span>🔒 PAGOS 100% SEGUROS</span>
                    <span>📦 ENVÍAMOS TU PEDIDO EL MISMO DÍA</span>
                </div>
            </div>

            <CategoryBar />
            <HeroSlider />

            {/* Brands Carousel */}
            <BrandsSection />

            {/* Promotional Grid - Mosaic Packery style */}
            <section style={{ padding: '6rem 0', backgroundColor: '#fff' }}>
                <div className="container promo-grid-v2">
                    {/* Item 1: Rotomartillo (Small) */}
                    <div className="mosaic-card card-r1-c1">
                        <img src="https://ferreteriaspacco.com/cdn/shop/files/PACKERY-3.png?v=1760428142&width=720" alt="Rotomartillo" />
                        <div className="mosaic-overlay"></div>
                    </div>

                    {/* Item 2: Nivel Laser (Small) */}
                    <div className="mosaic-card card-r1-c2">
                        <img src="https://ferreteriaspacco.com/cdn/shop/files/PACKERY-4.png?v=1760428142&width=720" alt="Nivel Laser" />
                        <div className="mosaic-overlay"></div>
                    </div>

                    {/* Item 3: Hidrolavadora (Wide) */}
                    <div className="mosaic-card card-wide">
                        <img src="https://ferreteriaspacco.com/cdn/shop/files/PACKERY-2.png?v=1760428143&width=720" alt="Hidrolavadora" />
                        <div className="mosaic-overlay"></div>
                    </div>

                    {/* Item 4: Taladro + Set (Tall) */}
                    <div className="mosaic-card card-tall">
                        <img src="https://ferreteriaspacco.com/cdn/shop/files/PACKERY-1.png?v=1760428143&width=720" alt="Taladro Set" />
                        <div className="mosaic-overlay"></div>
                    </div>
                </div>
            </section>

            {/* Offers of the month with Responsive Slider */}
            <section style={{ padding: '6rem 0' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 className="section-title">OFERTAS DEL MES</h2>

                    {/* Persistent Countdown */}
                    <div className="countdown-wrapper">
                        <span className="countdown-label">La oferta termina en:</span>
                        <div className="countdown-items">
                            {[
                                { val: String(timeLeft.days).padStart(2, '0'), label: 'días' },
                                { val: String(timeLeft.hours).padStart(2, '0'), label: 'horas' },
                                { val: String(timeLeft.minutes).padStart(2, '0'), label: 'min' },
                                { val: String(timeLeft.seconds).padStart(2, '0'), label: 'seg' }
                            ].map((t, i) => (
                                <div key={i} className="countdown-item">
                                    <span className="countdown-val">{t.val}</span>
                                    <span className="countdown-unit">{t.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="slider-container">
                        <div className="slider-viewport">
                            <div
                                onTransitionEnd={() => {
                                    if (currentIndex >= offers.length) {
                                        setTransitionEnabled(false);
                                        setCurrentIndex(0);
                                    } else if (currentIndex <= -1) {
                                        setTransitionEnabled(false);
                                        setCurrentIndex(offers.length - 1);
                                    }
                                }}
                                className="slider-track"
                                style={{
                                    display: 'flex',
                                    transition: transitionEnabled ? 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
                                    transform: `translateX(calc(-${(offers.length + currentIndex) * (100 / (window.innerWidth < 768 ? 1 : 4))}%))`
                                }}
                            >
                                {[...offers, ...offers, ...offers].map((p, idx) => (
                                    <div key={`${p.id}-${idx}`} className="slider-item">
                                        <ProductCard producto={p} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button onClick={prevSlide} className="slider-arrow prev" aria-label="Anterior">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <button onClick={nextSlide} className="slider-arrow next" aria-label="Siguiente">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>

                    <div style={{ marginTop: '4rem' }}>
                        <button className="btn-primary all-offers-btn">VER TODO</button>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{
                            left: `${(((currentIndex % offers.length) + offers.length) % offers.length) / Math.max(1, offers.length) * 100}%`,
                            width: `${(1 / Math.max(1, offers.length)) * 100}%`,
                            transition: transitionEnabled ? 'all 0.4s ease' : 'none'
                        }}></div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="trust-badges-section">
                <div className="container trust-badges-grid">
                    <div className="trust-badge">
                        <ShieldCheck size={40} className="badge-icon" />
                        <h4>Pago 100% seguro</h4>
                        <p>Realiza tu pago a través de nuestra pasarela</p>
                    </div>
                    <div className="trust-badge">
                        <Truck size={40} className="badge-icon" />
                        <h4>Envío Inmediato</h4>
                        <p>Despachamos pedidos antes de las 4pm</p>
                    </div>
                    <div className="trust-badge">
                        <Clock size={40} className="badge-icon" />
                        <h4>Soporte Total</h4>
                        <p>Seguimiento de tu pedido en tiempo real</p>
                    </div>
                </div>
            </section>

            <style>{`
                /* Adjusted Mosaic Packery Grid */
                .promo-grid-v2 {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    max-width: 1200px; /* Slightly smaller and more centered */
                    margin: 0 auto;
                }
                .mosaic-card {
                    position: relative;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
                    transition: all 0.4s ease;
                    background: #fff;
                }
                .mosaic-card img {
                    width: 100%;
                    height: 100%;
                    object-fit: fill; /* Standard for these pre-designed banners to fit perfectly */
                    display: block;
                    transition: transform 0.5s ease;
                }
                .mosaic-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
                }
                .mosaic-card:hover img {
                    transform: scale(1.02);
                }
                .mosaic-overlay {
                    position: absolute;
                    top: 0; bottom: 0; left: 0; right: 0;
                    background: rgba(0,0,0,0.02);
                    pointer-events: none;
                }

                .card-r1-c1, .card-r1-c2 { 
                    grid-column: span 1;
                    height: 240px; /* Increased height for the top row */
                }
                .card-tall { 
                    grid-column: 3; 
                    grid-row: 1 / span 2; 
                    width:380px;
                    height: 640px; /* Fixed height for the tall banner */
                }
                .card-wide { 
                    grid-column: 1 / span 2; 
                    height: 384px; /* Balanced height to match the tall card with 1rem gap */
                }

                @media (max-width: 1200px) {
                    .promo-grid-v2 { padding: 0 1rem; }
                    .card-tall { width: auto; } /* Remove fixed width to fit container */
                }

                @media (max-width: 992px) {
                    .promo-grid-v2 { 
                        grid-template-columns: 1fr 1fr;
                        grid-template-rows: auto;
                    }
                    .card-r1-c1, .card-r1-c2 { 
                        grid-column: span 1; 
                        height: 200px; 
                    }
                    .card-tall { 
                        grid-column: span 1; 
                        grid-row: auto; 
                        width: 100%;
                        height: 410px; 
                    }
                    .card-wide { 
                        grid-column: span 2; 
                        height: 250px; 
                    }
                }

                @media (max-width: 768px) {
                    .promo-grid-v2 { 
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    .card-r1-c1, .card-r1-c2, .card-tall, .card-wide { 
                        grid-column: span 1; 
                        grid-row: auto; 
                        width: 100%;
                        height: auto;
                        aspect-ratio: 16 / 9; /* Standard readable aspect ratio for mobile banners */
                    }
                    .card-tall { aspect-ratio: 4 / 5; } /* Slightly taller for the taladro on mobile */
                }

                .section-title { font-size: 2.8rem; font-weight: 900; margin-bottom: 1.5rem; letter-spacing: -1px; }
                
                .countdown-wrapper { 
                    display: flex; 
                    flex-direction: row; 
                    align-items: center; 
                    justify-content: center;
                    gap: 2.5rem; 
                    margin-bottom: 4rem; 
                    width: 100%;
                }
                .countdown-label { font-size: 1.4rem; font-weight: 500; color: #333; }
                .countdown-items { 
                    display: flex; 
                    gap: 2rem; 
                    align-items: baseline;
                    flex-wrap: nowrap;
                }
                .countdown-item { display: flex; align-items: baseline; gap: 8px; }
                .countdown-val { font-size: 2.8rem; font-weight: 900; color: var(--accent); line-height: 1; }
                .countdown-unit { font-size: 0.9rem; font-weight: 800; color: #888; text-transform: uppercase; }

                .slider-container { 
                    position: relative; 
                    width: 100%; 
                    padding: 20px 0;
                    margin: 0 auto;
                }
                .slider-viewport {
                    overflow: hidden;
                    width: 100%;
                    padding: 10px 0;
                }
                .slider-track {
                    display: flex;
                }
                .slider-item { 
                    flex: 0 0 25%; 
                    padding: 0 12px; 
                }
                
                .slider-arrow { 
                    position: absolute; 
                    top: 40%; /* Centered more towards the product image area */
                    transform: translateY(-50%); 
                    background-color: #fff; 
                    border: 1px solid #eee; 
                    width: 50px; 
                    height: 50px; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    z-index: 30; 
                    box-shadow: 0 6px 16px rgba(0,0,0,0.1); 
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    color: #000;
                }
                .slider-arrow:hover {
                    background-color: var(--primary);
                    border-color: var(--primary);
                    transform: translateY(-50%) scale(1.1);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                }
                .slider-arrow:active {
                    transform: translateY(-50%) scale(0.95);
                }
                .slider-arrow.prev { left: -25px; }
                .slider-arrow.next { right: -25px; }
                
                .progress-bar-bg { 
                    width: 100%; 
                    height: 4px; 
                    background-color: #eee; 
                    margin-top: 4rem; 
                    position: relative; 
                    border-radius: 10px;
                    overflow: hidden;
                }
                .progress-bar-fill { 
                    position: absolute; 
                    height: 100%; 
                    background-color: var(--primary); 
                    border-radius: 10px;
                }
                
                .trust-badges-section { background: var(--primary); padding: 5rem 0; color: #000; }
                .trust-badges-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3rem; }
                .trust-badge { text-align: center; }
                .badge-icon { margin-bottom: 1.5rem; }

                @media (max-width: 1200px) {
                    .slider-item { flex: 0 0 33.333%; }
                    .slider-arrow.prev { left: 10px; }
                    .slider-arrow.next { right: 10px; }
                }

                @media (max-width: 992px) {
                    .promo-item { grid-column: span 12; }
                    .slider-item { flex: 0 0 50%; }
                    .trust-badges-grid { grid-template-columns: 1fr; gap: 4rem; }
                }
                
                @media (max-width: 768px) {
                    .section-title { font-size: 2rem; text-align: center; }
                    .slider-item { flex: 0 0 100%; }
                    .slider-arrow { display: none; }
                    
                    /* Countdown Mobile Fixes */
                    .countdown-wrapper { 
                        flex-direction: column; 
                        gap: 1rem; 
                        width: 100% !important;
                    }
                    .countdown-items { 
                        gap: 0.8rem !important; 
                        width: 100%;
                        justify-content: center;
                    }
                    .countdown-val { font-size: 1.8rem !important; }
                    .countdown-unit { font-size: 0.65rem !important; }
                    .countdown-label { font-size: 1.1rem !important; }
                    .countdown-item { gap: 4px !important; }
                }

                @media (max-width: 480px) {
                    .countdown-items { gap: 0.5rem !important; }
                    .countdown-val { font-size: 1.4rem !important; }
                    .countdown-unit { font-size: 0.5rem !important; }
                }
            `}</style>

            <TestimonialsSection />

            {/* WhatsApp Floating */}
            <a
                href="https://wa.me/981182158"
                target="_blank"
                rel="noreferrer"
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    backgroundColor: '#25D366',
                    color: '#fff',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    transition: 'var(--transition)'
                }}
            >
                <MessageCircle size={32} />
            </a>
        </div >
    );
};
