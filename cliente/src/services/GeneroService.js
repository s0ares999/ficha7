import axios from 'axios';

const API_URL = "http://localhost:3000/api";

class GeneroService {
    // GET - Listar todos os gêneros
    async getGeneros() {
        try {
            const response = await axios.get(`${API_URL}/generos`);
            return response.data;
        } catch (error) {
            console.error('Erro detalhado:', {
                status: error.response?.status,
                url: error.config?.url
            });
            throw error;
        }
    }

    // GET - Obter detalhes de um gênero específico
    getGenero(id) {
        return axios.get(`${API_URL}/generos/${id}`);
    }

    // POST - Criar novo gênero
    createGenero(genero) {
        return axios.post(`${API_URL}/generos/create`, genero);
    }

    // PUT - Atualizar gênero existente
    updateGenero(id, genero) {
        return axios.put(`${API_URL}/generos/update/${id}`, genero);
    }

    // POST - Deletar gênero
    deleteGenero(id) {
        return axios.post(`${API_URL}/generos/delete`, { id: id });
    }
}

export default new GeneroService(); 