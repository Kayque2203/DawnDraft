const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD');

const Conexao = new conexao();

class Anotacoes {
    focoCapitulo;
    humorTom;
    capitulo;
    historia;

    constructor(focoCap, humroTomCap, capituloAnotacao, historiaAnotacao){
        this.focoCapitulo = focoCap;
        this.humorTom = humroTomCap;
        this.capitulo = capituloAnotacao;
        this.historia = historiaAnotacao;
    }

    // Métodos da classe
    async adicionarAnotacao(){
        let novaAnotacao = await Conexao.getCollections('Anotacoes').insertOne({
            "FocoCapitulo" : this.focoCapitulo,
            "HumorTom" : this.humorTom,
            "Capitulo" : new ObjectId(this.capitulo),
            "Historia" : new ObjectId(this.historia)
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

    static async deletarAnotacoes(idCapitulo){
        let anotacoesDeletadas = await Conexao.getCollections('Anotacoes').deleteMany({Capitulo : new ObjectId(idCapitulo)});
        
        return anotacoesDeletadas;
    }

    static async deletarAnotacao(idAnotacao){
        let anotacaoDeletada = await Conexao.getCollections('Anotacoes').deleteOne({_id: new ObjectId(idAnotacao)});

        return anotacaoDeletada;
    }

    static async deletarAnotacoesPeloIdHistoria(idHistoria){
        let anotacoesExcluidas = await Conexao.getCollections('Anotacoes').deleteMany({Historia : new ObjectId(idHistoria)});

        return anotacoesExcluidas;
    }
}

module.exports = Anotacoes;
