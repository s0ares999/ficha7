var Filme = require("../models/Filmes");
var generos = require("../models/Generos");
var sequelize = require("../models/database");
const controllers = {};
sequelize.sync();


controllers.list_genero = async (req, res) => {
    const data = await generos.findAll({
    })
        .then(function (data) {
            return data;
        })
        .catch((error) => {
            return error;
        });
    res.json({ success: true, data: data });
};


controllers.create_genero = async (req, res) => {
    // data
    const { id, descricao, titulo, foto, generoId
    } = req.body;
    // create
    const data = await generos.create({
        id: id,
        descricao: descricao,
        titulo: titulo,
        foto: foto,
        generoId: generoId
    })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            console.log("Erro: " + error)
            return error;
        })
    // return res
    res.status(200).json({
        success: true,
        message: "Registado",
        data: data
    });
};

controllers.detail_genero = async (req, res) => {
    const { id } = req.params;
    const data = await generos.findAll({
        where: { id: id },
    })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        })
    res.json({ success: true, data: data });
}

controllers.update_genero = async (req, res) => {
    // parameter get id
    const { id } = req.params;
    // parameter POST
    const { descricao } = req.body;
    // Update data
    const data = await generos.update({

        descricao: descricao,
    },
        {
            where: { id: id }
        })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        })
    res.json({ success: true, data: data, message: "Atualizado com sucesso!" });
}

controllers.delete_genero = async (req, res) => {
    // parâmetros por post
    const { id } = req.body;
    // delete por sequelize
    const del = await generos.destroy({
        where: { id: id }
    })
    res.json({ success: true, deleted: del, message: "Apagado com sucesso!" });
}

module.exports = controllers;