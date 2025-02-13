const Sequelize = require('sequelize');
const database = require('./database');
const Generos = require('./Generos');

const Filmes = database.define('filmes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        type: Sequelize.TEXT,
        allowNull: true
    },
    generoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Generos,
            key: 'id'
        }
    }
}, {
    timestamps: false
});

// Relacionamento com Generos
Filmes.belongsTo(Generos, { 
    foreignKey: 'generoId',
    as: 'genero'  // Este alias deve corresponder ao usado no controller
});

module.exports = Filmes;