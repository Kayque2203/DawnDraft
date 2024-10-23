const conexaoBD = require('../conexaoBD/conexaoBD');

const Conexao = new conexaoBD();

class Cenarios {
    NomeDoCenario;
    Ambientacao;
    RealOuFicticio;
    Regras;
    ExisteConflitos;
    GeografiaDoLocal;
    InformacoesRelevantesAParte;

    constructor(nome, ambientacao, realOuficticio, regras, conflitos, geografia, maisInfos){
        this.NomeDoCenario = nome;
        this.Ambientacao = ambientacao;
        this.RealOuFicticio = realOuficticio;
        this.Regras = regras;
        this.ExisteConflitos = conflitos;
        this.GeografiaDoLocal = geografia;
        this.InformacoesRelevantesAParte = maisInfos;
    }

    // Métodos
    async adicionarCenario(){
        let cenarioAdicionado = await Conexao.getCollections('Cenarios').insertOne({
            "Nome" : this.NomeDoCenario,
            "Ambientacao" : this.Ambientacao,
            "RealOuFicticio" : this.RealOuFicticio,
            "Regras" : this.Regras,
            "ExisteConflitos" : this.ExisteConflitos,
            "GeografiaLocal" : this.GeografiaDoLocal,
            "InformacoesRelevantes" : this.InformacoesRelevantesAParte
        });

        return cenarioAdicionado.insertedId;
    }
}

module.exports = Cenarios