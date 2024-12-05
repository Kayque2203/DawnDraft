const Usuarios = require('../models/mUsuarios');
const Historias = require('../models/mHistorias');
const Personagens = require('../models/mPersonagens');
const Cenarios = require('../models/mCenarios');
const ValidaSenha = require('../assets/validaSenha');
const ValidaEmail = require('../assets/Emails');
const Criptografia= require('../assets/criptografia');
const Imagens = require('../models/mImagens');

const path = require('path');
const fs = require('fs');

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
            let fotoPerfil = await Imagens.BuscaImagem(tratamentoParametroRota(req.params.idUsuario), "FotoPerfil");

            res.render('usuarios', { historias: consultaHistoriasDoUsuario , id_Usuario: tratamentoParametroRota(req.params.idUsuario), nome_Usuario: consultaUsuario.Nome, Personagens: consultaPersonagens, notify: "", cenarios, fotoPerfil });
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
            res.render("PerfilUsuarios", {usuario, historias : await Historias.buscaHistorias(usuario._id.toString()), personagens : await Personagens.buscaPersonagens(usuario._id.toString()), cenarios : await Cenarios.buscaCenarios(usuario._id.toString()), notify: "", notifyErro: "", email : "", senha : Criptografia.descriptografa(usuario.Senha), nome: "", fotoPerfil: await Imagens.BuscaImagem(tratamentoParametroRota(req.params.idUsuario), "FotoPerfil")});
        }

    } catch (error) {
        next(error);
    }
}

exports.AutualizaUsuario = [

    body('nome').trim().escape().notEmpty(),
    body('email').trim().escape().notEmpty(),
    body('senha').trim().escape().notEmpty(),
    body('biografia').trim().escape(),

    async (req, res, next) => {
        try {

            let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroRota(req.params.idUsuario));

            if ( usuario == null ) 
            {
                res.render('paginaERRO', { erro : "Usuario não encontrado, volte e faça seu login novamente! ", link : `/LoginECadastro`})
            }

            let errors = validationResult(req);

            if (!errors.isEmpty()) 
            {
                res.render('PerfilUsuarios', {usuario, historias : await Historias.buscaHistorias(usuario._id.toString()), personagens : await Personagens.buscaPersonagens(usuario._id.toString()), cenarios : await Cenarios.buscaCenarios(usuario._id.toString()), notify: "", notifyErro : "Verifique se os dados inseridos são validos!", email : req.body.email, senha : req.body.senha, nome: req.body.nome, fotoPerfil: await Imagens.BuscaImagem(tratamentoParametroRota(req.params.idUsuario), "FotoPerfil")});
            }

            let validaSenha = new ValidaSenha(req.body.senha);

            let validandoASenha = validaSenha.ValidacaoDaSenha();
            
            if (!validandoASenha.Valida) 
            {
                res.render('PerfilUsuarios', {usuario, historias : await Historias.buscaHistorias(usuario._id.toString()), personagens : await Personagens.buscaPersonagens(usuario._id.toString()), cenarios : await Cenarios.buscaCenarios(usuario._id.toString()), notify: "", notifyErro : validandoASenha.Erro, email : req.body.email, senha : req.body.senha, nome: req.body.nome, fotoPerfil: await Imagens.BuscaImagem(tratamentoParametroRota(req.params.idUsuario), "FotoPerfil")});
            }
            else 
            {
                let atualizarUsuario = new Usuarios(req.body.nome, "", req.body.senha, req.body.biografia);

                if (req.body.email != usuario.Email)
                {
                    let atualizandoUsuario = await atualizarUsuario.atualizaUsuario(usuario._id.toString());

                    switch (atualizandoUsuario) {
                        case null:
                            res.render('PerfilUsuarios', {usuario, historias : await Historias.buscaHistorias(usuario._id.toString()), personagens : await Personagens.buscaPersonagens(usuario._id.toString()), cenarios : await Cenarios.buscaCenarios(usuario._id.toString()), notify: "", notifyErro : "Um erro ocorreu ao atualizar as suas informações!", email : "", senha : Criptografia.descriptografa(usuario.Senha), nome: "", fotoPerfil: await Imagens.BuscaImagem(tratamentoParametroRota(req.params.idUsuario), "FotoPerfil")});
                            break;
                    
                        default:
                            res.render("avisos", { aviso: "Você esta mudando o seu email, antes de realmente executar essa mundaça presisamos verificar seu email para saber se é valido!", txtLink : "Ir para a verificação", link : `/Usuarios/:${usuario._id.toString()}/atualizaEmail/:${req.body.email}`});
                            break;
                    }
                }
                else 
                {
                    let atualizandoUsuario = await atualizarUsuario.atualizaUsuario(usuario._id.toString());

                    switch (atualizandoUsuario) {
                        case true:
                            usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroRota(req.params.idUsuario));
    
                            res.render('PerfilUsuarios', {usuario, historias : await Historias.buscaHistorias(usuario._id.toString()), personagens : await Personagens.buscaPersonagens(usuario._id.toString()), cenarios : await Cenarios.buscaCenarios(usuario._id.toString()), notify: "Suas informaões forma atualizadas com sucesso!", notifyErro : "", email : "", senha : Criptografia.descriptografa(usuario.Senha), nome: "", fotoPerfil: await Imagens.BuscaImagem(tratamentoParametroRota(req.params.idUsuario), "FotoPerfil")});
                            break;
                    
                        default:
                            res.render('PerfilUsuarios', {usuario, historias : await Historias.buscaHistorias(usuario._id.toString()), personagens : await Personagens.buscaPersonagens(usuario._id.toString()), cenarios : await Cenarios.buscaCenarios(usuario._id.toString()), notify: "", notifyErro : "Um erro ocorreu ao atualizar as suas informações!", email : "", senha : Criptografia.descriptografa(usuario.Senha), nome: "", fotoPerfil: await Imagens.BuscaImagem(tratamentoParametroRota(req.params.idUsuario), "FotoPerfil")});
                            break;
                    }
                }
            }
            
        } catch (error) {
            next(error);
        }
    }
];

