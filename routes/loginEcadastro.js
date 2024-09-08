var express = require('express');
var router = express.Router();

var controllerCadastro = require('../controllers/controllerCadastro')

/* GET users listing. */
router.get('/', controllerCadastro.CadastroGet);

router.post('/', controllerCadastro.CadastroPost);

module.exports = router;
