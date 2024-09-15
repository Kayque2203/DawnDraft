var express = require('express');

var router = express.Router();

const controllerPaginaHomeUsuarios =  require('../controllers/controllerUsuarios');

router.get('/:idUsuario', controllerPaginaHomeUsuarios.UsuariosIndex);

module.exports = router;