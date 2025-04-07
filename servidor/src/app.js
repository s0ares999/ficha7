require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const path = require('path');
const seedGeneros = require('./seed');
const FileUtil = require('./utils/FileUtil');

const app = express();

// Chama a função de seed ao iniciar o servidor
seedGeneros()
    .then(() => {
        console.log('Seed concluído');
    })
    .catch(error => {
        console.error('Erro no seed:', error);
    });

// Garantir que a pasta uploads exista
FileUtil.ensureUploadDirExists();

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
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas
app.use('/api', routes);

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'Servidor está rodando!' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro na aplicação:', err);
    res.status(500).json({
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;