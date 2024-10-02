const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD');

const Conexao = new conexao();

class CenariosAnotacao {
    cenario;
    anotacao;
    colecaoCenariosAnotacoes;

    constructor( idCenario, idAnotacao ){
        this.cenario = new ObjectId(idCenario);
        this.anotacao = new ObjectId(idAnotacao);
        this.colecaoCenariosAnotacoes = Conexao.getCollections('CenariosAnotacoes');
    }

    // Métodos
    async adicionarCenarioNaAnotacao(){
        let novoCenarioNaAnotacao = await this.colecaoCenariosAnotacoes.insertOne({
            "Cenario" : this.cenario,
            "Anotacao" : this.anotacao
        });

        return novoCenarioNaAnotacao.insertedId.toString();
    }

    // Métodos Estaticos 
    static async deletarCenarioDaAnotacao(idCenarioDaAnotacao){
        let cenarioDaAnotacaoExcluido = await Conexao.getCollections().deleteOne({ _id : new ObjectId(idCenarioDaAnotacao) });

        return cenarioDaAnotacaoExcluido;
    }
}

module.exports = CenariosAnotacao;
