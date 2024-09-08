// Arrumar isso
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';

const client = new  MongoClient(uri);

const database = client.db('DawnDraft');
// const Usuarios = database.collection('Usuarios');

class Conexao {
    static Usuarios = database.collection('Usuarios')

    static async fecharConexao(){
        await client.close()
    }
}





 


module.exports = Conexao;