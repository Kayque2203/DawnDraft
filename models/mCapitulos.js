const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD');

const Conexao = new conexao;

class Capitulos {
    tituloCapitulo;
    textoCapitulo;
    historia;
    humorCapitulo;
    focoCapitulo;
    resumoCapitulo;
    usuario;
    
    constructor( tituloCap = "", textoCap = "", idHis = "", idUsuario = "", humorCap = "", focoCap = "", resumoCap = "" ){
        this.tituloCapitulo = tituloCap;
        this.textoCapitulo = textoCap;
        this.historia = idHis;
        this.usuario = idUsuario;
        this.humorCapitulo = humorCap;
        this.focoCapitulo = focoCap;
        this.resumoCapitulo = resumoCap;
    }

    // Métodos

    async adicionarCapitulo(){
        let novoCapitulo = await Conexao.getCollections('Capitulos').insertOne({
            "TituloCapitulo" : this.tituloCapitulo,
            "TextoCapitulo" : this.textoCapitulo,
            "ResumoCapitulo" : this.resumoCapitulo,
            "HumorDoCapitulo" : this.humorCapitulo,
            "FocoDoCapitulo" : this.focoCapitulo,
            "Historia" : new ObjectId(this.historia),
            "Usuario" : new ObjectId(this.usuario)
        });

        return novoCapitulo.insertedId;
    }

    async atuaizarCapitulo(id){
        let capAtualizado = await Conexao.getCollections('Capitulos').updateOne(
            { _id : new ObjectId(id) }, 
            {
                $set: {
                    "TituloCapitulo" : this.tituloCapitulo,
                    "TextoCapitulo" : this.textoCapitulo,
                    "ResumoCapitulo" : this.resumoCapitulo,
                    "HumorDoCapitulo" : this.humorCapitulo,
                    "FocoDoCapitulo" : this.focoCapitulo
                },
                $currentDate: { lastModified : true }
            }
        )

        return capAtualizado;
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

    static async deletarVariosCapitulos(idHistoria){
        let capitulosExcluidos = await Conexao.getCollections('Capitulos').deleteMany({Historia : new ObjectId(idHistoria)});

        return capitulosExcluidos;
    }
}

module.exports = Capitulos;
