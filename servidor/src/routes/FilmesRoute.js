const express = require('express');
const router = express.Router();
const FilmesController = require('../controllers/FilmesController');
const auth = require('../middleware/auth');

// Verifique se as funções existem antes de usar
console.log('FilmesController:', FilmesController);

// Rotas públicas
router.get('/', FilmesController.list_filme);
router.get('/:id', FilmesController.get_filme);

// Rotas protegidas
router.post('/', auth, FilmesController.create_filme);
router.put('/:id', auth, FilmesController.update_filme);
router.delete('/:id', auth, FilmesController.delete_filme);

module.exports = router;