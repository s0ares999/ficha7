var Filme = require("../models/Filmes");
var generos = require("../models/Generos");
var sequelize = require("../models/database");
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
            Filme.create({
                descrição: "Filme muito bom de tiros",
                título: "Fight Club",
                foto: "img",
                género: "porrada",
            });
            Filme.create({
                descrição: "Filme muito bom de beijinhos",
                título: "About time",
                foto: "img",
                género: "beijinhos",
            });
            //ATE AQUI
            const data = Filme.findAll();
            return data;
        })
        .catch((err) => {
            return err;
        });
    res.json(response);
};

controllers.list_filme = async (req, res) => {
    const data = await Filme.findAll({
        include: [generos],
    })
        .then(function (data) {
            return data;
        })
        .catch((error) => {
            return error;
        });
    res.json({ success: true, data: data });
};


controllers.create_filme = async (req,res) => {
    // data
const { id, descricao, titulo, foto, generoId
} = req.body;
// create
const data = await Filme.create({
    descricao: descricao,
    titulo: titulo,
    foto: foto,
    generoId: generos
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

controllers.detail_filme = async (req, res) => {
    const { id } = req.params;
    const data = await Filme.findAll({
        where: { id: id },
        include: [generos]
    })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        })
    res.json({ success: true, data: data });
}

controllers.update_filme = async (req, res) => {
    // parameter get id
    const { id } = req.params;
    // parameter POST
    const { descricao, titulo, foto, generoId } = req.body;
    // Update data
    const data = await Filme.update({

        descricao: descricao,
        titulo: titulo,
        foto: foto,
        generoId: generoId
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

controllers.delete_filme = async (req, res) => {
    // parâmetros por post
    const { id } = req.body;
    // delete por sequelize
    const del = await Filme.destroy({
        where: { id: id }
    })
    res.json({ success: true, deleted: del, message: "Apagado com sucesso!" });
}

module.exports = controllers;
