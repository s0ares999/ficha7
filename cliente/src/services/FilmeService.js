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
            const response = await this.axios.get('/filmes');
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

    async createFilme(filmeData) {
        try {
            console.log('Dados do filme a serem enviados:', filmeData);
            
            const formData = new FormData();
            formData.append('titulo', filmeData.titulo);
            formData.append('descricao', filmeData.descricao);
            formData.append('genero_id', filmeData.genero_id);
            if (filmeData.foto) {
                formData.append('foto', filmeData.foto);
            }

            // Log do FormData
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const response = await this.axios.post('/filmes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro detalhado:', error.response);
            throw error;
        }
    }

    async updateFilme(id, filme) {
        try {
            const formData = new FormData();
            formData.append('titulo', filme.titulo);
            formData.append('descricao', filme.descricao);
            formData.append('genero_id', filme.genero_id);
            if (filme.foto) {
                formData.append('foto', filme.foto);
            }

            const response = await this.axios.put(`/filmes/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar filme:', error);
            throw error;
        }
    }

    async deleteFilme(id) {
        try {
            const response = await this.axios.delete(`/filmes/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao deletar filme:', error);
            throw error;
        }
    }
}

export default new FilmeService(); 