var express = require('express');

var router = express.Router();

const controllerPaginaHomeUsuarios =  require('../controllers/controllerUsuarios');

const controllerHistoria = require('../controllers/controllerHistorias');

// Rota para carregar a pagina home dos usuarios
router.get('/:idUsuario', controllerPaginaHomeUsuarios.UsuariosIndex);

//  ROTAS DAS HISTÓRIAS!!!
// Rota que carrega a pagina de uma historia
router.get('/:idUsuario/historia/:idHistooria', controllerHistoria.buscaHistoria);

// Rota para atualizar uma historia
router.post('/:idUsuario/historia/:idHistooria', controllerHistoria.atualizaHistoria);

// Rota para exibir a pagina de criação de uma nova história
router.get('/:idUsuario/NovaHistoria', controllerHistoria.adicionaHistoriaGet);

// Rota para adicionar uma nova história no abanco de dados
router.post('/:idUsuario/NovaHistoria', controllerHistoria.adicionaHistoriaPost);

// Rota para deletar uma história
router.get('/:idUsuario/deletarHistoria/:idHistooria', controllerHistoria.deletaHistoria);

// Rotas Dos Capitulos
// Rota que retorna o formulario para adicionar historias  
router.get('/:idUsuario/historia/:idHistoria/adicionarCapitulo', controllerHistoria.adicionaCapituloGet);

// Rota post para adicionar novos cápitulos as histórias
router.post('/:idUsuario/historia/:idHistoria/adicionarCapitulo', controllerHistoria.adicionaCapituloPost);

// Rota para carregar o template com o capitulo da historia do usuario
router.get('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo', controllerHistoria.BuscaCapitulo);

// Rota para atualizar um capitulo
router.post('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo', controllerHistoria.AtualizaCapitulo);

router.get('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/deletarCapitulo', controllerHistoria.deletarCapitulo);

module.exports = router;
