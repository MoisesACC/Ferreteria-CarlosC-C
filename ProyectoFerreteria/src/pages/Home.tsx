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

            {/* Promotional Grid - Professional Layout */}
            <section style={{ padding: '4rem 0' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
                    <div style={{ gridColumn: 'span 4', position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
                        <div style={{ background: '#000', color: '#fff', padding: '2.5rem', height: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'transform 0.5s ease' }} className="promo-card">
                            <h2 style={{ fontSize: '3rem', color: 'var(--primary)', fontWeight: '900', marginBottom: '0.5rem' }}>S/. 269</h2>
                            <p style={{ fontWeight: '800', fontSize: '1.2rem', lineHeight: '1.2', textTransform: 'uppercase' }}>ROTOMARTILLO <br /> INDUSTRIAL 1500W</p>
                            <div style={{ marginTop: '1rem', background: 'var(--primary)', color: '#000', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', width: 'fit-content', fontSize: '0.85rem' }}>ENVÍOS A TODO EL PERÚ</div>
                            <img src="https://ferreteriaspacco.com/cdn/shop/files/ROTOMARTILLO_TOTAL_TH1153216.png?v=1711656842&width=400"
                                style={{ position: 'absolute', right: '-15%', top: '55%', transform: 'translateY(-50%)', height: '85%', objectFit: 'contain', zIndex: 2 }} alt="Rotomartillo" />
                        </div>
                    </div>
                    <div style={{ gridColumn: 'span 4' }}>
                        <div style={{ background: 'var(--primary)', color: '#000', padding: '2rem', borderRadius: '16px', height: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ zIndex: 2 }}>
                                <h1 style={{ fontSize: '4.5rem', fontWeight: '900', margin: 0, lineHeight: 1 }}>S/. 299</h1>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0.5rem 0' }}>TALADRO + <br /> SET DE 165 PZ</h3>
                                <div style={{ background: '#000', color: '#fff', padding: '6px 20px', borderRadius: '99px', fontWeight: '900', marginTop: '1rem', fontSize: '0.9rem', display: 'inline-block' }}>HASTA AGOTAR STOCK</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ gridColumn: 'span 4', position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
                        <div style={{ background: '#000', color: '#fff', padding: '2.5rem', height: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h2 style={{ fontSize: '3rem', color: 'var(--primary)', fontWeight: '900', marginBottom: '0.5rem' }}>S/. 199</h2>
                            <p style={{ fontWeight: '800', fontSize: '1.2rem', lineHeight: '1.2', textTransform: 'uppercase' }}>ASPIRADORA <br /> ROBOT RCV1</p>
                            <div style={{ marginTop: '1rem', background: 'var(--primary)', color: '#000', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', width: 'fit-content', fontSize: '0.85rem' }}>SÚPER OFERTA PACCO</div>
                            <img src="https://ferreteriaspacco.com/cdn/shop/files/aspiradora_robot_karcher_rcv1.png?v=1711656842&width=400"
                                style={{ position: 'absolute', right: '-10%', top: '55%', transform: 'translateY(-50%)', height: '65%', objectFit: 'contain', zIndex: 2 }} alt="Aspiradora" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Offers of the month with TRUE infinite stepped slider */}
            <section style={{ padding: '6rem 0' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.8rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-1px', color: '#1a1a1a' }}>OFERTAS DEL MES</h2>

                    {/* Persistent Countdown */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
                        <span style={{ fontSize: '1rem', color: '#666', alignSelf: 'center', fontWeight: '600' }}>La oferta termina en:</span>
                        {[
                            { val: String(timeLeft.days).padStart(2, '0'), label: 'días' },
                            { val: String(timeLeft.hours).padStart(2, '0'), label: 'horas' },
                            { val: String(timeLeft.minutes).padStart(2, '0'), label: 'min' },
                            { val: String(timeLeft.seconds).padStart(2, '0'), label: 'seg' }
                        ].map((t, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent)' }}>{t.val}</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>{t.label}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', padding: '10px 0' }}>
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
                            style={{
                                display: 'flex',
                                transition: transitionEnabled ? 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
                                transform: `translateX(calc(-${(offers.length + currentIndex) * 25}%))`
                            }}
                        >
                            {[...offers, ...offers, ...offers].map((p, idx) => (
                                <div key={`${p.id}-${idx}`} style={{
                                    flex: '0 0 25%',
                                    padding: '0 10px'
                                }}>
                                    <ProductCard producto={p} />
                                </div>
                            ))}
                        </div>

                        {/* Arrows Styled like reference */}
                        <button
                            onClick={prevSlide}
                            className="slider-arrow"
                            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#fff', border: '1px solid #eee', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="slider-arrow"
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#fff', border: '1px solid #eee', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>

                    <div style={{ marginTop: '4rem' }}>
                        <button className="btn-primary" style={{ background: '#000', color: '#fff', padding: '16px 48px', fontSize: '0.9rem', letterSpacing: '1px' }}>VER TODO</button>
                    </div>

                    {/* Progress Bar styled precisely like the image */}
                    <div style={{ width: '100%', height: '2px', backgroundColor: '#E5E5E5', marginTop: '4rem', position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            left: `${(((currentIndex % offers.length) + offers.length) % offers.length) / Math.max(1, offers.length) * 100}%`,
                            width: `${(1 / Math.max(1, offers.length)) * 100}%`,
                            height: '100%',
                            backgroundColor: '#000',
                            transition: transitionEnabled ? 'all 0.4s ease' : 'none'
                        }}></div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section style={{ background: 'var(--primary)', padding: '4rem 0', color: '#000' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <ShieldCheck size={40} style={{ marginBottom: '1rem' }} />
                        <h4 style={{ fontSize: '1.2rem' }}>Pago 100% seguro</h4>
                        <p style={{ fontSize: '0.9rem' }}>Realiza tu pago a través de nuestra pasarela</p>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <Truck size={40} style={{ marginBottom: '1rem' }} />
                        <h4 style={{ fontSize: '1.2rem' }}>Enviamos tu pedido hoy</h4>
                        <p style={{ fontSize: '0.9rem' }}>Solo aplica para pedidos antes de las 4pm</p>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <Clock size={40} style={{ marginBottom: '1rem' }} />
                        <h4 style={{ fontSize: '1.2rem' }}>Soporte y seguimiento</h4>
                        <p style={{ fontSize: '0.9rem' }}>Trackea tu pedido en tiempo real</p>
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
        </div>
    );
};
