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
import '../styles/Home.css';

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
