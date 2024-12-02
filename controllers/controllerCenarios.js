// Importando a classe modelo dos cenarios
const Cenarios = require('../models/mCenarios');

// Importando a classe modelo dos usuarios
const Usuarios = require('../models/mUsuarios');

// Importando a classe modelo que vincula os capitulos aos cenarios
const CapitulosDoCenario = require('../models/mCenariosCapitulo');

// Importando a classe modelo das historias
const Historias = require('../models/mHistorias');

// Importando a classe modelo dos personagens
const Personagens = require('../models/mPersonagens');

// Importando a função de tratamento dos parametros de rotas
const TratamentoParametrosDeRotas = require('../assets/tratamentoParametroRota');

// Importando a biblioteca para validar e sanitizar dados vindos da requesição http post
const { validationResult, body } = require('express-validator');

exports.criarCenarioGet = async (req, res, next) => { // Endpoint que retorna um template para criação de um novo cenario
    try 
    {
        let usuario = await Usuarios.buscaUsuarioPeloId(TratamentoParametrosDeRotas(req.params.idUsuario));

        if (usuario == null)
        {
            res.render("paginaERRO", {erro : "Usuario não encontardo, volte e faça o login novamente!", link : `/`});
        }
        else
        {
            res.render('adicionarCenario', {UsuarioID: usuario._id.toString()});
        }
    } 
    catch (error) 
    {
        next(error);
    }
}

exports.criarCenarioPost = [ // Endpoint que salva as informações do personagem no banco de dados

    // Sanitizando os dados vindo do body da requisição
    body('nome').trim().escape().notEmpty(),
    body('ambientacao').trim().escape(),
    body('realOuFicticio').trim().escape(),
    body('regras').trim().escape(),
    body('conflitos').trim().escape(),
    body('geografia').trim().escape(),
    body('informacoesInportantes').trim().escape(),
    body('resumoDoCenario').trim().escape(),

    async (req, res, next) => { // Função de callback que adiciona o cenario ao banco de dados
        try 
        {
            let errors = validationResult(req);

            if (!errors.isEmpty()) 
            {
                res.render('paginaERRO', {erro : "Um erro aconteceu na validação dos dados inseridos, volte e tente novamente!", link : `/Usuarios/${req.params.idUsuario}/`})
            }

            let usuario = await Usuarios.buscaUsuarioPeloId(TratamentoParametrosDeRotas(req.params.idUsuario));

            if (usuario == null)
            {
                res.render("paginaERRO", {erro : "Usuario não encontardo, volte e faça o login novamente!", link : `/`});
            }
            

            let novoCenario = new Cenarios(req.body.nome, req.body.ambientacao, req.body.realOuFicticio, req.body.regras, req.body.conflitos, req.body.geografia, req.body.informacoesInportantes, req.body.resumoDoCenario, TratamentoParametrosDeRotas(req.params.idUsuario));

            let adicionandoNovoCenario = await novoCenario.adicionarCenario();

            switch (adicionandoNovoCenario) {
                case null:
                    res.render('paginaERRO', { erro : "Um erro inesperado aconteceu ao criar o cenario, volte e tente novamente!", link: `/Usuarios/${usuario._id.toString()}`});
                    break;
            
                default:
                    res.render('cenarios', { cenario : await novoCenario.buscaCenario1(adicionandoNovoCenario.toString()), capitulosVinculados : "", notify : "Capitulo criado com sucesso!", notifyErro : ""});
                    break;
            }
            
        } 
        catch (error) 
        {
            next(error);
        }
    }
];

exports.buscaCenario = async (req, res, next) => { // Endpoint que busca as informações de um cenario e o retorna em um template 
    try 
    {
        let usuario = await Usuarios.buscaUsuarioPeloId(TratamentoParametrosDeRotas(req.params.idUsuario));

        if (usuario == null)
        {
            res.render("paginaERRO", {erro : "Usuario não encontardo, volte e faça o login novamente!", link : `/`});
        }

        let cenario = await Cenarios.buscaCenario(TratamentoParametrosDeRotas(req.params.idCenario));

        if (cenario == null || cenario.Usuario.toString() != usuario._id.toString())
        {
            res.render("paginaERRO", {erro : "Cenario não encontardo, volte e faça o login novamente!", link : `/${req.params.idUsuario}/`});
        }
        else
        {
            res.render('cenarios', { cenario, capitulosVinculados : "", notify : "", notifyErro : ""});
        }
    } 
    catch (error) 
    {
        next(error);
    }
}

