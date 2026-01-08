import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        image: "https://ferreteriaspacco.com/cdn/shop/files/ASPIRADORAS-UYUSTOOLS_4b61cfad-0186-4f10-a4a7-c39a258b1c75.png?v=1760422428&width=1920", // Reemplazar con la imagen real de la duplicadora
        title: "Duplicadora de Llaves",
        link: "/productos"
    },
    {
        id: 2,
        image: "https://ferreteriaspacco.com/cdn/shop/files/SIERRA-DE-MESA-UYUS.png?v=1762547861&width=1920", // Reemplazar con la imagen real de las aspiradoras
        title: "Aspiradoras Industriales",
        link: "/productos"
    },
    {
        id: 3,
        image: "https://ferreteriaspacco.com/cdn/shop/files/DUPLICADORA-DE-LLAVES-F001.png?v=1761418287&width=1920", // Reemplazar con la imagen real de la sierra de mesa
        title: "Sierra de Mesa 10\"",
        link: "/productos"
    }
];

export const HeroSlider: React.FC = () => {
    const [current, setCurrent] = React.useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

    const next = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    React.useEffect(() => {
        if (!isAutoPlaying) return;
        const timer = setInterval(next, 3000);
        return () => clearInterval(timer);
    }, [isAutoPlaying]);

    return (
        <div
            className="hero-slider-v2"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="full-slide"
                >
                    <img
                        src={slides[current].image}
                        alt={slides[current].title}
                        className="hero-full-img"
                    />
                    <div className="container slide-overlay">
                        <motion.a
                            href={slides[current].link}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="banner-cta-overlay"
                        >
                            Ver Oferta
                        </motion.a>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button className="nav-btn prev" onClick={prev} aria-label="Anterior">
                <ChevronLeft size={30} />
            </button>
            <button className="nav-btn next" onClick={next} aria-label="Siguiente">
                <ChevronRight size={30} />
            </button>

            {/* Pagination Dots */}
            <div className="hero-dots">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        className={`hero-dot ${i === current ? 'active' : ''}`}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>

            <style>{`
                .hero-slider-v2 {
                    position: relative;
                    width: 100%;
                    height: 730px;
                    background-color: #000;
                    overflow: hidden;
                }
                .full-slide {
                    width: 100%;
                    height: 100%;
                    position: relative;
                }
                .hero-full-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .slide-overlay {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: flex-end;
                    justify-content: flex-start;
                    padding-bottom: 60px;
                    pointer-events: none;
                }
                .banner-cta-overlay {
                    pointer-events: auto;
                    background: var(--primary);
                    color: #000;
                    padding: 14px 45px;
                    border-radius: 99px;
                    font-weight: 850;
                    text-transform: uppercase;
                    text-decoration: none;
                    font-size: 1rem;
                    box-shadow: 0 10px 25px rgba(255,204,0,0.3);
                    transition: all 0.3s;
                }
                .banner-cta-overlay:hover {
                    transform: translateY(-5px);
                    background: #fff;
                    box-shadow: 0 15px 30px rgba(255,255,255,0.4);
                }

                .nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(0,0,0,0.3);
                    color: #fff;
                    border: none;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 10;
                    backdrop-filter: blur(8px);
                    transition: all 0.3s;
                }
                .nav-btn:hover {
                    background: var(--primary);
                    color: #000;
                }
                .nav-btn.prev { left: 30px; }
                .nav-btn.next { right: 30px; }

                .hero-dots {
                    position: absolute;
                    bottom: 25px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 12px;
                    z-index: 10;
                }
                .hero-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: 2px solid #fff;
                    background: transparent;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .hero-dot.active {
                    background: var(--primary);
                    border-color: var(--primary);
                    width: 35px;
                    border-radius: 10px;
                }

                @media (max-width: 768px) {
                    .hero-slider-v2 { height: 300px; }
                    .nav-btn { display: none; }
                    .hero-dot { width: 10px; height: 10px; }
                    .hero-dot.active { width: 25px; }
                    .banner-cta-overlay { padding: 10px 25px; font-size: 0.8rem; }
                    .slide-overlay { padding-bottom: 40px; }
                }

                @media (max-width: 1200px) {
                    .hero-full-img {
                        object-fit: cover;
                    }
                }
            `}</style>
        </div>
    );
};
