const { body, validationResult} = require("express-validator");

const Usuarios = require('../models/mCadastro');

exports.CadastroGet = (req,res,next) => {
    res.render('loginEcadastro', {notify: ''});
}

exports.CadastroPost = [

    body('nome').trim().escape().notEmpty(),
    body('email').trim().escape().notEmpty(),
    body('telefone').trim().escape().notEmpty(),
    body('senha').trim().escape().notEmpty(),

    async (req, res, next) => {

        const errors = validationResult(req);

        var novoUsuario = new Usuarios(req.body.nome, req.body.email, req.body.telefone, req.body.senha);

        if (!errors.isEmpty()){

            res.render('loginEcadastro', {notify: `Um erro inesperado aconteceu cheque se todas as informações estão corretas erro: ${errors}`})

        }/*else if (await novoUsuario.buscaUsuario(req.body.email) != null) {// ALGUM ERRO AQUI DESCOBRIR DPS basicamente isso serve para verificar se existe algum outro usuario com esse email no bd

            res.render('loginEcadastro', {notify: `Um usuario com esse mesmo email ja esta cadastrado eum nosso sistema tente novamente com um novo email!`})
            
        }*/else{

            try {

                let usuarioCadastrado = await novoUsuario.adicionarUsuario();

                res.redirect(`http://localhost:3000/Usuarios/:${usuarioCadastrado}`);
                
            } catch (error) {

                res.render('loginEcadastro', {notify: `Um erro inesperado aconteceu cheque se todas as informações estão corretas erro: ${error}`})
                
            }    

        }
    }
]