const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD');

const Conexao = new conexao();

class Historias {
    titulo;
    prologo;
    texto;
    usuario;

    constructor(tituloHis, prologoHis, txtHis, userHis){
        this.titulo = tituloHis;
        this.prologo = prologoHis;
        this.texto = txtHis;
        this.usuario = userHis;
    }

    // MÉTODOS DA CLASSE
    async addHistorias(){
        let novaHistoria = await Conexao.getCollections('Historias').insertOne({
            'Titulo' : this.titulo,
            'Prologo': this.prologo,
            'Texto' : this.texto,
            'Usuario' : this.usuario
        })

        return novaHistoria.insertedId;
    }

    async attHistoria(id){

        await Conexao.getCollections('Historias').updateOne({_id: new ObjectId(id)}, {$set: {Titulo: this.titulo, Prologo: this.prologo, Texto: this.texto}, $currentDate: {lastModified: true}});

        // return "Atualizado com sucesso!!!";
    }

    // Metodos estaticos
    static async buscaHistoria(id){
        let historiaBuscada = await Conexao.getCollections('Historias').findOne({_id : new ObjectId(id)})

        return historiaBuscada;
    }

    static async buscaHistorias(id){
           
        let historiasEncontradas = await Conexao.getCollections('Historias').find({Usuario: id}).toArray();

        return historiasEncontradas;
    }

    static async deleteHistoria(id){
        let historiaDeletada = await Conexao.getCollections('Historias').deleteOne({_id: new ObjectId(id)});

        return historiaDeletada;
    }
}

module.exports = Historias;
