const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD');

// DPS retirar esse try catch para nao interferir nos outros dos controllers

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

    async attHistoria(id){
        try {

            await Conexao.getCollections('Historias').updateOne({_id: new ObjectId(id)}, {$set: {Titulo: this.titulo, Texto: this.texto}, $currentDate: {lastModified: true}});

            return "Atualizado com sucesso!!!"
            
        } catch (error) {
            console.log(error)
        }
    }

    // Metodos estaticos
    static async buscaHistoria(id){
        let historiaBuscada = await Conexao.getCollections('Historias').findOne({_id : new ObjectId(id)})

        return historiaBuscada;
    }

    static async buscaHistorias(id){
        try {
            
            let historiasEncontradas = await Conexao.getCollections('Historias').find({Usuario: id}).toArray();

            return historiasEncontradas;

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Historias;
