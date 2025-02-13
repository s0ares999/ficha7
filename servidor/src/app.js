const express = require('express');
const cors = require('cors');
const app = express();

// Aumentar limite de payload
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware
app.use(cors());

// Rotas
const filmesRoutes = require('./routes/FilmesRoute');
const generosRoutes = require('./routes/GenerosRoute');

app.use('/filmes', filmesRoutes);
app.use('/generos', generosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});