const express = require('express');
const router = express.Router();
const GenerosController = require('../controllers/GenerosController');

// Verifique se as funções existem
console.log('GenerosController:', GenerosController);

// Listar todos os gêneros
router.get('/', (req, res) => GenerosController.list_genero(req, res));

// Criar novo gênero
router.post('/create', (req, res) => GenerosController.create_genero(req, res));

// Atualizar gênero
router.put('/update/:id', (req, res) => GenerosController.update_genero(req, res));

// Deletar gênero
router.post('/delete', (req, res) => GenerosController.delete_genero(req, res));

// Reset dos gêneros (nova rota)
router.post('/reset', (req, res) => GenerosController.reset_generos(req, res));

module.exports = router;