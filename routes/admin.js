const express = require('express');

const router = express.Router();

const ControllerAdmin = require('../controllers/controllerAdmin');

router.get('/:idUsuario', ControllerAdmin.AdminPage);

module.exports = router;
