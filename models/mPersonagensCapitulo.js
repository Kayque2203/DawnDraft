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
            "Capitulo" : this.anotacao
        });

        return novoPersonagemNoCapitulo.insertedId.toString();
    }

    // Métodos Staticos
    static async deletarPersonagemDoCapitulo(idPersonagemAnotacao){
        let personagemDeletado = Conexao.getCollections('PersonagensCapitulo').deleteOne({_id: new ObjectId(idPersonagemAnotacao) });

        return personagemDeletado;
    }

    static async buscaPersonagensDoCapitulo(idCapitulo){
        let personagensBuscados = await Conexao.getCollections('PersonagensCapitulo').find({Capitulo : new ObjectId(idCapitulo)}).toArray();

        return personagensBuscados;
    }

    static async buscaPersonagemDoCapitulo(idPersonagem){
        let personagemEncontrado = await Conexao.getCollections('PersonagensCapitulo').findOne({_id: new ObjectId(idPersonagem)});

        return personagemEncontrado;
    }
}

module.exports = PersonagensCapitulo;