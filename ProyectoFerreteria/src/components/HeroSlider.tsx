import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: "DUPLICADORA DE LLAVES",
        subtitle: "Duplica llaves de Casa, Candado, Moto, Auto",
        image: "https://www.keymachine.com.tw/es/productpic/pb_y3ip1544430898.jpg",
        bgColor: "#000000",
        price: 849,
        oldPrice: 950,
        highlightColor: "#FDB913"
    },
    {
        id: 2,
        title: "ASPIRADORA INDUSTRIAL",
        subtitle: "Potencia de succión superior para talleres",
        image: "https://media.falabella.com/falabellaPE/129658315_1/w=400,h=400,fit=cover",
        bgColor: "#000000",
        price: 269,
        oldPrice: 315,
        highlightColor: "#FDB913"
    }
];

export const HeroSlider: React.FC = () => {
    const [current, setCurrent] = React.useState(0);

    const next = () => setCurrent((current + 1) % slides.length);
    const prev = () => setCurrent((current - 1 + slides.length) % slides.length);

    return (
        <div className="hero-slider" style={{ position: 'relative', backgroundColor: slides[current].bgColor, overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="hero-slide-content"
                >
                    <div className="container hero-grid">
                        {/* Image Section - Left on desktop, left part on mobile */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="hero-image-wrapper"
                        >
                            {/* Decorative yellow shape behind image on mobile/desktop */}
                            <div className="hero-shape" />
                            <img src={slides[current].image} alt={slides[current].title} className="hero-img" />
                        </motion.div>

                        {/* Info Section - Right side */}
                        <div className="hero-text-container">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="price-info"
                            >
                                <span className="old-price">Antes: S/{slides[current].oldPrice}</span>
                                <div className="current-price-row">
                                    <span className="currency">S/</span>
                                    <span className="price-val">{slides[current].price}</span>
                                </div>
                                <div className="price-underline" />
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="title-info"
                            >
                                <h2 className="slide-title">{slides[current].title} 🔑</h2>
                                <p className="slide-subtitle">{slides[current].subtitle}</p>
                            </motion.div>

                            <motion.button
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="comprar-btn"
                            >
                                Comprar
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Pagination Controls Desktop */}
            <button className="slider-nav prev" onClick={prev}><ChevronLeft /></button>
            <button className="slider-nav next" onClick={next}><ChevronRight /></button>

            <style>{`
                .hero-slider {
                    height: 500px;
                    display: flex;
                    align-items: center;
                }
                .hero-slide-content {
                    width: 100%;
                    height: 100%;
                }
                .hero-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    height: 100%;
                    align-items: center;
                    gap: 2rem;
                    position: relative;
                }
                .hero-image-wrapper {
                    position: relative;
                    height: 90%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .hero-shape {
                    position: absolute;
                    left: 0;
                    top: 10%;
                    width: 80%;
                    height: 80%;
                    background-color: #FDB913;
                    z-index: 1;
                    border-radius: 0 50px 50px 0;
                }
                .hero-img {
                    height: 100%;
                    max-width: 100%;
                    object-fit: contain;
                    z-index: 2;
                    position: relative;
                    filter: drop-shadow(0 20px 30px rgba(0,0,0,0.5));
                }
                .hero-text-container {
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    z-index: 3;
                }
                .old-price {
                    font-size: 1.2rem;
                    text-decoration: line-through;
                    opacity: 0.8;
                    font-weight: 600;
                }
                .current-price-row {
                    display: flex;
                    align-items: flex-start;
                    line-height: 1;
                    margin-top: 5px;
                }
                .currency {
                    font-size: 2.5rem;
                    font-weight: 900;
                    margin-top: 10px;
                }
                .price-val {
                    font-size: 7rem;
                    font-weight: 950;
                    color: #FDB913;
                    letter-spacing: -4px;
                }
                .price-underline {
                    height: 6px;
                    background: #FDB913;
                    width: 280px;
                    margin-top: -5px;
                }
                .slide-title {
                    font-size: 1.8rem;
                    font-weight: 900;
                    width: 280px;
                    line-height: 1.1;
                    margin-bottom: 0.5rem;
                }
                .slide-subtitle {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #FDB913;
                    max-width: 300px;
                    line-height: 1.3;
                }
                .comprar-btn {
                    background: #000;
                    color: #fff;
                    border: 2px solid #fff;
                    padding: 12px 60px;
                    border-radius: 99px;
                    font-size: 1.3rem;
                    font-weight: 800;
                    cursor: pointer;
                    width: fit-content;
                    transition: all 0.3s;
                }
                .comprar-btn:hover {
                    background: #fff;
                    color: #000;
                }

                .slider-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255,255,255,0.1);
                    color: #fff;
                    border: none;
                    padding: 12px;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 10;
                    backdrop-filter: blur(5px);
                }
                .slider-nav:hover { background: #FDB913; color: #000; }
                .prev { left: 20px; }
                .next { right: 20px; }

                @media (max-width: 768px) {
                    .hero-slider { height: 420px; }
                    .hero-grid { gap: 0.5rem; }
                    .hero-shape { width: 90%; }
                    .price-val { font-size: 5rem; }
                    .currency { font-size: 1.8rem; }
                    .price-underline { width: 140px; }
                    .slide-title { font-size: 1.3rem; width: 150px; }
                    .slide-subtitle { font-size: 0.75rem; width: 150px; }
                    .comprar-btn { padding: 10px 30px; font-size: 1rem; }
                    .old-price { font-size: 0.9rem; }
                    .slider-nav { display: none; }
                }
            `}</style>
        </div>
    );
};
