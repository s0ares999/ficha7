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
                localStorage.setItem('user', JSON.stringify(response.data));
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
        try {
            const response = await axios.post('http://localhost:3000/api/auth/refresh', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                return response.data.token;
            }
            throw new Error('Token não retornado');
        } catch (error) {
            AuthService.logout();
            throw error;
        }
    }
}

// Interceptar requisições
axios.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            const novoToken = await new AuthService().renovarToken();
            error.config.headers.Authorization = `Bearer ${novoToken}`;
            return axios(error.config);
        }
        return Promise.reject(error);
    }
);

export default AuthService; 