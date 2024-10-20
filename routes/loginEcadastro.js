var express = require('express');
var router = express.Router();

var controllerLogin = require('../controllers/controllerLogin');

// Rota Para Retornar O template Com O Formulario
router.get('/', controllerLogin.CadastroGet);

// Rota que vai cadastrar um novo usuario
router.post('/Cadastro', controllerLogin.CadastroPost);

// Rota que vai efetuar o login do usuario
router.post('/Login', controllerLogin.login);

// Rota para deletar um usuario
router.get('/deletarUsuario/:idUsuario',  controllerLogin.deletarUsuario);

// Rot que ira retornar o template de validação de email
router.get('/validacaoDeEmail/:emailUsuario', controllerLogin.validaEmailGet);

router.post('/validacaoDeEmail/:emailUsuario', controllerLogin.validaEmailPost);

module.exports = router;
