const Personagens = require('../models/mPersonagens');
const Usuarios = require('../models/mUsuarios');

const TratamentoParamtrosDeRota = require('../assets/tratamentoParametroRota');

const { validationResult, body } = require('express-validator');
const PersonagensCapitulo = require('../models/mPersonagensCapitulo');

// Endpoint que retorna um template para criar um usuario
exports.adicionarPersonagemGet = async (req, res, next) => {
    try {
        let usuario = await Usuarios.buscaUsuarioPeloId(TratamentoParamtrosDeRota(req.params.idUsuario));

        if (usuario == null) 
        {
            res.render('paginaERRO', {erro : "Usuario não encontrado, volte e tente novamente!!!", link: '/'});
        } 
        else 
        {
            res.render('adicionarPersonagem', {UsuarioID: req.params.idUsuario});
        }
    } catch (error) {
        next(error);
    }
}

// Endpoint para adicionar um personagem no banco de dados
exports.adicionarPersonagemPost = [

    body('nome').trim().escape().notEmpty(),
    body('idade').trim().escape(),
    body('personalidade').trim().escape(),
    body('hobies').trim().escape(),
    body('sonhos').trim().escape(),
    body('traumas').trim().escape(),
    body('objetivo').trim().escape(),
    body('informacoes').trim().escape(),

    body('corPele').trim().escape(),
    body('olhos').trim().escape(),
    body('cabelo').trim().escape(),
    body('altura').trim().escape(),
    body('peso').trim().escape(),
    body('roupas').trim().escape(),
    body('resumoPersonagem').trim().escape(),
    
    async (req, res, next) => {
        try {
            let errors = validationResult(req);

            let usuario = await Usuarios.buscaUsuarioPeloId(TratamentoParamtrosDeRota(req.params.idUsuario));

            if (!errors.isEmpty()) 
            {
                res.render('paginaERRO', {erro: 'Um Erro Aconteceu Na Validação Dos Dados, volte e tente novamente!!!', link : `/Usuarios/${req.params.idUsuario}/adicionarPersonagem`});
            } 
            else if(usuario == null)
            {
                res.render('paginaERRO', {erro: 'Usuario Não Encontrado, Volte E Tente Novamente!!!', link : '/'});
            }
            else
            {
                let personagemASerAdicionado = new Personagens(req.body.nome, req.body.idade, req.body.personalidade, req.body.hobies, req.body.sonhos, req.body.traumas, req.body.objetivo, req.body.informacoes, TratamentoParamtrosDeRota(req.params.idUsuario), req.body.corPele, req.body.olhos, req.body.cabelo, req.body.altura, req.body.peso, req.body.roupas, req.body.resumoPersonagem);

                let personagemAdicinado = await personagemASerAdicionado.adicionaPersonagem();

                switch (personagemAdicinado) {
                    case null:
                        res.render('paginaERRO', {erro : 'Um Erro Ao Adicionar O Personagem Aconteceu, volte e tente novamente!!!', link : `/Usuarios/${req.params.idUsuario}/adicionarPersonagem`});
                        break;
                
                    default:
                        res.redirect(`/Usuarios/${req.params.idUsuario}/personagem/${personagemAdicinado.toString()}`);
                        break;
                }
            }
        } catch (error) {
            next(error);
        }
    }
];

// Endpoint buscar um personagem no banco de dados
exports.buscaPersonagem = async (req, res, next) => {
    try {
        let usuario = await Usuarios.buscaUsuarioPeloId(TratamentoParamtrosDeRota(req.params.idUsuario));

        let personagem = await Personagens.buscaPersonagem(TratamentoParamtrosDeRota(req.params.idPersonagem));

        if (usuario == null) 
        {
            res.render('paginaERRO', {erro : "Usuario não encontrado, volte e tente novamente!!!", link: '/'});
        } 
        else if(personagem == null || personagem.Usuario.toString() != TratamentoParamtrosDeRota(req.params.idUsuario))
        {
            res.render('paginaERRO', {erro : "Personagem não encontrado, volte e tente novamente!!!", link: `/Usuarios/${req.params.idUsuario}`});
        }
        else
        {
            res.render('personagens', {personagem});
        }
    } catch (error) {
        next(error);
    }
}

