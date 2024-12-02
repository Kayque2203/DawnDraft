var express = require('express'); // Importando o módulo express para definirmos as rotas!!!

var router = express.Router(); // "Instanciando" o método de roteamento Express

const multer = require('multer'); // Importando a biblioteca multer para conseguirmos salvar as imagens dos usuarios
const upload = multer({dest: 'public/uploads/'}); // Setando a pasta que será a de destino para as imagens

/* Importando Os Controllers */
const controllerUsuarios =  require('../controllers/controllerUsuarios');

const controllerHistoria = require('../controllers/controllerHistorias');

const controllerPersonagens = require('../controllers/controllerPersonagens');

const controllerCenarios = require('../controllers/controllerCenarios');


/* Rota das informações e da indexpage do usuario */
// Rota para carregar a pagina home dos usuarios
router.get('/:idUsuario', controllerUsuarios.UsuariosIndex);

// Rota para caregar a pagina de perfil dos usuarios
router.get('/:idUsuario/perfilUsuario', controllerUsuarios.PerfilUsuario);

// Rota para atualizar as informações do usuario
router.post('/:idUsuario/atualizarUsuario', controllerUsuarios.AutualizaUsuario);

// Rota que retorna um template para a verificação do novo email do usuario
router.get('/:idUsuario/atualizaEmail/:novoEmailUsuario', controllerUsuarios.AtualizaEmailUsuarioGet);

// Rota que valida o código enviado para o novo email do usuario
router.post('/:idUsuario/atualizaEmail/:novoEmailUsuario', controllerUsuarios.AtualizaEmailUsuarioPost);

// Rota para adicionar foto ao perfil do usuario
router.post('/:idUsuario/addFotoPerfil', upload.single('fotoPerfil'), controllerUsuarios.addImagemPerfil);

// Rota para atualizar as fotos de perfil dos usuarios
router.post('/:idUsuario/atualizaFotoPerfil', upload.single('fotoPerfil'), controllerUsuarios.atualizaFotoPerfil);

// Rota para deletar foto de perfil dos usuarios
router.get('/:idUsuario/deletarFotoPerfil', controllerUsuarios.deletarImagemPerfil);



/* Historias */
// Rota que carrega a pagina de uma historia
router.get('/:idUsuario/historia/:idHistoria', controllerHistoria.buscaHistoria);

// Rota para atualizar uma historia
router.post('/:idUsuario/historia/:idHistoria', controllerHistoria.atualizaHistoria);

// Rota para exibir a pagina de criação de uma nova história
router.get('/:idUsuario/NovaHistoria', controllerHistoria.adicionaHistoriaGet);

// Rota para adicionar uma nova história no banco de dados
router.post('/:idUsuario/NovaHistoria', controllerHistoria.adicionaHistoriaPost);

// Rota para deletar uma história
router.get('/:idUsuario/deletarHistoria/:idHistoria', controllerHistoria.deletaHistoria);



/* Capitulos */
// Rota que retorna o formulario para adicionar historias
router.get('/:idUsuario/historia/:idHistoria/adicionarCapitulo', controllerHistoria.adicionaCapituloGet);

// Rota post para adicionar novos cápitulos as histórias
router.post('/:idUsuario/historia/:idHistoria/adicionarCapitulo', controllerHistoria.adicionaCapituloPost);

// Rota para carregar o template com o capitulo da historia do usuario
router.get('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo', controllerHistoria.BuscaCapitulo);

// Rota para atualizar um capitulo
router.post('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo', controllerHistoria.AtualizaCapitulo);

// Rota para deletar um capitulo
router.get('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/deletarCapitulo', controllerHistoria.deletarCapitulo);



/* Personagem Capitulo */
// Rota Para Adicionar Personagens aos capitulos
router.post('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/adicionarPersonagem', controllerHistoria.adicionaPersonagensNoCapitulo);

// Rota Para Remover Um Personagem De Um Capitulo
router.get('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/removerPersonagemDoCapitulo/:idPersonagemDoCapitulo', controllerHistoria.deletarPersonagemDoCapitulo);



/* Cenarios Do Capitulo */
// Rota Para Adicionar Um Cenário A Um Capitulo
router.post('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/adicionaCenario', controllerHistoria.adicionarCenarioNoCapitulo);

// Rota Para Desvincular um capitulo do cenario
router.get('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/deletarCenario/:idCenarioDoCapitulo', controllerHistoria.deletarCenarioDoCapitulo)



/* Rotas Dos Personagens */
// Rota Para Retornar Um Template Para Adicionar Personagens
router.get('/:idUsuario/adicionarPersonagem', controllerPersonagens.adicionarPersonagemGet);

// Rota Para Retornar Para Adicionar Personagens
router.post('/:idUsuario/adicionarPersonagem', controllerPersonagens.adicionarPersonagemPost);

// Rota Para Exibir Um Template De Um Usuario
router.get('/:idUsuario/personagem/:idPersonagem', controllerPersonagens.buscaPersonagem);

// Rota Para Atualizar As Informações De Um Personagem No Banco De Dados
router.post('/:idUsuario/atualizarPersonagem/:idPersonagem', controllerPersonagens.atualizarPersonagemPost);

// Rota Para Deletar As Informações De Um Personagem No Banco De Dados
router.get('/:idUsuario/deletarPersonagem/:idPersonagem', controllerPersonagens.deletarPersonagem);



/* Rotas Dos Cenarios */
// Rota que retorna um template para criar um cenario
router.get('/:idUsuario/adicionarCenario', controllerCenarios.criarCenarioGet);

// Rota que adiciona um cenario ao banco de dados
router.post('/:idUsuario/adicionarCenario', controllerCenarios.criarCenarioPost);

// Rota para buscar os cenarios
router.get('/:idUsuario/cenario/:idCenario', controllerCenarios.buscaCenario);

// Rota para atualizar as informações dos cenarios
router.post('/:idUsuario/atualizarCenario/:idCenario', controllerCenarios.atualizaCenario);

// Rota para deletar um cenario
router.get('/:idUsuario/deletarCenario/:idCenario', controllerCenarios.deletaCenario);

module.exports = router;
