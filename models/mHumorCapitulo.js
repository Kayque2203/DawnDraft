const { ObjectId } = require("mongodb");
const Conexao = require("../conexaoBD/conexaoBD");

const ConexaoBD = new Conexao();

class HumorCapitulo {
    humor;
    capitulo;
    historia;
    usuario;

    constructor(humorCap, idCapitulo, idHistoria, idUsuario){ // Método Construtor Da Classe
        this.humor = humorCap;
        this.capitulo = new ObjectId(idCapitulo);
        this.historia = new ObjectId(idHistoria);
        this.usuario = new ObjectId(idUsuario);
    }

    // Métodos
    async adicionaHumorNoCapitulo(){ // Adiciona Um Novo Humor Ao Capitulo
        let adicionandoHumorAoCapitulo = await ConexaoBD.getCollections('HumorDosCapitulos').insertOne({
            "Humor" : this.humor,
            "Capitulo" : this.capitulo,
            "Historia" : this.historia,
            "Usuario" : this.usuario
        })

        return adicionandoHumorAoCapitulo;
    }

    // Métodos Estaticos
    static async excluiHumorDoCapitulo(idHumorCap){ // Remove Um Humor De Um Capitulo, Para Quando Fomos Excluir Apenas 1 Humor Do Capitulo
        let excluiHumorDoCapitulo = await ConexaoBD.getCollections('HumorDosCapitulos').deleteOne({ _id : new ObjectId(idHumorCap)});

        return excluiHumorDoCapitulo;
    }

    static async excluiTodosHumorDoCapituloPeloIdCapitulo(idCapitulo){ // Exclui Todos Os Homor do capitulo, Para Quando Fomos Deletar Um Capitulo
        let excluindoHumorDoCapitulo = await ConexaoBD.getCollections('HumorDosCapitulos').deleteMany({ Capitulo : new ObjectId(idCapitulo)});

        return excluindoHumorDoCapitulo;
    }

    static async excluiTodosHumorDeCapituloPeloIdHistoria(IdHistoria){ // Exclui Todos Os Humor De Todos Os Cpitulos De Uma Historia, Para Quando Fomos Deletar Uma Historia
        let excluindoHumorDoCapitulo = await ConexaoBD.getCollections('HumorDosCapitulos').deleteMany({ Historia : new ObjectId(IdHistoria)});

        return excluindoHumorDoCapitulo;
    }

    static async excluiTodosHumorDoCapituloPeloIdUsuario(IdUsuario){ // Exclui Todos Os Humor De Todos Os Capitulos Do Usuario, Para Quando Fomos Deletar 1 Usuario
        let excluindoHumorDoCapitulo = await ConexaoBD.getCollections('HumorDosCapitulos').deleteMany({Usuario : new ObjectId(IdUsuario)});

        return excluindoHumorDoCapitulo;
    }

    static async buscaHumoresDoCapitulo(idCapitulo){ // Busca Todos Humores De Um Capitulo
        let humoresBuscados = await ConexaoBD.getCollections('HumorDosCapitulos').find({Capitulo : new ObjectId(idCapitulo)}).toArray();

        return humoresBuscados;
    }

    static async buscaHumorDoCapitulo(idHumorCap){ // Busca Apenas 1 humor
        let humorEncontrado = await ConexaoBD.getCollections('HumorDosCapitulos').findOne({_id : new ObjectId(idHumorCap)});

        return humorEncontrado;
    } 
}

module.exports = HumorCapitulo;