var validaEmail;

exports.AtualizaEmailUsuarioGet = async (req, res, next) => {
    try {
        let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroRota(req.params.idUsuario));

        if (usuario == null)
        {
            res.render('paginaERRO', {link: `/LoginECadastro`, erro: "Usuario não encontrado, volte e faça login novamente!"});
        }

        let verificaSeExisteEmail = await Usuarios.buscaUsuariosPeloEmail2(tratamentoParametroRota(req.params.novoEmailUsuario));

        if (verificaSeExisteEmail != null) 
        {
            res.render('paginaERRO', {erro: "Esse email ja está sendo ultilizado por outro usuario, volte e tente outro email!", link : `/Usuarios/${req.params.idUsuario}/perfilUsuario/`});
        }
        else 
        {
            validaEmail = new ValidaEmail(tratamentoParametroRota(req.params.novoEmailUsuario));

            let validandoEmail = await validaEmail.enviarEmailDeVerificacao();

            switch (validandoEmail) {
                case null:
                    res.render('paginaERRO', {erro: "Um erro aconteceu ao enviar o email de verificação, volte e tente novamente", link : `/Usuarios/:${usuario._id.toString()}/perfilUsuario`});
                    break;
            
                default:
                    res.render('validacaoDeEmailTrocaEmail');
                    break;
            }
        }
    } catch (error) {
        next(error);
    }
}

//  validaEmail.getCodigoVerificacaoEmail
exports.AtualizaEmailUsuarioPost = [
    
    body('codigo').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {
            let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroRota(req.params.idUsuario));

            if(usuario == null)
            {
                res.render('paginaERRO', { erro: "Usuario não encontrado!", link: "/LoginECadastro"});
            }

            let errors = validationResult(req);

            if (!errors.isEmpty())
            {
                res.render('validacaoDeEmailTrocaEmail', {notifyErro : "Verifique se inseriu o codigo corretamente!"})
            }

            if ( req.body.codigo == validaEmail.getCodigoVerificacaoEmail ) 
            {
                let atualizandoEmail = await Usuarios.AtualizaEmailUsuario(usuario._id.toString(), tratamentoParametroRota(req.params.novoEmailUsuario));

                switch (atualizandoEmail) {
                    case true:
                        usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroRota(req.params.idUsuario));

                        res.render('PerfilUsuarios', {usuario, historias : await Historias.buscaHistorias(usuario._id.toString()), personagens : await Personagens.buscaPersonagens(usuario._id.toString()), cenarios : await Cenarios.buscaCenarios(usuario._id.toString()), notify: "Email alterado com sucesso!", notifyErro : "", email : "", senha : Criptografia.descriptografa(usuario.Senha), nome: "", fotoPerfil: await Imagens.BuscaImagem(tratamentoParametroRota(req.params.idUsuario), "FotoPerfil")});
                        break;
                
                    default:
                        res.render("paginaERRO", {erro:"Um erro aconteceu ao atualizar seu email, volte e tente novamente!", link : `/Usuarios/${req.params.idUsuario}/perfilUsuario`});
                        break;
                }            
            }
        } catch (error) {
            next(error);
        }
    }
]

