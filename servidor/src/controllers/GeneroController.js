const Genero = require('../models/Genero');
const Filme = require('../models/Filme');
const { Sequelize } = require('sequelize');
const BaseController = require('./BaseController');

class GeneroController extends BaseController {
    async list(req, res) {
        try {
            const generos = await Genero.findAll({ order: [['nome', 'ASC']] });
            
            if (generos.length === 0) {
                return this.sendNotFound(res, 'Nenhum gênero encontrado');
            }
            
            return this.sendSuccess(res, generos);
        } catch (error) {
            return this.handleError(error, res, 'Erro ao listar gêneros');
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const genero = await Genero.findByPk(id);

            if (!genero) {
                return this.sendNotFound(res, 'Gênero não encontrado');
            }

            return this.sendSuccess(res, genero);
        } catch (error) {
            return this.handleError(error, res, 'Erro ao buscar gênero');
        }
    }

    async create(req, res) {
        try {
            const { nome } = req.body;

            if (!nome || nome.trim() === '') {
                return this.sendBadRequest(res, 'Nome é obrigatório');
            }

            // Verifica se já existe um gênero com este nome
            const existingGenero = await Genero.findOne({
                where: { nome: nome.trim() }
            });

            if (existingGenero) {
                return this.sendBadRequest(res, `O gênero "${nome.trim()}" já existe.`);
            }

            const genero = await Genero.create({ 
                nome: nome.trim() 
            });

            return this.sendCreated(res, genero);
        } catch (error) {
            return this.handleError(error, res, 'Erro interno ao criar gênero');
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nome } = req.body;

            if (!nome || nome.trim() === '') {
                return this.sendBadRequest(res, 'Nome é obrigatório');
            }

            const genero = await Genero.findByPk(id);
            if (!genero) {
                return this.sendNotFound(res, 'Gênero não encontrado');
            }

            const existingGenero = await Genero.findOne({
                where: {
                    nome: nome.trim(),
                    id: { [Sequelize.Op.ne]: id }
                }
            });
            if (existingGenero) {
                return this.sendBadRequest(res, `O nome "${nome.trim()}" já está em uso por outro gênero.`);
            }

            genero.nome = nome.trim();
            await genero.save();

            return this.sendSuccess(res, genero);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return this.sendBadRequest(res, `O nome "${req.body.nome.trim()}" já está em uso.`);
            }
            return this.handleError(error, res, 'Erro interno ao atualizar gênero');
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const genero = await Genero.findByPk(id);
            
            if (!genero) {
                return this.sendNotFound(res, 'Gênero não encontrado');
            }

            const filmesAssociados = await Filme.count({ where: { genero_id: id } });
            if (filmesAssociados > 0) {
                return this.sendBadRequest(res, 
                    `Não é possível excluir o gênero "${genero.nome}" pois ele está associado a ${filmesAssociados} filme(s). Remova ou altere os filmes primeiro.`
                );
            }

            await genero.destroy();
            return this.sendNoContent(res);
        } catch (error) {
            return this.handleError(error, res, 'Erro interno ao deletar gênero');
        }
    }
}

module.exports = GeneroController;