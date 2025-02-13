const Filmes = require('../models/Filmes');
const Generos = require('../models/Generos');
const sequelize = require("../models/database");
const controllers = {};
sequelize.sync();

controllers.testdata = async (req, res) => {
    const response = await sequelize
        .sync()
        .then(function () {
            // APAGAR após a primeira EXECUÇÃO
            //Cria Role
            Role.create({
                role: "Admin",
            });
            // Cria employee
            Filmes.create({
                descrição: "Filme muito bom de tiros",
                título: "Fight Club",
                foto: "img",
                género: "porrada",
            });
            Filmes.create({
                descrição: "Filme muito bom de beijinhos",
                título: "About time",
                foto: "img",
                género: "beijinhos",
            });
            //ATE AQUI
            const data = Filmes.findAll();
            return data;
        })
        .catch((err) => {
            return err;
        });
    res.json(response);
};

controllers.list_filme = async function(req, res) {
    try {
        const filmes = await Filmes.findAll({
            include: [{
                model: Generos,
                as: 'genero'
            }]
        });
        res.json(filmes);
    } catch (error) {
        console.error("Erro ao listar filmes:", error);
        res.status(500).json({ message: "Erro ao listar filmes", error: error.message });
    }
};

controllers.get_filme = async function(req, res) {
    try {
        const filme = await Filmes.findOne({
            where: { id: req.params.id },
            include: [{
                model: Generos,
                as: 'genero'
            }]
        });

        if (!filme) {
            return res.status(404).json({ message: "Filme não encontrado" });
        }

        res.json(filme);
    } catch (error) {
        console.error("Erro ao buscar filme:", error);
        res.status(500).json({ message: "Erro ao buscar filme", error: error.message });
    }
};

controllers.create_filme = async function(req, res) {
    try {
        const filme = await Filmes.create({
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            foto: req.body.foto,
            generoId: req.body.generoId
        });
        res.json(filme);
    } catch (error) {
        console.error("Erro ao criar filme:", error);
        res.status(500).json({ message: "Erro ao criar filme", error: error.message });
    }
};

controllers.update_filme = async function(req, res) {
    try {
        const filme = await Filmes.findByPk(req.params.id);
        
        if (!filme) {
            return res.status(404).json({ message: "Filme não encontrado" });
        }

        await filme.update({
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            foto: req.body.foto,
            generoId: req.body.generoId
        });

        res.json({ message: "Filme atualizado com sucesso", filme });
    } catch (error) {
        console.error("Erro ao atualizar filme:", error);
        res.status(500).json({ message: "Erro ao atualizar filme", error: error.message });
    }
};

controllers.delete_filme = async function(req, res) {
    try {
        const filme = await Filmes.findByPk(req.body.id);
        
        if (!filme) {
            return res.status(404).json({ message: "Filme não encontrado" });
        }

        await filme.destroy();
        res.json({ message: "Filme deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar filme:", error);
        res.status(500).json({ message: "Erro ao deletar filme", error: error.message });
    }
};

module.exports = controllers;
