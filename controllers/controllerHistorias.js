// Importando os Modelos
const Historias = require('../models/mHistorias'); // Modelo Historias
const Usuarios = require('../models/mUsuarios'); // Modelo Usuarios
const Capitulos = require('../models/mCapitulos'); // Modelo Cápitulos
const Anotacoes = require('../models/mAnotacoesCapitulos'); // Modelo das anotações
const Personagens = require('../models/mPersonagens'); // Modelo Personagens
const PersonagensCapitulo = require('../models/mPersonagensCapitulo'); // Modelo personagens da anotação
const CenariosCapitulo = require('../models/mCenariosCapitulo'); // Modelo cenarios da anotação

// Importando a função para tratar os parametros de rota
var tratamentoParametroDeRota = require('../assets/tratamentoParametroRota');

// Importando os métodos do express-validator
const { validationResult, body } = require('express-validator');
const trataParametrosDeRota = require('../assets/tratamentoParametroRota');

// Endpoint para renderizar o template de criação de uma nova historia
exports.adicionaHistoriaGet = async (req, res, next) => {
    try {
        let usuarioDaHistoria = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

        if (usuarioDaHistoria == null) 
        {
            res.render('paginaERRO', {erro: 'O USUARIO NÃO EXISTE'});
        } 
        else 
        {
            res.render('adicionaHistoria', {id_Usuario: req.params.idUsuario});
        }
    } catch (error) {
        next(error);
    }
}

// Endpoint para adicionar uma nova historia
exports.adicionaHistoriaPost = [
    body('titulo').trim().escape().notEmpty(),
    body('prologo').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {

            let errors = validationResult(req);

            let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

            if(!errors.isEmpty())
            {
                res.redirect(`http://localhost:3000/Usuarios/:${usuario._id.toString()}/NovaHistoria`); // Da uma atenção aqui
            }
            else if(usuario == null)
            {
                res.render('paginaERRO', {erro: 'O USUARIO NÃO EXISTE'});
            }
            else
            {
                let novaHistoria = new Historias(req.body.titulo, req.body.prologo, tratamentoParametroDeRota(req.params.idUsuario));

                let idNovaHistoria = await novaHistoria.addHistorias();

                res.redirect(`http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${idNovaHistoria}}`);
            }
        } catch (error) {
            next(error);
        }
    }
];

// Endpoint que renderiza o template da historia com os dados da historia
exports.buscaHistoria = async (req, res, next) => {
    try {

        // Busca se o usuario existe no banco de dados com base no id inserido no parametro de rota 
        let usuarioDaHistoria = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

        // Busca as historias atraves do parametro de rota que traz o id da historia
        let historiaBuscada = await Historias.buscaHistoria(tratamentoParametroDeRota(req.params.idHistooria));

        // verifica se a busca da historia retorna algo ou não
        if(usuarioDaHistoria == null)
        {
            res.render('paginaERRO', {erro: 'O USUARIO NÃO EXISTE'});
        }
        else if (historiaBuscada == null) 
        {
            res.render('paginaERRO', {erro: 'A HISTÓRIA NÃO EXISTE'}); // DA UMA ATENÇÃO AQUI!!!
        } 
        else
        {
            let capitulosBuscados = await Capitulos.buscaCapitulos(historiaBuscada._id.toString());
            res.render('historias', {historia: historiaBuscada, capitulos: capitulosBuscados }); // Rederiza o template da historia e através das variaveis de template passamos as informações da história
        }
    } catch (error) { // Caso algum erro aconteça esse erro sera passado para o midleware para tratar erros do express
        next(error);
    }
}

