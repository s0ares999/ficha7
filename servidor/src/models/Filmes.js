const Sequelize = require('sequelize');
const sequelize = require('./database');
const genero = require('./Generos'); // Importa o modelo Generos

const Filme = sequelize.define('Filmes', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descricao: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  foto: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  generoId: { // Adiciona a chave estrangeira explicitamente
    type: Sequelize.INTEGER,
    references: {
      model: genero, // Referência ao modelo Generos
      key: 'id', // Coluna referenciada
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
}, {
  timestamps: false, // Desativa os campos `createdAt` e `updatedAt`
});

// Define o relacionamento
Filme.belongsTo(genero); // Um Filme pertence a um Genero
genero.hasMany(Filme); // Um Genero pode ter muitos Filmes

module.exports = Filme;