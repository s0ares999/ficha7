const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');
const bcrypt = require('bcryptjs');

const AuthController = {
    register: async function(req, res) {
        try {
            console.log('Recebendo requisição de registro:', req.body);

            if (!req.body.name || !req.body.email || !req.body.password) {
                return res.status(400).json({
                    message: "Todos os campos são obrigatórios"
                });
            }

            // Verificar se o email já existe
            const existingUser = await User.findOne({
                where: { email: req.body.email }
            });

            if (existingUser) {
                return res.status(400).json({
                    message: "Email já está em uso"
                });
            }

            // Criar novo usuário
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            console.log('Usuário criado com sucesso:', user.id);

            // Gerar token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Retornar resposta sem a senha
            res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token
            });
        } catch (error) {
            console.error("Erro detalhado no registro:", error);
            res.status(500).json({
                message: "Erro ao registrar usuário",
                error: error.message
            });
        }
    },

    login: async function(req, res) {
        try {
            console.log('Requisição de login recebida:', req.body);
            const { email, password } = req.body;

            if (!email || !password) {
                console.log('Email ou senha não fornecidos');
                return res.status(400).json({ message: 'Email e senha são obrigatórios' });
            }

            console.log('Buscando usuário com email:', email);
            const user = await User.findOne({ 
                where: { email },
                attributes: ['id', 'name', 'email', 'password'] 
            });

            console.log('Usuário encontrado:', user ? 'Sim' : 'Não');

            if (!user) {
                return res.status(401).json({ message: 'Email ou senha inválidos' });
            }

            console.log('Verificando senha');
            const validPassword = await bcrypt.compare(password, user.password);
            
            console.log('Senha válida:', validPassword ? 'Sim' : 'Não');

            if (!validPassword) {
                return res.status(401).json({ message: 'Email ou senha inválidos' });
            }

            console.log('Gerando token com JWT_SECRET:', JWT_SECRET ? 'Definido' : 'Não definido');
            const token = jwt.sign(
                { id: user.id },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            console.log('Token gerado com sucesso');

            const userData = {
                user: {
                    id: user.id,
                    name: user.name || 'Usuário',
                    email: user.email
                },
                token
            };

            console.log('Enviando resposta:', userData);
            res.json(userData);

        } catch (error) {
            console.error('Erro detalhado no login:', error);
            console.error('Stack trace:', error.stack);
            res.status(500).json({ 
                message: 'Erro no servidor',
                error: error.message 
            });
        }
    },

    verifyToken: async function(req, res) {
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
                return res.status(401).json({
                    message: "Usuário não encontrado"
                });
            }

            res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            res.status(401).json({
                message: "Token inválido"
            });
        }
    }
};

module.exports = AuthController; 