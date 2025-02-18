const Filme = require('../models/Filme');
const path = require('path');
const fs = require('fs');
const Genero = require('../models/Genero');

class FilmeController {
    async list(req, res) {
        try {
            console.log('Iniciando listagem de filmes');
            const filmes = await Filme.findAll({
                include: ['genero'],
                order: [['id', 'DESC']] // Ordenar por ID decrescente para mostrar os mais novos primeiro
            });
            
            console.log('Filmes encontrados:', filmes.length);
            console.log('Dados dos filmes:', JSON.stringify(filmes, null, 2));

            // Adicionar URL completa para as fotos
            const filmesComURL = filmes.map(filme => {
                const filmeJSON = filme.toJSON();
                if (filmeJSON.foto) {
                    filmeJSON.fotoUrl = `http://localhost:3000/uploads/${filmeJSON.foto}`;
                }
                return filmeJSON;
            });

            res.json(filmesComURL);
        } catch (error) {
            console.error('Erro ao listar filmes:', error);
            res.status(500).json({ message: 'Erro ao listar filmes' });
        }
    }

    async getById(req, res) {
        try {
            const filme = await Filme.findByPk(req.params.id, {
                include: ['genero']
            });
            
            if (!filme) {
                return res.status(404).json({ message: 'Filme não encontrado' });
            }
            
            res.json(filme);
        } catch (error) {
            console.error('Erro ao buscar filme:', error);
            res.status(500).json({ message: 'Erro ao buscar filme' });
        }
    }

    async create(req, res) {
        try {
            console.log('Dados recebidos:', req.body);
            console.log('Arquivo recebido:', req.file);

            const { titulo, descricao, genero_id } = req.body;
            const foto = req.file.filename;

            if (!titulo || !descricao || !genero_id) {
                return res.status(400).json({ error: 'Dados incompletos' });
            }

            if (isNaN(genero_id)) {
                return res.status(400).json({ error: 'ID de gênero inválido' });
            }

            const novoFilme = await Filme.create({
                titulo,
                descricao,
                genero_id: parseInt(genero_id, 10),
                foto
            });

            console.log('Filme criado:', novoFilme.toJSON());
            res.status(201).json(novoFilme);

        } catch (error) {
            console.error('Erro detalhado:', {
                message: error.message,
                stack: error.stack,
                body: req.body,
                file: req.file
            });
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { titulo, descricao, genero_id } = req.body;

            const filme = await Filme.findByPk(id);
            if (!filme) {
                return res.status(404).json({ message: 'Filme não encontrado' });
            }

            let fotoPath = filme.foto;
            if (req.file) {
                // Se havia uma foto anterior, deleta
                if (filme.foto) {
                    const oldPath = path.join(__dirname, '../../uploads', filme.foto);
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                }
                fotoPath = req.file.filename;
            }

            await filme.update({
                titulo: titulo || filme.titulo,
                descricao: descricao || filme.descricao,
                genero_id: genero_id || filme.genero_id,
                foto: fotoPath
            });

            res.json(filme);
        } catch (error) {
            console.error('Erro ao atualizar filme:', error);
            res.status(500).json({ message: 'Erro ao atualizar filme' });
        }
    }

    async delete(req, res) {
        try {
            const filme = await Filme.findByPk(req.params.id);
            if (!filme) {
                return res.status(404).json({ error: 'Filme não encontrado' });
            }

            await filme.destroy();
            res.status(204).send();
        } catch (error) {
            console.error('Erro ao excluir filme:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new FilmeController(); 