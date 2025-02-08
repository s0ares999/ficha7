var Sequelize = require('sequelize');
var sequelize = require('./database');

// importa o modelo – chave forasteira roleID
var genero = require('./Generos');
var Filme = sequelize.define('Filmes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    descricao: Sequelize.STRING,
    titulo: Sequelize.STRING,
    foto: Sequelize.STRING
    },
    {
        timestamps: false,
    });

Filme.belongsTo(genero);
genero.hasMany(Filme);
module.exports = Filme