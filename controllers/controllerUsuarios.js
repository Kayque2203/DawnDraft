// Falta terminar, esse sera o controller para manipular a rota da pagina index dos usuarios (*Obs essa pagina ira exibir as histórias criadas pelo usuario e seus personagens e cenários)
const Usuarios = require('../models/mUsuarios');
const Historias = require('../models/mHistorias');
const Personagens = require('../models/mPersonagens');
const Cenarios = require('../models/mCenarios');
const tratamentoParametroRota = require('../assets/tratamentoParametroRota');
const { body, validationResult } = require('express-validator');

exports.UsuariosIndex = async (req, res, next) => {
    try {
        // Faz uma consulta no banco de dados apartir do id inserido como parametro de rota para saber se aquele usuario realmente existe
        let consultaUsuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroRota(req.params.idUsuario));

        // Faz a verfificação, caso a variavel consultaUsuario retorne null siginifica que aquele usario não existe, caso exista essa variavel ira conter todas as infos do usuario.
        if (consultaUsuario == null) 
        {
            res.render('paginaERRO', {erro: 'O USUARIO NÃO EXISTE', link: "/"});
        } 
        else 
        {
            let consultaHistoriasDoUsuario = await Historias.buscaHistorias(tratamentoParametroRota(req.params.idUsuario));
            let consultaPersonagens = await Personagens.buscaPersonagens(tratamentoParametroRota(req.params.idUsuario));
            let cenarios = await Cenarios.buscaCenarios(tratamentoParametroRota(req.params.idUsuario));

            res.render('usuarios', { historias: consultaHistoriasDoUsuario , id_Usuario: tratamentoParametroRota(req.params.idUsuario), nome_Usuario: consultaUsuario.Nome, Personagens: consultaPersonagens, notify: "", cenarios });
        }
    } catch (error) {
        next(error);
    }
}

exports.PerfilUsuario = async (req, res, next) => {
    try {
        let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroRota(req.params.idUsuario));

        if (usuario == null) 
        {
            res.render('paginaERRO', { erro : "Usuario não encontrado, vplte e faça o login novamente!", link : `/`});
        }
        else
        {
            res.render("PerfilUsuarios", {usuario, historias : await Historias.buscaHistorias(usuario._id.toString()), personagens : await Personagens.buscaPersonagens(usuario._id.toString()), cenarios : await Cenarios.buscaCenarios(usuario._id.toString())});
        }

    } catch (error) {
        next(error);
    }
}

exports.AutualizaUsuario = [

    body('nome').trim().escape().notEmpty(),
    body('email').trim().escape().notEmpty(),
    body('senha').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {
            let errors = validationResult(req);

            
        } catch (error) {
            next(error);
        }
    }

];
