const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD');

const Conexao = new conexao();

class PersonagensAnotacao {
    personagem;
    anotacao;
    colecaoPersonagensAnotacao;

    constructor(personagemAnotacao, idAnotacao){
        this.personagem = new ObjectId(personagemAnotacao);
        this.anotacao = new ObjectId(idAnotacao);
        this.colecaoPersonagensAnotacao = Conexao.getCollections('PersonagensAnotacoes');
    }

    // Métodos da classe
    async adicionarPersonagemNaAnotacao(){
        let novoPersonagemNaAnotacao = await this.colecaoPersonagensAnotacao.insertOne({
            "Personagem" : this.personagem,
            "Anotacao" : this.anotacao
        });

        return novoPersonagemNaAnotacao.insertedId.toString();
    }

    // Métodos Staticos
    static async deletarPersonagemDaAnotacao(idPersonagemAnotacao){
        let personagemDeletado = Conexao.getCollections('PersonagensAnotacoes').deleteOne({_id: new ObjectId(idPersonagemAnotacao) });

        return personagemDeletado;
    }
}

module.exports = PersonagensAnotacao;