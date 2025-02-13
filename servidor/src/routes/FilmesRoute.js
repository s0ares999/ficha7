const express = require('express');
const router = express.Router();
const FilmesController = require('../controllers/FilmesController');

// Verifique se as funções existem antes de usar
console.log('FilmesController:', FilmesController);

// Listar todos os filmes
router.get('/', (req, res) => FilmesController.list_filme(req, res));

// Obter um filme específico
router.get('/:id', (req, res) => FilmesController.get_filme(req, res));

// Criar novo filme
router.post('/create', (req, res) => FilmesController.create_filme(req, res));

// Atualizar filme
router.put('/update/:id', (req, res) => FilmesController.update_filme(req, res));

// Deletar filme
router.post('/delete', (req, res) => FilmesController.delete_filme(req, res));

module.exports = router;