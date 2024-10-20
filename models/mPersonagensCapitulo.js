const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD');

const Conexao = new conexao();

class PersonagensCapitulo {
    personagem;
    capitulo;
    historia;
    usuario;
    colecaoPersonagensCapitulo;

    constructor(personagemCapitulo, idcapitulo, idHistoria, idUsuario){
        this.personagem = new ObjectId(personagemCapitulo);
        this.capitulo = new ObjectId(idcapitulo);
        this.historia = new ObjectId(idHistoria);
        this.usuario = new ObjectId(idUsuario);
        this.colecaoPersonagensCapitulo = Conexao.getCollections('PersonagensCapitulo');
    }

    // Métodos da classe
    async adicionarPersonagemNoCapitulo(){
        let novoPersonagemNoCapitulo = await this.colecaoPersonagensCapitulo.insertOne({
            "Personagem" : this.personagem,
            "Capitulo" : this.capitulo,
            "Historia" : this.historia,
            "Usuario" : this.usuario,
        });

        return novoPersonagemNoCapitulo.insertedId.toString();
    }

    // Métodos Staticos
    static async deletarPersonagemDoCapitulo(idPersonagemAnotacao){
        let personagemDeletado = Conexao.getCollections('PersonagensCapitulo').deleteOne({_id: new ObjectId(idPersonagemAnotacao) });

        return personagemDeletado;
    }

    static async deletarTodosPersonagensDoCapituloPeloIdCapitulo(idCapitulo){
        let personegensExcluidos = Conexao.getCollections('PersonagensCapitulo').deleteMany({Capitulo : new ObjectId(idCapitulo)});

        return personegensExcluidos;
    }

    static async deletarTodosPersonagensDoCapituloPeloIdHistoria(idHistoria){
        let personegensExcluidos = Conexao.getCollections('PersonagensCapitulo').deleteMany({Historia : new ObjectId(idHistoria)});

        return personegensExcluidos;
    }

    static async deletarTodosPersonagensDoCapituloPeloIdUsuario(idUsuario){
        let personegensExcluidos = Conexao.getCollections('PersonagensCapitulo').deleteMany({Usuario : new ObjectId(idUsuario)});

        return personegensExcluidos;
    }

    static async deletaPersonagensDoCapituloPeloIdPersonagem(idPersonagem){
        let personegemExcluidos = Conexao.getCollections('PersonagensCapitulo').deleteMany({Personagem : new ObjectId(idPersonagem)});

        return personegemExcluidos;
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