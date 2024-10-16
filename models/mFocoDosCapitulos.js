const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD');

const Conexao = new conexao();

class FocoDoCapitulo {
    focoCapitulo;
    capitulo;
    historia;
    usuario;

    constructor(focoCap, capituloAnotacao, historiaAnotacao, user){
        this.focoCapitulo = focoCap;
        this.capitulo = capituloAnotacao;
        this.historia = historiaAnotacao;
        this.usuario = user;
    }

    // Métodos da classe
    async adicionarFocoAoCapitulo(){
        let novaFocoDoCapitulo = await Conexao.getCollections('FocoDosCapitulos').insertOne({
            "FocoCapitulo" : this.focoCapitulo,
            "Capitulo" : new ObjectId(this.capitulo),
            "Historia" : new ObjectId(this.historia),
            "Usuario" : new ObjectId(this.usuario)
        });

        return novaFocoDoCapitulo.insertedId.toString();
    }

    async atualizarFocoCapitulo(idFocoDoCapitulo){
        let focoCapituloAtualizado = await Conexao.getCollections('FocoDosCapitulos').updateOne(
            {_id : new ObjectId(idFocoDoCapitulo)},
            {
                $set: {
                    "FocoCapitulo" : this.focoCapitulo,
                },
                $currentDate: { lastModified: true }
            }
        );

        return focoCapituloAtualizado;
    }

    // Métodos staticos
    static async buscaFocosDoCapitulo(idCapitulo){
        let todosFocosDosCapitulos = await Conexao.getCollections('FocoDosCapitulos').find({ Capitulo : new ObjectId(idCapitulo)}).toArray();

        return todosFocosDosCapitulos;
    }

    static async buscaFocoDoCapitulo(idFocoDoCapitulo){
        let focoDoCapituloBuscado = await Conexao.getCollections('FocoDosCapitulos').findOne({_id : new ObjectId(idFocoDoCapitulo)});

        return focoDoCapituloBuscado;
    }

    static async deletarFocosDoCapitulo(idCapitulo){
        let focosDoCapituloDeletadas = await Conexao.getCollections('FocoDosCapitulos').deleteMany({Capitulo : new ObjectId(idCapitulo)});
        
        return focosDoCapituloDeletadas;
    }

    static async DeletarfocoDoCapitulo(idFocoDoCapitulo){
        let focoDoCapituloDeletado = await Conexao.getCollections('FocoDosCapitulos').deleteOne({_id: new ObjectId(idFocoDoCapitulo)});

        return focoDoCapituloDeletado;
    }

    static async deletarFocosDoCapituloPeloIdHistoria(idHistoria){
        let focosDoCapituloExcluidos = await Conexao.getCollections('FocoDosCapitulos').deleteMany({Historia : new ObjectId(idHistoria)});

        return focosDoCapituloExcluidos;
    }

    static async deletarFocosDoCapituloPeloIdCapitulo(idCapitulo){
        let focosDoCapituloExcluidos = await Conexao.getCollections('FocoDosCapitulos').deleteMany({Historia : new ObjectId(idCapitulo)});

        return focosDoCapituloExcluidos;
    }
}

module.exports = FocoDoCapitulo;
