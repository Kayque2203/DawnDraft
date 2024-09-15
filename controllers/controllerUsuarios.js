// Falta terminar, esse sera o controller para manipular a rota da pagina index dos usuarios (*Obs essa pagina ira exibir as histórias criadas pelo usuario e seus personagens e cenários)
// Até agora eu fiz 
const Usuarios = require('../models/mCadastro');
const Historias = require('../models/mHsitorias')

exports.UsuariosIndex = async (req, res, next) => {

    let parametroDeRota = '';

    // Esse for "Sanitiza o parametro de rota retirando possiveis caracteres maliciosos e principalmente os dois pontos ( : ) que usamaso para identificar os parametros de rota. )"
    for (const caracter of req.params.idUsuario) {
        if ( caracter !=':' && caracter != '<' && caracter != '>' && caracter != '{' && caracter != '}') {
            parametroDeRota += caracter;
        }
    }
    
    // Faz uma consulta no banco de dados apartir do id inserido como parametro de rota para saber se aquele usuario realmente existe
    var consultaUsuario = await Usuarios.buscaUsuarioPeloId(parametroDeRota);

    // Faz a verfificação, caso a variavel consultaUsuario retorne null siginifica que aquele usario não existe, caso exista essa variavel ira conter todas as infos do usuario.
    if (consultaUsuario == null) {
       next("Usuario Não Encontrado")
    } else {

        // Parei aqui pois estava fazendo as classes modelos das demais coleções do banco de dados que iremos presisar para as funções dessa pagina.

        var consultaHistoriasDoUsuario = await Historias.buscaHistorias(parametroDeRota);

        res.render('Usuarios', { historias: consultaHistoriasDoUsuario });
    }
}