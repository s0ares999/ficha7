const Genero = require('../models/Genero');

class GeneroController {
    async list(req, res) {
        try {
            const generos = await Genero.findAll();
            res.json(generos);
        } catch (error) {
            console.error('Erro ao listar gêneros:', error);
            res.status(500).json({ message: 'Erro ao listar gêneros' });
        }
    }

    async create(req, res) {
        try {
            const { nome } = req.body;
            
            if (!nome) {
                return res.status(400).json({ message: 'Nome é obrigatório' });
            }

            const genero = await Genero.create({ nome });
            res.status(201).json(genero);
        } catch (error) {
            console.error('Erro ao criar gênero:', error);
            res.status(500).json({ message: 'Erro ao criar gênero' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nome } = req.body;

            if (!nome) {
                return res.status(400).json({ message: 'Nome é obrigatório' });
            }

            const genero = await Genero.findByPk(id);
            if (!genero) {
                return res.status(404).json({ message: 'Gênero não encontrado' });
            }

            await genero.update({ nome });
            res.json(genero);
        } catch (error) {
            console.error('Erro ao atualizar gênero:', error);
            res.status(500).json({ message: 'Erro ao atualizar gênero' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const genero = await Genero.findByPk(id);
            
            if (!genero) {
                return res.status(404).json({ message: 'Gênero não encontrado' });
            }

            await genero.destroy();
            res.json({ message: 'Gênero excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir gênero:', error);
            res.status(500).json({ message: 'Erro ao excluir gênero' });
        }
    }
}

module.exports = new GeneroController();