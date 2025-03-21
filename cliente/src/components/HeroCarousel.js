import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';

export default function HeroCarousel({ filmes }) {
    const filmesComFoto = filmes
        .filter(filme => filme.foto)
        .slice(-5);

    if (filmesComFoto.length === 0) {
        return null;
    }

    return (
        <div className="hero-carousel-container" style={{ marginTop: '1.5rem' }}>
            <div className="hero-carousel-wrapper">
                <Carousel>
                    {filmesComFoto.map((filme) => (
                        <Carousel.Item key={filme.id}>
                            <div className="carousel-image-container">
                                <img
                                    className="d-block w-100"
                                    src={`http://localhost:3000/uploads/${filme.foto}`}
                                    alt={filme.titulo}
                                    style={{
                                        height: '670px',
                                        objectFit: 'cover',
                                        objectPosition: 'center'
                                    }}
                                />
                                <div className="image-overlay"></div>
                            </div>
                            <Carousel.Caption className="carousel-caption-custom">
                                <h3>{filme.titulo}</h3>
                                <p className="mb-3" style={{
                                    fontSize: '1.1rem',
                                    lineHeight: '1.4',
                                    maxWidth: '600px',
                                    margin: '0 auto',
                                    marginLeft: '17rem'
                                }}>
                                    {filme.descricao}
                                </p>
                                <Link
                                    to={`/filme/${filme.id}`}
                                    className="btn btn-danger hero-btn"
                                    style={{
                                        padding: '8px 24px',
                                        fontSize: '0.95rem',
                                        marginTop: '1rem'
                                    }}
                                >
                                    <i className="bi bi-play-fill me-2"></i>
                                    Ver Detalhes
                                </Link>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </div>
    );
}