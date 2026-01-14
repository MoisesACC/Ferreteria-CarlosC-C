import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Target, Rocket, History, Briefcase, TrendingUp, Heart } from 'lucide-react';

export const AboutUs: React.FC = () => {
    return (
        <div style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', overflow: 'hidden' }}>
            {/* Hero Section */}
            <section style={{
                position: 'relative',
                height: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://png.pngtree.com/background/20231016/original/pngtree-d-illustration-of-diverse-construction-tools-screwdriver-level-electrical-tape-hammer-picture-image_5579557.jpg") center/cover fixed'
            }}>
                <div style={{ textAlign: 'center', maxWidth: '800px', padding: '0 2rem' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '900', color: 'var(--primary)', marginBottom: '1.5rem' }}
                    >
                        NUESTRA HISTORIA
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: '1.2rem', color: '#fff', opacity: 0.9, lineHeight: '1.6' }}
                    >
                        Desde un pequeño taller hasta convertirnos en el aliado estratégico de la construcción en el Perú.
                    </motion.p>
                </div>
            </section>

            {/* Story Timeline Section */}
            <section style={{ padding: '8rem 5%' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>Cómo Empezamos</h2>
                        <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--primary)', margin: '0 auto' }}></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
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
            <section style={{ backgroundColor: 'rgba(253, 185, 19, 0.05)', padding: '8rem 5%' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-card"
                            style={{ padding: '3rem', textAlign: 'center' }}
                        >
                            <Target size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Nuestra Misión</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                Proveer las mejores herramientas y materiales de construcción, facilitando el desarrollo de proyectos con productos de alta calidad y un servicio especializado que supere las expectativas.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-card"
                            style={{ padding: '3rem', textAlign: 'center' }}
                        >
                            <TrendingUp size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Nuestra Visión</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                Ser la ferretería e-commerce líder en el Perú, reconocida por nuestra innovación tecnológica, logística impecable y el compromiso inquebrantable con el éxito de nuestros clientes.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-card"
                            style={{ padding: '3rem', textAlign: 'center' }}
                        >
                            <Heart size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Nuestros Valores</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                Honestidad, responsabilidad, trabajo en equipo y excelencia en el servicio son los pilares que nos han permitido crecer y ganar la confianza de miles de peruanos.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={{ padding: '8rem 5%', backgroundColor: '#000', color: '#fff' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', textAlign: 'center' }}>
                        <div>
                            <h4 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '0.5rem' }}>25+</h4>
                            <p style={{ opacity: 0.7, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Años de Experiencia</p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '0.5rem' }}>10k+</h4>
                            <p style={{ opacity: 0.7, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Clientes Felices</p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '0.5rem' }}>500+</h4>
                            <p style={{ opacity: 0.7, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Marcas Aliadas</p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '0.5rem' }}>24h</h4>
                            <p style={{ opacity: 0.7, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Envíos Rápidos</p>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .story-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 5rem;
                    align-items: center;
                }
                .story-row.reverse {
                    direction: rtl;
                }
                .story-row.reverse .story-content {
                    direction: ltr;
                }
                .story-content {
                    padding: 2rem;
                }
                .year-badge {
                    display: inline-block;
                    background: var(--primary);
                    color: #000;
                    padding: 5px 20px;
                    border-radius: 4px;
                    font-weight: 900;
                    font-size: 1.2rem;
                    margin-bottom: 2rem;
                }
                .story-content h3 {
                    font-size: 2.2rem;
                    font-weight: 900;
                    margin-bottom: 1.5rem;
                }
                .story-content p {
                    font-size: 1.1rem;
                    line-height: 1.8;
                    color: var(--text-muted);
                }
                .story-image {
                    height: 400px;
                    background-size: cover;
                    background-position: center;
                    border-radius: 24px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.1);
                }

                @media (max-width: 992px) {
                    .story-row {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                        text-align: center;
                    }
                    .story-row.reverse {
                        direction: ltr;
                    }
                    .story-image {
                        order: 2;
                        height: 300px;
                    }
                    .story-content {
                        order: 1;
                    }
                }
            `}</style>
        </div>
    );
};
