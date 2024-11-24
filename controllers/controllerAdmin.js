const Usuarios = require('../models/mUsuarios');
const Historias = require('../models/mMensagens');
const Mensagens = require('../models/mMensagens');

const TratamentoParametrosDeRota = require('../assets/tratamentoParametroRota');

exports.AdminPage = async (req, res, next) => {
    try {
        let admin = await Usuarios.buscaUsuarioPeloId(TratamentoParametrosDeRota(req.params.idUsuario));

        if (admin == null) 
        {
            res.render('paginaERRO', { erro : "Usuario não encontrado!", link : `/`});    
        }
        else if (admin.IsAdmin == false) 
        {
            res.render('paginaERRO', {erro: "Um erro aconteceu volte e tente novamnte! :)", link : "/"})
        }
        else 
        {
            res.render('administrador', { admin ,usuarios : await Usuarios.buscaTodosUsuarios(), mensagens : await Mensagens.BuscaTodasAsMensagens() });
        }
    } catch (error) {
        next(error);
    }
}

exports.Usuario = async(req, res, next) => {
        try {
            let admin = await Usuarios.buscaUsuarioPeloId(TratamentoParametrosDeRota(req.params.idUsuario));
            let usuario = await Usuarios.buscaUsuarioPeloId(TratamentoParametrosDeRota(req.params.idUsario));

            if (admin == null) 
            {
                res.render('paginaERRO', { erro : "Usuario não encontrado!", link : `/`});    
            }
            if (usuario == null) {
                res.render('paginaERRO', {erro: "Usuario não encontrado!", link : `/Administrador/:${admin._id.toString()}`});
            }
            else
            {
                res.render('infoUsuarios', {usuario});
            }
        } catch (error) {
            next(error);
        }
}
