const express = require('express');
const router = express.Router();

const GenerosControllers = require('../controllers/GenerosControllers.js')

router.get('/save', (req, res) => {
    res.json({ status: 'Filme guardado' });
});

router.get('/', GenerosControllers.list_genero);

router.post('/create', GenerosControllers.create_genero);

router.get('/:id', GenerosControllers.detail_genero);

router.put('/update/:id', GenerosControllers.update_genero);

router.post('/delete', GenerosControllers.delete_genero);

module.exports = router;