// Endpoint para autualizar as historias ja criadas
exports.atualizaHistoria = [

    // sanitiza os dados trazidos pelo corpo da requisição http
    body('titulo').trim().escape().notEmpty(),
    body('prologo').trim().escape().notEmpty(),

    async (req, res, next) => {

        let errors = validationResult(req);
        let usuarioDaHistoria = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

        try {
            if (!errors.isEmpty()) 
            {
                res.render('historia', {notify: "Verifique se os campos não estão vizios e tente novamente!!!", titulo: req.body.titulo, texto: req.body.texto}); //   DA UMA TAENÇÃO AQUI
            }
            else if(usuarioDaHistoria == null)
            {
                res.render('paginaERRO', {erro: 'O USUARIO NÃO EXISTE'});
            }
            else
            {
                // Estancia a classe de "modelo da historia"
                var historia = new Historias( req.body.titulo, req.body.prologo, tratamentoParametroDeRota(req.params.idUsuario) );

                await historia.attHistoria(tratamentoParametroDeRota(req.params.idHistooria));

                res.redirect(`http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistooria)}`)
            }
        } catch (error) {
            next(error);
        }
    }
]

exports.deletaHistoria = async (req, res, next) => {
    try {
        let usuarioDaHistoria = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));
        let historiaADeletar = await Historias.buscaHistoria(tratamentoParametroDeRota(req.params.idHistooria));

        if (usuarioDaHistoria == null) 
        {
            res.render('paginaERRO', {erro: 'O USUARIO NÃO EXISTE'});
        } 
        else if(historiaADeletar == null) 
        {
            res.render('paginaERRO', {erro: 'A HISTÓRIA NÃO EXISTE'});
        }
        else 
        {
            await Anotacoes.deletarAnotacoesPeloIdHistoria(trataParametrosDeRota(req.params.idHistooria));

            await Capitulos.deletarVariosCapitulos(tratamentoParametroDeRota(req.params.idHistooria));

            await Historias.deleteHistoria(tratamentoParametroDeRota(req.params.idHistooria));

            res.redirect(`http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}`)
        }

    } catch (error) {
        next(error);
    }
}

// Capitulos da história 

// Endpoint que renderiza o template para adicionar capitulos
exports.adicionaCapituloGet = async (req, res, next) => {
    try {
        let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

        let historia = await Historias.buscaHistoria(tratamentoParametroDeRota(req.params.idHistoria));

        if(usuario == null)
        {
            res.render('paginaERRO', { erro : 'Usuario não encontrado' }) ;
        } 
        else if(historia == null || historia.Usuario != tratamentoParametroDeRota(req.params.idUsuario))
        {
            res.render('paginaERRO', { erro: 'Historia não encontrada' });
        } 
        else
        {
            res.render('adicionaCapitulo', {id_Usuario : tratamentoParametroDeRota(req.params.idUsuario), id_Historia : tratamentoParametroDeRota(req.params.idHistoria)});
        }  
    } catch (error) {
        next(error);
    }
}

// Endpoint que adiciona um novo cápitulo a uma historia no banco de dados
exports.adicionaCapituloPost = [

    body('tituloCapitulo').trim().escape().notEmpty(),
    body('textoCapitulo').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {
            let errors = validationResult(req);

            let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

            let historia = await Historias.buscaHistoria(tratamentoParametroDeRota(req.params.idHistoria));

            if (!errors.isEmpty()) 
            {
                res.render('paginaERRO', {erro : 'Algo de errado nos inputs'});
            } 
            else if(usuario == null)
            {
                res.render('paginaERRO',{erro : 'O usuario não existe'});
            }
            else if(historia == null)
            {
                res.render('paginaERRO',{ erro: 'Usuario não existe' });
            }
            else
            {
                let novoCapitulo = new Capitulos( req.body.tituloCapitulo, req.body.textoCapitulo, tratamentoParametroDeRota(req.params.idHistoria), tratamentoParametroDeRota(req.params.idUsuario) );

                let capituloAdicionado = await novoCapitulo.adicionarCapitulo();

                res.redirect(`http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${capituloAdicionado.toString()}`);
            }

        } catch (error) {
            next(error);
        }
    }

];

