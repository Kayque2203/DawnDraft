var Historias = require('../models/mHsitorias');
var tratamentoParametroDeRota = require('../assets/tratamentoParametroRota');
const { validationResult, body } = require('express-validator');
const Usuarios = require('../models/mCadastro');

// Endpoint para renderizar o template de criação de uma nova historia
exports.adicionaHistoriaGet = (req, res, next) => {
    try {
        res.render('adicionaHistoria', {id_Usuario: req.params.idUsuario})
    } catch (error) {
        next(error);
    }
}

// Endpoint para adicionar uma nova historia
exports.adicionaHistoriaPost = [
    body('titulo').trim().escape().notEmpty(),
    body('prologo').trim().escape().notEmpty(),
    body('texto').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {

            let errors = validationResult(req);

            let usuario = Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

            if(!errors.isEmpty())
            {
                res.render('adicionaHistoria', { titulo: req.body.titulo , prologo: req.body.prologo, texto: req.body.texto }); // Da uma atenção aqui
            }
            else if(usuario == null)
            {
                res.json('O Usuario não existe'); // DA UMA ATENÇÂO AQUI!!!
            }
            else
            {
                let novaHistoria = new Historias(req.body.titulo, req.body.prologo, req.body.texto, tratamentoParametroDeRota(req.params.idUsuario));

                let idNovaHistoria = await novaHistoria.addHistorias()

                res.redirect(`http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${idNovaHistoria}}`);
            }
        } catch (error) {
            next(error)
        }
    }
];

// Endpoint que renderiza o template da historia com os dados da historia
exports.buscaHistoria = async (req, res, next) => {
    try {
        // Busca as historias atraves do parametro de rota que traz o id da historia
        let historiaBuscada = await Historias.buscaHistoria(tratamentoParametroDeRota(req.params.idHistooria));

        // verifica se a busca da historia retorna algo ou não
        if (historiaBuscada == null) 
        {
            res.json('Historia Não existe'); // DA UMA ATENÇÃO AQUI!!!
        } 
        else
        {
            res.render('historias', {historia: historiaBuscada}); // Rederiza o template da historia e através das variaveis de template passamos as informações da história
        }
    } catch (error) { // Caso algum erro aconteça esse erro sera passado para o midleware para tratar erros do express
        next(error);
    }
}

// Endpoint para autualizar as historias ja criadas
exports.atualizaHistoria = [

    // sanitiza os dados trazidos pelo corpo da requisição http
    body('titulo').trim().escape().notEmpty(),
    body('texto').trim().escape().notEmpty(),

    async (req, res, next) => {

        let errors = validationResult(req);

        try {
            if (!errors.isEmpty()) 
            {
                res.render('historia', {notify: "Verifique se os campos não estão vizios e tente novamente!!!", titulo: req.body.titulo, texto: req.body.texto}); //   DA UMA TAENÇÃO AQUI
            }
            else
            {
                // Estancia a classe de "modelo da historia"
                var historia = new Historias(req.body.titulo, req.body.prologo, req.body.texto,tratamentoParametroDeRota(req.params.idUsuario));

                await historia.attHistoria(tratamentoParametroDeRota(req.params.idHistooria));

                res.redirect(`http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistooria)}`)
            }
        } catch (error) {
            next(error);
        }
    }
]