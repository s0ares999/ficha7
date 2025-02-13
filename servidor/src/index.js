const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const database = require('./models/database');
const syncDatabase = require('./models/sync');

const app = express();

// Log de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Configuração do CORS
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para processar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api', routes);

// Middleware de erro
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Erro interno do servidor',
        error: err.message
    });
});

// Rota para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.json({ message: 'Servidor está rodando!' });
});

// Sincronizar banco de dados e iniciar servidor
const PORT = process.env.PORT || 3000;

syncDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Erro ao iniciar servidor:', err);
    }); 