const { ObjectId } = require('mongodb');
const conexaoBD = require('../conexaoBD/conexaoBD')
const Conexao = new conexaoBD();

class Imagens {
    UrlImagem;
    OndeSeraUsada;
    Usuario;

    constructor (fileName, user,aondeUsa) {
        this.UrlImagem = `${fileName}`;
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

    async atualizaImagemPerfil (idUsuario) {
        let atualizando = await Conexao.getCollections('Imagens').updateOne(
            {
                Usuario : new ObjectId(idUsuario)
            },
            {
                $set:{
                    "UrlImagem" : this.UrlImagem
                },
            }
        );

        return atualizando
    }

    static async BuscaImagem (idUsuario, ondeSeraUsada = "FotoPerfil") {
        let imagem = await Conexao.getCollections('Imagens').findOne({
            $and : [
                { "Usuario" : new ObjectId(idUsuario) },
                { "OndeSeraUsada" : ondeSeraUsada }
            ]
        });
        
        if (imagem == null) 
        {
            return "";
        }

        return imagem.UrlImagem;
    }

    static async DeletarFotoPerfil (idUsuario) {
        let deletandoFotoPerfil = await Conexao.getCollections('Imagens').deleteOne({Usuario : new ObjectId(idUsuario)});

        return deletandoFotoPerfil.deletedCount == 0? false : true; 
    }
}

module.exports = Imagens;
