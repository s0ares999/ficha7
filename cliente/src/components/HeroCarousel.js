import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';

export default function HeroCarousel({ filmes }) {
    // Pegar apenas os 5 primeiros filmes que têm foto
    const filmesComFoto = filmes
        .filter(filme => filme.foto)
        .slice(0, 5);

    if (filmesComFoto.length === 0) {
        return null;
    }

    return (
        <div className="hero-carousel-container mt-4">
            <Carousel className="mb-5">
                {filmesComFoto.map((filme) => (
                    <Carousel.Item key={filme.id}>
                        <img
                            className="d-block w-100"
                            src={`http://localhost:3000/uploads/${filme.foto}`}
                            alt={filme.titulo}
                            style={{
                                height: '400px',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                borderRadius: '15px'
                            }}
                        />
                        <Carousel.Caption 
                            className="carousel-caption-custom"
                            style={{
                                background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.8))',
                                borderRadius: '0 0 15px 15px'
                            }}
                        >
                            <h3>{filme.titulo}</h3>
                            <p>{filme.descricao}</p>
                            <Link to={`/filme/${filme.id}`} className="btn btn-primary btn-lg">
                                Ver Detalhes
                            </Link>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
} 