const express = require('express');
const router = express.Router();
// const GenerosController = require('../controllers/GenerosController'); // Parece não ser usado, apenas GeneroController
const GeneroController = require('../controllers/GeneroController'); // Importa a instância/classe
// const authMiddleware = require('../middleware/authMiddleware'); // Descomenta se precisar de autenticação

// Verifica se as funções existem (podes remover estes logs depois)
// console.log('GeneroController:', GeneroController);
// console.log('GeneroController.getById:', GeneroController.getById);
// console.log('GeneroController.update:', GeneroController.update);
// console.log('GeneroController.delete:', GeneroController.delete);


// const generoController = new GeneroController(); // Não precisa se GeneroController já exporta uma instância

// Aplicar middleware de autenticação a todas as rotas de gênero, se necessário
// router.use(authMiddleware);

// GET - Listar todos os gêneros
router.get('/', GeneroController.list);

// GET - Obter um gênero específico pelo ID
router.get('/:id', GeneroController.getById); // <-- ROTA RESTAURADA

// POST - Criar novo gênero
router.post('/create', GeneroController.create);

// PUT - Atualizar gênero existente
router.put('/update/:id', GeneroController.update); // <-- ROTA RESTAURADA

// DELETE - Deletar gênero
router.delete('/delete/:id', GeneroController.delete); // <-- ROTA RESTAURADA

// Reset dos gêneros (nova rota - verificar se GenerosController e reset_generos existem)
// Se GenerosController não existir ou não tiver reset_generos, comenta ou remove esta linha:
// router.post('/reset', (req, res) => GenerosController.reset_generos(req, res));

module.exports = router;