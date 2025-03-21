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

    async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
                localStorage.setItem('token', response.data.token);
                return response.data;
            }
            return false;
        } catch (error) {
            console.error('Erro detalhado:', error.response);
            throw new Error(error.response?.data?.error || 'Erro no login');
        }
    }

    setUserData(userData) {
        console.log('Salvando dados do usuário:', userData);
        if (!userData.user || !userData.token) {
            console.error('Dados do usuário inválidos:', userData);
            return;
        }

        const dataToStore = {
            user: {
                id: userData.user.id,
                name: userData.user.name || 'Usuário',
                email: userData.user.email
            },
            token: userData.token
        };

        localStorage.setItem('user', JSON.stringify(dataToStore));
        localStorage.setItem('token', userData.token);
    }

    getUserData() {
        const userStr = localStorage.getItem('user');
        console.log('Dados brutos do usuário:', userStr);
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                console.log('Dados do usuário parseados:', userData);
                return userData;
            } catch (e) {
                console.error('Erro ao parsear dados do usuário:', e);
                return null;
            }
        }
        return null;
    }

    isAuthenticated() {
        const token = this.getToken();
        const userData = this.getUserData();
        console.log('Verificando autenticação:', { token, userData });
        return !!token && !!userData;
    }

    getToken() {
        return localStorage.getItem('token');
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        window.location.reload();
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
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
            const response = await axios.post('/auth/refresh', {}, {
                withCredentials: true
            });
            localStorage.setItem('token', response.data.token);
            return response.data.token;
        } catch (error) {
            this.logout();
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

export default new AuthService(); 