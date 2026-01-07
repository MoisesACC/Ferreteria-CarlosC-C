import React from 'react';

const brands = [
    { name: 'Truper', logo: 'https://carpintec.com.pe/cdn/shop/collections/HERRAMIENTAS_DE_CARPINTERIA_TRUPER_1080x1080.jpg?v=1738016775', bgColor: '#2D3233' },
    { name: 'Dong Cheng', logo: 'https://www.dongcheng.com.ar/wp-content/uploads/2013/06/Logo-DongCheng-13.jpg', bgColor: '#0057A0' },
    { name: 'Ferton', logo: 'https://ferreteriaspacco.com/cdn/shop/collections/LG-FERTON.jpg?v=1747035911&width=185', bgColor: '#000' },
    { name: 'Hermex', logo: 'https://ferreteriaspacco.com/cdn/shop/collections/LG-HERMEX.jpg?v=1747035898&width=185', bgColor: '#000' },
    { name: 'Makute', logo: 'https://ferreteriaspacco.com/cdn/shop/collections/LG-MAKUTE-150x150.jpg?v=1747035877&width=300', bgColor: '#01418F' },
    { name: 'Uyustools', logo: 'https://ferreteriaspacco.com/cdn/shop/collections/LG-UYUSTOOLS.jpg?v=1747035923&width=300', bgColor: '#FDB913' },
];

export const BrandsSection: React.FC = () => {
    return (
        <section style={{ padding: '5rem 0 3rem', textAlign: 'center', backgroundColor: '#fff' }}>
            <h2 className="brands-title">Las Mejores Marcas para Tus Proyectos</h2>

            <div className="container brands-container">
                <div className="brands-scroll-wrapper">
                    {brands.map((brand, idx) => (
                        <div key={idx} className="brand-card">
                            <div className="brand-circle" style={{ backgroundColor: brand.bgColor }}>
                                <img src={brand.logo} alt={brand.name} className="brand-img" />
                            </div>
                            <span className="brand-name">{brand.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* PACCO Style Pagination Dots */}
            <div className="pagination-dots">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className={`dot ${i === 0 ? 'active' : ''}`}
                    />
                ))}
            </div>

            <style>{`
                .brands-title {
                    font-size: 2.5rem;
                    font-weight: 900;
                    margin-bottom: 4rem;
                    letter-spacing: -1.5px;
                    color: #000;
                    padding: 0 1rem;
                }
                .brands-container {
                    overflow-x: hidden;
                    padding: 10px 0;
                }
                .brands-scroll-wrapper {
                    display: flex;
                    justify-content: center;
                    gap: 2.5rem;
                }
                .brand-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.2rem;
                    flex-shrink: 0;
                }
                .brand-circle {
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
                    transition: transform 0.3s;
                    cursor: pointer;
                    overflow: hidden;
                }
                .brand-circle:hover {
                    transform: scale(1.05);
                }
                .brand-img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    filter: brightness(1.1);
                }
                .brand-name {
                    font-weight: 800;
                    font-size: 1.1rem;
                    color: #333;
                }

                .pagination-dots {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    margin-top: 4rem;
                    align-items: center;
                }
                .dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: #ccc;
                    transition: 0.3s;
                }
                .dot.active {
                    background-color: #000;
                    transform: scale(1.2);
                }

                @media (max-width: 992px) {
                    .brands-scroll-wrapper {
                        justify-content: flex-start;
                        padding-left: 2rem;
                        gap: 2rem;
                        overflow-x: auto;
                        scrollbar-width: none;
                    }
                    .brands-scroll-wrapper::-webkit-scrollbar { display: none; }
                    .brand-circle { width: 110px; height: 110px; }
                    .brands-title { font-size: 1.8rem; margin-bottom: 2.5rem; }
                    .brand-name { font-size: 0.9rem; }
                }
            `}</style>
        </section>
    );
};
