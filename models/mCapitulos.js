const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD');

const Conexao = new conexao;

class Capitulos {
    tituloCapitulo;
    textoCapitulo;
    anotacoes;
    historia;
    colecaoHistoria;
    
    constructor( tituloCap, textoCap, anotocoesCap, idHis ){
        this.tituloCapitulo = tituloCap;
        this.textoCapitulo = textoCap;
        this.anotacoes = anotocoesCap;
        this.historia = idHis;
    }

    // Métodos

    async adicionarCapitulo(){
        let novoCapitulo = await Conexao.getCollections('Capitulos').insertOne({
            "TituloCapitulo" : this.tituloCapitulo,
            "TextoCapitulo" : this.textoCapitulo,
            "Anotacoes" : this.anotacoes,
            "Historia" : new ObjectId(this.historia)
        });

        return novoCapitulo.insertedId;
    }

    async atuaizarCapitulo(id){
        await Conexao.getCollections('Capitulos').updateOne(
            { _id : new ObjectId(id) }, 
            {
                $set: {
                    "TituloCapitulo" : this.tituloCapitulo,
                    "TextoCapitulo" : this.textoCapitulo
                },
                $currentDate: { lastModified : true }
            }
        )
    }

    // métodos estaticos
    static async buscaCapitulos(idHistoria){
        let capitulosEncontrados = await Conexao.getCollections('Capitulos').find( { Historia : new ObjectId(idHistoria) } ).toArray();

        return capitulosEncontrados;
    }

    static async buscaCapitulo(idCapitulo){
        let capituloEncontrado = await Conexao.getCollections('Capitulos').findOne( {_id: new ObjectId(idCapitulo)} );

        return capituloEncontrado;
    }

    static async deletarCapitulo(idCapitulo){
        let capituloExcluido = await Conexao.getCollections('Capitulos').deleteOne({_id: new ObjectId(idCapitulo)});

        return capituloExcluido;
    } 
}

module.exports = Capitulos;