var express = require('express');
var router = express.Router();

var controllerCadastro = require('../controllers/controllerCadastro');
var controllerLogin = require('../controllers/controllerLogin');

/* GET users listing. */
// essa vai ser somente a rota de cadastro irei trabalhar com uma rota para login e outra para cadastro tenho que mudar o nopme dessa rota
router.get('/', controllerCadastro.CadastroGet);

router.post('/Cadastro', controllerCadastro.CadastroPost);

router.post('/Login', controllerLogin.login);

module.exports = router;