exports.atualizaCenario = [ // Endpoint que atualiza as informações dos cenarios no banco de dados

    // Sanitizando os dados vindo do body da requisição
    body('nome').trim().escape().notEmpty(),
    body('ambientacao').trim().escape(),
    body('realOuFicticio').trim().escape(),
    body('conflitos').trim().escape(),
    body('geografia').trim().escape(),
    body('informacoesInportantes').trim().escape(),
    body('resumoDoCenario').trim().escape(),

    async (req, res, next) => { // Função de callback que atualiza as informações do cenario no banco de dados
        try 
        {
            let errors = validationResult(req);

            if (!errors.isEmpty()) 
            {
                res.render('paginaERRO', {erro : "Um erro aconteceu na validação dos dados inseridos, volte e tente novamente!", link : `/Usuarios/${req.params.idUsuario}/`})
            }

            let usuario = await Usuarios.buscaUsuarioPeloId(TratamentoParametrosDeRotas(req.params.idUsuario));

            if (usuario == null)
            {
                res.render("paginaERRO", {erro : "Usuario não encontardo, volte e faça o login novamente!", link : `/`});
            }
            
            let cenario = await Cenarios.buscaCenario(TratamentoParametrosDeRotas(req.params.idCenario));

            if (cenario == null || cenario.Usuario.toString() != usuario._id.toString())
            {
                res.render("paginaERRO", {erro : "Cenario não encontardo, volte e faça o login novamente!", link : `/${req.params.idUsuario}/`});
            }
            else
            {
                let cenarioASerAtualizado = new Cenarios(req.body.nome, req.body.ambientacao, req.body.realOuFicticio, req.body.regras, req.body.conflitos, req.body.geografia, req.body.informacoesInportantes, req.body.resumoDoCenario, TratamentoParametrosDeRotas(req.params.idUsuario))

                let cenarioAtualizado = await cenarioASerAtualizado.atualizaCenario(TratamentoParametrosDeRotas(req.params.idCenario));

                switch (cenarioAtualizado.modifiedCount) {
                    case 0 || "0":
                        res.render('paginaERRO', { erro : "Um erro aconteceu ao atualizar o cenario, volte e tente novamente!", link : `/Usuarios/${req.params.idUsuario}/cenario/${req.params.idCenario}`});
                        break;

                    default:
                        res.render('cenarios', { cenario : await cenarioASerAtualizado.buscaCenario1(TratamentoParametrosDeRotas(req.params.idCenario)), capitulosVinculados : "", notify : "Cenario atualizado com sucesso!", notifyErro : ""});
                        break;
                }
            }


        } 
        catch (error) 
        {
            next(error);
        }
    }
];

exports.deletaCenario = async (req, res, next) => { // Endpoint que deleta um cenario
    try 
    {
        let usuario = await Usuarios.buscaUsuarioPeloId(TratamentoParametrosDeRotas(req.params.idUsuario));

        if (usuario == null)
        {
            res.render("paginaERRO", {erro : "Usuario não encontardo, volte e faça o login novamente!", link : `/`});
        }
        
        let cenario = await Cenarios.buscaCenario(TratamentoParametrosDeRotas(req.params.idCenario));

        if (cenario == null || cenario.Usuario.toString() != usuario._id.toString())
        {
            res.render("paginaERRO", {erro : "Cenario não encontardo, volte e tente novamente login novamente!", link : `/Usuarios/${req.params.idUsuario}/`});
        }
        else
        {
            let desvinculandoOsCapitulosDoCenario = await CapitulosDoCenario.desvincularTodosOsCapitulosDoCenario(cenario._id.toString());

            let excluindoCenario = await Cenarios.deletarCenario(cenario._id.toString()) 

            if (excluindoCenario) 
            {
                res.render('usuarios', {notify: "Cenario Deletado com sucesso!", historias: await Historias.buscaHistorias(TratamentoParametrosDeRotas(req.params.idUsuario)), "Personagens" : await Personagens.buscaPersonagens(TratamentoParametrosDeRotas(req.params.idUsuario)), cenarios: await Cenarios.buscaCenarios(TratamentoParametrosDeRotas(req.params.idUsuario)) ,id_Usuario : req.params.idUsuario, fotoPerfil : await Imagens.BuscaImagem(TratamentoParamtrosDeRota(req.params.idUsuario), "FotoPerfil")});
            }

            res.render('paginaERRO', {erro : "Um erro aconteceu ao excluir o cenario, volte e tente novamente!", link : `/Usuarios/${req.params.idUsuario}/cenario/${req.params.idCenario}`});
        }
        
    } 
    catch (error) 
    {
        next(error);
    }
}
