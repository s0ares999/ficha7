import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneroService from '../services/GeneroService'; // Confirma o caminho do teu service
import AuthService from '../services/AuthService'; // Para verificar autenticação
import SwalUtil from '../utils/SwalUtil';

export default function GeneroForm() {
    const [nome, setNome] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Verifica autenticação ao carregar o componente (opcional, mas recomendado)
    useEffect(() => {
        if (!AuthService.isAuthenticated()) {
            // Redireciona para login ou mostra mensagem
            // Exemplo: navigate('/login', { state: { from: '/generos/create' } });
            setError('Acesso não autorizado. Faça login para criar gêneros.');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nome.trim()) {
            setError('O nome do gênero é obrigatório.');
            return;
        }

        // Verifica novamente a autenticação antes de enviar
        if (!AuthService.isAuthenticated()) {
            setError('Sessão expirada. Faça login novamente.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await GeneroService.createGenero({ nome });
            
            // Substituir o alert pelo SwalUtil
            SwalUtil.success('Sucesso!', 'Gênero criado com sucesso!', () => {
                navigate('/generos'); // Redireciona após clicar em OK
            });
            
        } catch (err) {
            console.error("Erro ao criar gênero:", err);
            const errMsg = err.response?.data?.message || err.message || 'Erro desconhecido ao criar gênero.';
             // Verifica erro de nome duplicado (ajuste a condição conforme a resposta da API)
            if (errMsg.includes('unique') || (err.response?.status === 400 && errMsg.toLowerCase().includes('já existe'))) {
                 setError(`O gênero "${nome}" já existe.`);
            } else if (err.response?.status === 401 || err.response?.status === 403) {
                setError('Erro de autenticação. Faça login novamente.');
                // Talvez redirecionar para login: navigate('/login');
            }
             else {
                 setError(`Erro ao criar gênero: ${errMsg}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Não renderiza o formulário se houver erro de autenticação inicial
    if (error && error.includes('Acesso não autorizado')) {
         return <div className="container mt-4 alert alert-danger">{error}</div>;
    }

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <div className="card shadow-sm">
                 <div className="card-header bg-primary text-white">
                     <h2 className="h4 mb-0">Criar Novo Gênero</h2>
                 </div>
                 <div className="card-body">
                     <form onSubmit={handleSubmit}>
                         {error && <div className="alert alert-danger">{error}</div>}

                         <div className="mb-3">
                             <label htmlFor="nome" className="form-label">Nome do Gênero</label>
                             <input
                                 type="text"
                                 className={`form-control ${error.includes('obrigatório') || error.includes('já existe') ? 'is-invalid' : ''}`}
                                 id="nome"
                                 value={nome}
                                 onChange={(e) => setNome(e.target.value)}
                                 placeholder="Ex: Ação, Comédia, Drama..."
                                 required
                                 disabled={loading}
                             />
                             {error.includes('já existe') && <div className="invalid-feedback">{error}</div>}
                         </div>

                         <button
                             type="submit"
                             className="btn btn-primary w-100"
                             disabled={loading || !nome.trim()}
                         >
                             {loading ? (
                                 <>
                                     <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                     Salvando...
                                 </>
                             ) : (
                                 'Criar Gênero'
                             )}
                         </button>
                     </form>
                 </div>
            </div>
        </div>
    );
} 