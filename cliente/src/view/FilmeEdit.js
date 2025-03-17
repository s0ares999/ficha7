import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FilmeService from '../services/FilmeService';
import FilmeForm from './FilmeForm';

export default function FilmeEdit() {
    const { id } = useParams();
    const [filme, setFilme] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const carregarFilme = useCallback(async () => {
        try {
            const response = await FilmeService.getFilme(id);
            setFilme(response.data);
        } catch (error) {
            setError('Erro ao carregar o filme');
            console.error('Erro:', error);
        }
    }, [id]);

    useEffect(() => {
        carregarFilme();
    }, [carregarFilme]);

    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!filme) return <div>Carregando...</div>;

    return (
        <div>
            <FilmeForm 
                filme={filme} 
                isEditing={true}
                onSuccess={() => navigate('/')}
            />
        </div>
    );
}