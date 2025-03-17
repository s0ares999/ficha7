import React, { useEffect, useState } from "react";
import FilmeService from "../services/FilmeService";
import { Link } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import HeroCarousel from '../components/HeroCarousel';
import GeneroService from '../services/GeneroService';

export default function FilmeList() {
    const [filmes, setFilmes] = useState([]);
    const [generos, setGeneros] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [filmeToDelete, setFilmeToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        carregarFilmes();
        carregarGeneros();
    }, []);

    const carregarFilmes = async () => {
        try {
            setLoading(true);
            const response = await FilmeService.getFilmes();
            setFilmes(response || []);
            console.log('Filmes carregados:', response);
        } catch (error) {
            console.error("Erro ao carregar filmes:", error);
            setError('Erro ao carregar filmes');
        } finally {
            setLoading(false);
        }
    };

    const carregarGeneros = async () => {
        try {
            const data = await GeneroService.getGeneros();
            const generosMap = {};
            data.forEach(genero => {
                generosMap[genero.id] = genero.nome;
            });
            setGeneros(generosMap);
        } catch (error) {
            console.error('Erro ao carregar gêneros:', error);
        }
    };

    const abrirModalExclusao = (filme) => {
        setFilmeToDelete(filme);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirmado = async () => {
        if (!filmeToDelete) return;
        
        try {
            await FilmeService.deleteFilme(filmeToDelete.id);
            setFilmes(prev => prev.filter(f => f.id !== filmeToDelete.id));
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    };

    // Filtrar filmes baseado na busca
    const filteredFilmes = filmes.filter(filme =>
        filme.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        filme.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (generos[filme.genero_id] || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginação
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFilmes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredFilmes.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <>
            {!loading && filmes.length > 0 && (
                <div className="mb-5">
                    <HeroCarousel filmes={filmes} />
                </div>
            )}
            
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">
                        <i className="bi bi-film me-2"></i>
                        Todos os Filmes
                    </h2>
                </div>

                {/* Barra de pesquisa com tema escuro */}
                <div className="search-container mb-4">
                    <div className="position-relative">
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Pesquisar filmes por título, descrição ou gênero..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                borderRadius: "50px",
                                padding: "15px 20px",
                                paddingLeft: "50px",
                                fontSize: "1rem",
                                border: "none",
                                backgroundColor: "#212529", // Cor do bg-dark do Bootstrap
                                color: "#fff",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                transition: "all 0.3s ease"
                            }}
                        />
                        <i 
                            className="bi bi-search position-absolute"
                            style={{
                                left: "20px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#6c757d",
                                fontSize: "1.2rem"
                            }}
                        ></i>
                        {searchTerm && (
                            <div
                                className="btn position-absolute"
                                style={{
                                    right: "15px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#6c757d",
                                    transition: "color 0.3s ease"
                                }}
                                onClick={() => setSearchTerm('')}
                            >
                                <i className="bi bi-x-lg"></i>
                            </div>
                        )}
                    </div>
                </div>

                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-4">
                    {currentItems.map((filme) => (
                        <div key={filme.id} className="col">
                            <div 
                                className="card h-100 shadow-sm border-0 hover-card"
                                style={{
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    borderRadius: "15px",
                                }}
                            >
                                <Link 
                                    to={`/filme/${filme.id}`} 
                                    className="text-decoration-none"
                                >
                                    {filme.foto ? (
                                        <img
                                            src={`http://localhost:3000/uploads/${filme.foto}`}
                                            className="card-img-top"
                                            alt={filme.titulo}
                                            style={{ 
                                                height: '300px', 
                                                objectFit: 'cover',
                                                borderRadius: "15px 15px 0 0"
                                            }}
                                        />
                                    ) : (
                                        <div 
                                            className="card-img-top d-flex align-items-center justify-content-center bg-light"
                                            style={{ height: '300px', borderRadius: "15px 15px 0 0" }}
                                        >
                                            <i className="bi bi-film" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
                                        </div>
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title text-dark mb-2">{filme.titulo}</h5>
                                        <span className="badge bg-primary mb-2">
                                            {generos[filme.genero_id] || 'Carregando...'}
                                        </span>
                                        <p className="card-text text-muted mt-2" style={{ 
                                            fontSize: '0.9rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: '3',
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            minHeight: '4.5em'
                                        }}>
                                            {filme.descricao || 'Sem descrição disponível'}
                                        </p>
                                    </div>
                                </Link>
                                <div className="card-footer bg-transparent border-top-0 pb-3">
                                    <div className="d-flex justify-content-between gap-2">
                                        <Link
                                            to={`/edit/${filme.id}`}
                                            className="btn btn-danger flex-grow-1 shadow-sm"
                                            style={{
                                                borderRadius: "50px",
                                                padding: "8px 20px",
                                                fontWeight: "500",
                                                transition: "all 0.3s ease",
                                                background: "linear-gradient(45deg, #dc3545;,rgb(151, 3, 17);)",
                                                border: "none"
                                            }}
                                        >
                                            <i className="bi bi-pencil-square text-center me-2"></i>
                                            Editar
                                        </Link>
                                        <button
                                            className="btn btn-danger btn-sm rounded-pill"
                                            onClick={() => abrirModalExclusao(filme)}
                                            style={{ 
                                                padding: '0.75rem 1.5rem',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <i className="bi bi-trash3-fill me-1"></i>
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <nav className="mt-5">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link rounded-circle mx-1 shadow-sm"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                            </li>
                            {[...Array(totalPages)].map((_, i) => (
                                <li
                                    key={i + 1}
                                    className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                                >
                                    <button
                                        className="page-link rounded-circle mx-1 shadow-sm"
                                        onClick={() => paginate(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link rounded-circle mx-1 shadow-sm"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>

            <Modal 
                show={showDeleteModal} 
                onHide={() => setShowDeleteModal(false)}
                centered
            >
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Confirmar Exclusão
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="lead">
                        Deseja realmente excluir <strong>"{filmeToDelete?.titulo}"</strong>?
                    </p>
                    <p className="text-muted small">
                        Esta ação removerá permanentemente o registro do sistema.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-outline-secondary btn-lg"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        Cancelar
                    </button>
                    <button
                        className="btn btn-danger btn-lg"
                        onClick={handleDeleteConfirmado}
                        style={{
                            background: '#dc3545',
                            borderColor: '#dc3545',
                            fontWeight: 500
                        }}
                    >
                        <i className="bi bi-trash3-fill me-2"></i>
                        Confirmar Exclusão
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}