// EndPoint Para Atualizar As Infoemações Do Personagem No Banco De DaDos
exports.atualizarPersonagemPost = [

    body('nome').trim().escape().notEmpty(),
    body('idade').trim().escape(),
    body('personalidade').trim().escape(),
    body('hobies').trim().escape(),
    body('sonhos').trim().escape(),
    body('traumas').trim().escape(),
    body('objetivo').trim().escape(),
    body('informacoes').trim().escape(),
    body('corPele').trim().escape(),
    body('olhos').trim().escape(),
    body('cabelo').trim().escape(),
    body('altura').trim().escape(),
    body('peso').trim().escape(),
    body('roupas').trim().escape(),
    body('resumoPersonagem').trim().escape(),

    async (req, res, next) => {
        try {
            let errors = validationResult(req);

            let usuario = await Usuarios.buscaUsuarioPeloId(TratamentoParamtrosDeRota(req.params.idUsuario));

            let personagem = await Personagens.buscaPersonagem(TratamentoParamtrosDeRota(req.params.idPersonagem));

            if (!errors.isEmpty())
            {
                res.render('paginaERRO', {erro: 'Um Erro Aconteceu Na Validação Dos Dados, volte e tente novamente!!!', link : `/Usuarios/${req.params.idUsuario}/personagem/${req.params.idPersonagem}`});
            }
            else if(usuario == null)
            {
                res.render('paginaERRO', {erro: 'Usuario Não Encontrado, Volte E Tente Novamente!!!', link : '/'});
            }
            else if(personagem == null || personagem.Usuario.toString() != TratamentoParamtrosDeRota(req.params.idUsuario))
            {
                res.render('paginaERRO', {erro : "Personagem não encontrado, volte e tente novamente!!!", link: `/Usuarios/${req.params.idUsuario}`});
            }
            else
            {
                let personagemASerAtualizado = new Personagens(req.body.nome, req.body.idade, req.body.personalidade, req.body.hobies, req.body.sonhos, req.body.traumas, req.body.objetivo, req.body.informacoes, TratamentoParamtrosDeRota(req.params.idUsuario), req.body.corPele, req.body.olhos, req.body.cabelo, req.body.altura, req.body.peso, req.body.roupas, req.body.resumoPersonagem);

                console.log(req.body.nome, req.body.idade, req.body.personalidade, req.body.hobies, req.body.sonhos, req.body.traumas, req.body.objetivo, req.body.informacoes, TratamentoParamtrosDeRota(req.params.idUsuario), req.body.corPele, req.body.olhos, req.body.cabelo, req.body.altura, req.body.peso, req.body.roupas, req.body.resumoPersonagem)

                let personagemAtualizado = await personagemASerAtualizado.atualizaPersonagem(TratamentoParamtrosDeRota(req.params.idPersonagem));

                console.log(personagemAtualizado)

                switch (personagemAtualizado.modifiedCount) {
                    case 0:
                        res.render('paginaERRO', {erro : 'Um Erro Ao Atualizar O Personagem Aconteceu, volte e tente novamente!!!', link : `/Usuarios/${req.params.idUsuario}/personagem/${req.params.idPersonagem}`});
                        break;
                
                    default:
                        res.redirect(`/Usuarios/${req.params.idUsuario}/personagem/${TratamentoParamtrosDeRota(req.params.idPersonagem)}`);
                        break;
                }
            }
        } catch (error) {
            next(error);
        }
    }
];

// EndPoint Para Deletar Os Personagens Do Banco De Dados
exports.deletarPersonagem = async (req, res, next) => {
    try {
        let usuario = await Usuarios.buscaUsuarioPeloId(TratamentoParamtrosDeRota(req.params.idUsuario));

        let personagem = await Personagens.buscaPersonagem(TratamentoParamtrosDeRota(req.params.idPersonagem));

        if (usuario == null)
        {
            res.render('paginaERRO', {erro : "Usuario não encontrado, volte e tente novamente!!!", link: '/'});
        }
        else if(personagem == null || personagem.Usuario.toString() != TratamentoParamtrosDeRota(req.params.idUsuario))
        {
            res.render('paginaERRO', {erro : "Personagem não encontrado, volte e tente novamente!!!", link: `/Usuarios/${req.params.idUsuario}`});
        }
        else
        {
            let deletaPersonagemDosCapitulos = await PersonagensCapitulo.deletaPersonagensDoCapituloPeloIdPersonagem(TratamentoParamtrosDeRota(req.params.idPersonagem));
            let personagemDeletado = await Personagens.deletarPersonagem(TratamentoParamtrosDeRota(req.params.idPersonagem));

            switch (personagemDeletado) {
                case null:
                    res.render('paginaERRO', {erro: 'Um Erro Aconteceu Ao Deletar O Personagem, Volte E Tente Novamente!!!'});
                    break;
            
                default:
                    res.redirect(`/Usuarios/${req.params.idUsuario}`);
                    break;
            }
        }
    } catch (error) {
        next(error);
    }
}
