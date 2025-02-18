const express = require('express');
const router = express.Router();
const FilmeController = require('./controllers/FilmeController');
const GeneroController = require('./controllers/GeneroController');
const AuthController = require('./controllers/AuthController');
const authMiddleware = require('./middleware/auth');
const multer = require('multer');
const path = require('path');
const upload = require('./config/multerConfig');

// Configuração do Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads');
        console.log('Upload path:', uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        console.log('Gerando nome do arquivo:', uniqueSuffix + path.extname(file.originalname));
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadMulter = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Apenas imagens são permitidas!'));
    }
});

// Rotas de Autenticação
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);

// Rotas de Filmes
router.get('/filmes', FilmeController.list);
router.get('/filmes/:id', FilmeController.getById);
router.post('/filmes', upload.single('foto'), FilmeController.create);
router.put('/filmes/:id', upload.single('foto'), FilmeController.update);
router.delete('/filmes/:id', FilmeController.delete);

// Rotas de Gêneros
router.get('/generos', GeneroController.list);
router.post('/generos', authMiddleware, GeneroController.create);
router.put('/generos/:id', authMiddleware, GeneroController.update);
router.delete('/generos/:id', authMiddleware, GeneroController.delete);

module.exports = router; 