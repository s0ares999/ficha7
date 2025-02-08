var Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'ai2',
    'postgres',
    'postgres',
    {
        host: 'localhost',
        port: '5432',
        dialect: 'postgres'
    }
);
module.exports = sequelize;