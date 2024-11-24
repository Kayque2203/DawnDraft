const express = require('express');

const router = express.Router();

const ControllerMensagens = require('../controllers/controllerMensagens');

router.get('/', ControllerMensagens.FaleConoscoGet);

router.post('/', ControllerMensagens.FaleConoscoPost)

module.exports = router;
