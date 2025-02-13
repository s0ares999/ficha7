const Sequelize = require('sequelize');
const database = require('./database');
const Genero = require('./Genero');

const Filme = database.define('filmes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    foto: {
        type: Sequelize.STRING,
        allowNull: true
    },
    genero_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'generos',
            key: 'id'
        }
    }
});

Filme.belongsTo(Genero, { foreignKey: 'genero_id', as: 'genero' });

module.exports = Filme; 