const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD');

const Conexao = new conexao();

class CenariosCapitulo {
    cenario;
    capitulo;
    historia;
    usuario;
    colecaoCenariosCapitulo;

    constructor( idCenario, idCap, idHis, idUser ){
        this.cenario = new ObjectId(idCenario);
        this.capitulo = new ObjectId(idCap);
        this.historia = new ObjectId(idHis);
        this.usuario = new ObjectId(idUser);

        this.colecaoCenariosCapitulo = Conexao.getCollections('CenariosCapitulo');
    }

    // Métodos
    async adicionarCenarioNoCapitulo () { // Esse método vincula um capitulo a um cenario
        let novoCenarioNoCapitulo = await this.colecaoCenariosCapitulo.insertOne({
            "Cenario" : this.cenario,
            "Capitulo" : this.capitulo,
            "Historia" : this.historia,
            "Usuario" : this.usuario
        });

        return novoCenarioNoCapitulo.insertedId.toString();
    }

    // Métodos Estaticos 

    /* Busca dos cenarios vinculadoas aos capitulos */
    static async buscaCenarioDoCapitulo (idCenarioDoCapitulo) { // Busca 1 cenario do capitulo
        let cenarioDoCapituloBuscado = await Conexao.getCollections('CenariosCapitulo').findOne({ _id : new ObjectId(idCenarioDoCapitulo) });

        return cenarioDoCapituloBuscado;
    }

    static async buscaCenariosVinculadosAoCapitulo (idCapitulo) { // Esse método busca no banco de dados e retorna todos os cenarios vinculados a um capitulo
        let cenariosDoCapitulo = await Conexao.getCollections('CenariosCapitulo').find({Capitulo : new ObjectId(idCapitulo)}).toArray();

        return cenariosDoCapitulo;
    }

    static async buscaTodosOsCapituloVinculadosAUmCenario (idCenario) { // Retorna Todos os capitulos vinculados a um cenario
        let capitulosDosCenarios = await Conexao.getCollections('CenariosCapitulo').find({Cenario : new ObjectId(idCenario)}).toArray();

        return capitulosDosCenarios;
    }

    /* Deletar/desvincular os(o) cenarios(o) do(s) capitulo(s) */
    static async deletarCenarioDoCapitulo (idCenarioDoCapitulo) { // Desvincula um cenario de um capitulo apagando o registro do cenario do capitulo
        let cenarioExcluidoDoCapitulo = await Conexao.getCollections('CenariosCapitulo').deleteOne({ _id : new ObjectId(idCenarioDoCapitulo) });

        return cenarioExcluidoDoCapitulo;
    }

    static async desvincularTodosOsCapitulosDoCenario (idCenario) { // Desvincula todos os capitulos de um cenario
        let desvinculando = await Conexao.getCollections('CenariosCapitulo').deleteMany({Cenario : new ObjectId(idCenario)})

        return desvinculando;
    }

    static async ExcluirTodosOsCenariosDosCapitulosPeloIdHistoria (idHistoria) { // Deleta Todos os Cenarios Dos Capitulos Pelo Id da Historia
        let deletando = await Conexao.getCollections('CenariosCapitulo').deleteMany({Historia : new ObjectId(idHistoria)});

        return deletando;
    }

    static async ExcluirTodosOsCenariosDosCapitulosPeloIdCapitulo (idCapitulo) { // Deleta Todos os Cenarios Dos Capitulos Pelo Id do Capitulo
        let deletando = await Conexao.getCollections('CenariosCapitulo').deleteMany({Capitulo : new ObjectId(idCapitulo)});

        return deletando;
    }

    static async ExcluirTodosOsCenariosDosCapitulosPeloIdUsuario (idUsuario) { // Deleta Todos os Cenarios Dos Capitulos Pelo Id do Usuario
        let deletando = await Conexao.getCollections('CenariosCapitulo').deleteMany({Usuario : new ObjectId(idUsuario)});

        return deletando;
    }
}

module.exports = CenariosCapitulo;
