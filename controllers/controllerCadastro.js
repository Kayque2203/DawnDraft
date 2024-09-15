const { body, validationResult} = require("express-validator");

const Usuarios = require('../models/mCadastro');

exports.CadastroGet = (req,res,next) => {
    res.render('loginEcadastro', {notify: ''});
}

exports.CadastroPost = [

    // Aqui ultilizamos a biblioteca express-validator para sanitizar os dados inseridos nos campos dos furmularios que vem através do corpo da requisição http
    // O método trim() retira os espaços do começo e do final da string, O metodo escape() retirar possiveis caracteres maliciossos das strings, o notEmpty() não aceita que os campos venham vazis.
    body('nome').trim().escape().notEmpty(),
    body('email').trim().escape().notEmpty(),
    body('telefone').trim().escape().notEmpty(),
    body('senha').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            var novoUsuario = new Usuarios(req.body.nome, req.body.email, req.body.telefone, req.body.senha);

            if (!errors.isEmpty()){

                res.render('loginEcadastro', {notify: `Um erro inesperado aconteceu cheque se todas as informações estão corretas erro: ${errors}`})

            }else if (await novoUsuario.buscaUsuarioPeloEmail(req.body.email) != null) {

                res.render('loginEcadastro', {notify: `Um usuario com esse mesmo email ja esta cadastrado eum nosso sistema tente novamente com um novo email!`})
                
            }else{

                let usuarioCadastrado = await novoUsuario.adicionarUsuario();

                res.redirect(`http://localhost:3000/Usuarios/:${usuarioCadastrado}`);

            }
        } catch (error) {
            next(error)
        }
    }
]