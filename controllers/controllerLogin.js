const { body, validationResult} = require("express-validator");
const Criptografia = require('../assets/criptografia');
const tratamentoParametroDeRota = require('../assets/tratamentoParametroRota');
const Emails = require('../assets/Emails');

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
                var novoUsuario = new Usuarios(req.body.nome, req.body.email, req.body.senha);

                if (await novoUsuario.buscaUsuarioPeloEmail(req.body.email) != null)
                {
                    res.render('loginEcadastro', {notify: `Um usuario com esse mesmo email ja esta cadastrado eum nosso sistema tente novamente com um novo email!`}) 
                }
                else
                {

                    let usuarioCadastrado = await novoUsuario.adicionarUsuario();

                    switch (usuarioCadastrado) {
                        case null:
                            res.render('paginaERRO', {erro: "Um erro aconteceu ao efetuar o cadastro, volte e tente novamente!!!", link : "/LoginECadastro"});
                            break;
                    
                        default:
                            res.redirect(`/LoginECadastro/validacaoDeEmail/:${req.body.email}`);
                            break;
                    }
                }
            } 
        } catch (error) {
            next(error);
        }
    }
];

var cod; // Essa Variavel serve para conseguirmos acessar o código gerado no controller validaEmailPost

exports.validaEmailGet = async (req, res, next) => {
    try {

        let buscaEmail = await Usuarios.buscaUsuariosPeloEmail2(tratamentoParametroDeRota(req.params.emailUsuario));

        if (buscaEmail == null) 
        {
            res.render('paginaERRO', {erro: "Nenhum Usuario Cadastrado Com Esse Email, volte e tente novamente!!!", link : "/LoginECadastro"});
        } 
        else 
        {
            let verificacaoEmail = new Emails(tratamentoParametroDeRota(req.params.emailUsuario));

            let emailEnviado = await verificacaoEmail.enviarEmailDeVerificacao();

            cod = verificacaoEmail.getCodigoVerificacaoEmail;

            if (emailEnviado != true) 
            {
                await Usuarios.deletarUsuario(buscaEmail._id.toString());
                res.render('paginaERRO', {erro: "Erro ao validar o email, faça seu cadastro novamente!!!", link : "/LoginECadastro"})
            } 
            else 
            {
                res.render('validacaoDeEmail', {notify: ""});
            }
        }
    } catch (error) {
        next(error);
    }
}

exports.validaEmailPost = [

    body('codigoVerificacao').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {
            let buscaEmail = await Usuarios.buscaUsuariosPeloEmail2(tratamentoParametroDeRota(req.params.emailUsuario));
    
            if (buscaEmail == null) 
            {
                res.render('paginaERRO', {erro: "Nenhum Usuario Cadastrado Com Esse Email, volte e tente novamente!!!", link : "/LoginECadastro"});
            } 
            else if (req.body.codigoVerificacao == cod)
            {
                cod = '';
                let mudandoAVerificacaoDoUsuario = Usuarios.mudarVerificacao(buscaEmail._id.toString(), true)
                res.render("avisos",{aviso : "Email Verificado Com Sucesso, clique no link para ser redirecionado para a pagina do usuario", txtLink: "Ir para a pagina do usuario" ,link :`/Usuarios/${buscaEmail._id.toString()}`});
            }
            else
            {
                res.render('validacaoDeEmail', {notify: "Código Errado Tente Novamente!!!"});
            }
        } catch (error) {
            next(error);
        }
    }

]

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
                else if(usuarioEncontrado.Verificado == false)
                {
                    res.redirect(`/LoginECadastro/validacaoDeEmail/:${usuarioEncontrado.Email}`);
                }
                else if(Criptografia.descriptografa(usuarioEncontrado.Senha) != req.body.login_senha)
                {
                    res.render('loginEcadastro', {notify: `Senha errada`, email: req.body.login_email });
                }
                else
                {
                    res.redirect(`/Usuarios/:${usuarioEncontrado._id.toString()}`);
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

            res.redirect('/');
        }
        
    } catch (error) {
        next(error);
    }
}

