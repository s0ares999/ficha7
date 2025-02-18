import axios from 'axios';
import AuthService from './AuthService';

const API_URL = "http://localhost:3000/api";

class FilmeService {
    constructor() {
        this.axios = axios.create({
            baseURL: API_URL
        });

        this.axios.interceptors.request.use(
            (config) => {
                const token = AuthService.getToken();
                console.log('Configurando requisição:');
                console.log('- URL:', config.url);
                console.log('- Método:', config.method);
                console.log('- Token:', token);
                
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                    console.log('- Header Authorization:', config.headers['Authorization']);
                }
                
                return config;
            },
            (error) => {
                console.error('Erro no interceptor:', error);
                return Promise.reject(error);
            }
        );

        this.axios.interceptors.response.use(
            response => response,
            error => {
                // Log detalhado do erro
                console.log('Erro detalhado:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.response?.headers,
                    config: {
                        url: error.config?.url,
                        method: error.config?.method,
                        headers: error.config?.headers
                    }
                });
                return Promise.reject(error);
            }
        );
    }

    async getFilmes() {
        try {
            console.log('Buscando filmes...');
            const response = await this.axios.get(`${API_URL}/filmes`);
            console.log('Filmes recebidos:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
            throw error;
        }
    }

    // GET - Obter detalhes de um filme específico
    getFilme(filmeId) {
        return axios.get(`${API_URL}/filmes/${filmeId}`);
    }

    async createFilme(formData) {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Usuário não autenticado');
        }

        return axios.post(`${API_URL}/filmes`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    async updateFilme(id, formData) {
        const token = localStorage.getItem('token');
        return axios.put(`${API_URL}/filmes/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    async deleteFilme(id) {
        const token = localStorage.getItem('token');
        return axios.delete(`${API_URL}/filmes/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
}

export default new FilmeService(); 