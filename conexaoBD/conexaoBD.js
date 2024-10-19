const { MongoClient } = require('mongodb');

const DadosSensiveis = require('../etc/secrets/dadosSensiveis.json');

class Conexao {
    #client;
    #database;

    constructor(){
        this.#client = new MongoClient(DadosSensiveis.UriBD);
        this.#database = this.#client.db('DawnDraft');
    }

    // get getCliente(){
    //     return this.#client
    // }
    
    getCollections(collection){ // Método que retorna a coleção desejada.
        return this.#database.collection(collection);
    }
}

module.exports = Conexao;
