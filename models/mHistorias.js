const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD');

const Conexao = new conexao();

class Historias {
    titulo;
    prologo;
    usuario;

    constructor(tituloHis, prologoHis, userHis){
        this.titulo = tituloHis;
        this.prologo = prologoHis;
        this.usuario = userHis;
    }

    // MÉTODOS DA CLASSE
    async addHistorias(){
        let novaHistoria = await Conexao.getCollections('Historias').insertOne({
            'Titulo' : this.titulo,
            'Prologo': this.prologo,
            'Usuario' : this.usuario
        })

        return novaHistoria.insertedId;
    }

    async attHistoria(id){

        await Conexao.getCollections('Historias').updateOne(
            {_id: new ObjectId(id)}, 
            {
                $set: {
                    Titulo: this.titulo, 
                    Prologo: this.prologo
                }, 
                $currentDate: {lastModified: true}
            }
        );

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

    // Verifica Isso Aqui DPS
    static async deleteTodasHistoriasDoUser(id){
        let capitulosDeletados = await Conexao.getCollections('Capitulos').deleteMany({ "Usuario" : new ObjectId(id) });
        let historiasDeletadas = await Conexao.getCollections('Historias').deleteMany({ "Usuario": id });

        return historiasDeletadas, capitulosDeletados;
    }
}

module.exports = Historias;