exports.esqueciMinhaSenhaGet = (req, res, next) => {
    try {
        res.render('esqueciMinhaSenha', {notify:""});
    } catch (error) {
        next(error);
    }
}

exports.esqueciMinhaSenhaPost = [

    body('email').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {

            let errors = validationResult(req);

            let buscandoEmail = Usuarios.buscaUsuariosPeloEmail2(req.body.email);

            if (!errors.isEmpty()) 
            {
                res.render('esqueciMinhaSenha', {notify: "Verifique se vc digitou certo seu email e tente novamente!!!"})
            }
            else if (buscandoEmail == null) 
            {
                res.render('paginaERRO', {erro:"Usuario não encontrado, volte e tente novamente!!!", link:`/LoginECadastro`})
            } 
            else 
            {
                let enviaEmail = new Emails(req.body.email);

                let enviandoEmail = await enviaEmail.enviarEmailComLinkSenha();

                cod = enviaEmail.getCodigoVerificacaoEmail;

                switch (enviandoEmail) {
                    case null:
                        res.render('paginaERRO', {erro : "Um erro inesperado aconteceu ao enviar o email, volte e tente novamente!!!", link : "/LoginECadastro"});
                        break;
                
                    default:
                        res.render('avisos', {aviso : "Email enviado com sucesso, verifique seu email e acesse o link enviado!!!", link : "", txtLink : ""});
                        break;
                }
            }
        } catch (error) {
            next(error);
        }
    }
];

exports.redefinirSenhaUsuarioGet = async (req, res, next) => {
    try {

        let buscaEmail = await Usuarios.buscaUsuariosPeloEmail2(tratamentoParametroDeRota(req.params.emailUsuario));

        if(buscaEmail == null)
        {
            res.render("paginaERRO", {erro: "Usuario não encontrado volte e tente novamente!!!", link : "/LoginECadastro"});
        }
        else if (tratamentoParametroDeRota(req.params.codigoVerificacao) != cod) 
        {
            res.render("paginaERRO", {erro: "Código invalido, volte e tente novamente!!!", link : "/LoginECadastro"});
        }
        else
        {
            res.render('redefinirSenha', {notify : ""});
        }
    } catch (error) {
        next(error);
    }
}


exports.redefinirSenhaUsuarioPost = [

    body('senha').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {
            let errors = validationResult(req);
            
            let buscaEmail = await Usuarios.buscaUsuariosPeloEmail2(tratamentoParametroDeRota(req.params.emailUsuario));

            if (!errors.isEmpty()) 
            {
                res.render('redefinirSenha', {notify : "Verifique se inseriu a senha corretamente!!!"})
            }
            else if(buscaEmail == null)
            {
                res.render("paginaERRO", {erro: "Usuario não encontrado volte e tente novamente!!!", link : "/LoginECadastro"});
            }
            else if (tratamentoParametroDeRota(req.params.codigoVerificacao) != cod) 
            {
                res.render("paginaERRO", {erro: "Código invalido, volte e tente novamente!!!", link : "/LoginECadastro"});
            }
            else
            {
                let redefinindoSenha = await Usuarios.redefinirSenhaUsuario(tratamentoParametroDeRota(req.params.emailUsuario), Criptografia.criptografar(req.body.senha));

                switch (redefinindoSenha.modifiedCount) {
                    case 0:
                        res.render('paginaERRO', {erro : "Um erro aconteceu ao redefinir sua senha, volte e tente novamente!!!", link : "/LoginECadastro"});
                        break;
                
                    default:
                        cod = "";
                        res.render('avisos', {aviso: "Senha redefinida com sucesso, volte e faça o login!!!", link : "/loginECadastro", txtLink: ""});
                        break;
                }
            }
        } catch (error) {
            next(error);
        }
    }
];
