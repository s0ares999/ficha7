const Filme = require('../models/Filme');
const path = require('path');
const fs = require('fs');
const Genero = require('../models/Genero');
const BaseController = require('./BaseController');
const FileUtil = require('../utils/FileUtil');

class FilmeController extends BaseController {
    async list(req, res) {
        try {
            console.log('Iniciando listagem de filmes');
            const filmes = await Filme.findAll({
                include: ['genero'],
                order: [['id', 'DESC']] // Ordenar por ID decrescente para mostrar os mais novos primeiro
            });
            
            console.log('Filmes encontrados:', filmes.length);

            // Adicionar URL completa para as fotos
            const filmesComURL = filmes.map(filme => {
                const filmeJSON = filme.toJSON();
                if (filmeJSON.foto) {
                    filmeJSON.fotoUrl = FileUtil.getFileUrl(filmeJSON.foto);
                }
                return filmeJSON;
            });

            return this.sendSuccess(res, filmesComURL);
        } catch (error) {
            return this.handleError(error, res, 'Erro ao listar filmes');
        }
    }

    async getById(req, res) {
        try {
            const filme = await Filme.findByPk(req.params.id, {
                include: ['genero']
            });
            
            if (!filme) {
                return this.sendNotFound(res, 'Filme não encontrado');
            }
            
            return this.sendSuccess(res, filme);
        } catch (error) {
            return this.handleError(error, res, 'Erro ao buscar filme');
        }
    }

    async create(req, res) {
        try {
            console.log('Dados recebidos:', req.body);
            console.log('Arquivo recebido:', req.file);

            const { titulo, descricao, genero_id } = req.body;
            const foto = req.file.filename;

            if (!titulo || !descricao || !genero_id) {
                return this.sendBadRequest(res, 'Dados incompletos');
            }

            if (isNaN(genero_id)) {
                return this.sendBadRequest(res, 'ID de gênero inválido');
            }

            const novoFilme = await Filme.create({
                titulo,
                descricao,
                genero_id: parseInt(genero_id, 10),
                foto
            });

            console.log('Filme criado:', novoFilme.toJSON());
            return this.sendCreated(res, novoFilme);

        } catch (error) {
            console.error('Erro detalhado:', {
                message: error.message,
                stack: error.stack,
                body: req.body,
                file: req.file
            });
            return this.handleError(error, res, 'Erro ao criar filme');
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { titulo, descricao, genero_id } = req.body;

            const filme = await Filme.findByPk(id);
            if (!filme) {
                return this.sendNotFound(res, 'Filme não encontrado');
            }

            let fotoPath = filme.foto;
            if (req.file) {
                // Se havia uma foto anterior, deleta
                if (filme.foto) {
                    FileUtil.deleteFile(filme.foto);
                }
                fotoPath = req.file.filename;
            }

            await filme.update({
                titulo: titulo || filme.titulo,
                descricao: descricao || filme.descricao,
                genero_id: genero_id || filme.genero_id,
                foto: fotoPath
            });

            return this.sendSuccess(res, filme);
        } catch (error) {
            return this.handleError(error, res, 'Erro ao atualizar filme');
        }
    }

    async delete(req, res) {
        try {
            const filme = await Filme.findByPk(req.params.id);
            if (!filme) {
                return this.sendNotFound(res, 'Filme não encontrado');
            }

            // Excluir o arquivo de foto, se existir
            if (filme.foto) {
                FileUtil.deleteFile(filme.foto);
            }

            await filme.destroy();
            return this.sendNoContent(res);
        } catch (error) {
            return this.handleError(error, res, 'Erro ao excluir filme');
        }
    }
}

// Exportamos a classe em vez da instância
module.exports = FilmeController; 