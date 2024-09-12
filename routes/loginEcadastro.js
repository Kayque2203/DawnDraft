var express = require('express');
var router = express.Router();

var controllerCadastro = require('../controllers/controllerCadastro')

/* GET users listing. */
// essa vai ser somente a rota de cadastro irei trabalhar com uma rota para login e outra para cadastro tenho que mudar o nopme dessa rota
router.get('/', controllerCadastro.CadastroGet);

router.post('/', controllerCadastro.CadastroPost);

module.exports = router;
