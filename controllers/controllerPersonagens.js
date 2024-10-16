const Personagens = require('../models/mPersonagens');
const Usuarios = require('../models/mUsuarios');

const TratamentoParamtrosDeRota = require('../assets/tratamentoParametroRota');

const { validationResult, body } = require('express-validator');

// Endpoint que retorna um template para criar um usuario
exports.adicionarPersonagemGet = async (req, res, next) => {
    try {
        let usuario = await Usuarios.buscaUsuarioPeloId(TratamentoParamtrosDeRota(req.params.idUsuario));

        if (usuario == null) 
        {
            res.render('paginaERRO', {erro : "Usuario não encontrado, volte e tente novamente!!!", link: 'http://localhost:3000'});
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
    body('idade').trim().escape().notEmpty(),
    body('personalidade').trim().escape().notEmpty(),
    body('hobies').trim().escape().notEmpty(),
    body('sonhos').trim().escape().notEmpty(),
    body('traumas').trim().escape().notEmpty(),
    body('objetivo').trim().escape().notEmpty(),
    body('informacoes').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {
            let errors = validationResult(req);

            let usuario = await Usuarios.buscaUsuarioPeloId(TratamentoParamtrosDeRota(req.params.idUsuario));

            if (!errors.isEmpty()) 
            {
                res.render('paginaERRO', {erro: 'Um Erro Aconteceu Na Validação Dos Dados, volte e tente novamente!!!', link : `http://localhost:3000/Usuarios/${req.params.idUsuario}/adicionarPersonagem`});
            } 
            else if(usuario == null)
            {
                res.render('paginaERRO', {erro: 'Usuario Não Encontrado, Volte E Tente Novamente!!!', link : 'http://localhost:3000'});
            }
            else
            {
                let personagemASerAdicionado = new Personagens(req.body.nome, req.body.idade, req.body.personalidade, req.body.hobies, req.body.sonhos, req.body.traumas, req.body.objetivo, req.body.informacoes, TratamentoParamtrosDeRota(req.params.idUsuario));

                let personagemAdicinado = await personagemASerAdicionado.adicionaPersonagem();

                switch (personagemAdicinado) {
                    case null:
                        res.render('paginaERRO', {erro : 'Um Erro Ao Adicionar O Personagem Aconteceu, volte e tente novamente!!!', link : `http://localhost:3000/Usuarios/${req.params.idUsuario}/adicionarPersonagem`});
                        break;
                
                    default:
                        res.redirect(`http://localhost:3000/Usuarios/${req.params.idUsuario}/personagem/${personagemAdicinado.toString()}`);
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
            res.render('paginaERRO', {erro : "Usuario não encontrado, volte e tente novamente!!!", link: 'http://localhost:3000'});
        } 
        else if(personagem == null || personagem.Usuario.toString() != TratamentoParamtrosDeRota(req.params.idUsuario))
        {
            res.render('paginaERRO', {erro : "Personagem não encontrado, volte e tente novamente!!!", link: `http://localhost:3000/Usuarios/${req.params.idUsuario}`});
        }
        else
        {
            res.render('personagens', {personagem});
        }
    } catch (error) {
        next(error);
    }
}

// Endpoint que retorna um template para atualizar um personagem
// exports.atualizarPersonagemGet = async (req, res, next) => {
//     try {
//         let usuario = await Usuarios.buscaUsuarioPeloId(TratamentoParamtrosDeRota(req.params.idUsuario));

//         let personagem = await Personagens.buscaPersonagem(TratamentoParamtrosDeRota(req.params.idPersonagem));

//         if (usuario == null) 
//         {
//             res.render('paginaERRO', {erro : "Usuario não encontrado, volte e tente novamente!!!", link: 'http://localhost:3000'});
//         } 
//         else if(personagem == null || personagem.Usuario.toString() != TratamentoParamtrosDeRota(req.params.idUsuario))
//         {
//             res.render('paginaERRO', {erro : "Personagem não encontrado, volte e tente novamente!!!", link: `http://localhost:3000/Usuarios/${req.params.idUsuario}`});
//         }
//         else
//         {
//             res.render('atualizarPersonagem', {personagem});
//         }
//     } catch (error) {
//         next(error);
//     }
// }

// EndPoint Para Atualizar As Infoemações Do Personagem No Banco De DaDos
exports.atualizarPersonagemPost = [

    body('nome').trim().escape().notEmpty(),
    body('idade').trim().escape().notEmpty(),
    body('personalidade').trim().escape().notEmpty(),
    body('hobies').trim().escape().notEmpty(),
    body('sonhos').trim().escape().notEmpty(),
    body('traumas').trim().escape().notEmpty(),
    body('objetivo').trim().escape().notEmpty(),
    body('informacoes').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {
            let errors = validationResult(req);

            let usuario = await Usuarios.buscaUsuarioPeloId(TratamentoParamtrosDeRota(req.params.idUsuario));

            let personagem = await Personagens.buscaPersonagem(TratamentoParamtrosDeRota(req.params.idPersonagem));

            if (!errors.isEmpty()) 
            {
                res.render('paginaERRO', {erro: 'Um Erro Aconteceu Na Validação Dos Dados, volte e tente novamente!!!', link : `http://localhost:3000/Usuarios/${req.params.idUsuario}/adicionarPersonagem`});
            } 
            else if(usuario == null)
            {
                res.render('paginaERRO', {erro: 'Usuario Não Encontrado, Volte E Tente Novamente!!!', link : 'http://localhost:3000'});
            }
            else if(personagem == null || personagem.Usuario.toString() != TratamentoParamtrosDeRota(req.params.idUsuario))
            {
                res.render('paginaERRO', {erro : "Personagem não encontrado, volte e tente novamente!!!", link: `http://localhost:3000/Usuarios/${req.params.idUsuario}`});
            }
            else
            {
                let personagemASerAtualizado = new Personagens(req.body.nome, req.body.idade, req.body.personalidade, req.body.hobies, req.body.sonhos, req.body.traumas, req.body.objetivo, req.body.informacoes, TratamentoParamtrosDeRota(req.params.idUsuario));

                let personagemAtualizado = await personagemASerAtualizado.atualizaPersonagem();

                switch (personagemAtualizado) {
                    case null:
                        res.render('paginaERRO', {erro : 'Um Erro Ao Atualizar O Personagem Aconteceu, volte e tente novamente!!!', link : `http://localhost:3000/Usuarios/${req.params.idUsuario}/adicionarPersonagem`});
                        break;
                
                    default:
                        res.redirect(`http://localhost:3000/Usuarios/${req.params.idUsuario}/personagem/${personagemAtualizado._id.toString()}`);
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
            res.render('paginaERRO', {erro : "Usuario não encontrado, volte e tente novamente!!!", link: 'http://localhost:3000'});
        } 
        else if(personagem == null || personagem.Usuario.toString() != TratamentoParamtrosDeRota(req.params.idUsuario))
        {
            res.render('paginaERRO', {erro : "Personagem não encontrado, volte e tente novamente!!!", link: `http://localhost:3000/Usuarios/${req.params.idUsuario}`});
        }
        else
        {
            let personagemDeletado = await Personagens.deletarPersonagem(TratamentoParamtrosDeRota(req.params.idPersonagem));

            switch (personagemDeletado) {
                case null:
                    res.render('paginaERRO', {erro: 'Um Erro Aconteceu Ao Deletar O Personagem, Volte E Tente Novamente!!!'});
                    break;
            
                default:
                    res.redirect(`http://localhost:3000/Usuarios/${req.params.idUsuario}`);
                    break;
            }
        }
    } catch (error) {
        next(error);
    }
}
