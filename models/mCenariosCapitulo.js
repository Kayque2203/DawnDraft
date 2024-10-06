const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD');

const Conexao = new conexao();

class CenariosCapitulo {
    cenario;
    anotacao;
    colecaoCenariosCapitulo;

    constructor( idCenario, idAnotacao ){
        this.cenario = new ObjectId(idCenario);
        this.anotacao = new ObjectId(idAnotacao);
        this.colecaoCenariosCapitulo = Conexao.getCollections('CenariosCapitulo');
    }

    // Métodos
    async adicionarCenarioNoCapitulo(){
        let novoCenarioNoCapitulo = await this.colecaoCenariosCapitulo.insertOne({
            "Cenario" : this.cenario,
            "Anotacao" : this.anotacao
        });

        return novoCenarioNoCapitulo.insertedId.toString();
    }

    // Métodos Estaticos 
    static async deletarCenarioDoCapitulo(idCenarioDoCapitulo){
        let cenarioExcluidoDoCapitulo = await Conexao.getCollections('CenariosCapitulo').deleteOne({ _id : new ObjectId(idCenarioDoCapitulo) });

        return cenarioExcluidoDoCapitulo;
    }
}

module.exports = CenariosCapitulo;
