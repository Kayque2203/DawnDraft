// Importando os Modelos
const Historias = require('../models/mHistorias'); // Modelo Historias
const Usuarios = require('../models/mUsuarios'); // Modelo Usuarios
const Capitulos = require('../models/mCapitulos'); // Modelo Cápitulos
const FocoDoCapitulo = require('../models/mFocoDosCapitulos'); // Modelo dos focos dos capitulos 
const Personagens = require('../models/mPersonagens'); // Modelo Personagens
const PersonagensCapitulo = require('../models/mPersonagensCapitulo'); // Modelo personagens da anotação
const CenariosCapitulo = require('../models/mCenariosCapitulo'); // Modelo cenarios da anotação

// Importando a função para tratar os parametros de rota
var tratamentoParametroDeRota = require('../assets/tratamentoParametroRota');

// Importando os métodos do express-validator
const { validationResult, body } = require('express-validator');
const trataParametrosDeRota = require('../assets/tratamentoParametroRota');
const HumorCapitulo = require('../models/mHumorCapitulo');

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
            res.render('paginaERRO', {erro:'Usuario não encontrado, volte e tente novamente!!!', link : `http://localhost:3000`});
        } 
        else if(historia == null || historia.Usuario != tratamentoParametroDeRota(req.params.idUsuario))
        {
            res.render('paginaERRO', { erro:'Historia não encontrada', link : `http://localhost:3000/Usuarios/${req.params.idUsuario}` });
        } 
        else if(capituloBuscado == null)
        {
           res.render('paginaERRO', { erro: 'Capitulo não encontrado', link : `http://localhost:3000/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}` });
        }
        else
        {
            let focosDoCapitulo = await FocoDoCapitulo.buscaFocosDoCapitulo(tratamentoParametroDeRota(req.params.idCapitulo));

            let humorDoCapitulo = await HumorCapitulo.buscaHumoresDoCapitulo(trataParametrosDeRota(req.params.idCapitulo));

            let personagens = await Personagens.buscaPersonagens();

            let personagensCapitulo = await PersonagensCapitulo.buscaPersonagensDoCapitulo(trataParametrosDeRota(req.params.idCapitulo));

            for (const element of personagensCapitulo) { 
                todosPersonagensDoCapitulo.push(await Personagens.buscaPersonagem(element.Personagem.toString()));
                idsPorOrdem.push(element._id.toString());
            }

            res.render('capitulos', {id_Usuario : tratamentoParametroDeRota(req.params.idUsuario), id_Historia : tratamentoParametroDeRota(req.params.idHistoria), capitulo : capituloBuscado, focoCapitulo : focosDoCapitulo, humor : humorDoCapitulo, personagens, personagensCapitulo : todosPersonagensDoCapitulo, idsDosPersonagensDoCapitulo: idsPorOrdem});
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
                res.render('paginaERRO', { erro:`Erro nos campos do txt`, link : `http://localhost:3000/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}/capitulo/${req.params.idCapitulo}` } );
            }
            else if(usuario == null)
            {
                res.render("paginaERRO", { erro:'Usuario não encontrado', link : 'http://localhost:3000'});
            } 
            else if(historia == null || historia.Usuario != tratamentoParametroDeRota(req.params.idUsuario))
            {
                res.render('paginaERRO', { erro:'Historia não encontrada', link : `htpp://localhost:3000/Usuarios/${req.params.idUsuario}` });
            } 
            else if(capituloBuscado == null)
            {
                res.render('paginaERRO', { erro:'Capitulo não encontrada, volte e tente novamnete!!!', link : `htpp://localhost:3000/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}` });
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
            res.render('paginaERRO', {erro: "Um erro Inesperado aconteceu tente relogar e tentar novamente!!!", link : 'http://localhost:3000'});
        }
        else if (historia == null)
        {
            res.render('paginaERRO', {erro: "Um Erro Inesperado Aconteceu ao buscar a historia, volte e tente novamente", link : `http://localhost:3000/Usuarios/${req.params.idUsuario}`});
        }
        else if (capituloBuscado == null)
        {
            res.render('paginaERRO', {erro: "Um erro inesperado aconteceu ao buscar o capitulo, volte e tente novamente!!!", link : `http://localhost:3000/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}`});
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
// Daqui para cima refatorar com o novo padrão ^
exports.adicionarFocoAoCapitulo = [

    body('focoCapitulo').trim().escape().notEmpty(),

    async ( req, res, next ) => {
        try {
            let errors = validationResult(req);
            let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));
            let capitulo = await Capitulos.buscaCapitulo(tratamentoParametroDeRota(req.params.idCapitulo));

            if (!errors.isEmpty()) 
            {
                res.render('paginaERRO', { erro:`Erro nos campos do txt`, link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`} );
            }
            else if(usuario == null) 
            {
                res.render('paginaERRO', {erro: "Usuario não encontrado volte ao inicio e tente novamente!!!", link : `http://localhost:3000/`});
            }
            else if(capitulo == null || capitulo.Usuario.toString() != tratamentoParametroDeRota(req.params.idUsuario) )
            {
                res.render('paginaERRO', {erro: "Capitulo não encontrado volte ao inicio e tente novamente!!!", link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}`});
            }
            else if(capitulo.Historia.toString() != tratamentoParametroDeRota(req.params.idHistoria))
            {
                res.render('paginaERRO', {erro: "O id da historia não corresponde a este capitulo, volte ao inicio e tente novamente!!!", link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}`});
            }
            else
            {
                let novoFocoAoCapitulo = new FocoDoCapitulo(req.body.focoCapitulo, tratamentoParametroDeRota(req.params.idCapitulo), trataParametrosDeRota(req.params.idHistoria));

                let focoAdicionado = await novoFocoAoCapitulo.adicionarFocoAoCapitulo();

                switch (focoAdicionado) {
                    case null:
                        res.render('paginaERRO', { erro : 'Um erro inesperado aconteceu volte e tente novamente!!!', link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`})
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

exports.deletarFocoCapitulo = async (req, res, next) => {
    try {
        
        let usuario  = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));
        let capitulo = await Capitulos.buscaCapitulo(trataParametrosDeRota(req.params.idCapitulo));
        let focoDoCapitulo = await FocoDoCapitulo.buscaFocoDoCapitulo(trataParametrosDeRota(req.params.idFocoDoCapitulo));

        if (usuario == null) 
        {
            res.render('paginaERRO', {erro: "Usuario não encontrado volte do inicio e tente novamente!!!", link : `http://localhost:3000`});
        }
        else if(capitulo == null || capitulo.Usuario.toString() != tratamentoParametroDeRota(req.params.idUsuario))
        {
            res.render('paginaERRO', {erro: "Capitulo não encontrado volte do inicio e tente novamente!!!", link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}`});
        }
        else if(capitulo.Historia.toString() != trataParametrosDeRota(req.params.idHistoria))
        {
            res.render('paginaERRO', {erro: "O id da historia não corresponde a este capitulo, volte do inicio e tente novamente!!!", link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}`});
        }
        else if(focoDoCapitulo == null)
        {
            res.render('paginaERRO', {erro: "O foco docapitulo não existe não existe!!!", link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`});
        }
        else
        {
            let focoCapituloExcluido = await FocoDoCapitulo.DeletarfocoDoCapitulo(tratamentoParametroDeRota(req.params.idFocoDoCapitulo));

            switch (focoCapituloExcluido) {
                case null:
                    res.render('paginaERRO', {erro: "Erro ao excluir tente novamente", link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`});
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

exports.atualizarFocoDoCapituloGet = async (req, res, next) => {
    try {
        let focoDoCapituloBuscado = await FocoDoCapitulo.buscaFocoDoCapitulo(trataParametrosDeRota(req.params.idFocoDoCapitulo));
        res.render('atualizarAnotacao', {anotacao: focoDoCapituloBuscado});
    } catch (error) {
        next(error);
    }
}

exports.atualizarFocoDoCapituloPost = [

    body('focoCapitulo').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {

            let usuario = await Usuarios.buscaUsuarioPeloId(trataParametrosDeRota(req.params.idUsuario));
            let capitulo = await Capitulos.buscaCapitulo(trataParametrosDeRota(req.params.idCapitulo));
            let focoDoCapituloBuscado = await FocoDoCapitulo.buscaFocoDoCapitulo(trataParametrosDeRota(req.params.idFocoDoCapitulo));

            if (usuario == null) 
            {
                res.render('paginaERRO', {erro: "Usuario não encontrado volte do inicio e tente novamente!!!", link : `http://localhost:3000`});
            } 
            else if (capitulo == null || capitulo.Usuario.toString() != tratamentoParametroDeRota(req.params.idUsuario))
            {
                res.render('paginaERRO', {erro: "Capitulo Não encontarado, volte e tente novamente!!!", link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/`});
            }
            else if (capitulo.Historia.toString() != tratamentoParametroDeRota(req.params.idHistoria)) 
            {
                res.render('paginaERRO', {erro: "A historia não pertence a esse capitulo, volte e tente novamente!!!", link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/`});
            }
            else if (focoDoCapituloBuscado == null)
            {
                res.render('paginaERRO', {erro: "Anotacao Não encontrada, volte do inicio e tente novamente!!!", link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}` })
            }
            else
            {
                focoDoCapituloBuscado = new FocoDoCapitulo(req.body.focoCapitulo, trataParametrosDeRota(req.params.idCapitulo), tratamentoParametroDeRota(req.params.idHistoria));

                let focoDoCapituloAtualizado = await focoDoCapituloBuscado.atualizarAnotacao(trataParametrosDeRota(req.params.idFocoDoCapitulo));

                switch (focoDoCapituloAtualizado) {
                    case null:
                        res.render('paginaERRO', {erro: "Um erro inesperado aconteceu, volte e tente novamente!!!", link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`});
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

// Parei aqui falta terminar as funções para deletar e atualizar o humor do capitulo feito isso só arummar os erros adicionar todos os links as chamadas do template PaginaERRO e fazer um Pull Request e A Feature Tela De CRiação De HIstoria Estará Acabada 
// Adiciona Humor Ao Capitulo, Isso Não Está Testado!!!
exports.adicionaHumorPost = [

    body('humor').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {
            let errors = validationResult(req);
            let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));
            let capitulo = await Capitulos.buscaCapitulo(trataParametrosDeRota(req.params.idCapitulo));

            if(!errors.isEmpty())
            {
                res.render('paginaERRO', {erro: "Um erro aconteceu na validação dos dados, verifique a inserção dos dados e tente novamente!!!", link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`});
            }
            else if(usuario == null)
            {
                res.render('paginaERRO', {erro: "Usuario Não Encontrado, volte e tente novamente!!!", link : `http://localhost:3000`});
            }
            else if(capitulo == null || capitulo.Usuario.toString() != tratamentoParametroDeRota(req.params.idUsuario))
            {
                res.render('paginaERRO', {erro : "Capitulo não encontrado volte ao inicio e tente novamente!!!", link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUSuario)}`});
            }
            else if(capitulo.Historia.toString() != tratamentoParametroDeRota(req.params.idHistoria))
            {
                res.render('paginaERRO', {erro : "Historia não encontrada, volte e tente novamente!!!", link : `htpp://localhost:3000/Usuarios/${req.params.idUsuario}`});
            }
            else 
            {
                let adicinandoHumor = new HumorCapitulo(req.body.humor, tratamentoParametroDeRota(req.params.idCapitulo), tratamentoParametroDeRota(req.params.idHistoria), tratamentoParametroDeRota(req.params.idUsuario));

                let humorAdicionado = await adicinandoHumor.adicionaHumorNoCapitulo()

                switch (humorAdicionado) {
                    case null:
                        res.render('paginaERRO', {erro: "Um erro aconteceu, volte e tente novamente!!!", link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`});
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
]

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
        else if(capitulo == null || capitulo.Usuario.toString() != tratamentoParametroDeRota(req.params.idUsuario))
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

// Falta Testar isso aqui não testei pois não tinha nenhum cenario cadastrado no banco, vou fazer a parte de cadastrar personagens e cernarios e ai podemos testar!!!
exports.adicionarCenarioNoCapitulo = [

    body('cenario').trim().escape().notEmpty(),

    async (req, res, next) => {

        try {

            let errors = validationResult(req); 

            let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

            let capitulo = await Capitulos.buscaCapitulo(trataParametrosDeRota(req.params.idCapitulo));

            if(!errors.isEmpty())
            {
                res.render('paginaERRO', {erro: "Um erro na inserção dos dados aconteceu, verifique se todos os dados foram inseridos corretamente!!!", link: `http://localhost:3000/Usuario/:${trataParametrosDeRota(req.params.idUsuario)}/historia/:${trataParametrosDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`});
            }
            else if(usuario == null)
            {
                res.render('paginaERRO', {erro: "Usuario não encontrado, volte e tente novamente!!!", link: `http://localhost:3000/`});
            }
            else if(capitulo == null || capitulo.Usuario.toString() != tratamentoParametroDeRota(req.params.idUsuario))
            {
                res.render('paginaERRO', {erro: "Capitulo não encontrado, volte e tente novamente!!!", link: `http://localhost:3000/Usuarios/:${trataParametrosDeRota(req.params.idUsuario)}/historia/:${trataParametrosDeRota(req.params.idHistoria)}`});
            }
            else if(capitulo.Historia.toString() != tratamentoParametroDeRota(req.params.idHistoria))
            {
                res.render('paginaERRO', {erro: "Capitulo não encontrado, volte e tente novamente!!!", link: `http://localhost:3000/Usuarios/:${trataParametrosDeRota(req.params.idUsuario)}/`});
            }
            else
            {
                let adicionaCenario = new CenariosCapitulo(req.body.cenario, trataParametrosDeRota(req.params.idUsuario));

                let adicionandoCenario = await adicionaCenario.adicionarCenarioNoCapitulo();

                switch (adicionandoCenario) {
                    case null:
                        res.render('paginaERRO', {erro: "Erro ao adicionar personagem, tente novamente!!!"});
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

exports.deletarCenarioDoCapitulo = async (req, res, next) => {
    let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));
    let capitulo = await Capitulos.buscaCapitulo(tratamentoParametroDeRota(req.params.idCapitulo));
    let cenarioQSeraDeletadoDoCapitulo = await CenariosCapitulo.buscaCenarioDoCapitulo(trataParametrosDeRota(req.params.idCenarioDoCapitulo));

    if(usuario == null)
    {
        res.render('paginaERRO', {erro: 'Usuario não encontrado, volte e tente novamente!!!', link : `http://localhost:3000`});
    }
    else if(capitulo == null || capitulo.Usuario.toString() != tratamentoParametroDeRota(req.params.idUsuario))
    {
        res.render('paginaERRO', { erro : "Capitulo não encontrado, volte e tente novamente!!!", link: `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}`});
    }
    else if(capitulo.Historia.toString() != tratamentoParametroDeRota(req.params.idUsuario))
    {
        res.render('paginaERRO', { erro : "Historia não encontrada, volte e tente novamente!!!", link: `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}`});
    }
    else if(cenarioQSeraDeletadoDoCapitulo == null)
    {
        res.render('paginaERRo', { erro : "O cenario não existe, volte e tente novamente!!!", link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`});
    }
    else
    {
        let cenarioDeletadoDoCapitulo = await CenariosCapitulo.deletarCenarioDoCapitulo(tratamentoParametroDeRota(req.params.idCenarioDoCapitulo));

        switch (cenarioDeletadoDoCapitulo) {
            case null:
                res.render('paginaERRO', { erro : "Um erro Aconteceu, volte e tente novamente!!!", link : `http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`});
                break;
        
            default:
                res.redirect(`http://localhost:3000/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`);
                break;
        }
    }
}
