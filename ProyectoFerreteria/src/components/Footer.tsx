import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
    return (
        <footer style={{ backgroundColor: '#000', color: '#fff', padding: '6rem 0 2rem' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>

                    {/* Brand and Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Logo width={220} variant="dark" />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#ccc', fontSize: '0.95rem' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <Clock size={20} style={{ color: '#FFCC00', flexShrink: 0 }} />
                                <div>
                                    <p style={{ fontWeight: '700', color: '#fff' }}>Horario de atención</p>
                                    <p>Lunes a Viernes 09:00am a 06:00pm</p>
                                    <p>Sábado 12:30pm a 06:00pm</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <MapPin size={20} style={{ color: '#FFCC00', flexShrink: 0 }} />
                                <p>Dir: Jr. Mariscal Las Heras 437 Of 101</p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <Phone size={20} style={{ color: '#FFCC00', flexShrink: 0 }} />
                                <p>+51 981 182 158</p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <Mail size={20} style={{ color: '#FFCC00', flexShrink: 0 }} />
                                <p>info@ferreteriacarloscc.com</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}>
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '2rem', borderBottom: '2px solid #FFCC00', width: 'fit-content', paddingBottom: '5px' }}>Categorías</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#ccc' }}>
                            {['Herramientas Eléctricas', 'Equipos de Limpieza', 'Herramientas Manuales', 'Seguridad Industrial', 'Ferretería General'].map(cat => (
                                <Link key={cat} to="/productos" style={{ textDecoration: 'none', color: 'inherit', transition: '0.3s' }} className="footer-link">{cat}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '2rem', borderBottom: '2px solid #FFCC00', width: 'fit-content', paddingBottom: '5px' }}>Enlaces Rápidos</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#ccc' }}>
                            {['Nosotros', 'Mi Cuenta', 'Mis Pedidos', 'Términos y Condiciones', 'Políticas de Envío'].map(link => (
                                <Link key={link} to="/" style={{ textDecoration: 'none', color: 'inherit', transition: '0.3s' }} className="footer-link">{link}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Reclamos */}
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '2rem' }}>Libro de Reclamaciones</h4>
                        <a href="#">
                            <img src="https://ferreteriaspacco.com/cdn/shop/files/libro-de-reclamaciones.png?v=1711656842&width=200" alt="Libro de Reclamaciones" style={{ width: '180px', filter: 'brightness(0) invert(1)' }} />
                        </a>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #222', paddingTop: '2rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                    <p>© 2025 Ferreterías Carlos C&C. Todos los Derechos Reservados.</p>
                </div>
            </div>

            <style>{`
                .footer-link:hover { color: #FFCC00 !important; transform: translateX(5px); }
            `}</style>
        </footer>
    );
};
