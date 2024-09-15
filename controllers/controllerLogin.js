// Falta testar tudo, fiz com sono deve ter varios erros!
const { body, validationResult} = require("express-validator");

const Usuarios = require('../models/mCadastro');

exports.login = [
    
    body('login_email').trim().escape().notEmpty(),
    body('login_senha').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {

            var errors = validationResult(req);

            var usuarioEncontrado = await Usuarios.buscaUsuariosPeloEmail2(req.body.login_email);


            if(!errors.isEmpty())
            {
                res.render('loginEcadastro', {notify: `Verifique se todos os campos estão devidamente preenchidos`, email: req.body.login_email});
            }
            else if(usuarioEncontrado == null)
            {
                res.render('loginEcadastro', {notify: `Nenhum usuario cadastrado com esse email`, email: false});
            }
            else if(usuarioEncontrado.Senha != req.body.login_senha)
            {
                res.render('loginEcadastro', {notify: `Senha errada`, email: req.body.login_email });
            }
            else
            {
                res.redirect(`http://localhost:3000/Usuarios/:${usuarioEncontrado._id.toString()}`);
            }
            
        } catch (error) {
            next(error);
        }
    }
]