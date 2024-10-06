const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD');

const Conexao = new conexao();

class PersonagensCapitulo {
    personagem;
    anotacao;
    colecaoPersonagensCapitulo;

    constructor(personagemAnotacao, idAnotacao){
        this.personagem = new ObjectId(personagemAnotacao);
        this.anotacao = new ObjectId(idAnotacao);
        this.colecaoPersonagensCapitulo = Conexao.getCollections('PersonagensCapitulo');
    }

    // Métodos da classe
    async adicionarPersonagemNoCapitulo(){
        let novoPersonagemNoCapitulo = await this.colecaoPersonagensCapitulo.insertOne({
            "Personagem" : this.personagem,
            "Anotacao" : this.anotacao
        });

        return novoPersonagemNoCapitulo.insertedId.toString();
    }

    // Métodos Staticos
    static async deletarPersonagemDoCapitulo(idPersonagemAnotacao){
        let personagemDeletado = Conexao.getCollections('PersonagensCapitulo').deleteOne({_id: new ObjectId(idPersonagemAnotacao) });

        return personagemDeletado;
    }
}

module.exports = PersonagensCapitulo;