import React, { useEffect, useState } from "react";
import FilmeService from "../services/FilmeService";
import { Link } from "react-router-dom";
import HeroCarousel from '../components/HeroCarousel';
import GeneroService from '../services/GeneroService';
import SwalUtil from "../utils/SwalUtil";
import AuthService from "../services/AuthService";
import { useAuth } from "../contexts/AuthContext";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

export default function FilmeList() {
    const [filmes, setFilmes] = useState([]);
    const [generos, setGeneros] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        carregarFilmes();
        
        if (currentUser) {
            // Usuário está logado, carrega os gêneros
            carregarGeneros();
        } else {
            // Usuário não está logado ou fez logout, limpa os gêneros
            setGeneros({});
        }
    }, [currentUser]);

    const handleLoginClick = () => {
        setShowLogin(true);
    };

    const handleRegisterClick = () => {
        setShowRegister(true);
    };

    const switchToRegister = () => {
        setShowLogin(false);
        setShowRegister(true);
    };

    const switchToLogin = () => {
        setShowRegister(false);
        setShowLogin(true);
    };

    const carregarFilmes = async () => {
        try {
            setLoading(true);
            const response = await FilmeService.getFilmes();
            setFilmes(response || []);
            console.log('Filmes carregados:', response);
        } catch (error) {
            console.error("Erro ao carregar filmes:", error);
            setError('Erro ao carregar filmes');
            
            // Verificar tipo específico de erro
            if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
                SwalUtil.error(
                    'Servidor Indisponível', 
                    'Não foi possível conectar ao servidor. Verifique se o servidor está rodando e tente novamente.'
                );
            } else if (error.response?.status === 401) {
                SwalUtil.error(
                    'Não Autorizado', 
                    'Você precisa fazer login para acessar esta funcionalidade.'
                );
            } else {
                SwalUtil.error('Erro!', 'Não foi possível carregar a lista de filmes.');
            }
        } finally {
            setLoading(false);
        }
    };

    const carregarGeneros = async () => {
        // Não precisamos verificar a autenticação aqui porque o useEffect
        // já verifica se currentUser existe antes de chamar esta função
        try {
            const data = await GeneroService.getGeneros();
            const generosMap = {};
            data.forEach(genero => {
                generosMap[genero.id] = genero.nome;
            });
            setGeneros(generosMap);
        } catch (error) {
            console.error('Erro ao carregar gêneros:', error);
            
            // Não mostrar erro quando for problema de autenticação (401)
            // pois isso é esperado quando o usuário não está logado
            if (error.response?.status !== 401) {
                SwalUtil.error('Erro!', 'Não foi possível carregar os gêneros dos filmes.');
            }
        }
    };

    const abrirModalExclusao = (filme) => {
        SwalUtil.confirmDelete(
            'Confirmar Exclusão',
            `Tem certeza que deseja excluir o filme <strong>"${filme.titulo}"</strong>?<br><small class="text-muted">Esta ação não pode ser desfeita.</small>`,
            () => handleDeleteConfirmado(filme)
        );
    };

    const handleDeleteConfirmado = async (filme) => {
        if (!filme) return;
        
        try {
            SwalUtil.loading('Excluindo...', 'Processando sua solicitação');
            
            await FilmeService.deleteFilme(filme.id);
            setFilmes(prev => prev.filter(f => f.id !== filme.id));
            
            SwalUtil.closeLoading();
            SwalUtil.success('Excluído!', `Filme "${filme.titulo}" excluído com sucesso!`);
        } catch (error) {
            console.error('Erro ao excluir:', error);
            SwalUtil.closeLoading();
            SwalUtil.error('Erro!', error.response?.data?.message || 'Erro ao excluir filme.');
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

    if (loading) return (
        <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="mt-3">Carregando filmes...</p>
        </div>
    );
    
    if (error) return (
        <div className="container mt-5">
            <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Erro ao carregar filmes
                </h4>
                <p>{error}</p>
                <hr />
                <p className="mb-0">
                    Verifique se o servidor está rodando na porta 3000 e tente novamente.
                    <button 
                        className="btn btn-outline-danger ms-3"
                        onClick={carregarFilmes}
                    >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Tentar novamente
                    </button>
                </p>
            </div>
            
            {currentUser ? (
                <div className="text-center mt-4">
                    <Link to="/create" className="btn btn-primary btn-lg">
                        <i className="bi bi-plus-circle me-2"></i>
                        Adicionar novo filme
                    </Link>
                </div>
            ) : (
                <div className="text-center mt-4">
                    <button onClick={handleLoginClick} className="btn btn-success btn-lg me-3">
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Entrar
                    </button>
                    <button onClick={handleRegisterClick} className="btn btn-outline-primary btn-lg">
                        <i className="bi bi-person-plus me-2"></i>
                        Registrar
                    </button>
                </div>
            )}
        </div>
    );
    
    if (filmes.length === 0 && !loading) return (
        <div className="container mt-5">
            <div className="alert alert-info" role="alert">
                <h4 className="alert-heading">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    Nenhum filme encontrado
                </h4>
                <p>Ainda não há filmes cadastrados no sistema.</p>
                {currentUser ? (
                    <div className="text-center mt-4">
                        <Link to="/create" className="btn btn-primary">
                            <i className="bi bi-plus-circle me-2"></i>
                            Adicionar filme
                        </Link>
                    </div>
                ) : (
                    <div className="text-center mt-4">
                        <p>Faça login para adicionar novos filmes.</p>
                        <button onClick={handleLoginClick} className="btn btn-success me-3">
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Entrar
                        </button>
                        <button onClick={handleRegisterClick} className="btn btn-outline-primary">
                            <i className="bi bi-person-plus me-2"></i>
                            Registrar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

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
                                            {currentUser 
                                                ? (generos[filme.genero_id] || 'Carregando...') 
                                                : 'Login necessário'}
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
                                    {currentUser ? (
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
                                    ) : (
                                        <div className="text-center">
                                            <button onClick={handleLoginClick} className="btn btn-primary w-100">
                                                <i className="bi bi-lock me-1"></i>
                                                Faça login para editar
                                            </button>
                                        </div>
                                    )}
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
            <Login 
                show={showLogin} 
                handleClose={() => setShowLogin(false)}
                switchToRegister={switchToRegister}
            />
            <Register 
                show={showRegister} 
                handleClose={() => setShowRegister(false)}
                switchToLogin={switchToLogin}
            />
        </>
    );
}