const { MongoClient } = require('mongodb');

class Conexao {
    #client;
    #database;
    #Usuarios;

    constructor(){
        this.#client = new MongoClient('mongodb://localhost:27017');
        this.#database = this.#client.db('DawnDraft');
        this.#Usuarios = this.#database.collection('Usuarios');
    }

    get getUsuarioCollection(){
        return this.#Usuarios
    }

    get getCliente(){
        return this.#client
    }
    
}

module.exports = Conexao;
