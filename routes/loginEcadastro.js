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

// Rota que ira retornar o template de validação de email
router.get('/validacaoDeEmail/:emailUsuario', controllerLogin.validaEmailGet);

// Rota que irá validar emails
router.post('/validacaoDeEmail/:emailUsuario', controllerLogin.validaEmailPost);

// Rota que retorna um template para os usuarios que esqueceram sua senha
router.get('/esqueciMinhaSenha', controllerLogin.esqueciMinhaSenhaGet);

// Rota que envia o email para redefinição de senha
router.post('/esqueciMinhaSenha', controllerLogin.esqueciMinhaSenhaPost);

// Rota que retorna um template para redefinição de senha
router.get('/redefinirSenha/:emailUsuario/:codigoVerificacao', controllerLogin.redefinirSenhaUsuarioGet);

// Rota que irá redefinir as senhas do usuario
router.post('/redefinirSenha/:emailUsuario/:codigoVerificacao', controllerLogin.redefinirSenhaUsuarioPost);

module.exports = router;
