// Falta testar tudo, fiz com sono deve ter varios erros!
const { body, validationResult} = require("express-validator");
const Criptografia = require('../assets/criptografia');
const tratamentoParametroDeRota = require('../assets/tratamentoParametroRota');

const Usuarios = require('../models/mUsuarios');

exports.CadastroGet = (req,res,next) => {
    try {
        res.render('loginEcadastro', {notify: ''});
    } catch (error) {
        next(error);
    }
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
            var errors = validationResult(req);

            if (!errors.isEmpty())
            {
                res.render('loginEcadastro', {notify: `Um erro inesperado aconteceu cheque se todas as informações estão corretas erro: ${errors}`}); // DA UMA ATENÇÃO AQUI!!!
            }
            else
            {
                var novoUsuario = new Usuarios(req.body.nome, req.body.email, req.body.telefone, req.body.senha);

                if (await novoUsuario.buscaUsuarioPeloEmail(req.body.email) != null)
                {
                    res.render('loginEcadastro', {notify: `Um usuario com esse mesmo email ja esta cadastrado eum nosso sistema tente novamente com um novo email!`}) 
                }
                else
                {
                    let usuarioCadastrado = await novoUsuario.adicionarUsuario();
    
                    res.redirect(`http://localhost:3000/Usuarios/:${usuarioCadastrado}`);
                }
            } 
        } catch (error) {
            next(error);
        }
    }
];

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
];


exports.deletarUsuario = async (req, res, next) => {
    try {

        let UsuarioBuscado = Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

        if (UsuarioBuscado == null) 
        {
            res.render('paginaERRO', {erro: "Usuario não encontrado"});
        } 
        else 
        {
            let usuarioADeletar = await Usuarios.deletarUsuario(tratamentoParametroDeRota(req.params.idUsuario));

            console.log(usuarioADeletar);

            res.redirect('/');
        }
        
    } catch (error) {
        next(error);
    }
}