// Endpoint para renderizar o template com um capitulo 
exports.BuscaCapitulo = async (req, res, next) => {
    try {

        let todosPersonagensDoCapitulo = [];

        let idsPorOrdem = [];

        let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

        let historia = await Historias.buscaHistoria(tratamentoParametroDeRota(req.params.idHistoria));

        let capituloBuscado = await Capitulos.buscaCapitulo(tratamentoParametroDeRota(req.params.idCapitulo));

        if(usuario == null)
        {
            res.render('paginaERRO', {erro:'Usuario não encontrado'});
        } 
        else if(historia == null || historia.Usuario != tratamentoParametroDeRota(req.params.idUsuario))
        {
            res.render('paginaERRO', { erro:'Historia não encontrada' });
        } 
        else if(capituloBuscado == null)
        {
           res.render('paginaERRO', { erro: 'Capitulo não encontrado' });
        }
        else
        {
            let anotacoesDoCapitulo = await Anotacoes.buscaAnotacoes(tratamentoParametroDeRota(req.params.idCapitulo));

            let personagens = await Personagens.buscaPersonagens();

            let personagensCapitulo = await PersonagensCapitulo.buscaPersonagensDoCapitulo(trataParametrosDeRota(req.params.idCapitulo));

            for (const element of personagensCapitulo) { 
                todosPersonagensDoCapitulo.push(await Personagens.buscaPersonagem(element.Personagem.toString()));
                idsPorOrdem.push(element._id.toString());
            }

            res.render('capitulos', {id_Usuario : tratamentoParametroDeRota(req.params.idUsuario), id_Historia : tratamentoParametroDeRota(req.params.idHistoria), capitulo : capituloBuscado, anotacoes : anotacoesDoCapitulo, personagens, personagensCapitulo : todosPersonagensDoCapitulo, idsDosPersonagensDoCapitulo: idsPorOrdem});
        }

    } catch (error) {
        next(error);
    }
}

exports.AtualizaCapitulo = [

    body('tituloCapitulo').trim().escape().notEmpty(),
    body('textoCapitulo').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {
            
            let errors = validationResult(req);

            let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

            let historia = await Historias.buscaHistoria(tratamentoParametroDeRota(req.params.idHistoria));

            let capituloBuscado = await Capitulos.buscaCapitulo(tratamentoParametroDeRota(req.params.idCapitulo));

            if (!errors.isEmpty()) 
            {
                res.render('paginaERRO', { erro:`Erro nos campos do txt` } );
            }
            else if(usuario == null)
            {
                res.render("paginaERRO", { erro:'Usuario não encontrado' });
            } 
            else if(historia == null || historia.Usuario != tratamentoParametroDeRota(req.params.idUsuario))
            {
                res.render('paginaERRO', { erro:'Historia não encontrada' });
            } 
            else if(capituloBuscado == null)
            {
            res.json('Capitulo não encontrado');
            }
            else
            {
                let atualizandoCapitulo = new Capitulos(req.body.tituloCapitulo, req.body.textoCapitulo, tratamentoParametroDeRota(req.params.idHistoria));

                await atualizandoCapitulo.atuaizarCapitulo(tratamentoParametroDeRota(req.params.idCapitulo));

                res.redirect(`http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`);
            }

        } catch (error) {
            next(error);
        }
    }
];

exports.deletarCapitulo = async (req, res, next) => {
    try {
        let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

        let historia = await Historias.buscaHistoria(tratamentoParametroDeRota(req.params.idHistoria));

        let capituloBuscado = await Capitulos.buscaCapitulo(tratamentoParametroDeRota(req.params.idCapitulo));

        if (usuario == null) 
        {
            res.render('paginaERRO', {erro: "Um erro Inesperado aconteceu tente relogar e tentar novamente!!! \n Usuario não enconrtrado"});
        }
        else if (historia == null)
        {
            res.render('paginaERRO', {erro: "Um Erro Inesperado Aconteceu tente relogar e tente novamente \n Historia não encontrada"});
        }
        else if (capituloBuscado == null)
        {
            res.render('paginaERRO', {erro: "Um erro inesperado aconteceu relogue e tente novamente \n Capitulo não encontrado"});
        }
        else 
        {
            await Anotacoes.deletarAnotacoes(trataParametrosDeRota(req.params.idCapitulo));
            await Capitulos.deletarCapitulo(tratamentoParametroDeRota(req.params.idCapitulo));

            res.redirect(`http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}`);
        }
    } catch (error) {
        next(error);
    }
}