exports.addImagemPerfil = async (req, res, next) => {
    try {
        let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroRota(req.params.idUsuario));

        if (usuario != null) 
        {
            let fotoPerfil = new Imagens(req.file.filename, tratamentoParametroRota(req.params.idUsuario), "FotoPerfil");

            switch (await fotoPerfil.addImagemBancoDeDados()) {
                case null:
                    res.render('PerfilUsuarios', {usuario, historias : await Historias.buscaHistorias(usuario._id.toString()), personagens : await Personagens.buscaPersonagens(usuario._id.toString()), cenarios : await Cenarios.buscaCenarios(usuario._id.toString()), notify: "", notifyErro : "Erro ao adicionar a foto de perfil tente novamente!", email : "", senha : Criptografia.descriptografa(usuario.Senha), nome: "", fotoPerfil: ""});
                    break;
            
                default:
                    res.render('PerfilUsuarios', {usuario, historias : await Historias.buscaHistorias(usuario._id.toString()), personagens : await Personagens.buscaPersonagens(usuario._id.toString()), cenarios : await Cenarios.buscaCenarios(usuario._id.toString()), notify: "Foto de perfil adicionada com sucesso!", notifyErro : "", email : "", senha : Criptografia.descriptografa(usuario.Senha), nome: "", fotoPerfil: await Imagens.BuscaImagem(tratamentoParametroRota(req.params.idUsuario), "FotoPerfil")});
                    break;
            }
        }
        else
        {
            res.render('paginaERRO', {erro : "Usuario não encontrado!", link : "/"});
        }
    } catch (error) {
        next(error);
    }
}

exports.atualizaFotoPerfil = async (req, res, next) => {
    try {
        let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroRota(req.params.idUsuario));

        let fotoAntiga = await Imagens.BuscaImagem(tratamentoParametroRota(req.params.idUsuario), "FotoPerfil");

        let fotoPerfil = new Imagens(req.file.filename, tratamentoParametroRota(req.params.idUsuario), "FotoPerfil");

        let caminhoDoArquivo =  path.join("public/uploads/", fotoAntiga);

        fs.unlink(caminhoDoArquivo, (err) => {
            if (err) 
            {
                console.log("erro ao ao deletar imagem!");
                return
            }
            console.log("Excluido com sucesso!");
        })

        switch ((await fotoPerfil.atualizaImagemPerfil(tratamentoParametroRota(req.params.idUsuario))).modifiedCount) {
            case 0:
                res.render('PerfilUsuarios', {usuario, historias : await Historias.buscaHistorias(usuario._id.toString()), personagens : await Personagens.buscaPersonagens(usuario._id.toString()), cenarios : await Cenarios.buscaCenarios(usuario._id.toString()), notify: "", notifyErro : "Erro ao atualizar a foto de perfil tente novamente!", email : "", senha : Criptografia.descriptografa(usuario.Senha), nome: "", fotoPerfil: ""});
                break;
        
            default:
                res.render('PerfilUsuarios', {usuario, historias : await Historias.buscaHistorias(usuario._id.toString()), personagens : await Personagens.buscaPersonagens(usuario._id.toString()), cenarios : await Cenarios.buscaCenarios(usuario._id.toString()), notify: "Foto de perfil atualizada com sucesso!", notifyErro : "", email : "", senha : Criptografia.descriptografa(usuario.Senha), nome: "", fotoPerfil: await Imagens.BuscaImagem(tratamentoParametroRota(req.params.idUsuario), "FotoPerfil")});
                break;
        }
    } catch (error) {
        next(error);
    }
}

exports.deletarImagemPerfil = async (req, res, next) => {
    try {
        let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroRota(req.params.idUsuario));

        if(usuario != null)
        {
            let fotoAntiga = await Imagens.BuscaImagem(tratamentoParametroRota(req.params.idUsuario), "FotoPerfil");
            let caminhoDoArquivo =  path.join("public/uploads/", fotoAntiga);
            fs.unlink(caminhoDoArquivo, (err) => {
                if (err) 
                {
                    console.log("erro ao ao deletar imagem!");
                    return
                }
                console.log("Excluido com sucesso!");
            })

            let deletandoFotoPerfil = await Imagens.DeletarFotoPerfil(tratamentoParametroRota(req.params.idUsuario));

            switch (deletandoFotoPerfil) {
                case true:
                    res.render('PerfilUsuarios', {usuario, historias : await Historias.buscaHistorias(usuario._id.toString()), personagens : await Personagens.buscaPersonagens(usuario._id.toString()), cenarios : await Cenarios.buscaCenarios(usuario._id.toString()), notify: "Foto de perfil excluida com sucesso!", notifyErro : "", email : "", senha : Criptografia.descriptografa(usuario.Senha), nome: "", fotoPerfil: ""});
                    break;
            
                default:
                    res.render('PerfilUsuarios', {usuario, historias : await Historias.buscaHistorias(usuario._id.toString()), personagens : await Personagens.buscaPersonagens(usuario._id.toString()), cenarios : await Cenarios.buscaCenarios(usuario._id.toString()), notify: "", notifyErro : "Erro ao deletar a foto de perfil tente novamente!", email : "", senha : Criptografia.descriptografa(usuario.Senha), nome: "", fotoPerfil: await Imagens.BuscaImagem(tratamentoParametroRota(req.params.idUsuario), "FotoPerfil") });
                    break;
            }
        }
        else
        {
            res.render('paginaERRO', {erro : "Usuario não encontrado!", link : "/"});
        }
    } catch (error) {
        next(error);
    }
}
