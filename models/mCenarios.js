const { ObjectId } = require('mongodb');
const conexaoBD = require('../conexaoBD/conexaoBD');

const Conexao = new conexaoBD();

class Cenarios {
    // Propiedades da classe
    NomeDoCenario;
    Ambientacao;
    RealOuFicticio;
    Regras;
    ExisteConflitos;
    GeografiaDoLocal;
    InformacoesRelevantesAParte;
    ResumoDoCenario;

    Usuario;

    // Construtor da classe
    constructor(nome = "", ambientacao = "", realOuficticio = "", regras = "", conflitos = "", geografia = "", maisInfos = "", resumoCenario = "", user = ""){
        this.NomeDoCenario = nome;
        this.Ambientacao = ambientacao;
        this.RealOuFicticio = realOuficticio;
        this.Regras = regras;
        this.ExisteConflitos = conflitos;
        this.GeografiaDoLocal = geografia;
        this.InformacoesRelevantesAParte = maisInfos;
        this.ResumoDoCenario = resumoCenario;
        this.Usuario = new ObjectId(user);
    }

    // Métodos
    async adicionarCenario () { // Esse método adiciona um cenario ao banco de dados
        let cenarioAdicionado = await Conexao.getCollections('Cenarios').insertOne({
            "Nome" : this.NomeDoCenario,
            "Ambientacao" : this.Ambientacao,
            "RealOuFicticio" : this.RealOuFicticio,
            "Regras" : this.Regras,
            "ExisteConflitos" : this.ExisteConflitos,
            "GeografiaLocal" : this.GeografiaDoLocal,
            "InformacoesRelevantes" : this.InformacoesRelevantesAParte,
            "ResumoDoCenario" : this.ResumoDoCenario,
            "Usuario" : this.Usuario
        });

        return cenarioAdicionado.insertedId; // Retorna o id do cenario adicionado
    }

    async atualizaCenario (idCenario) { // Atualiza as informações de um cenario ja criado
        let cenarioAtualizado = await Conexao.getCollections('Cenarios').updateOne(
            {
                _id : new ObjectId(idCenario)
            },
            {
                "Nome" : this.NomeDoCenario,
                "Ambientacao" : this.Ambientacao,
                "RealOuFicticio" : this.RealOuFicticio,
                "Regras" : this.Regras,
                "ExisteConflitos" : this.ExisteConflitos,
                "GeografiaLocal" : this.GeografiaDoLocal,
                "InformacoesRelevantes" : this.InformacoesRelevantesAParte,
                "ResumoDoCenario" : this.ResumoDoCenario
            }
        );

        return cenarioAtualizado; // Retorna os resultados da atualização
    }

    async buscaCenario1 (idCenario) { // Método que busca e retorna um cenario
        let cenarioBuscado = await Conexao.getCollections('Cenarios').findOne({_id: new ObjectId(idCenario)});

        return cenarioBuscado;
    }

    // Métodos estaticos

    static async deletarCenario (idCenario) { // Método que deleta um cenario
        let cenarioDeletado = await Conexao.getCollections('Cenarios').deleteOne({_id: new ObjectId(idCenario)})

        return cenarioDeletado.deletedCount == 0? false : true;
    }

    static async deletarCenariosPeloIdUsuario (idUsuario) { // Método que ira deletar todos os cenarios de um usuario
        let cenariosDeletados = await Conexao.getCollections('Cenarios').deleteMany({Usuario : new ObjectId(idUsuario)});

        return cenariosDeletados.deletedCount == 0? false : true;
    }

    static async buscaCenario (idCenario) { // Método que busca e retorna um cenario
        let cenarioBuscado = await Conexao.getCollections('Cenarios').findOne({_id: new ObjectId(idCenario)});

        return cenarioBuscado;
    }

    static async buscaCenarios (idUsuario) { // Método que busca todos os cenarios de um usuario
        let cenariosBuscados = await Conexao.getCollections('Cenarios').find({Usuario: new ObjectId(idUsuario)}).toArray();

        return cenariosBuscados;
    }
}

module.exports = Cenarios;
