const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD.js');
const Criptografia = require('../assets/criptografia.js');
const Historias = require('../models/mHistorias.js');

const Conexao = new conexao();

// DPS retirar esse try catch para nao interferir nos outros dos controllers

class Usuarios {
    #nome;
    #email;
    #telefone;
    #senha;

    constructor( nomeUsuario = '', emailUsuario = '', telUsuario = '', senhaUsuario = '' ) {
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
        this.#senha = Criptografia.criptografar(senhaUsuario);
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

        let novoUser = await Conexao.getCollections('Usuarios').insertOne({
            "Nome" : this.#nome,
            "Email" : this.#email,
            "Telefone" : this.#telefone,
            "Senha" : this.#senha
        })

        return novoUser.insertedId;
    }

    async buscaUsuarioPeloEmail(email) {

       let usuario =  await Conexao.getCollections('Usuarios').findOne({"Email": email});

       return usuario;

    }

    // Staticos 
    static async buscaUsuariosPeloEmail2(email){
        let usuario =  await Conexao.getCollections('Usuarios').findOne({"Email": email});

        return usuario;
    }

    static async buscaUsuarioPeloId(id){
        let usuario = await Conexao.getCollections('Usuarios').findOne( { _id: new ObjectId(id) } );

        return usuario;
    }

    // Verificar isso aqui dps
    static async deletarUsuario(id){
        let personagensDoCapituloDeletados = await PersonagensCapitulo.deletarTodosPersonagensDoCapituloPeloIdHistoria(tratamentoParametroDeRota(req.params.idHistoria));
        let FocosDeCapituloDeletados = await FocoDoCapitulo.deletarFocosDoCapituloPeloIdCapitulo(trataParametrosDeRota(req.params.idCapitulo));
        let HomoresDeCapitulosDeletados = await HumorCapitulo.excluiTodosHumorDoCapituloPeloIdCapitulo(trataParametrosDeRota(req.params.idCapitulo));
        let historiasDeletadas = await Historias.deleteTodasHistoriasDoUser(id);
        let usuarioDeletado = await Conexao.getCollections('Usuarios').deleteOne({_id: new ObjectId(id)});
        return usuarioDeletado, historiasDeletadas;
    }
}

module.exports = Usuarios;
