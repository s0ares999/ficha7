const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

module.exports = (req, res, next) => {
    try {
        // Pegar o token do header
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        // Formato do header: "Bearer <token>"
        const parts = authHeader.split(' ');
        
        if (parts.length !== 2) {
            return res.status(401).json({ message: 'Token mal formatado' });
        }

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ message: 'Token mal formatado' });
        }

        // Verificar o token
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token inválido' });
            }

            // Adicionar o ID do usuário decodificado à requisição
            req.userId = decoded.id;
            return next();
        });
    } catch (error) {
        return res.status(401).json({ message: 'Erro na autenticação' });
    }
}; 