exports.adicionarAnotacao = [

    body('focoCapitulo').trim().escape().notEmpty(),
    body('humorCapitulo').trim().escape().notEmpty(),

    async ( req, res, next ) => {
        try {
            let errors = validationResult(req);
            let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));
            let capitulo = await Capitulos.buscaCapitulo(tratamentoParametroDeRota(req.params.idCapitulo));

            if (!errors.isEmpty()) 
            {
                res.render('paginaERRO', { erro:`Erro nos campos do txt` } );
            }
            else if(usuario == null) 
            {
                res.render('paginaERRO', {erro: "Usuario não encontrado volte ao inicio e tente novamente!!!"});
            }
            else if(capitulo == null)
            {
                res.render('paginaERRO', {erro: "Capitulo não encontrado volte ao inicio e tente novamente!!!"});
            }
            else if(capitulo.Historia.toString() != tratamentoParametroDeRota(req.params.idHistoria) )
            {
                res.render('paginaERRO', {erro: "O id da historia não corresponde a este capitulo, volte ao inicio e tente novamente!!!"});
            }
            else
            {
                let novaAnotacao = new Anotacoes(req.body.focoCapitulo, req.body.humorCapitulo, tratamentoParametroDeRota(req.params.idCapitulo), trataParametrosDeRota(req.params.idHistoria));

                await novaAnotacao.adicionarAnotacao();

                res.redirect(`http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`);
            }
        } catch (error) {
            next(error);
        }
    }
];

exports.deletarAnotacao = async (req, res, next) => {
    try {
        
        let usuario  = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));
        let capitulo = await Capitulos.buscaCapitulo(trataParametrosDeRota(req.params.idCapitulo));
        let anotacao = await Anotacoes.buscaAnotacao(trataParametrosDeRota(req.params.idAnotacao))

        if (usuario == null) 
        {
            res.render('paginaERRO', {erro: "Usuario não encontrado volte do inicio e tente novamente!!!"});
        }
        else if(capitulo == null)
        {
            res.render('paginaERRO', {erro: "Capitulo não encontrado volte do inicio e tente novamente!!!"});
        }
        else if(capitulo.Historia.toString() != trataParametrosDeRota(req.params.idHistoria))
        {
            res.render('paginaERRO', {erro: "O id da historia não corresponde a este capitulo, volte do inicio e tente novamente!!!"});
        }
        else if(anotacao == null)
        {
            res.render('paginaERRO', {erro: "Esta anotação não existe!!!"});
        }
        else
        {
            let anotacaoExcluida = await Anotacoes.deletarAnotacao(tratamentoParametroDeRota(req.params.idAnotacao));

            switch (anotacaoExcluida) {
                case null:
                    res.render('paginaERRO', {erro: "Erro ao excluir tente novamente"});
                    break;
            
                default:
                    res.redirect(`http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`);
                    break;
            }
        }

    } catch (error) {
        next(error);
    }
}

exports.atualizarAnotacaoGet = async (req, res, next) => {
    try {
        let anotacaoBuscada = await Anotacoes.buscaAnotacao(tratamentoParametroDeRota(req.params.idAnotacao));
        res.render('atualizarAnotacao', {anotacao: anotacaoBuscada});
    } catch (error) {
        next(error);
    }
}

