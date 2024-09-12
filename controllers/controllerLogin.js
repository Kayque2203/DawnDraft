// Falta testar tudo, fiz com sono deve ter varios erros!
const { body, validationResult} = require("express-validator");

const Usuarios = require('../models/mCadastro');

const Usuario = new Usuarios()

exports.login = [
    
    body('email').trim().escape().notEmpty(),
    body('senha').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {

            var errors = validationResult(req);

            var usuarioEncontrado = Usuario.buscaUsuarioPeloEmail(req.body.email);


            if(!errors.isEmpty())
            {
                res.render('loginEcadastro', {notify: `Verifique se todos os campos estão devidamente preenchidos`, email: req.body.email});
            }
            else if(usuarioEncontrado == null)
            {
                res.render('loginEcadastro', {notify: `Nenhum usuario cadastrado com esse email`, email: false});
            }
            else if(usuarioEncontrado.Senha != req.body.senha)
            {
                res.render('loginEcadastro', {notify: `Senha errada`, email: req.body.email });
            }
            else
            {
                // me esqueci como que a api do mongo me retorna o json com os dados pedidos e fiquei com preguiça de testar dps entt TESTAR ISSO AQUI!
                res.redirect(`http://localhost:3000/Usuarios/:${usuarioEncontrado._id}`);
            }
            
        } catch (error) {
            next(error);
        }
    }
]