var express = require('express');

var router = express.Router();

const controllerPaginaHomeUsuarios =  require('../controllers/controllerUsuarios');

const controllerHistoria = require('../controllers/controllerHistorias');

router.get('/:idUsuario', controllerPaginaHomeUsuarios.UsuariosIndex);

router.get('/:idUsuario/historia/:idHistooria', controllerHistoria.buscaHistoria);

router.post('/:idUsuario/historia/:idHistooria', controllerHistoria.atualizaHistoria);

module.exports = router;