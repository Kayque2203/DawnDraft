// Falta terminar, esse sera o controller para manipular a rota da pagina index dos usuarios (*Obs essa pagina ira exibir as histórias criadas pelo usuario e seus personagens e cenários)
const Usuarios = require('../models/mCadastro');
const Historias = require('../models/mHsitorias');
const tratamentoParametroRota = require('../assets/tratamentoParametroRota');

exports.UsuariosIndex = async (req, res, next) => {

    // Faz uma consulta no banco de dados apartir do id inserido como parametro de rota para saber se aquele usuario realmente existe
    var consultaUsuario = await Usuarios.buscaUsuarioPeloId(tratamentoParametroRota(req.params.idUsuario));

    // Faz a verfificação, caso a variavel consultaUsuario retorne null siginifica que aquele usario não existe, caso exista essa variavel ira conter todas as infos do usuario.
    if (consultaUsuario == null) 
    {
       res.json("Não existe esse usuario"); // DA UMA ATENÇÃO AQUI!!!
    } 
    else 
    {
        var consultaHistoriasDoUsuario = await Historias.buscaHistorias(tratamentoParametroRota(req.params.idUsuario));

        res.render('Usuarios', { historias: consultaHistoriasDoUsuario });
    }
}