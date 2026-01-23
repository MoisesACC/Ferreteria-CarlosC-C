import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Heart } from 'lucide-react';
import '../styles/AboutUs.css';

export const AboutUs: React.FC = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="hero-content">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hero-title"
                    >
                        NUESTRA HISTORIA
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hero-subtitle"
                    >
                        Desde un pequeño taller hasta convertirnos en el aliado estratégico de la construcción en el Perú.
                    </motion.p>
                </div>
            </section>

            {/* Story Timeline Section */}
            <section className="timeline-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Cómo Empezamos</h2>
                        <div className="section-underline"></div>
                    </div>

                    <div className="timeline-container">
                        {/* 1995: The Beginning */}
                        <div className="story-row">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="story-content"
                            >
                                <div className="year-badge">1995</div>
                                <h3>El Humilde Comienzo</h3>
                                <p>
                                    Carlos C&C nació en un pequeño local de apenas 20 metros cuadrados en el corazón del Rímac. Con apenas una caja de herramientas básicas y mucha determinación, nuestro fundador, el Sr. Carlos, comenzó ofreciendo servicios de reparación y venta minorista a los vecinos del barrio.
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="story-image"
                                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1513467655676-561b7d489a88?q=80&w=1932&auto=format&fit=crop")' }}
                            ></motion.div>
                        </div>

                        {/* 2010: Growth */}
                        <div className="story-row reverse">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="story-content"
                            >
                                <div className="year-badge">2010</div>
                                <h3>Expansión y Confianza</h3>
                                <p>
                                    Gracias a la calidad del servicio y la honestidad en cada venta, la demanda creció. Nos trasladamos a un local más amplio e introdujimos marcas internacionales por primera vez. Fue el año donde dejamos de ser "la ferretería del barrio" para convertirnos en un proveedor industrial confiable.
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="story-image"
                                style={{ backgroundImage: 'url("https://st2.depositphotos.com/1003098/5745/i/450/depositphotos_57459297-stock-photo-young-vendor-welcoming-at-hardware.jpg")' }}
                            ></motion.div>
                        </div>

                        {/* Present */}
                        <div className="story-row">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="story-content"
                            >
                                <div className="year-badge">HOY</div>
                                <h3>Liderazgo Digital</h3>
                                <p>
                                    Hoy, Carlos C&C es una empresa multicanal que atiende a todo el territorio nacional. Hemos digitalizado nuestra experiencia para estar más cerca de nuestros clientes, manteniendo siempre los mismos valores de aquel pequeño local de 1995: honestidad, calidad y pasión por lo que hacemos.
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="story-image"
                                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop")' }}
                            ></motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section">
                <div className="container">
                    <div className="values-grid">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-card value-card"
                        >
                            <Target size={48} color="var(--primary)" className="value-icon" />
                            <h3 className="value-title">Nuestra Misión</h3>
                            <p className="value-text">
                                Proveer las mejores herramientas y materiales de construcción, facilitando el desarrollo de proyectos con productos de alta calidad y un servicio especializado que supere las expectativas.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-card value-card"
                        >
                            <TrendingUp size={48} color="var(--primary)" className="value-icon" />
                            <h3 className="value-title">Nuestra Visión</h3>
                            <p className="value-text">
                                Ser la ferretería e-commerce líder en el Perú, reconocida por nuestra innovación tecnológica, logística impecable y el compromiso inquebrantable con el éxito de nuestros clientes.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-card value-card"
                        >
                            <Heart size={48} color="var(--primary)" className="value-icon" />
                            <h3 className="value-title">Nuestros Valores</h3>
                            <p className="value-text">
                                Honestidad, responsabilidad, trabajo en equipo y excelencia en el servicio son los pilares que nos han permitido crecer y ganar la confianza de miles de peruanos.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div>
                            <h4 className="stat-number">25+</h4>
                            <p className="stat-label">Años de Experiencia</p>
                        </div>
                        <div>
                            <h4 className="stat-number">10k+</h4>
                            <p className="stat-label">Clientes Felices</p>
                        </div>
                        <div>
                            <h4 className="stat-number">500+</h4>
                            <p className="stat-label">Marcas Aliadas</p>
                        </div>
                        <div>
                            <h4 className="stat-number">24h</h4>
                            <p className="stat-label">Envíos Rápidos</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
