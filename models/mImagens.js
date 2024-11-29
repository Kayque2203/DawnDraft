const { ObjectId } = require('mongodb');
const conexaoBD = require('../conexaoBD/conexaoBD')
const Conexao = new conexaoBD();

class Imagens {
    UrlImagem;
    OndeSeraUsada;
    Usuario;

    constructor (fileName, user,aondeUsa) {
        this.UrlImagem = `/public/uploads/${fileName}`;
        this.Usuario = new ObjectId(user);
        this.OndeSeraUsada = aondeUsa;
    }

    async addImagemBancoDeDados () {
        return await Conexao.getCollections('Imagens').insertOne({
            "UrlImagem" : this.UrlImagem,
            "Usuario" : this.Usuario,
            "OndeSeraUsada" : this.OndeSeraUsada,
        });
    }

    static async BuscaImagem (idUsuario, ondeSeraUsada) {
        let teste = await Conexao.getCollections('Imagens').findOne({
            $and : [
                { "Usuario" : new ObjectId(idUsuario) },
                { "OndeSeraUsada" : ondeSeraUsada }
            ]
        });
        return teste.UrlImagem;
    }
}

module.exports = Imagens;
