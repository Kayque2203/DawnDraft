const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD.js');

const Conexao = new conexao();

class Usuarios {
    #nome;
    #email;
    #telefone;
    #senha;

    constructor( nomeUsuario, emailUsuario, telUsuario, senhaUsuario ) {
        this.setUsuario(nomeUsuario);
        this.setEmail(emailUsuario);
        this.setTelefone(telUsuario);
        this.setSenha(senhaUsuario);
    }

    // Setters
    setUsuario(nomeUsuario){
        this.#nome = nomeUsuario;
    }

    setEmail(emailUsuario){
        this.#email = emailUsuario;
    }

    setTelefone(telUsuario){
        this.#telefone = telUsuario;
    }

    setSenha(senhaUsuario){
        this.#senha = senhaUsuario;
    }

    // Getters
    get getNome(){
        return this.#nome;
    }

    get getEmail(){
        return this.#email;
    }

    get getTelefone(){
        return this.#telefone;
    }

    get getSenha(){
        return this.#senha;
    }

    // Metodos
    async adicionarUsuario(){
        try {

            let novoUser = await Conexao.getCollections('Usuarios').insertOne({
                "Nome" : this.#nome,
                "Email" : this.#email,
                "Telefone" : this.#telefone,
                "Senha" : this.#senha
            })

            return novoUser.insertedId;

        } catch (error) {
            console.log(error);
            next(error);
        }
        
    }

    async buscaUsuarioPeloEmail(email) {

       let usuario =  await Conexao.getCollections('Usuarios').findOne({"Email": email});

       return usuario;

    }

    static async buscaUsuarioPeloId(id){
        let usuario = await Conexao.getCollections('Usuarios').findOne( { _id: ObjectId(id) } );

        return usuario;
    }
}

module.exports = Usuarios;
