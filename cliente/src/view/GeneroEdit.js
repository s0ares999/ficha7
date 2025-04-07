import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GeneroService from '../services/GeneroService';
import AuthService from '../services/AuthService';
import SwalUtil from '../utils/SwalUtil';

export default function GeneroEdit() {
    const { id } = useParams(); // Pega o ID da URL
    const [nome, setNome] = useState('');
    const [originalNome, setOriginalNome] = useState(''); // Para saber o nome original
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(''); // Erro ao buscar dados
    const [saveError, setSaveError] = useState('');   // Erro ao salvar
    const navigate = useNavigate();

    const carregarGenero = useCallback(async () => {
        if (!AuthService.isAuthenticated()) {
             setFetchError("Acesso não autorizado.");
             // navigate('/login');
             return;
        }
        setLoading(true);
        setFetchError('');
        try {
            const response = await GeneroService.getGenero(id);
            setNome(response.data.nome);
            setOriginalNome(response.data.nome); // Guarda o nome original
        } catch (err) {
            console.error("Erro ao carregar gênero:", err);
            if (err.response?.status === 404) {
                setFetchError(`Gênero com ID ${id} não encontrado.`);
            } else if(err.response?.status === 401 || err.response?.status === 403) {
                setFetchError("Sessão expirada ou sem permissão.");
                 // navigate('/login');
            } else {
                setFetchError("Falha ao carregar dados do gênero.");
            }
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        carregarGenero();
    }, [carregarGenero]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nome.trim()) {
            setSaveError('O nome do gênero é obrigatório.');
            return;
        }
         if (nome.trim() === originalNome) {
             setSaveError('Nenhuma alteração detectada.');
             return;
         }

        if (!AuthService.isAuthenticated()) {
            setSaveError('Sessão expirada. Faça login novamente.');
            return;
        }

        setLoading(true);
        setSaveError('');

        try {
            await GeneroService.updateGenero(id, { nome: nome.trim() });
            
            // Substituir o alert pelo SwalUtil
            SwalUtil.success('Sucesso!', 'Gênero atualizado com sucesso!', () => {
                navigate('/generos'); // Redireciona após clicar em OK
            });
            
        } catch (err) {
            console.error("Erro ao atualizar gênero:", err);
            const errMsg = err.response?.data?.message || err.message || 'Erro desconhecido ao salvar.';
            // Verifica erro de nome duplicado
            if (errMsg.includes('já está em uso') || err.response?.status === 400) {
                 setSaveError(errMsg);
            } else if (err.response?.status === 401 || err.response?.status === 403) {
                 setSaveError('Erro de autenticação ao salvar.');
                 // navigate('/login');
            }
             else {
                 setSaveError(`Erro ao salvar: ${errMsg}`);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading && !nome) { // Loading inicial
        return <div className="container mt-4 text-center">Carregando dados do gênero...</div>;
    }

    if (fetchError) { // Se houve erro ao buscar
        return <div className="container mt-4 alert alert-danger">{fetchError}</div>;
    }

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h2 className="h4 mb-0">Editar Gênero</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {saveError && <div className="alert alert-danger">{saveError}</div>}

                        <div className="mb-3">
                            <label htmlFor="nome" className="form-label">Nome do Gênero</label>
                            <input
                                type="text"
                                className={`form-control ${saveError ? 'is-invalid' : ''}`}
                                id="nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                                disabled={loading}
                            />
                             {saveError && <div className="invalid-feedback">{saveError}</div>}
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                             <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/generos')} // Botão para voltar para a lista
                                disabled={loading}
                             >
                                Cancelar
                             </button>
                             <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading || !nome.trim() || nome.trim() === originalNome}
                             >
                                {loading ? 'Salvando...' : 'Salvar Alterações'}
                             </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 