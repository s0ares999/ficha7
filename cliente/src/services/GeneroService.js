import axios from 'axios';

const API_URL = "http://localhost:3000";

class GeneroService {
    // GET - Listar todos os gêneros
    getGeneros() {
        return axios.get(`${API_URL}/generos`);
    }

    // GET - Obter detalhes de um gênero específico
    getGeneroById(id) {
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