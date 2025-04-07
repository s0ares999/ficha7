const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

module.exports = (req, res, next) => {
    try {
        // Pega o token do header Authorization
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        // Verifica se o formato é "Bearer <token>"
        const parts = authHeader.split(' ');
        
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Token mal formatado' });
        }

        const token = parts[1];

        // Verifica e decodifica o token
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            console.error('Erro ao verificar token:', err);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expirado' });
            }
            return res.status(400).json({ message: 'Token inválido' });
        }
    } catch (err) {
        console.error('Erro no middleware de autenticação:', err);
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
}; 