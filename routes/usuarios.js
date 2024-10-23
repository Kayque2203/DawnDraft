var express = require('express'); // Importando o módulo express para definirmos as rotas!!!

var router = express.Router(); // "Instanciando" o método de roteamento Express

/* Importando os Controllers */
const controllerPaginaHomeUsuarios =  require('../controllers/controllerUsuarios');

const controllerHistoria = require('../controllers/controllerHistorias');

const controllerPersonagens = require('../controllers/controllerPersonagens');



// Rota para carregar a pagina home dos usuarios
router.get('/:idUsuario', controllerPaginaHomeUsuarios.UsuariosIndex);



/* Historias */
// Rota que carrega a pagina de uma historia
router.get('/:idUsuario/historia/:idHistoria', controllerHistoria.buscaHistoria);

// Rota para atualizar uma historia
router.post('/:idUsuario/historia/:idHistoria', controllerHistoria.atualizaHistoria);

// Rota para exibir a pagina de criação de uma nova história
router.get('/:idUsuario/NovaHistoria', controllerHistoria.adicionaHistoriaGet);

// Rota para adicionar uma nova história no abanco de dados
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



/* Foco Do Capitulo */
// Rota para adicionar Um Novo Foco Ao Capitulo
router.post('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/adicionarFocoAoCapitulo', controllerHistoria.adicionarFocoAoCapitulo);

// Rota Para Excluir um Foco Ao Capitulo
router.get('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/excluirFocoDoCapitulo/:idFocoDoCapitulo', controllerHistoria.deletarFocoCapitulo);

// Rota que retorna um template para atualizar um foco de capitulo
router.get('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/atualizarFocoCapitulo/:idFocoDoCapitulo', controllerHistoria.atualizarFocoDoCapituloGet);

// Rota que atualiza um foco do capitulo
router.post('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/atualizarFocoCapitulo/:idFocoDoCapitulo', controllerHistoria.atualizarFocoDoCapituloPost);



/* Humor Do Capitulo */
// Rota Para Adicionar Humor Ao Capitulo
router.post('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/adicionarHumor', controllerHistoria.adicionaHumorPost);

// Rota que retorna o template para atualizar um humor de capitulo
router.get('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/atualizarHumorDoCapitulo/:idHumorDoCapitulo', controllerHistoria.atualizarHumorGet);

// Rota Para Atualizar Um Humor Do Capitulo
router.post('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/atualizarHumorDoCapitulo/:idHumorDoCapitulo', controllerHistoria.atualizarHumorPost);

// Rota Para Deletar Humor Do Capitulo
router.get('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/excluirHumorDoCapitulo/:idHumorDoCapitulo', controllerHistoria.deletaHumor);



/* Personagem Capitulo */
// Rota Para Adicionar Personagens aos capitulos
router.post('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/adicionarPersonagem', controllerHistoria.adicionaPersonagensNoCapitulo);

// Rota Para Remover Um Personagem De Um Capitulo
router.get('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/removerPersonagemDoCapitulo/:idPersonagemDoCapitulo', controllerHistoria.deletarPersonagemDoCapitulo);



/* Cenarios Do Capitulo */
// Rota Para Adicionar Um Cenário A Um Capitulo
router.post('/:idUsuario/historia/:idHistoria/capitulo/:idCapitulo/adicionaCenario', controllerHistoria.adicionarCenarioNoCapitulo);



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

module.exports = router;
