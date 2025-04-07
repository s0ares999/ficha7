const Sequelize = require('sequelize');
require('dotenv').config();

// Verificar variáveis de ambiente obrigatórias
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_DIALECT'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Erro: Variável de ambiente ${envVar} não definida. Configure o arquivo .env corretamente.`);
        process.exit(1); // Encerra o processo com erro
    }
}

// Função para definir logging baseado na variável de ambiente
const getLoggingOption = () => {
    return process.env.DB_LOGGING === 'true' ? console.log : false;
};

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging: getLoggingOption(),
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