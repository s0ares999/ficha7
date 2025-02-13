const Generos = require('../models/Generos');

const GenerosController = {
    list_genero: async function(req, res) {
        try {
            const generos = await Generos.findAll();
            res.json(generos);
        } catch (error) {
            res.status(500).json({ message: "Erro ao listar gêneros", error: error });
        }
    },

    create_genero: async function(req, res) {
        try {
            const genero = await Generos.create({
                descricao: req.body.descricao
            });
            res.json(genero);
        } catch (error) {
            res.status(500).json({ message: "Erro ao criar gênero", error: error });
        }
    },

    delete_genero: async function(req, res) {
        try {
            await Generos.destroy({
                where: { id: req.body.id }
            });
            res.json({ message: "Gênero deletado com sucesso" });
        } catch (error) {
            res.status(500).json({ message: "Erro ao deletar gênero", error: error });
        }
    },

    update_genero: async function(req, res) {
        try {
            await Generos.update(
                { descricao: req.body.descricao },
                { where: { id: req.params.id } }
            );
            res.json({ message: "Gênero atualizado com sucesso" });
        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar gênero", error: error });
        }
    },

    reset_generos: async function(req, res) {
        try {
            // Limpa todos os gêneros existentes
            await Generos.destroy({ where: {} });

            // Adiciona os gêneros padrão
            const generosDefault = [
                { descricao: 'Ação' },
                { descricao: 'Comédia' },
                { descricao: 'Drama' },
                { descricao: 'Romance' },
                { descricao: 'Terror' },
                { descricao: 'Ficção Científica' },
                { descricao: 'Aventura' },
                { descricao: 'Animação' }
            ];

            await Generos.bulkCreate(generosDefault);
            res.json({ message: "Gêneros resetados com sucesso" });
        } catch (error) {
            res.status(500).json({ message: "Erro ao resetar gêneros", error: error });
        }
    }
};

module.exports = GenerosController;