var express = require('express');

var router = express.Router();

var controllerHistoria = require('../controllers/controllerHistorias');

router.get('/:idHistooria', controllerHistoria.buscaHistoria);

module.exports = router;
