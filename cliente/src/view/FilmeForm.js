import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import FilmeService from "../services/FilmeService";
import GeneroService from "../services/GeneroService";

export default function FilmeForm() {
    const navigate = useNavigate();
    const [generos, setGeneros] = useState([]);
    const [filme, setFilme] = useState({
        titulo: "",
        descricao: "",
        foto: "",
        generoId: ""
    });

    useEffect(() => {
        carregarGeneros();
    }, []);

    const carregarGeneros = async () => {
        try {
            const response = await GeneroService.getGeneros();
            console.log("Resposta dos gêneros:", response.data);
            setGeneros(response.data || []);
        } catch (error) {
            console.error("Erro ao carregar gêneros:", error);
            setGeneros([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilme(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const resizeImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Converter para JPEG com qualidade reduzida
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const resizedImage = await resizeImage(file);
                setFilme(prevState => ({
                    ...prevState,
                    foto: resizedImage
                }));
            } catch (error) {
                console.error("Erro ao redimensionar imagem:", error);
                alert("Erro ao processar a imagem");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Enviando filme:", filme);
            await FilmeService.createFilme(filme);
            alert("Filme cadastrado com sucesso!");
            navigate("/");
        } catch (error) {
            console.error("Erro ao cadastrar filme:", error);
            alert("Erro ao cadastrar filme: " + error.message);
        }
    };

    return (
        <div className="container">
            <h2 className="text-center mb-4">Novo Filme</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input
                        type="text"
                        className="form-control"
                        name="titulo"
                        value={filme.titulo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <textarea
                        className="form-control"
                        name="descricao"
                        value={filme.descricao}
                        onChange={handleChange}
                        rows="3"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Imagem do Filme</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                    {filme.foto && (
                        <img 
                            src={filme.foto} 
                            alt="Preview" 
                            className="mt-2"
                            style={{ maxWidth: '200px' }} 
                        />
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label">Gênero</label>
                    <select
                        className="form-select"
                        name="generoId"
                        value={filme.generoId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione um gênero</option>
                        {generos.map(genero => (
                            <option key={genero.id} value={genero.id}>
                                {genero.descricao}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">
                        Cadastrar Filme
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