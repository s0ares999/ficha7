const express = require('express');
const app = express();
const FilmesRoute = require('./routes/FilmesRoute.js')
const GenerosRoute = require('./routes/GenerosRoute.js');

//Configuracoes
app.set("port", process.env.port || 3000);
//Middlewares
app.use(express.json());

// Configurar CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access - Control - Allow - Request - Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Rotas
app.use('/Filmes', FilmesRoute);
app.use('/Generos', GenerosRoute);

app.listen(app.get('port'),()=>{
console.log("Start server on port "+app.get('port'))
})