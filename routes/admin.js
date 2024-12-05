const express = require('express');

const router = express.Router();

const ControllerAdmin = require('../controllers/controllerAdmin');

router.get('/:idAdmin', ControllerAdmin.AdminPage);

router.get('/:idAdmin/mensagens', ControllerAdmin.Mensagens);

router.get('/:idAdmin/usuarios', ControllerAdmin.Usuarios);

router.get('/:idAdmin/usuario/:idUsuario', ControllerAdmin.Usuario);

router.get('/:idAdmin/mensagem/:idMensagem', ControllerAdmin.Mensagem);

module.exports = router;
