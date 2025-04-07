import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const API_URL = "http://localhost:3000/api/auth";

class AuthService {
    async register(userData) {
        try {
            console.log('Enviando dados de registro:', userData);
            const response = await axios.post(`${API_URL}/register`, userData);
            console.log('Resposta do registro:', response.data);
            
            if (response.data.token) {
                AuthService.setUserData(response.data);
            }
            return response.data;
        } catch (error) {
            console.error('Erro no registro:', error.response?.data || error.message);
            throw error;
        }
    }

    static async login(email, password) {
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password
            });

            console.log('Resposta do login:', response.data);
            
            if (response.data && response.data.token) {
                this.setUserData(response.data);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }

    static setUserData(data) {
        if (!data) return;
        
        try {
            // Guarda o token separadamente
            localStorage.setItem('token', data.token);
            
            // Guarda os dados do usuário
            const userData = {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email
            };
            localStorage.setItem('userData', JSON.stringify(userData));
        } catch (error) {
            console.error('Erro ao salvar dados do usuário:', error);
        }
    }

    static getUserData() {
        try {
            const token = localStorage.getItem('token');
            const userData = JSON.parse(localStorage.getItem('userData'));
            return { token, userData };
        } catch (error) {
            console.error('Erro ao recuperar dados do usuário:', error);
            return null;
        }
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token; // Retorna true se existir um token
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
    }

    static getCurrentUser() {
        try {
            const userData = localStorage.getItem('userData');
            if (userData) {
                return JSON.parse(userData);
            }
            return null;
        } catch (error) {
            console.error('Erro ao obter usuário atual:', error);
            return null;
        }
    }

    removeToken() {
        localStorage.removeItem('token');
    }

    verificarToken() {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        try {
            const decoded = jwtDecode(token);
            return decoded.exp > Date.now() / 1000;
        } catch (error) {
            console.error('Erro na decodificação:', error);
            return false;
        }
    }

    async renovarToken() {
        // Verifica se existe um token antes de tentar renová-lo
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Nenhum token encontrado para renovar');
            throw new Error('Nenhum token disponível');
        }
        
        try {
            console.log('Tentando renovar token...');
            const response = await axios.post('http://localhost:3000/api/auth/refresh', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data && response.data.token) {
                console.log('Token renovado com sucesso');
                localStorage.setItem('token', response.data.token);
                return response.data.token;
            }
            throw new Error('Token não retornado');
        } catch (error) {
            console.error('Erro ao renovar token:', error.message);
            // Não fazer logout em caso de erro específico de renovação
            // para não afetar o processo de login/registro
            if (error.message !== 'Nenhum token disponível') {
                AuthService.logout();
            }
            throw error;
        }
    }
}

// Interceptar requisições
axios.interceptors.response.use(
    response => response,
    async error => {
        const config = error.config;
        
        // Verifica se é um erro 401 (não autorizado)
        if (error.response?.status === 401) {
            // Não tenta renovar token para rotas de autenticação (login/registro)
            const isAuthRoute = config.url.includes('/auth/login') || 
                                config.url.includes('/auth/register');
            
            // Se for uma rota de autenticação, apenas retorna o erro
            if (isAuthRoute) {
                return Promise.reject(error);
            }
            
            try {
                // Para outras rotas, tenta renovar o token se existir um token
                if (localStorage.getItem('token')) {
                    const novoToken = await new AuthService().renovarToken();
                    config.headers.Authorization = `Bearer ${novoToken}`;
                    return axios(config);
                } else {
                    // Se não houver token, apenas rejeita o erro
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                // Se falhar ao renovar o token, rejeita o erro original
                return Promise.reject(error);
            }
        }
        
        return Promise.reject(error);
    }
);

export default AuthService; 