// Falta testar tudo, fiz com sono deve ter varios erros!
const { body, validationResult} = require("express-validator");
const Criptografia = require('../assets/criptografia');

const Usuarios = require('../models/mUsuarios');

exports.login = [
    
    body('login_email').trim().escape().notEmpty(),
    body('login_senha').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {

            let errors = validationResult(req);

            if(!errors.isEmpty())
            {
                res.render('loginEcadastro', {notify: `Verifique se todos os campos estão devidamente preenchidos`, email: req.body.login_email}); // DA UMA ATENÇÃO AQUI!!!
            }
            else
            {
                let usuarioEncontrado = await Usuarios.buscaUsuariosPeloEmail2(req.body.login_email);

                if(usuarioEncontrado == null)
                {
                    res.render('loginEcadastro', {notify: `Nenhum usuario cadastrado com esse email`});
                }
                else if(Criptografia.descriptografa(usuarioEncontrado.Senha) != req.body.login_senha)
                {
                    res.render('loginEcadastro', {notify: `Senha errada`, email: req.body.login_email });
                }
                else
                {
                    res.redirect(`http://localhost:3000/Usuarios/:${usuarioEncontrado._id.toString()}`);
                }
            }
            
        } catch (error) {
            next(error);
        }
    }
]