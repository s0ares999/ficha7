import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import FilmeService from "../services/FilmeService";
import SwalUtil from "../utils/SwalUtil";


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
            
            // Usar SwalUtil para mostrar o erro
            SwalUtil.error(
                'Erro ao carregar filme', 
                'Não foi possível carregar os detalhes do filme solicitado.',
                () => navigate("/")
            );
        }
    }, [id, navigate]);

    useEffect(() => {
        carregarFilme();
    }, [carregarFilme]);

    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!filme) return <div>Carregando...</div>;

    return (
        <div className="container py-5">
            <div className="card border-0 shadow-lg overflow-hidden">
                <div className="row g-0">
                    {/* Seção da Imagem */}
                    <div className="col-lg-5 position-relative">
                        {filme.foto ? (
                            <img
                                src={`http://localhost:3000/uploads/${filme.foto}`}
                                className="img-fluid h-100 object-fit-cover"
                                alt={filme.titulo}
                                style={{ minHeight: '65vh' }}
                            />
                        ) : (
                            <div className="h-100 d-flex align-items-center justify-content-center bg-light">
                                <i className="bi bi-film display-4 text-muted"></i>
                            </div>
                        )}
                    </div>

                    {/* Seção de Conteúdo */}
                    <div className="col-lg-7">
                        <div className="card-body p-4 p-xl-5">
                            {/* Cabeçalho */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <h1 className="display-4 text-white fw-bold mb-0">{filme.titulo}</h1>
                                    <span className="badge bg-primary fs-5 rounded-pill">
                                        {filme.genero?.descricao}
                                    </span>
                                </div>
                                <div className="d-flex align-items-center gap-3 text-muted">
                                    <span className="d-flex align-items-center">
                                        <i className="bi bi-calendar3 me-2"></i>
                                        {filme.anoLancamento}
                                    </span>
                                    <span className="d-flex align-items-center">
                                        <i className="bi bi-clock me-2"></i>
                                        2h 15min
                                    </span>
                                </div>
                            </div>

                            {/* Sinopse */}
                            <div className="mb-5">
                                <h3 className="h4 text-primary mb-3 text-white">Sinopse</h3>
                                <p className="fs-5 lh-lg" style={{ color: '#495057' }}>
                                    {filme.descricao}
                                </p>
                            </div>

                            {/* Detalhes Técnicos */}
                            <div className="row row-cols-2 row-cols-md-3 g-4 mb-5">
                                <div className="col">
                                    <div className="p-3 text-white bg-grey shadow rounded">
                                        <div className="text-muted small mb-2">Direção</div>
                                        <div className="fw-medium">Nome do Diretor</div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="p-3 text-white bg-grey shadow rounded">
                                        <div className="text-muted small mb-2">Elenco</div>
                                        <div className="fw-medium">Ator 1, Ator 2</div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="p-3 text-white bg-grey shadow rounded">
                                        <div className="text-muted small mb-2">Classificação</div>
                                        <div className="fw-medium">16 anos</div>
                                    </div>
                                </div>
                            </div>

                            {/* Ações */}
                            <div className="d-flex gap-3">
                                <Link
                                    to={`/edit/${filme.id}`}
                                    className="btn btn-primary btn-lg px-4 py-3 d-inline-flex align-items-center"
                                >
                                    <i className="bi bi-pencil fs-5 me-2"></i>
                                    Editar Filme
                                </Link>
                                <Link
                                    to="/"
                                    className="btn btn-outline-secondary btn-lg px-4 py-3 d-inline-flex align-items-center"
                                >
                                    <i className="bi bi-arrow-left fs-5 me-2"></i>
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