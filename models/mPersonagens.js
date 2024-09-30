const conexao = require('../conexaoBD/conexaoBD');

const Conexao = new conexao();
// Isso aqui não esta terminado!!!
// DPS retirar esse try catch para nao interferir nos outros dos controllers

class Personagens {
    // Propiedades
    nome;
    altura;
    peso;
    cor;
    pais_origem;
    cidade;
    historia;

    // Contrutor da classe
    constructor(nomePersonagem, alturaPErsonagem, pesoPersonagem, corPersonagem, paisOrigemPersonagem, cidadePersonagem, historiaPersonagem){
        this.nome = nomePersonagem;
        this.altura = alturaPErsonagem;
        this.peso = pesoPersonagem;
        this.cor = corPersonagem;
        this.pais_origem = paisOrigemPersonagem;
        this.cidade = cidadePersonagem;
        this.historia = historiaPersonagem;
    }

    // Metodo da classe para adicionar novos personagens
    async adicionaPersonagem(){
        try {

            // Adiciona um novo personagem no banco de dados
            let novoPersonagem = await Conexao.getCollections('Personagens').insertOne({
                "Nome" : this.nome,
                "Caracteristicas_Fisicas" : {
                    "Altura" : this.altura,
                    "Peso" : this.peso,
                    "Cor" : this.cor
                },
                "Pais_Origem" : this.pais_origem,
                "Cidade" : this.cidade,
                "Historia" : ObjectId(this.historia)
            });

            // Retorna o id do personagem recem adicionado
            return novoPersonagem.insertedId;

        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Personagens;