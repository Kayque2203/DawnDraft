const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD');

const Conexao = new conexao();

class Historias {
    titulo;
    texto;
    usuario;

    constructor(tituloHis, txtHis, userHis){
        this.titulo = tituloHis;
        this.texto = txtHis;
        this.usuario = ObjectId(userHis);
    }

    async addHistorias(){
        try {

            let novaHistoria = await Conexao.getCollections('Historias').insertOne({
                'Titulo' : this.titulo,
                'Texto' : this.texto,
                'Personagens' : this.personagens,
                'Usuario' : this.usuario
            })

            return novaHistoria.insertedId;

        } catch (error) {
            console.log(error)
        }
    }

    async buscaHistoria(id){
        try {
            
            let usuarioEncontarado = await Conexao.getCollections('Historia').find({ _id : ObjectId(id) });

            return usuarioEncontarado;

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Historias;
