import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    Mail,
    MessageCircle,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Faq.css';

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
        <div className="accordion-item">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="accordion-btn"
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
                        className="accordion-content"
                    >
                        <p className="accordion-text">
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
        <div className="faq-page">
            <div className="container faq-layout">

                {/* Sidebar */}
                <aside className="faq-sidebar">
                    <div className="contact-card">
                        <h2 className="contact-title">
                            Contáctanos
                        </h2>
                        <p className="contact-desc">
                            Si tiene un problema o una pregunta que requiere asistencia inmediata,
                            puede hacer clic en el botón a continuación para enviar un correo a un
                            representante de Servicio al Cliente.
                        </p>

                        <div className="contact-actions">
                            <button className="btn-contact-outline">
                                Contáctanos
                            </button>

                            <button className="btn-contact-dark">
                                Sobre nosotros
                            </button>
                        </div>

                        <div className="contact-info">
                            <div className="info-row">
                                <div className="icon-circle">
                                    <MessageCircle size={20} color="#000" />
                                </div>
                                <div>
                                    <span className="info-label">WhatsApp</span>
                                    <span className="info-value">+51 981 182 158</span>
                                </div>
                            </div>
                            <div className="info-row">
                                <div className="icon-circle">
                                    <Mail size={20} color="#000" />
                                </div>
                                <div>
                                    <span className="info-label">Email</span>
                                    <span className="info-value">info@ferreteriacarloscc.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main>
                    {FAQ_DATA.map((section, idx) => (
                        <div key={idx} className="faq-section">
                            <h3 className="faq-section-title">
                                {section.title}
                            </h3>
                            <div className="faq-list">
                                {section.items.map((item, i) => (
                                    <AccordionItem key={i} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="cta-box">
                        <div>
                            <h4 className="cta-title">¿Aún tienes dudas?</h4>
                            <p className="cta-subtitle">Nuestro equipo técnico está listo para ayudarte con tu compra.</p>
                        </div>
                        <button className="btn-cta-dark">
                            Hablar con un experto <ArrowRight size={18} />
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};
