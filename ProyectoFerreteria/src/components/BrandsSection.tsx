import React from 'react';

const brands = [
    { name: 'Hermex', logo: 'https://ferreteriaspacco.com/cdn/shop/collections/LG-HERMEX.jpg?v=1747035898&width=185', bgColor: '#000' },
    { name: 'R-umi', logo: 'https://ferreteriaspacco.com/cdn/shop/collections/LG-RUMI1.jpg?v=1747035887&width=185', bgColor: '#fff' },
    { name: 'Makute', logo: 'https://ferreteriaspacco.com/cdn/shop/collections/LG-MAKUTE-150x150.jpg?v=1747035877&width=185', bgColor: '#01418F' },
    { name: 'Truper', logo: 'https://cdn.worldvectorlogo.com/logos/truper-1.svg', bgColor: '#2D3233' },
    { name: 'Dong Cheng', logo: 'https://ferreteriaspacco.com/cdn/shop/collections/LG-DONG-CHENG.jpg?v=1747035933&width=185', bgColor: '#0057A0' },
    { name: 'Ferton', logo: 'https://ferreteriaspacco.com/cdn/shop/collections/LG-FERTON.jpg?v=1747035911&width=185', bgColor: '#000' },
    { name: 'Uyustools', logo: 'https://ferreteriaspacco.com/cdn/shop/collections/LG-UYUSTOOLS.jpg?v=1747035923&width=185', bgColor: '#FDB913' },
];

export const BrandsSection: React.FC = () => {
    return (
        <section style={{ padding: '4rem 0 2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '3rem', letterSpacing: '-1px' }}>Las Mejores Marcas para Tus Proyectos</h2>

            <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', alignItems: 'center', flexWrap: 'nowrap' }}>
                {brands.map((brand, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', flex: '0 0 auto' }}>
                        <div style={{
                            width: '110px',
                            height: '110px',
                            borderRadius: '50%',
                            backgroundColor: brand.bgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            border: brand.bgColor === '#fff' ? '1px solid #eee' : 'none'
                        }}
                            className="brand-circle-item"
                        >
                            <img src={brand.logo} alt={brand.name} style={{
                                width: '100%',
                                height: '110px',
                                objectFit: 'contain',
                                filter: brand.bgColor === '#000' || brand.bgColor === '#01418F' || brand.bgColor === '#0057A0' || brand.bgColor === '#2D3233' ? 'brightness(1.5)' : 'none'
                            }} />
                        </div>
                        <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#444' }}>{brand.name}</span>
                    </div>
                ))}
            </div>

            {/* Pagination Dots Indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '4rem', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
                    <div key={i} style={{
                        width: i === 4 ? '12px' : '6px',
                        height: i === 4 ? '12px' : '6px',
                        borderRadius: '50%',
                        backgroundColor: i === 4 ? '#000' : '#ccc',
                        border: i === 4 ? '4px solid #fff' : 'none',
                        boxShadow: i === 4 ? '0 0 0 1px #ccc' : 'none',
                        transition: '0.3s'
                    }}></div>
                ))}
            </div>

            <style>{`
                .brand-circle-item:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
                }
            `}</style>
        </section>
    );
};
