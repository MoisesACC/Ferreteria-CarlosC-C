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

            {/* Promotional Grid - Professional Layout */}
            <section style={{ padding: '6rem 0', backgroundColor: '#fff' }}>
                <div className="container promo-grid">
                    {/* Item 1: Rotomartillo (Small) */}
                    <div className="promo-card card-small-top dark-theme">
                        <div className="card-info">
                            <div className="price-tag">
                                <span className="currency">S/</span>
                                <span className="amount">269</span>
                            </div>
                            <div className="product-name">
                                ROTOMARTILLO <br /> <span>1500W</span>
                            </div>
                        </div>
                        <div className="card-image">
                            <img src="https://ferreteriaspacco.com/cdn/shop/files/ROTOMARTILLO_TOTAL_TH1153216.png?v=1711656842&width=400" alt="Rotomartillo" />
                        </div>
                        <div className="card-footer-yellow">1500W</div>
                    </div>

                    {/* Item 2: Nivel Laser (Small) */}
                    <div className="promo-card card-small-top dark-theme">
                        <div className="card-info">
                            <div className="price-tag">
                                <span className="currency">S/</span>
                                <span className="amount">275</span>
                            </div>
                            <div className="product-name">
                                NIVEL LASER <br /> <span>16 LÍNEAS</span>
                            </div>
                        </div>
                        <div className="card-image smaller-img">
                            <img src="https://ferreteriaspacco.com/cdn/shop/products/TMMTD20003.png?v=1711656842&width=400" alt="Nivel Laser" />
                        </div>
                        <div className="card-footer-yellow">16 LÍNEAS</div>
                    </div>

                    {/* Item 3: Taladro (Large - Spans 2 rows) */}
                    <div className="promo-card card-large-vertical">
                        <div className="card-info-main">
                            <div className="price-tag-large">
                                <span className="currency">S/</span>
                                <span className="amount">299</span>
                            </div>
                            <div className="product-name-large">
                                TALADRO <br /> <span>+ SET DE 165 PZ</span>
                            </div>
                        </div>
                        <div className="card-image-main">
                            <img src="https://ferreteriaspacco.com/cdn/shop/products/TIDLI20025.png?v=1711656842&width=600" alt="Taladro" />
                        </div>
                        <div className="card-badge">
                            <Logo width={40} />
                        </div>
                        <div className="card-footer-yellow-banner">Hasta agotar stock</div>
                    </div>

                    {/* Item 4: Hidrolavadora (Wide) */}
                    <div className="promo-card card-wide-bottom">
                        <div className="card-info-main">
                            <div className="price-tag-large">
                                <span className="currency">S/</span>
                                <span className="amount">199</span>
                            </div>
                            <div className="product-name-large">
                                HIDRO <br /> <span>LAVADORA</span>
                            </div>
                        </div>
                        <div className="card-image-main floating">
                            <img src="https://ferreteriaspacco.com/cdn/shop/files/WADFOW_WCP1501.png?v=1711656842&width=400" alt="Hidrolavadora" />
                        </div>
                        <div className="card-badge">
                            <Logo width={40} />
                        </div>
                        <div className="card-footer-yellow-banner">Envíos a todo el Perú</div>
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

                        <button onClick={prevSlide} className="slider-arrow prev">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <button onClick={nextSlide} className="slider-arrow next">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
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
                .promo-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: auto auto;
                    gap: 1.5rem;
                }
                .promo-card {
                    position: relative;
                    background: #fff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    display: flex;
                    border: 1px solid #eee;
                }
                .card-small-top {
                    grid-column: span 1;
                    height: 220px;
                }
                .card-large-vertical {
                    grid-column: 3;
                    grid-row: 1 / span 2;
                    height: 100%;
                    flex-direction: column;
                }
                .card-wide-bottom {
                    grid-column: span 2;
                    height: 280px;
                }
                
                .dark-theme { background: #000; color: #fff; border: none; }
                
                /* Info Area */
                .card-info {
                    width: 45%;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    position: relative;
                    z-index: 5;
                }
                .card-info-main {
                    width: 50%;
                    padding: 2.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    z-index: 5;
                }
                .card-large-vertical .card-info-main {
                    width: 100%;
                    padding-bottom: 0;
                }

                /* Price Tags */
                .price-tag { display: flex; align-items: flex-start; margin-bottom: 0.5rem; transform: rotate(-3deg); }
                .price-tag-large { display: flex; align-items: flex-start; margin-bottom: 1rem; transform: rotate(-2deg); }
                .currency { font-size: 1.2rem; font-weight: 800; margin-top: 8px; margin-right: 2px; }
                .price-tag-large .currency { font-size: 2.2rem; font-weight: 900; margin-top: 15px; }
                
                .amount { font-size: 3.5rem; font-weight: 900; line-height: 0.9; color: var(--primary); letter-spacing: -2px; }
                .price-tag-large .amount { font-size: 7.5rem; font-weight: 900; color: #000; letter-spacing: -4px; }
                .dark-theme .amount { color: var(--primary); }
                .card-wide-bottom .amount { font-size: 8.5rem; }

                /* Text */
                .product-name { font-weight: 900; font-size: 0.95rem; line-height: 1.1; text-transform: uppercase; letter-spacing: 0.5px; }
                .product-name span { color: var(--primary); display: block; font-size: 1.2rem; }
                .product-name-large { font-weight: 900; font-size: 2.8rem; line-height: 0.9; text-transform: uppercase; margin-top: -10px; }
                .product-name-large span { font-size: 1.8rem; display: block; color: #666; }

                /* Image Area */
                .card-image {
                    flex: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-right: 1rem;
                }
                .card-image img {
                    max-height: 90%;
                    max-width: 140%;
                    object-fit: contain;
                    transform: scale(1.3) translateX(10%);
                    filter: drop-shadow(0 15px 25px rgba(0,0,0,0.2));
                    transition: 0.4s ease;
                }
                .promo-card:hover .card-image img { transform: scale(1.4) translateX(15%); }
                
                .smaller-img img { transform: scale(1) translateX(5%); }
                
                .card-image-main {
                    flex: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .card-image-main img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    filter: drop-shadow(0 20px 40px rgba(0,0,0,0.15));
                    transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .promo-card:hover .card-image-main img { transform: scale(1.15); }
                
                .card-large-vertical .card-image-main img {
                    transform: scale(1.3) translateY(20px);
                }
                .card-wide-bottom .card-image-main img {
                    transform: scale(1.5) translateX(30px);
                }
                .card-wide-bottom:hover .card-image-main img { transform: scale(1.6) translateX(40px); }

                /* Footer Elements */
                .card-footer-yellow {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    background: var(--primary);
                    color: #000;
                    padding: 6px 20px;
                    font-weight: 900;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    clip-path: polygon(0 0, 90% 0, 100% 100%, 0% 100%);
                }
                .card-footer-yellow-banner {
                    background: var(--primary);
                    color: #000;
                    text-align: center;
                    padding: 12px;
                    font-weight: 900;
                    text-transform: uppercase;
                    font-size: 1.1rem;
                    width: 100%;
                    letter-spacing: 1px;
                }
                .card-badge {
                    position: absolute;
                    top: 25px;
                    right: 25px;
                    background: #000;
                    padding: 10px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }

                @media (max-width: 1200px) {
                    .price-tag-large .amount { font-size: 4rem; }
                    .card-wide-bottom .amount { font-size: 5rem; }
                }

                @media (max-width: 992px) {
                    .promo-grid { 
                        grid-template-columns: 1fr;
                        grid-template-rows: auto;
                    }
                    .card-small-top, .card-large-vertical, .card-wide-bottom { grid-column: span 1; grid-row: auto; height: auto; padding: 2rem 0; }
                    .card-large-vertical { flex-direction: row; }
                    .card-info, .card-info-main { width: 60%; }
                }
                
                @media (max-width: 768px) {
                    .section-title { font-size: 2rem; }
                    .slider-item { flex: 0 0 100%; }
                    .countdown-wrapper { flex-direction: column; gap: 1rem; }
                    .card-info, .card-info-main { width: 100%; text-align: center; align-items: center; }
                    .card-image, .card-image-main { display: none; }
                }

                .section-title { font-size: 2.8rem; font-weight: 900; margin-bottom: 1.5rem; letter-spacing: -1px; }
                
                .countdown-wrapper { display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 4rem; align-items: center; flex-wrap: wrap; }
                .countdown-items { display: flex; gap: 1rem; }
                .countdown-item { display: flex; alignItems: baseline; gap: 6px; }
                .countdown-val { font-size: 1.8rem; fontWeight: 900; color: var(--accent); }
                .countdown-unit { font-size: 0.85rem; fontWeight: 700; color: #888; textTransform: uppercase; }

                .slider-container { position: relative; width: 100%; overflow: hidden; padding: 10px 0; }
                .slider-item { flex: 0 0 25%; padding: 0 10px; }
                .slider-arrow { position: absolute; top: 50%; transform: translateY(-50%); background-color: #fff; border: 1px solid #eee; width: 45px; height: 45px; borderRadius: 50%; display: flex; alignItems: center; justifyContent: center; z-index: 20; box-shadow: 0 4px 12px rgba(0,0,0,0.1); cursor: pointer; }
                .slider-arrow.prev { left: 10px; }
                .slider-arrow.next { right: 10px; }
                
                .progress-bar-bg { width: 100%; height: 2px; backgroundColor: #E5E5E5; margin-top: 4rem; position: relative; }
                .progress-bar-fill { position: absolute; height: 100%; backgroundColor: #000; }
                
                .trust-badges-section { background: var(--primary); padding: 4rem 0; color: #000; }
                .trust-badges-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
                .trust-badge { textAlign: center; }
                .badge-icon { margin-bottom: 1rem; }

                @media (max-width: 992px) {
                    .promo-item { grid-column: span 12; }
                    .slider-item { flex: 0 0 50%; }
                    .trust-badges-grid { grid-template-columns: 1fr; }
                }
                
                @media (max-width: 768px) {
                    .section-title { font-size: 2rem; }
                    .slider-item { flex: 0 0 100%; }
                    .promo-price-large { font-size: 3.5rem; }
                    .countdown-wrapper { flex-direction: column; gap: 1rem; }
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
