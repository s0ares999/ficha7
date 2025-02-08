const express = require('express');
const router = express.Router();

const FilmesControllers = require('../controllers/FilmesControllers.js')

router.get('/save', (req, res) => {
    res.json({ status: 'Filme guardado' });
});

router.get('/testdata', FilmesControllers.testdata);

router.get('/', FilmesControllers.list_filme);

router.post('/create', FilmesControllers.create_filme);

router.get('/:id', FilmesControllers.detail_filme);

router.put('/update/:id', FilmesControllers.update_filme);

router.post('/delete', FilmesControllers.delete_filme);

module.exports = router;