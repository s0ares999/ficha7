const Filme = require('../models/Filme');
const path = require('path');
const fs = require('fs');

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
            console.log('=== Início do create ===');
            console.log('Headers:', req.headers);
            console.log('Body:', req.body);
            console.log('File:', req.file);

            const { titulo, descricao, genero_id } = req.body;

            // Validação dos campos
            if (!titulo || !descricao || !genero_id) {
                console.log('Campos faltando:', { titulo, descricao, genero_id });
                return res.status(400).json({
                    message: 'Todos os campos são obrigatórios',
                    received: { titulo, descricao, genero_id }
                });
            }

            let fotoPath = null;
            if (req.file) {
                console.log('Arquivo recebido:', req.file);
                fotoPath = req.file.filename;
                console.log('Caminho da foto:', fotoPath);
            }

            // Criar o filme
            console.log('Criando filme com dados:', {
                titulo,
                descricao,
                genero_id,
                foto: fotoPath
            });

            const filme = await Filme.create({
                titulo,
                descricao,
                genero_id: parseInt(genero_id),
                foto: fotoPath
            });

            console.log('Filme criado com sucesso:', filme.toJSON());
            return res.status(201).json(filme);

        } catch (error) {
            console.error('=== Erro ao criar filme ===');
            console.error('Mensagem:', error.message);
            console.error('Stack:', error.stack);
            
            return res.status(500).json({
                message: 'Erro ao criar filme',
                error: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
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
            const { id } = req.params;
            const filme = await Filme.findByPk(id);
            
            if (!filme) {
                return res.status(404).json({ message: 'Filme não encontrado' });
            }

            // Deleta a foto se existir
            if (filme.foto) {
                const fotoPath = path.join(__dirname, '../../uploads', filme.foto);
                if (fs.existsSync(fotoPath)) {
                    fs.unlinkSync(fotoPath);
                }
            }

            await filme.destroy();
            res.json({ message: 'Filme excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir filme:', error);
            res.status(500).json({ message: 'Erro ao excluir filme' });
        }
    }
}

module.exports = new FilmeController(); 