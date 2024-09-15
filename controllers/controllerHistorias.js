var Historias = require('../models/mHsitorias');
var tratamentoParametroDeRota = require('../assets/tratamentoParametroRota');
const { validationResult, body } = require('express-validator');

// Endpoint que renderiza o template da historia com os dados da historia
exports.buscaHistoria = async (req, res, next) => {
    try {
        // Busca as historias atraves do parametro de rota que traz o id da historia
        var historiaBuscada = await Historias.buscaHistoria(tratamentoParametroDeRota(req.params.idHistooria));

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

        var errors = validationResult(req);

        try {
            if (!errors.isEmpty()) 
            {
                res.render('historia', {notify: "Verifique se os campos não estão vizios e tente novamente!!!", titulo: req.body.titulo, texto: req.body.texto});
            }
            else
            {
                // Estancia a classe de "modelo da historia"
                var historia = new Historias(req.body.titulo, req.body.texto, tratamentoParametroDeRota(req.params.idUsuario));

                await historia.attHistoria(tratamentoParametroDeRota(req.params.idHistooria));

                res.redirect(`http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistooria)}`)
            }
        } catch (error) {
            next(error);
        }
    }
]