exports.atualizarAnotacaoPost = [

    body('focoCapitulo').trim().escape().notEmpty(),
    body('humorCapitulo').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {

            let usuario = await Usuarios.buscaUsuarioPeloId(trataParametrosDeRota(req.params.idUsuario));
            let capitulo = await Capitulos.buscaCapitulo(trataParametrosDeRota(req.params.idCapitulo));
            let anotacao = await Anotacoes.buscaAnotacao(trataParametrosDeRota(req.params.idAnotacao));

            if (usuario == null) 
            {
                res.render('paginaERRO', {erro: "Usuario não encontrado volte do inicio e tente novamente!!!"});
            } 
            else if (capitulo == null)
            {
                res.render('paginaERRO', {erro: "Capitulo Não encontarado, volte etente novamente!!!"});
            }
            else if (capitulo.Historia.toString() != tratamentoParametroDeRota(req.params.idHistoria)) 
            {
                res.render('paginaERRO', {erro: "A historia não pertence a esse capitulo, volte e tente novamente!!!"});
            }
            else if (anotacao == null)
            {
                res.render('paginaERRO', {erro: "Anotacao Não encontrada, volte do inicio e tente novamente!!!"})
            }
            else
            {
                anotacao = new Anotacoes(req.body.focoCapitulo, req.body.humorCapitulo, trataParametrosDeRota(req.params.idAnotacao), tratamentoParametroDeRota(req.params.idHistoria));

                let anotacaoAtualizada = await anotacao.atualizarAnotacao(trataParametrosDeRota(req.params.idAnotacao));

                switch (anotacaoAtualizada) {
                    case null:
                        res.render('paginaERRO', {erro: "Um erro inesperado aconteceu, volte e tente novamente!!!"});
                        break;
                
                    default:
                        res.redirect(`http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`);
                        break;
                }
            }    

        } catch (error) {
            next(error);
        }
    }
];

// Adicionar Personagens no capitulo
exports.adicionaPersonagensNoCapitulo = [ // Falta fazer a verificação de cada parametro de rota para que não de boqueta!!!

    body('personagem').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {
            let adicionandoPersonagemNoCapitulo = new PersonagensCapitulo( req.body.personagem, trataParametrosDeRota(req.params.idCapitulo));

            await adicionandoPersonagemNoCapitulo.adicionarPersonagemNoCapitulo();

            res.redirect(`http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`)
        } catch (error) {
            next(error);
        }
    }
];

exports.deletarPersonagemDoCapitulo = async (req, res, next) => {
    try {
        let usuario = await Usuarios.buscaUsuarioPeloId(trataParametrosDeRota(req.params.idUsuario));

        let capitulo = await Capitulos.buscaCapitulo(trataParametrosDeRota(req.params.idCapitulo));

        let personagemDoCapitulo = await PersonagensCapitulo.buscaPersonagemDoCapitulo(trataParametrosDeRota(req.params.idPersonagemDoCapitulo));

        if (usuario == null) 
        {
            res.render('paginaERRO', {erro: "Usuario Não encontrado, volte ao inicio e tente novamente!!!"});    
        } 
        else if(capitulo == null)
        {
            res.render('paginaERRO', {erro: "Capitulo não encontrado, volte ao inicio e tente novamente!!!"});
        }
        else if(capitulo.Historia.toString() != trataParametrosDeRota(req.params.idHistoria))
        {
            res.render('paginaERRO', {erro: "O Capitulo Pesquisado não é dessa historia, volte ao inicio e tente novamente!!!"});
        }
        else if(personagemDoCapitulo == null)
        {
            res.render('paginaERRO', {erro: "O personagem não existe nesse capitulo, volte ao inicio e tente novamente!!!"});
        }
        else
        {
            let personagemDeletadoDoCapitulo = await PersonagensCapitulo.deletarPersonagemDoCapitulo(tratamentoParametroDeRota(req.params.idPersonagemDoCapitulo));

            switch (personagemDeletadoDoCapitulo) {
                case null:
                    res.render('paginaErro', {erro: "Erro ao deletear o personagem tente novamente mais tarde!!!"});
                    break;
            
                default:
                    res.redirect(`http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`);
                    break;
            }
        }
    } catch (error) {
        next(error);
    }
}
