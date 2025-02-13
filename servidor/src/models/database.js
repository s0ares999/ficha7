const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'ai2',
    'postgres',
    'postgres',
    {
        host: 'localhost',
        port: '5432',
        dialect: 'postgres',
        logging: true, // Mostra queries SQL no console
        define: {
            timestamps: false
        }
    }
);
// Testar conexão
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com banco de dados estabelecida com sucesso.');
        // Sincronizar modelos com o banco
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados com o banco de dados.');
    } catch (error) {
        console.error('Erro ao conectar com banco de dados:', error);
    }
})();

module.exports = sequelize;