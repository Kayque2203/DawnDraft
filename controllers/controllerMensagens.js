const { body, validationResult } = require('express-validator');
const Mensagens = require('../models/mMensagens');

exports.FaleConoscoGet = (req, res, next) => {
    try {
        res.render('FaleConosco');
    } catch (error) {
        next(error)
    }
}

exports.FaleConoscoPost = [
    body('assunto').trim().escape().notEmpty(),
    body('email').trim().escape().notEmpty(),
    body('mensagem').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {
            let errors = validationResult(req);

            if (!errors.isEmpty()) 
            {
                res.render('FaleConosco', {notifyErro: "Verifique os dados inseridos e tente novamente!", assunto : req.body.assunto, email : req.body.email, mensagem : req.body.mensagem});
            }
            else 
            {
                let novaMensagem = new Mensagens(req.body.assunto, req.body.email, req.body.mensagem);

                let enviandoMensagem = await novaMensagem.enviandoMensagem();

                switch (enviandoMensagem) {
                    case null:
                        res.render('paginaERRO', {erro : "Um erro ocorreu ao enviar sua mensagem volte e tente novamente!", link : `/FaleConosco` });
                        break;
                
                    default:
                        res.render('avisos', {aviso: "Mensagem enviada com seucesso!", link : "/", txtLink: "Voltar"});
                        break;
                }
            }
        } catch (error) {
            next(error);
        }
    }
]