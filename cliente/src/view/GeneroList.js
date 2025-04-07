import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GeneroService from '../services/GeneroService';
import { Modal, Button, Form } from 'react-bootstrap';
import AuthService from '../services/AuthService';
import SwalUtil from '../utils/SwalUtil';

export default function GeneroList() {
    const [generos, setGeneros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    // --- Estados para Modal (Criar/Editar) ---
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentGenero, setCurrentGenero] = useState({ id: null, nome: '' }); // Gênero no modal
    const [modalLoading, setModalLoading] = useState(false); // Loading do submit do modal
    const [modalError, setModalError] = useState(''); // Erro dentro do modal
    // --- Fim Estados Modal ---

    // Estado para o modal de confirmação
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [generoToDelete, setGeneroToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState(''); // Erro específico da exclusão

    useEffect(() => {
        // Obter usuário atual
        const user = AuthService.getCurrentUser();
        setCurrentUser(user);

        // Se não estiver autenticado, não carrega os dados
        if (!AuthService.isAuthenticated()) {
            setError("Acesso não autorizado. Faça login para ver os gêneros.");
            setLoading(false);
            return;
        }

        carregarGeneros();
    }, []);

    const carregarGeneros = useCallback(async () => {
        try {
            const dados = await GeneroService.getGeneros();
            setGeneros(dados || []);
            setError('');
        } catch (err) {
            console.error("Erro ao carregar gêneros:", err);
            if(err.response?.status === 401 || err.response?.status === 403) {
                setError("Sessão expirada ou sem permissão. Faça login novamente.");
            } else {
                setError("Falha ao carregar gêneros. Tente novamente mais tarde.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Funções para Modal Criar/Editar ---
    const handleShowCreateModal = () => {
        setIsEditing(false);
        setCurrentGenero({ id: null, nome: '' });
        setModalError('');
        setShowModal(true);
    };

    const handleShowEditModal = (genero) => {
        setIsEditing(true);
        setCurrentGenero({ ...genero }); // Copia o gênero para edição
        setModalError('');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        // Resetar estado do modal pode ser útil, embora handleShow redefina
        setCurrentGenero({ id: null, nome: '' });
        setModalError('');
        setModalLoading(false);
    };

    const handleModalInputChange = (e) => {
        const { value } = e.target;
        setCurrentGenero(prev => ({ ...prev, nome: value }));
        // Limpar erro ao digitar
        if(modalError) setModalError('');
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        const nomeTrimmed = currentGenero.nome.trim();

        if (!nomeTrimmed) {
            setModalError('O nome do gênero é obrigatório.');
            return;
        }

        if (!AuthService.isAuthenticated()) {
            setModalError('Sessão expirada. Faça login novamente.');
            return;
        }

        setModalLoading(true);
        setModalError('');

        try {
            console.log('Enviando dados para criar gênero:', { nome: nomeTrimmed }); // Log para debug
            
            if (isEditing) {
                await GeneroService.updateGenero(currentGenero.id, { nome: nomeTrimmed });
                SwalUtil.success('Sucesso!', 'Gênero atualizado com sucesso!');
            } else {
                await GeneroService.createGenero({ nome: nomeTrimmed });
                SwalUtil.success('Sucesso!', 'Gênero criado com sucesso!');
            }
            
            handleCloseModal();
            await carregarGeneros(); // Recarrega a lista

        } catch (err) {
            console.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} gênero:`, err);
            const errMsg = err.response?.data?.message || `Erro desconhecido ao ${isEditing ? 'salvar' : 'criar'}.`;

            if (err.response?.status === 400 || errMsg.toLowerCase().includes('já existe')) {
                setModalError(errMsg);
            } else if (err.response?.status === 401 || err.response?.status === 403) {
                setModalError('Erro de autenticação. Faça login novamente.');
            } else {
                setModalError(errMsg);
            }
        } finally {
            setModalLoading(false);
        }
    };
    // --- Fim Funções Modal Criar/Editar ---

    // Funções para o modal de exclusão
    const handleShowDeleteModal = (genero) => {
        SwalUtil.confirmDelete(
            'Confirmar Exclusão',
            `Tem certeza que deseja excluir o gênero <strong>"${genero.nome}"</strong>?<br><small class="text-muted">Esta ação não pode ser desfeita.</small>`,
            () => deleteGenero(genero)
        );
    };

    // Nova função para executar a exclusão
    const deleteGenero = async (genero) => {
        try {
            const loading = SwalUtil.loading('Excluindo...', 'Processando sua solicitação');
            
            await GeneroService.deleteGenero(genero.id);
            await carregarGeneros(); // Recarrega a lista
            
            SwalUtil.closeLoading();
            SwalUtil.success('Excluído!', `Gênero "${genero.nome}" excluído com sucesso!`);
        } catch (err) {
            console.error("Erro ao deletar gênero:", err);
            const errMsg = err.response?.data?.message || "Erro ao excluir gênero.";
            
            SwalUtil.closeLoading();
            SwalUtil.error('Erro!', errMsg);
        }
    };

    if (loading && generos.length === 0) { // Mostra loading inicial
        return <div className="container mt-4 text-center">Carregando gêneros...</div>;
    }

    if (error && !error.includes("Sessão expirada")) { // Mostra erro geral, exceto se for redirecionar
         return <div className="container mt-4 alert alert-danger">{error}</div>;
    }
    // Se o erro for de autenticação e não estivermos redirecionando, mostramos a mensagem
     if (!AuthService.isAuthenticated() && error) {
         return <div className="container mt-4 alert alert-warning">{error}</div>;
     }


    return (
        <div className="container mt-4">
            {!currentUser ? (
                <div className="alert alert-warning">
                    Por favor, faça login para acessar esta página.
                </div>
            ) : (
                <>
                    <div className="d-flex justify-content-center align-items-center mb-4">
                        <h2 className="mb-0">
                            <i className="bi bi-tags me-2"></i>
                            Gerir Gêneros
                        </h2>
                    </div>

                    <div className="d-flex justify-content-end mb-3">
                        <Button variant="danger" onClick={handleShowCreateModal}>
                            <i className="bi bi-plus-circle me-2"></i> Novo Gênero
                        </Button>
                    </div>

                    {generos.length === 0 && !loading ? (
                        <div className="alert alert-info">Nenhum gênero encontrado.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover shadow-sm">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Nome</th>
                                        <th scope="col" className="text-end">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generos.map((genero) => (
                                        <tr key={genero.id}>
                                            <td>{genero.id}</td>
                                            <td>{genero.nome}</td>
                                            <td className="text-end">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleShowEditModal(genero)}
                                                    title="Editar"
                                                >
                                                    <i className="bi bi-pencil-square"></i> Editar
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleShowDeleteModal(genero)}
                                                    title="Excluir"
                                                >
                                                    <i className="bi bi-trash3"></i> Excluir
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Modal Criar/Editar */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar Gênero' : 'Criar Novo Gênero'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleModalSubmit}>
                    <Modal.Body>
                        {modalError && <div className="alert alert-danger">{modalError}</div>}
                        <Form.Group className="mb-3" controlId="generoNome">
                            <Form.Label>Nome do Gênero</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ex: Ação, Comédia..."
                                value={currentGenero.nome}
                                onChange={handleModalInputChange}
                                required
                                disabled={modalLoading}
                                isInvalid={!!modalError}
                            />
                            <Form.Control.Feedback type="invalid">
                                {modalError}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal} disabled={modalLoading}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" disabled={modalLoading || !currentGenero.nome.trim()}>
                            {modalLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Salvando...
                                </>
                            ) : (isEditing ? 'Salvar Alterações' : 'Criar Gênero')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
} 