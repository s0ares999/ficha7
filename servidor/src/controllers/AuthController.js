const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');
const bcrypt = require('bcryptjs');
const BaseController = require('./BaseController');

class AuthControllerClass extends BaseController {
    async register(req, res) {
        try {
            console.log('Recebendo requisição de registro:', req.body);

            if (!req.body.name || !req.body.email || !req.body.password) {
                return this.sendBadRequest(res, "Todos os campos são obrigatórios");
            }

            // Verificar se o email já existe
            const existingUser = await User.findOne({
                where: { email: req.body.email }
            });

            if (existingUser) {
                return this.sendBadRequest(res, "Email já está em uso");
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            // Criar novo usuário
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            });

            console.log('Usuário criado com sucesso:', user.id);

            // Gerar token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Retornar resposta sem a senha
            return this.sendSuccess(res, {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token
            });
        } catch (error) {
            return this.handleError(error, res, "Erro ao registrar usuário");
        }
    }

    async login(req, res) {
        try {
            console.log('Requisição de login recebida:', req.body);
            const { email, password } = req.body;

            if (!email || !password) {
                console.log('Email ou senha não fornecidos');
                return this.sendBadRequest(res, 'Email e senha são obrigatórios');
            }

            console.log('Buscando usuário com email:', email);
            const user = await User.findOne({ 
                where: { email },
                attributes: ['id', 'name', 'email', 'password'] 
            });

            console.log('Usuário encontrado:', user ? 'Sim' : 'Não');

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'Email ou senha inválidos' });
            }

            console.log('[Auth Login] Usando SECRET para assinar:', JWT_SECRET);
            const token = jwt.sign(
                { id: user.id },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            console.log('[Auth Login] Token gerado:', token ? 'Sim' : 'Não');

            const userData = {
                user: {
                    id: user.id,
                    name: user.name || 'Usuário',
                    email: user.email
                },
                token
            };

            console.log('Enviando resposta:', userData);
            return this.sendSuccess(res, userData);
        } catch (error) {
            return this.handleError(error, res, 'Erro no servidor');
        }
    }

    async verifyToken(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    message: "Token não fornecido"
                });
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findByPk(decoded.id);

            if (!user) {
                return this.sendNotFound(res, "Usuário não encontrado");
            }

            return this.sendSuccess(res, {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            return res.status(401).json({
                message: "Token inválido"
            });
        }
    }

    async refreshToken(req, res) {
        try {
            // Pegar o ID do usuário a partir do token de autenticação
            const userId = req.user.id;
            if (!userId) {
                return this.sendBadRequest(res, "ID de usuário não encontrado");
            }

            // Buscar o usuário
            const user = await User.findByPk(userId);
            if (!user) {
                return this.sendNotFound(res, "Usuário não encontrado");
            }

            // Gerar novo token
            const newToken = jwt.sign(
                { id: user.id },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Retornar o novo token
            return this.sendSuccess(res, {
                token: newToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            return this.handleError(error, res, "Erro ao renovar token");
        }
    }
}

const AuthController = new AuthControllerClass();
module.exports = AuthController; 