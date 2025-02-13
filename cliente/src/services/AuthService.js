import axios from "axios";

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
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Erro no login');
            }

            const data = await response.json();
            console.log('Resposta do servidor:', data);

            // Estrutura os dados do usuário
            const userData = {
                user: {
                    id: data.user.id,
                    name: data.user.name || 'Usuário', // Valor padrão caso o nome não venha
                    email: data.user.email
                },
                token: data.token
            };

            // Salva os dados estruturados
            this.setUserData(userData);
            return userData;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
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
}

export default new AuthService(); 