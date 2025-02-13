import React, { useEffect, useState } from "react";
import FilmeService from "../services/FilmeService";
import { Link } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';

export default function FilmeList() {
    const [filmes, setFilmes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [filmeToDelete, setFilmeToDelete] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarFilmes();
    }, []);

    const carregarFilmes = async () => {
        try {
            setLoading(true);
            const response = await FilmeService.getFilmes();
            setFilmes(response.data);
        } catch (error) {
            console.error("Erro ao carregar filmes:", error);
            alert("Erro ao carregar filmes!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await FilmeService.deleteFilme(filmeToDelete.id);
            setShowDeleteModal(false);
            carregarFilmes();
            alert("Filme deletado com sucesso!");
        } catch (error) {
            console.error("Erro ao deletar filme:", error);
            alert("Erro ao deletar filme!");
        }
    };

    const confirmDelete = (filme) => {
        setFilmeToDelete(filme);
        setShowDeleteModal(true);
    };

    // Filtrar filmes baseado na busca
    const filteredFilmes = filmes.filter(filme =>
        filme.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        filme.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginação
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFilmes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredFilmes.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col">
                    <h2>Lista de Filmes</h2>
                </div>
                <div className="col-auto">
                    <Link to="/create" className="btn btn-primary">
                        Novo Filme
                    </Link>
                </div>
            </div>

            {/* Barra de busca */}
            <div className="row mb-4">
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar filmes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {currentItems.map((filme) => (
                            <div key={filme.id} className="col">
                                <div className="card h-100">
                                    {filme.foto && (
                                        <img
                                            src={filme.foto}
                                            className="card-img-top"
                                            alt={filme.titulo}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{filme.titulo}</h5>
                                        <p className="card-text">{filme.descricao}</p>
                                        <p className="card-text">
                                            <small className="text-muted">
                                                Gênero: {filme.genero?.descricao}
                                            </small>
                                        </p>
                                    </div>
                                    <div className="card-footer bg-transparent border-top-0">
                                        <div className="d-flex justify-content-between">
                                            <Link
                                                to={`/edit/${filme.id}`}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(filme)}
                                                className="btn btn-sm btn-outline-danger"
                                            >
                                                Deletar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Paginação */}
                    {totalPages > 1 && (
                        <nav className="mt-4">
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Anterior
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li
                                        key={i + 1}
                                        className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => paginate(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Próximo
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </>
            )}

            {/* Modal de confirmação de delete */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza que deseja deletar o filme "{filmeToDelete?.titulo}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Deletar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}