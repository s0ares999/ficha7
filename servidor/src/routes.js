const express = require('express');
const router = express.Router();
const FilmeControllerClass = require('./controllers/FilmeController');
const GeneroControllerClass = require('./controllers/GeneroController');
const AuthController = require('./controllers/AuthController');
const authMiddleware = require('./middleware/auth');
const multer = require('multer');
const path = require('path');
const upload = require('./config/multerConfig');

// Instanciando os controladores
const FilmeController = new FilmeControllerClass();
const GeneroController = new GeneroControllerClass();

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
router.post('/auth/login', AuthController.login.bind(AuthController));
router.post('/auth/register', AuthController.register.bind(AuthController));
router.post('/auth/refresh', authMiddleware, AuthController.refreshToken.bind(AuthController));

// Rotas de Filmes
router.get('/filmes', FilmeController.list.bind(FilmeController));
router.get('/filmes/:id', FilmeController.getById.bind(FilmeController));
router.post('/filmes', authMiddleware, upload.single('foto'), FilmeController.create.bind(FilmeController));
router.put('/filmes/:id', authMiddleware, upload.single('foto'), FilmeController.update.bind(FilmeController));
router.delete('/filmes/:id', authMiddleware, FilmeController.delete.bind(FilmeController));

// Rotas de Gêneros
router.get('/generos', authMiddleware, GeneroController.list.bind(GeneroController));
router.get('/generos/:id', authMiddleware, GeneroController.getById.bind(GeneroController));
router.post('/generos/create', authMiddleware, GeneroController.create.bind(GeneroController));
router.put('/generos/update/:id', authMiddleware, GeneroController.update.bind(GeneroController));
router.delete('/generos/delete/:id', authMiddleware, GeneroController.delete.bind(GeneroController));

// Rota de Teste (Opcional)
router.get('/', (req, res) => {
  res.json({ message: 'API FilmesFlix está operacional!' });
});

module.exports = router; 