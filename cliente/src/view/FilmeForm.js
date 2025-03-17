import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilmeService from "../services/FilmeService";
import GeneroService from "../services/GeneroService";
import AuthService from "../services/AuthService";

export default function FilmeForm({ filme: initialData, isEditing = false }) {
    const navigate = useNavigate();
    const [filme, setFilme] = useState(initialData || {
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
            navigate('/login', { state: { from: '/filmes' } });
            return;
        }

        carregarGeneros();
        if (initialData) {
            setFilme(initialData);
            if (initialData.foto) {
                setPreview(initialData.foto);
            }
        }
    }, [initialData, navigate]);

    const carregarGeneros = async () => {
        try {
            const dados = await GeneroService.getGeneros();
            setGeneros(dados);
        } catch (error) {
            console.error('Erro ao carregar gêneros:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'genero') {
            setFilme(prev => ({
                ...prev,
                [name]: value
            }));
        } else if (name === 'foto' && files && files[0]) {
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

        // Validação completa
        const camposObrigatorios = [
            { campo: filme.titulo, nome: 'título' },
            { campo: filme.descricao, nome: 'descrição' },
            { campo: filme.genero_id, nome: 'gênero' },
            { campo: filme.foto, nome: 'foto' }
        ];

        const campoFaltante = camposObrigatorios.find(c => !c.campo);
        if (campoFaltante) {
            return setError(`Campo ${campoFaltante.nome} é obrigatório`);
        }

        try {
            const formData = new FormData();
            formData.append('titulo', filme.titulo);
            formData.append('descricao', filme.descricao);
            formData.append('genero_id', filme.genero_id);
            formData.append('foto', filme.foto);

            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            if (isEditing) {
                await FilmeService.updateFilme(filme.id, formData);
            } else {
                await FilmeService.createFilme(formData);
            }
            navigate('/');
        } catch (error) {
            console.error('Erro completo:', error.response?.data);
            setError(error.message || 'Erro ao salvar filme');
        } finally {
            setLoading(false);
        }
    };

    console.log('Estado atual do filme:', {
        titulo: filme.titulo?.length,
        descricao: filme.descricao?.length,
        genero_id: filme.genero_id,
        foto: Boolean(filme.foto)
    });

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">
                {isEditing ? 'Editar Filme' : 'Registrar Novo Filme'}
            </h2>

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
                    <label htmlFor="genero" className="form-label">Gênero</label>
                    {generos.length > 0 ? (
                        <select
                            className="form-select"
                            id="genero_id"
                            name="genero_id"
                            value={filme.genero_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione um gênero</option>
                            {generos.map((genero) => (
                                <option key={genero.id} value={genero.id}>
                                    {genero.nome}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p>Carregando gêneros...</p>
                    )}
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
                        {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
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