const express = require('express');
const router = express.Router();
const filmesRoutes = require('./FilmesRoute');
const GenerosController = require('../controllers/GeneroController');
const AuthController = require('../controllers/AuthController');

// Rotas de filmes
router.use('/filmes', filmesRoutes);

// Rotas de gêneros
router.get('/generos', GenerosController.list_generos);

// Rotas de autenticação
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth/verify', AuthController.verifyToken);

module.exports = router; 