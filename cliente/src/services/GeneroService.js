import axios from 'axios';
import AuthService from './AuthService';

const API_URL = "http://localhost:3000/api";

const getAuthHeaders = () => {
    const token = AuthService.getToken();
    console.log('Token sendo usado:', token); // Debug
    
    if (token) {
        return { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }
    return {};
};

class GeneroService {
    // GET - Listar todos os gêneros
    async getGeneros() {
        try {
            const headers = getAuthHeaders();
            console.log('Headers da requisição:', headers); // Debug
            
            const response = await axios.get(`${API_URL}/generos`, { 
                headers: headers
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao listar gêneros:', error.response || error);
            throw error;
        }
    }

    // GET - Obter detalhes de um gênero específico
    getGenero(id) {
        return axios.get(`${API_URL}/generos/${id}`, { headers: getAuthHeaders() });
    }

    // POST - Criar novo gênero (com autenticação)
    async createGenero(genero) {
        try {
            const headers = getAuthHeaders();
            console.log('Headers do create:', headers); // Debug
            console.log('Dados sendo enviados:', genero); // Debug
            
            const response = await axios.post(
                `${API_URL}/generos/create`, 
                genero,
                { headers: headers }
            );
            return response.data;
        } catch (error) {
            console.error('Erro ao criar gênero:', error.response || error);
            throw error;
        }
    }

    // PUT - Atualizar gênero existente
    updateGenero(id, generoData) {
        // Envia apenas o campo 'nome' no corpo da requisição
        return axios.put(`${API_URL}/generos/update/${id}`, generoData, {
            headers: getAuthHeaders()
        });
    }

    // DELETE - Deletar gênero
    deleteGenero(id) {
        // Usa o método DELETE e passa o ID na URL
        return axios.delete(`${API_URL}/generos/delete/${id}`, {
            headers: getAuthHeaders()
        });
    }
}

export default new GeneroService(); 