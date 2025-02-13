import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilmeService from "../services/FilmeService";
import GeneroService from "../services/GeneroService";
import AuthService from "../services/AuthService";

export default function FilmeForm({ filme: filmeInicial }) {
    const navigate = useNavigate();
    const [filme, setFilme] = useState({
        titulo: '',
        descricao: '',
        genero_id: '',
        foto: null
    });
    const [preview, setPreview] = useState(null);
    const [generos, setGeneros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!AuthService.isAuthenticated()) {
            navigate('/login', { state: { from: '/filmes/novo' } });
            return;
        }

        carregarGeneros();
        if (filmeInicial) {
            setFilme(filmeInicial);
            if (filmeInicial.foto) {
                setPreview(filmeInicial.foto);
            }
        }
    }, [filmeInicial, navigate]);

    const carregarGeneros = async () => {
        try {
            const response = await GeneroService.getGeneros();
            console.log('Gêneros carregados:', response);
            setGeneros(response);
        } catch (error) {
            console.error('Erro ao carregar gêneros:', error);
            setError('Erro ao carregar gêneros');
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'foto' && files && files[0]) {
            setFilme(prev => ({
                ...prev,
                [name]: files[0]
            }));
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setFilme(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Usuário não está autenticado');
            }

            if (filmeInicial) {
                await FilmeService.updateFilme(filmeInicial.id, filme);
            } else {
                await FilmeService.createFilme(filme);
            }
            
            alert('Filme salvo com sucesso!');
            
            navigate('/filmes');
        } catch (error) {
            console.error('Erro ao salvar filme:', error);
            setError('Erro ao salvar filme. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2 className="text-center mb-4">Registar Filme</h2>
            <form onSubmit={handleSubmit} className="needs-validation">
                {error && <div className="alert alert-danger">{error}</div>}
                
                <div className="mb-3">
                    <label htmlFor="titulo" className="form-label">Título</label>
                    <input
                        type="text"
                        className="form-control"
                        id="titulo"
                        name="titulo"
                        value={filme.titulo}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="descricao" className="form-label">Descrição</label>
                    <textarea
                        className="form-control"
                        id="descricao"
                        name="descricao"
                        value={filme.descricao}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="genero_id" className="form-label">Gênero</label>
                    <select
                        className="form-select"
                        id="genero_id"
                        name="genero_id"
                        value={filme.genero_id || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione um gênero</option>
                        {generos && generos.map(genero => (
                            <option key={genero.id} value={genero.id}>
                                {genero.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="foto" className="form-label">Foto</label>
                    <input
                        type="file"
                        className="form-control"
                        id="foto"
                        name="foto"
                        onChange={handleChange}
                        accept="image/*"
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="mt-2"
                            style={{ maxWidth: '200px' }}
                        />
                    )}
                </div>

                <div className="d-grid gap-2">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : (filmeInicial ? 'Atualizar' : 'Criar')}
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => navigate("/")}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}