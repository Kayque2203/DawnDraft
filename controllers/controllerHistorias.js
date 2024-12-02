// Importando os Modelos
const Historias = require('../models/mHistorias'); // Modelo Historias
const Usuarios = require('../models/mUsuarios'); // Modelo Usuarios
const Capitulos = require('../models/mCapitulos'); // Modelo Cápitulos
const Personagens = require('../models/mPersonagens'); // Modelo Personagens
const PersonagensCapitulo = require('../models/mPersonagensCapitulo'); // Modelo personagens da anotação
const Cenarios = require('../models/mCenarios'); // Modelo cenarios
const CenariosCapitulo = require('../models/mCenariosCapitulo'); // Modelo cenarios da anotação

// Importando a função para tratar os parametros de rota
const tratamentoParametroDeRota = require('../assets/tratamentoParametroRota');
const trataParametrosDeRota = require('../assets/tratamentoParametroRota');

// Importando os métodos do express-validator
const { validationResult, body } = require('express-validator');

// Endpoint para renderizar o template de criação de uma nova historia
exports.adicionaHistoriaGet = async (req, res, next) => {
    try {
        let usuarioDaHistoria = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

        if (usuarioDaHistoria == null) 
        {
            res.render('paginaERRO', {erro: 'O USUARIO NÃO EXISTE, volte e tente novamente!!!', link : '/'});
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
    body('prologo').trim().escape(),

    async (req, res, next) => {
        try {

            let errors = validationResult(req);

            let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

            if(!errors.isEmpty())
            {
                res.render('paginaERRO', {erro : "Aconteceu um erro na validação dos dados, verifique os dados inseridos e tente novamente!!!", link : `/Usuarios/${req.params.idUsuario}/NovaHistoria`});
            }
            else if(usuario == null)
            {
                res.render('paginaERRO', {erro: 'O USUARIO NÃO EXISTE, volte e tente novamente!!!', link : `/`});
            }
            else
            {
                let novaHistoria = new Historias(req.body.titulo, req.body.prologo, tratamentoParametroDeRota(req.params.idUsuario));

                let idNovaHistoria = await novaHistoria.addHistorias();

                switch (idNovaHistoria) {
                    case null:
                        res.render('paginaERRO', {erro : "Um erro aconteceu ao adicionar a historia, volte e tente novamente!", link : `/Usuarios/${req.params.idUsuario}`});
                        break;
                
                    default:
                        let historiaBuscada = await Historias.buscaHistoria(idNovaHistoria.toString());

                        let capitulosBuscados = await Capitulos.buscaCapitulos(historiaBuscada._id.toString());

                        res.render('historias', {notify : "Historia adicionada com secesso!", historia : historiaBuscada, capitulos : capitulosBuscados});
                        break;
                }                
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
        let historiaBuscada = await Historias.buscaHistoria(tratamentoParametroDeRota(req.params.idHistoria));

        // verifica se a busca da historia retorna algo ou não
        if(usuarioDaHistoria == null)
        {
            res.render('paginaERRO', {erro: 'O USUARIO NÃO EXISTE, volte e tente novamente!!!', link : '/'});
        }
        else if (historiaBuscada == null || historiaBuscada.Usuario.toString() != trataParametrosDeRota(req.params.idUsuario)) 
        {
            res.render('paginaERRO', {erro: 'A HISTÓRIA NÃO EXISTE, volte e tente novamente!!!', link : `/Usuario/${req.params.idUsuario}`});
        } 
        else
        {
            let capitulosBuscados = await Capitulos.buscaCapitulos(historiaBuscada._id.toString());
            res.render('historias', {historia: historiaBuscada, capitulos: capitulosBuscados, notify: "" }); // Rederiza o template da historia e através das variaveis de template passamos as informações da história
        }
    } catch (error) { // Caso algum erro aconteça esse erro sera passado para o midleware para tratar erros do express
        next(error);
    }
}

// Endpoint para autualizar as historias ja criadas
exports.atualizaHistoria = [

    // sanitiza os dados trazidos pelo corpo da requisição http
    body('titulo').trim().escape().notEmpty(),
    body('prologo').trim().escape(),

    async (req, res, next) => {

        let errors = validationResult(req);
        let usuarioDaHistoria = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));
        let buscandoHistoria = await Historias.buscaHistoria(tratamentoParametroDeRota(req.params.idHistoria));

        try {
            if (!errors.isEmpty()) 
            {
                res.render('paginaERRO', {erro : "Um erro aconteceu na validação dos dados, volte e tente novamente!!!", link : `/Usuarios/${req.params.idUsuario}historia/${req.params.idHistoria}`});
            }
            else if(usuarioDaHistoria == null)
            {
                res.render('paginaERRO', {erro: 'O USUARIO NÃO EXISTE, volte e tente novamente!!!', link : `/`});
            }
            else if(buscandoHistoria == null || buscandoHistoria.Usuario.toString() != tratamentoParametroDeRota(req.params.idUsuario))
            {
                res.render('paginaERRO', {erro : "Historia Não Encontrada, volte e tente novamente!!!", link : `/Usuarios/${req.params.idUsuario}`})
            }
            else
            {
                // Estancia a classe de "modelo da historia"
                let historia = new Historias( req.body.titulo, req.body.prologo, tratamentoParametroDeRota(req.params.idUsuario) );

                let attHistoria = await historia.attHistoria(tratamentoParametroDeRota(req.params.idHistoria));

                switch (attHistoria.modifiedCount) {
                    case 0:
                        res.render('paginaERRO', {erro: "Um Erro Ocorreu Ao Atualizar A Historia, Volte E Tente Novamente!!!", link : `/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}`})
                        break;
                
                    default:

                        buscandoHistoria = await Historias.buscaHistoria(trataParametrosDeRota(req.params.idHistoria));

                        let capitulosBuscados = await Capitulos.buscaCapitulos(buscandoHistoria._id.toString());

                        res.render('historias', {historia: buscandoHistoria, capitulos: capitulosBuscados, notify: "Historia atualizada com sucesso!" });
                        break;
                }
            }
        } catch (error) {
            next(error);
        }
    }
]

exports.deletaHistoria = async (req, res, next) => {
    try {
        let usuarioDaHistoria = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));
        let historiaADeletar = await Historias.buscaHistoria(tratamentoParametroDeRota(req.params.idHistoria));

        if (usuarioDaHistoria == null) 
        {
            res.render('paginaERRO', {erro: 'O USUARIO NÃO EXISTE, volte e tente novamente!!!', link : '/'});
        } 
        else if(historiaADeletar == null || historiaADeletar.Usuario.toString() != tratamentoParametroDeRota(req.params.idUsuario)) 
        {
            res.render('paginaERRO', {erro: 'A HISTÓRIA NÃO EXISTE, volte e tente novamente!!!', link : `/Usuarios/${req.params.idUsuario}`});
        }
        else 
        {
            // Falta a verificação para saber se esta tudo sendo deletado
            await PersonagensCapitulo.deletarTodosPersonagensDoCapituloPeloIdHistoria(tratamentoParametroDeRota(req.params.idHistoria));

            await CenariosCapitulo.ExcluirTodosOsCenariosDosCapitulosPeloIdHistoria(tratamentoParametroDeRota(req.params.idHistoria))

            await Capitulos.deletarVariosCapitulos(tratamentoParametroDeRota(req.params.idHistoria));

            await Historias.deleteHistoria(tratamentoParametroDeRota(req.params.idHistoria));


            let historias = await Historias.buscaHistorias(tratamentoParametroDeRota(req.params.idUsuario));

            let personagens = await Personagens.buscaPersonagens(tratamentoParametroDeRota(req.params.idUsuario));

            let cenarios = await Cenarios.buscaCenarios(tratamentoParametroDeRota(req.params.idUsuario));

            let fotoPerfil = await Imagens.BuscaImagem(TratamentoParamtrosDeRota(req.params.idUsuario), "FotoPerfil");

            res.render('usuarios', {notify: "Historia deletada com sucesso!", historias, "Personagens" : personagens, id_Usuario : req.params.idUsuario, cenarios, fotoPerfil});
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
            res.render('paginaERRO', { erro : 'Usuario não encontrado, volte e tente novamente', link : '/' });
        } 
        else if(historia == null || historia.Usuario.toString() != tratamentoParametroDeRota(req.params.idUsuario))
        {
            res.render('paginaERRO', { erro: 'Historia não encontrada, volte e tente novamente', link : `/Usuario/${req.params.idUsuario}`});
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
    body('textoCapitulo').trim().escape(),
    body('humorCapitulo').trim().escape(),
    body('focoCapitulo').trim().escape(),
    body("resumoCapitulo").trim().escape(),

    async (req, res, next) => {
        try {
            let errors = validationResult(req);

            let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

            let historia = await Historias.buscaHistoria(tratamentoParametroDeRota(req.params.idHistoria));

            if (!errors.isEmpty()) 
            {
                res.render('paginaERRO', {erro : 'Algo de errado nos inputs, volte e tente novamente', link: `/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}`});
            } 
            else if(usuario == null)
            {
                res.render('paginaERRO', { erro : 'Usuario não encontrado, volte e tente novamente', link : 'htpp://localhost:3000' });
            }
            else if(historia == null || historia.Usuario.toString() != trataParametrosDeRota(req.params.idUsuario))
            {
                res.render('paginaERRO', { erro: 'Historia não encontrada, volte e tente novamente', link : `/Usuario/${req.params.idUsuario}`});
            }
            else
            {
                let novoCapitulo = new Capitulos( req.body.tituloCapitulo, req.body.textoCapitulo, tratamentoParametroDeRota(req.params.idHistoria), tratamentoParametroDeRota(req.params.idUsuario), req.body.humorCapitulo, req.body.focoCapitulo, req.body.resumoCapitulo);

                let capituloAdicionado = await novoCapitulo.adicionarCapitulo();

                switch (capituloAdicionado) {
                    case null:
                        res.render('paginaRender',{erro : "Um erro aconteceu ao adicionar o capitulo!", link : `/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}`})
                        break;
                
                    default:
                        let capituloBuscado = await Capitulos.buscaCapitulo(capituloAdicionado.toString());
                        let personagens = await Personagens.buscaPersonagens(tratamentoParametroDeRota(req.params.idUsuario));
                        let cenarios = await Cenarios.buscaCenarios(tratamentoParametroDeRota(req.params.idUsuario));

                        res.render('capitulos', {id_Usuario : tratamentoParametroDeRota(req.params.idUsuario), id_Historia : tratamentoParametroDeRota(req.params.idHistoria), capitulo : capituloBuscado, personagens, personagensDoCapitulo : "",  cenarios, cenariosDoCapitulo: "",notify : "Capitulo criado com sucesso!", notifyErro:""});
                        break;
                }
            }

        } catch (error) {
            next(error);
        }
    }

];

// Endpoint para renderizar o template com um capitulo 
exports.BuscaCapitulo = async (req, res, next) => {
    try {
        let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

        let historia = await Historias.buscaHistoria(tratamentoParametroDeRota(req.params.idHistoria));

        let capitulo = await Capitulos.buscaCapitulo(tratamentoParametroDeRota(req.params.idCapitulo));

        if(usuario == null)
        {
            res.render('paginaERRO', {erro:'Usuario não encontrado, volte e tente novamente!!!', link : `/`});
        } 
        else if(historia == null || historia.Usuario.toString() != tratamentoParametroDeRota(req.params.idUsuario))
        {
            res.render('paginaERRO', { erro:'Historia não encontrada', link : `/Usuarios/${req.params.idUsuario}` });
        } 
        else if(capitulo == null)
        {
           res.render('paginaERRO', { erro: 'Capitulo não encontrado', link : `/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}` });
        }
        else
        {
            let personagens = await Personagens.buscaPersonagens(tratamentoParametroDeRota(req.params.idUsuario));

            let cenarios = await Cenarios.buscaCenarios(tratamentoParametroDeRota(req.params.idUsuario));

            let cenariosDoCapitulo = [];

            let personagensDoCapitulo = [];

            for (const cenario of await CenariosCapitulo.buscaCenariosVinculadosAoCapitulo(trataParametrosDeRota(req.params.idCapitulo))) {
                cenariosDoCapitulo.push(await Cenarios.buscaCenario(cenario.Cenario.toString()));
            }

            for (const element of await PersonagensCapitulo.buscaPersonagensDoCapitulo(trataParametrosDeRota(req.params.idCapitulo))) { 
                personagensDoCapitulo.push(await Personagens.buscaPersonagem(element.Personagem.toString()));
            }

            res.render('capitulos', {id_Usuario : tratamentoParametroDeRota(req.params.idUsuario), id_Historia : tratamentoParametroDeRota(req.params.idHistoria), capitulo, personagens, personagensDoCapitulo, cenarios, cenariosDoCapitulo, notify : "", notifyErro: ""});
        }

    } catch (error) {
        next(error);
    }
}

exports.AtualizaCapitulo = [

    body('tituloCapitulo').trim().escape().notEmpty(),
    body('textoCapitulo').trim().escape(),
    body('humorCapitulo').trim().escape(),
    body('focoCapitulo').trim().escape(),
    body("resumoCapitulo").trim().escape(),

    async (req, res, next) => {
        try {
            
            let errors = validationResult(req);

            let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

            let historia = await Historias.buscaHistoria(tratamentoParametroDeRota(req.params.idHistoria));

            let capitulo = await Capitulos.buscaCapitulo(tratamentoParametroDeRota(req.params.idCapitulo));

            if (!errors.isEmpty()) 
            {
                res.render('paginaERRO', { erro:`Erro nos campos do txt`, link : `/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}/capitulo/${req.params.idCapitulo}` } );
            }
            else if(usuario == null)
            {
                res.render("paginaERRO", { erro:'Usuario não encontrado', link : '/'});
            } 
            else if(historia == null || historia.Usuario != tratamentoParametroDeRota(req.params.idUsuario))
            {
                res.render('paginaERRO', { erro:'Historia não encontrada', link : `/Usuarios/${req.params.idUsuario}` });
            } 
            else if(capitulo == null || capitulo.Historia.toString() != tratamentoParametroDeRota(req.params.idHistoria))
            {
                res.render('paginaERRO', { erro:'Capitulo não encontrada, volte e tente novamenete!!!', link : `/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}` });
            }
            else
            {
                let atualizandoCapitulo = new Capitulos(req.body.tituloCapitulo, req.body.textoCapitulo, tratamentoParametroDeRota(req.params.idHistoria),"", req.body.humorCapitulo, req.body.focoCapitulo, req.body.resumoCapitulo);

                let capAtualizado = await atualizandoCapitulo.atuaizarCapitulo(tratamentoParametroDeRota(req.params.idCapitulo));

                switch (capAtualizado.modifiedCount) {
                    case 0:
                        res.render('paginaERRO', {erro: "Um erro inesperado aconteceu ao atualizar o capitulo, volte e tente novamente!!!", link: `/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}`});
                        break;
                
                    default:

                        capitulo = await Capitulos.buscaCapitulo(tratamentoParametroDeRota(req.params.idCapitulo));

                        let personagens = await Personagens.buscaPersonagens(tratamentoParametroDeRota(req.params.idUsuario));

                        let cenarios = await Cenarios.buscaCenarios(tratamentoParametroDeRota(req.params.idUsuario));

                        let cenariosDoCapitulo = [];

                        let personagensDoCapitulo = [];

                        for (const cenario of await CenariosCapitulo.buscaCenariosVinculadosAoCapitulo(trataParametrosDeRota(req.params.idCapitulo))) {
                            cenariosDoCapitulo.push(await Cenarios.buscaCenario(cenario.Cenario.toString()));
                        }

                        for (const element of await PersonagensCapitulo.buscaPersonagensDoCapitulo(trataParametrosDeRota(req.params.idCapitulo))) { 
                            personagensDoCapitulo.push(await Personagens.buscaPersonagem(element.Personagem.toString()));
                        }

                        res.render('capitulos', {id_Usuario : tratamentoParametroDeRota(req.params.idUsuario), id_Historia : tratamentoParametroDeRota(req.params.idHistoria), capitulo, personagens, personagensDoCapitulo, cenarios, cenariosDoCapitulo, notify : "Capitulo atualizado com sucesso!", notifyErro: ""});
                        break;
                }
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
            res.render('paginaERRO', {erro: "Um erro Inesperado aconteceu tente relogar e tentar novamente!!!", link : '/'});
        }
        else if (historia == null || historia.Usuario != tratamentoParametroDeRota(req.params.idUsuario))
        {
            res.render('paginaERRO', {erro: "Um Erro Inesperado Aconteceu ao buscar a historia, volte e tente novamente", link : `/Usuarios/${req.params.idUsuario}`});
        }
        else if (capituloBuscado == null || capituloBuscado.Historia.toString() != tratamentoParametroDeRota(req.params.idHistoria))
        {
            res.render('paginaERRO', {erro: "Um erro inesperado aconteceu ao buscar o capitulo, volte e tente novamente!!!", link : `/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}`});
        }
        else 
        {// Falta colocar a verificação para saber se tudo esta sendo deletado
            await PersonagensCapitulo.deletarTodosPersonagensDoCapituloPeloIdCapitulo(tratamentoParametroDeRota(req.params.idCapitulo));

            await CenariosCapitulo.ExcluirTodosOsCenariosDosCapitulosPeloIdCapitulo(tratamentoParametroDeRota(req.params.idCapitulo))
            
            await Capitulos.deletarCapitulo(tratamentoParametroDeRota(req.params.idCapitulo));

            let capitulosBuscados = await Capitulos.buscaCapitulos(historia._id.toString());

            res.render('historias', {historia, capitulos: capitulosBuscados, notify : "Capitulo deletado com sucesso!"});
        }
    } catch (error) {
        next(error);
    }
}

// Adicionar Personagens no capitulo
exports.adicionaPersonagensNoCapitulo = [

    body('personagem').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {
            let usuario = await Usuarios.buscaUsuarioPeloId(trataParametrosDeRota(req.params.idUsuario));
    
            let capitulo = await Capitulos.buscaCapitulo(trataParametrosDeRota(req.params.idCapitulo));

            // Se o conteudo vindo da requesição for igual a zero, significa que o usuario não escolheu um personagem no select, então não precisamos executar a query no banco de dados.
            let personagemNoCapitulo = req.body.personagem == "0" ?  null : await PersonagensCapitulo.buscaPersonagemDoCapituloPeloIdPersonagem2(req.body.personagem, tratamentoParametroDeRota(req.params.idCapitulo));

            if (usuario == null) 
            {
                res.render('paginaERRO', {erro: "Usuario Não encontrado, volte ao inicio e tente novamente!!!", link: `/`});    
            } 
            else if(capitulo == null || capitulo.Usuario.toString() != tratamentoParametroDeRota(req.params.idUsuario))
            {
                res.render('paginaERRO', {erro: "Capitulo não encontrado, volte ao inicio e tente novamente!!!", link: `/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}`});
            }
            else if(capitulo.Historia.toString() != trataParametrosDeRota(req.params.idHistoria))
            {
                res.render('paginaERRO', {erro: "O Capitulo Pesquisado não é dessa historia, volte ao inicio e tente novamente!!!",  link: `/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}`});
            }
            else if(req.body.personagem == "0")
            {
                let personagens = await Personagens.buscaPersonagens(tratamentoParametroDeRota(req.params.idUsuario));

                let cenarios = await Cenarios.buscaCenarios(tratamentoParametroDeRota(req.params.idUsuario));

                let cenariosDoCapitulo = [];

                let personagensDoCapitulo = [];

                for (const cenario of await CenariosCapitulo.buscaCenariosVinculadosAoCapitulo(trataParametrosDeRota(req.params.idCapitulo))) {
                    cenariosDoCapitulo.push(await Cenarios.buscaCenario(cenario.Cenario.toString()));
                }

                for (const element of await PersonagensCapitulo.buscaPersonagensDoCapitulo(trataParametrosDeRota(req.params.idCapitulo))) { 
                    personagensDoCapitulo.push(await Personagens.buscaPersonagem(element.Personagem.toString()));
                }

                res.render('capitulos', {id_Usuario : tratamentoParametroDeRota(req.params.idUsuario), id_Historia : tratamentoParametroDeRota(req.params.idHistoria), capitulo, personagens, personagensDoCapitulo, cenarios, cenariosDoCapitulo, notify : "", notifyErro: "Lembre-se de escolher um personagem!"});   
            }
            else if(personagemNoCapitulo.length)
            {
                let personagens = await Personagens.buscaPersonagens(tratamentoParametroDeRota(req.params.idUsuario));

                let cenarios = await Cenarios.buscaCenarios(tratamentoParametroDeRota(req.params.idUsuario));

                let cenariosDoCapitulo = [];

                let personagensDoCapitulo = [];

                for (const cenario of await CenariosCapitulo.buscaCenariosVinculadosAoCapitulo(trataParametrosDeRota(req.params.idCapitulo))) {
                    cenariosDoCapitulo.push(await Cenarios.buscaCenario(cenario.Cenario.toString()));
                }

                for (const element of await PersonagensCapitulo.buscaPersonagensDoCapitulo(trataParametrosDeRota(req.params.idCapitulo))) { 
                    personagensDoCapitulo.push(await Personagens.buscaPersonagem(element.Personagem.toString()));
                }

                res.render('capitulos', {id_Usuario : tratamentoParametroDeRota(req.params.idUsuario), id_Historia : tratamentoParametroDeRota(req.params.idHistoria), capitulo, personagens, personagensDoCapitulo, cenarios, cenariosDoCapitulo, notify : "", notifyErro: "Esse personagem ja existe no capitulo e não pode ser adicionado novamente!"}); 
            }
            else
            {
                let adicionandoPersonagemNoCapitulo = new PersonagensCapitulo( req.body.personagem, trataParametrosDeRota(req.params.idCapitulo), capitulo.Historia.toString(), trataParametrosDeRota(req.params.idUsuario));

                let personagemADD = await adicionandoPersonagemNoCapitulo.adicionarPersonagemNoCapitulo();
    
                switch (personagemADD) {
                    case null:
                        res.render('paginaERRO',{erro : "Erro Ao Adicionar O Personagem, Volte E Tente Novamente!!!", link : `/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`});
                        break;
                
                    default:

                        let personagens = await Personagens.buscaPersonagens(tratamentoParametroDeRota(req.params.idUsuario));

                        let cenarios = await Cenarios.buscaCenarios(tratamentoParametroDeRota(req.params.idUsuario));
        
                        let cenariosDoCapitulo = [];
        
                        let personagensDoCapitulo = [];
        
                        for (const cenario of await CenariosCapitulo.buscaCenariosVinculadosAoCapitulo(trataParametrosDeRota(req.params.idCapitulo))) {
                            cenariosDoCapitulo.push(await Cenarios.buscaCenario(cenario.Cenario.toString()));
                        }
        
                        for (const element of await PersonagensCapitulo.buscaPersonagensDoCapitulo(trataParametrosDeRota(req.params.idCapitulo))) { 
                            personagensDoCapitulo.push(await Personagens.buscaPersonagem(element.Personagem.toString()));
                        }
        
                        res.render('capitulos', {id_Usuario : tratamentoParametroDeRota(req.params.idUsuario), id_Historia : tratamentoParametroDeRota(req.params.idHistoria), capitulo, personagens, personagensDoCapitulo, cenarios, cenariosDoCapitulo, notify : "Personagem vinculado ao capitulo com sucesso!", notifyErro: ""});
                        break;
                }
            }
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
            res.render('paginaERRO', {erro: "Capitulo não encontrado, volte ao inicio e tente novamente!!!", link: `/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}`});
        }
        else if(capitulo.Historia.toString() != trataParametrosDeRota(req.params.idHistoria))
        {
            res.render('paginaERRO', {erro: "O Capitulo Pesquisado não é dessa historia, volte ao inicio e tente novamente!!!",  link: `/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}`});
        }
        else if(personagemDoCapitulo == null)
        {
            res.render('paginaERRO', {erro: "O personagem não existe nesse capitulo, volte ao inicio e tente novamente!!!", link: `/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}/capitulo/${req.params.idCapitulo}`});
        }
        else
        {
            let personagemDeletadoDoCapitulo = await PersonagensCapitulo.deletarPersonagemDoCapitulo(tratamentoParametroDeRota(req.params.idPersonagemDoCapitulo));

            switch (personagemDeletadoDoCapitulo.deletedCount) {
                case 0:
                    res.render('paginaErro', {erro: "Erro ao deletear o personagem tente novamente!!!", link: `/Usuarios/${req.params.idUsuario}/historia/${req.params.idHistoria}/capitulo/${req.params.idCapitulo}`});
                    break;
            
                default:

                    let personagens = await Personagens.buscaPersonagens(tratamentoParametroDeRota(req.params.idUsuario));

                    let cenarios = await Cenarios.buscaCenarios(tratamentoParametroDeRota(req.params.idUsuario));
    
                    let cenariosDoCapitulo = [];
    
                    let personagensDoCapitulo = [];
    
                    for (const cenario of await CenariosCapitulo.buscaCenariosVinculadosAoCapitulo(trataParametrosDeRota(req.params.idCapitulo))) {
                        cenariosDoCapitulo.push(await Cenarios.buscaCenario(cenario.Cenario.toString()));
                    }
    
                    for (const element of await PersonagensCapitulo.buscaPersonagensDoCapitulo(trataParametrosDeRota(req.params.idCapitulo))) { 
                        personagensDoCapitulo.push(await Personagens.buscaPersonagem(element.Personagem.toString()));
                    }
    
                    res.render('capitulos', {id_Usuario : tratamentoParametroDeRota(req.params.idUsuario), id_Historia : tratamentoParametroDeRota(req.params.idHistoria), capitulo, personagens, personagensDoCapitulo, cenarios, cenariosDoCapitulo, notify : "Personagem deletado do capitulo com sucesso!", notifyErro: ""});

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
                res.render('paginaERRO', {erro: "Um erro na inserção dos dados aconteceu, verifique se todos os dados foram inseridos corretamente!!!", link: `/Usuario/:${trataParametrosDeRota(req.params.idUsuario)}/historia/:${trataParametrosDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`});
            }
            else if(usuario == null)
            {
                res.render('paginaERRO', {erro: "Usuario não encontrado, volte e tente novamente!!!", link: `/`});
            }
            else if(capitulo == null || capitulo.Usuario.toString() != tratamentoParametroDeRota(req.params.idUsuario))
            {
                res.render('paginaERRO', {erro: "Capitulo não encontrado, volte e tente novamente!!!", link: `/Usuarios/:${trataParametrosDeRota(req.params.idUsuario)}/historia/:${trataParametrosDeRota(req.params.idHistoria)}`});
            }
            else if(capitulo.Historia.toString() != tratamentoParametroDeRota(req.params.idHistoria))
            {
                res.render('paginaERRO', {erro: "Capitulo não encontrado, volte e tente novamente!!!", link: `/Usuarios/:${trataParametrosDeRota(req.params.idUsuario)}/`});
            }
            else
            {
                let adicionaCenario = new CenariosCapitulo(req.body.cenario, capitulo._id.toString(), capitulo.Historia.toString(), trataParametrosDeRota(req.params.idUsuario));

                let adicionandoCenario = await adicionaCenario.adicionarCenarioNoCapitulo();

                switch (adicionandoCenario) {
                    case null:
                        res.render('paginaERRO', {erro: "Erro ao adicionar personagem, tente novamente!!!"});
                        break;
                
                    default:
                        
                        let personagens = await Personagens.buscaPersonagens(tratamentoParametroDeRota(req.params.idUsuario));

                        let cenarios = await Cenarios.buscaCenarios(tratamentoParametroDeRota(req.params.idUsuario));
        
                        let cenariosDoCapitulo = [];
        
                        let personagensDoCapitulo = [];
        
                        for (const cenario of await CenariosCapitulo.buscaCenariosVinculadosAoCapitulo(trataParametrosDeRota(req.params.idCapitulo))) {
                            cenariosDoCapitulo.push(await Cenarios.buscaCenario(cenario.Cenario.toString()));
                        }
        
                        for (const element of await PersonagensCapitulo.buscaPersonagensDoCapitulo(trataParametrosDeRota(req.params.idCapitulo))) { 
                            personagensDoCapitulo.push(await Personagens.buscaPersonagem(element.Personagem.toString()));
                        }
        
                        res.render('capitulos', {id_Usuario : tratamentoParametroDeRota(req.params.idUsuario), id_Historia : tratamentoParametroDeRota(req.params.idHistoria), capitulo, personagens, personagensDoCapitulo, cenarios, cenariosDoCapitulo, notify : "Cenário adicionado ao capitulo com sucesso!", notifyErro: ""});

                        break;
                }
            }
        } catch (error) {
            next(error);
        }
    }
];

exports.deletarCenarioDoCapitulo = async (req, res, next) => {
    try {
        let usuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroDeRota(req.params.idUsuario));

        let capitulo = await Capitulos.buscaCapitulo(tratamentoParametroDeRota(req.params.idCapitulo));

        let cenarioQSeraDeletadoDoCapitulo = await CenariosCapitulo.buscaCenarioDoCapitulo(trataParametrosDeRota(req.params.idCenarioDoCapitulo));

        if(usuario == null)
        {
            res.render('paginaERRO', {erro: 'Usuario não encontrado, volte e tente novamente!!!', link : `/`});
        }
        else if(capitulo == null || capitulo.Usuario.toString() != tratamentoParametroDeRota(req.params.idUsuario))
        {
            res.render('paginaERRO', { erro : "Capitulo não encontrado, volte e tente novamente!!!", link: `/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}`});
        }
        else if(capitulo.Historia.toString() != tratamentoParametroDeRota(req.params.idHistoria))
        {
            res.render('paginaERRO', { erro : "Historia não encontrada, volte e tente novamente!!!", link: `/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}`});
        }
        else if(cenarioQSeraDeletadoDoCapitulo == null)
        {
            res.render('paginaERRo', { erro : "O cenario não existe, volte e tente novamente!!!", link : `/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`});
        }
        else
        {
            let cenarioDeletadoDoCapitulo = await CenariosCapitulo.deletarCenarioDoCapitulo(tratamentoParametroDeRota(req.params.idCenarioDoCapitulo));

            switch (cenarioDeletadoDoCapitulo.deletedCount) {
                case '0' || 0:
                    res.render('paginaERRO', { erro : "Um erro Aconteceu, volte e tente novamente!!!", link : `/Usuarios/:${tratamentoParametroDeRota(req.params.idUsuario)}/historia/:${tratamentoParametroDeRota(req.params.idHistoria)}/capitulo/:${tratamentoParametroDeRota(req.params.idCapitulo)}`});
                    break;
            
                default:

                    let personagens = await Personagens.buscaPersonagens(tratamentoParametroDeRota(req.params.idUsuario));

                    let cenarios = await Cenarios.buscaCenarios(tratamentoParametroDeRota(req.params.idUsuario));
    
                    let cenariosDoCapitulo = [];
    
                    let personagensDoCapitulo = [];
    
                    for (const cenario of await CenariosCapitulo.buscaCenariosVinculadosAoCapitulo(trataParametrosDeRota(req.params.idCapitulo))) {
                        cenariosDoCapitulo.push(await Cenarios.buscaCenario(cenario.Cenario.toString()));
                    }
    
                    for (const element of await PersonagensCapitulo.buscaPersonagensDoCapitulo(trataParametrosDeRota(req.params.idCapitulo))) { 
                        personagensDoCapitulo.push(await Personagens.buscaPersonagem(element.Personagem.toString()));
                    }
    
                    res.render('capitulos', {id_Usuario : tratamentoParametroDeRota(req.params.idUsuario), id_Historia : tratamentoParametroDeRota(req.params.idHistoria), capitulo, personagens, personagensDoCapitulo, cenarios, cenariosDoCapitulo, notify : "Cenário deletado do capitulo com sucesso!", notifyErro: ""});
                    
                    break;
            }
        }
    } catch (error) {
        next(error);
    }
}
