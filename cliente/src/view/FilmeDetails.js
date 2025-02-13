import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import FilmeService from "../services/FilmeService";

export default function FilmeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [filme, setFilme] = useState(null);
    const [error, setError] = useState('');

    const carregarFilme = useCallback(async () => {
        try {
            const response = await FilmeService.getFilme(id);
            setFilme(response.data);
        } catch (error) {
            setError('Erro ao carregar o filme');
            console.error('Erro:', error);
            navigate("/");
        }
    }, [id, navigate]);

    useEffect(() => {
        carregarFilme();
    }, [carregarFilme]);

    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!filme) return <div>Carregando...</div>;

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="row g-0">
                    <div className="col-md-4">
                        {filme.foto ? (
                            <img
                                src={filme.foto}
                                className="img-fluid rounded-start"
                                alt={filme.titulo}
                                style={{ 
                                    height: '100%',
                                    objectFit: 'cover',
                                    backgroundColor: '#f8f9fa'
                                }}
                            />
                        ) : (
                            <div className="h-100 d-flex align-items-center justify-content-center bg-light">
                                <i className="bi bi-film" style={{ fontSize: '5rem' }}></i>
                            </div>
                        )}
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <h2 className="card-title mb-3">{filme.titulo}</h2>
                                <span className="badge bg-primary">{filme.genero?.descricao}</span>
                            </div>
                            <p className="card-text">{filme.descricao}</p>
                            
                            <div className="mt-4">
                                <Link to={`/edit/${filme.id}`} className="btn btn-primary me-2">
                                    <i className="bi bi-pencil me-2"></i>
                                    Editar Filme
                                </Link>
                                <Link to="/" className="btn btn-secondary">
                                    <i className="bi bi-arrow-left me-2"></i>
                                    Voltar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 