var Sequelize = require('sequelize');
var sequelize = require('./database');
var generos = sequelize.define('generos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    descricao: Sequelize.STRING
},
    {
        timestamps: false,
    });

module.exports = generos