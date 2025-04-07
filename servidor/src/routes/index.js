const express = require('express');
const router = express.Router();
const filmesRoutes = require('./FilmesRoute');
const generosRoutes = require('./GenerosRoute');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas de filmes
router.use('/filmes', authMiddleware, filmesRoutes);

// Rotas de gêneros
router.use('/generos', authMiddleware, generosRoutes);

// Rotas de autenticação
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth/verify', AuthController.verifyToken);

module.exports = router; 