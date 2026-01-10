import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    Mail,
    MessageCircle,
    Info,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqSection {
    title: string;
    items: FaqItem[];
}

const FAQ_DATA: FaqSection[] = [
    {
        title: "Compra y Atención al Cliente",
        items: [
            {
                question: "¿Por qué confiar en nosotros?",
                answer: "Contamos con más de 10 años en el mercado peruano, ofreciendo productos de las mejores marcas con garantía oficial y un servicio de atención personalizado."
            },
            {
                question: "¿Puedo comprar si estoy en provincia? ¿Cómo pago?",
                answer: "¡Sí! Realizamos envíos a todo el Perú. Puedes pagar mediante transferencia bancaria (BCP, BBVA, Interbank), Yape, Plin o con cualquier tarjeta de crédito/débito a través de nuestra pasarela segura."
            },
            {
                question: "¿Cómo sé qué producto me conviene más?",
                answer: "Nuestro equipo de asesores técnicos está listo para ayudarte. Puedes contactarnos por WhatsApp o visitarnos en tienda para recibir asesoría experta según tu proyecto."
            }
        ]
    },
    {
        title: "Envíos y Entregas",
        items: [
            {
                question: "¿Realizan envíos a todo el Perú?",
                answer: "Sí, trabajamos con las mejores agencias de transporte (Shalom, Marvisur, Olva Courier) para llegar a cada rincón del país de manera segura y rápida."
            },
            {
                question: "¿Cuánto demora en llegar mi pedido?",
                answer: "Para Lima, entregamos en 24-48 horas. Para provincias, el tiempo estimado es de 2 a 5 días hábiles, dependiendo de la ubicación."
            },
            {
                question: "¿Puedo recoger el producto en tienda?",
                answer: "¡Claro! Al momento de tu compra selecciona 'Recojo en tienda'. Te notificaremos cuando tu pedido esté listo para ser retirado."
            }
        ]
    },
    {
        title: "Garantía y Seguridad",
        items: [
            {
                question: "¿Qué garantía tienen los productos?",
                answer: "Todos los productos eléctricos tienen una garantía mínima de 1 año. Las herramientas manuales cuentan con garantía limitada contra defectos de fábrica."
            },
            {
                question: "¿Cómo sé que me están enviando lo que realmente compré?",
                answer: "Emitimos boleta o factura legal por cada compra. Además, te enviamos el número de seguimiento y fotos de tu paquete antes de ser despachado."
            },
            {
                question: "¿Qué pasa si el producto llega dañado o con fallas?",
                answer: "Contamos con una política de cambios inmediata para productos que lleguen con daños por transporte. Solo debes reportarlo en las primeras 24 horas tras recibirlo."
            }
        ]
    }
];

const AccordionItem: React.FC<{ item: FaqItem }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    padding: '0.5rem 0',
                    cursor: 'pointer',
                    fontSize: '1.05rem',
                    fontWeight: '600',
                    color: '#333'
                }}
            >
                {item.question}
                {isOpen ? <ChevronUp size={20} color="#888" /> : <ChevronDown size={20} color="#888" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <p style={{
                            padding: '1rem 0',
                            color: '#666',
                            lineHeight: '1.6',
                            fontSize: '0.95rem'
                        }}>
                            {item.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const Faq: React.FC = () => {
    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: 'calc(100vh - 150px)', padding: '4rem 0' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '3rem' }}>

                {/* Sidebar */}
                <aside style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
                    <div style={{
                        backgroundColor: '#f5f5f5',
                        padding: '2.5rem',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                    }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1.5rem', color: '#000' }}>
                            Contáctanos
                        </h2>
                        <p style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.6' }}>
                            Si tiene un problema o una pregunta que requiere asistencia inmediata,
                            puede hacer clic en el botón a continuación para enviar un correo a un
                            representante de Servicio al Cliente.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button style={{
                                backgroundColor: '#fff',
                                border: '1px solid #000',
                                padding: '1rem',
                                borderRadius: '99px',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }} className="btn-secondary-outline">
                                Contáctanos
                            </button>

                            <button style={{
                                backgroundColor: '#000',
                                color: '#fff',
                                border: 'none',
                                padding: '1rem',
                                borderRadius: '99px',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}>
                                Sobre nosotros
                            </button>
                        </div>

                        <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid #e0e0e0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                                <div style={{ backgroundColor: 'var(--primary)', padding: '10px', borderRadius: '50%' }}>
                                    <MessageCircle size={20} color="#000" />
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.8rem', color: '#888', display: 'block' }}>WhatsApp</span>
                                    <span style={{ fontWeight: '800' }}>+51 981 182 158</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ backgroundColor: 'var(--primary)', padding: '10px', borderRadius: '50%' }}>
                                    <Mail size={20} color="#000" />
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.8rem', color: '#888', display: 'block' }}>Email</span>
                                    <span style={{ fontWeight: '800' }}>info@ferreteriacarloscc.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main>
                    {FAQ_DATA.map((section, idx) => (
                        <div key={idx} style={{ marginBottom: '4rem' }}>
                            <h3 style={{
                                fontSize: '1.8rem',
                                fontWeight: '900',
                                marginBottom: '1.5rem',
                                color: '#000',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                {section.title}
                            </h3>
                            <div style={{ backgroundColor: '#fff', padding: '0 1rem' }}>
                                {section.items.map((item, i) => (
                                    <AccordionItem key={i} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}

                    <div style={{
                        marginTop: '6rem',
                        padding: '3rem',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: '#000'
                    }}>
                        <div>
                            <h4 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>¿Aún tienes dudas?</h4>
                            <p style={{ fontWeight: '500', opacity: 0.8 }}>Nuestro equipo técnico está listo para ayudarte con tu compra.</p>
                        </div>
                        <button style={{
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            padding: '1rem 2rem',
                            borderRadius: '99px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer'
                        }}>
                            Hablar con un experto <ArrowRight size={18} />
                        </button>
                    </div>
                </main>
            </div>

            <style>{`
                @media (max-width: 992px) {
                    .container {
                        grid-template-columns: 1fr !important;
                        gap: 4rem !important;
                    }
                    aside {
                        position: relative !important;
                        top: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
};
