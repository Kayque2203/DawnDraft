const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD');

const Conexao = new conexao();

class Anotacoes {
    focoCapitulo;
    humorTom;
    capitulo;

    constructor(focoCap, humroTomCap, capituloAnotacao){
        this.focoCapitulo = focoCap;
        this.humorTom = humroTomCap;
        this.capitulo = capituloAnotacao;
    }

    // Métodos da classe
    async adicionarAnotacao(){
        let novaAnotacao = await Conexao.getCollections('Anotacoes').insertOne({
            "FocoCapitulo" : this.focoCapitulo,
            "HumorTom" : this.humorTom,
            "Capitulo" : new ObjectId(this.capitulo)
        });

        return novaAnotacao.insertedId.toString();
    }

    async atualizarAnotacao(idAnotacao){
        let anotacaoAtualizada = await Conexao.getCollections('Anotacoes').updateOne(
            {_id : new ObjectId(idAnotacao)},
            {
                $set: {
                    "FocoCapitulo" : this.focoCapitulo,
                    "HumorTom" : this.humorTom
                },
                $currentDate: { lastModified: true }
            }
        );

        return anotacaoAtualizada;
    }

    // Métodos staticos
    static async buscaAnotacoes(idCapitulo){
        let todasAnotacoes = await Conexao.getCollections('Anotacoes').find({ Capitulo : new ObjectId(idCapitulo)}).toArray();

        return todasAnotacoes;
    }

    static async buscaAnotacao(idAnotacao){
        let anotacaoBuscada = await Conexao.getCollections('Anotacoes').findOne({_id : new ObjectId(idAnotacao)});

        return anotacaoBuscada;
    }

    static async deletarAnotacao(idAnotacao){
        let anotacaoDeletada = await Conexao.getCollections('Anotacoes').deleteOne({_id: new ObjectId(idAnotacao)});

        return anotacaoDeletada;
    }
}

module.exports = Anotacoes;
