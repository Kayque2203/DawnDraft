const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD.js');
const Criptografia = require('../assets/criptografia.js');
const Historias = require('../models/mHistorias.js');
const PersonagensCapitulo = require('../models/mPersonagensCapitulo.js');
const FocoDoCapitulo = require('../models/mFocoDosCapitulos.js');
const HumorCapitulo = require('../models/mHumorCapitulo.js');
const Personagens = require('../models/mPersonagens.js');

const Conexao = new conexao();

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

    // Metodos
    async adicionarUsuario(){

        let novoUser = await Conexao.getCollections('Usuarios').insertOne({
            "Nome" : this.#nome,
            "Email" : this.#email,
            "Telefone" : this.#telefone,
            "Senha" : this.#senha,
            "Verificado" : false
        })

        return novoUser.insertedId;
    }

    async buscaUsuarioPeloEmail(email) {

       let usuario =  await Conexao.getCollections('Usuarios').findOne({"Email": email});

       return usuario;

    }

    async atualizaUsuario(idUsuario) { // Falta Testar!!!
        let usuarioAserAtualizado = await Conexao.getCollections('Usuarios').updateOne(
            {
                _id : new ObjectId(idUsuario)
            },
            {
                $set : {
                    "Nome" : this.#nome,
                    "Telefone" : this.#telefone,
                    "Senha" : this.#senha
                }
            }
        );

        return usuarioAserAtualizado == null? false : true
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

    static async mudarVerificacaoDoUsuario(idUsuario, verificacao){
        let usuarioAserAtualizado = await Conexao.getCollections('Usuarios').updateOne(
            {
                _id : new ObjectId(idUsuario)
            },
            {
                $set : {
                    "Verificado" : verificacao
                }
            }
        );

        return usuarioAserAtualizado == null? false : true
    }

    // Verificar isso aqui dps
    static async deletarUsuario(id){
        let personagensDoCapituloDeletados = await PersonagensCapitulo.deletarTodosPersonagensDoCapituloPeloIdUsuario(id);
        let personagens = await Personagens.deletarTodosPersonagensPeloIdUsuario(id);
        let FocosDeCapituloDeletados = await FocoDoCapitulo.deletarFocosDoCapituloPeloIdUsuario(id);
        let HomoresDeCapitulosDeletados = await HumorCapitulo.excluiTodosHumorDoCapituloPeloIdUsuario(id);
        let historiasDeletadas = await Historias.deleteTodasHistoriasDoUser(id);
        let usuarioDeletado = await Conexao.getCollections('Usuarios').deleteOne({_id: new ObjectId(id)});
        return usuarioDeletado
    }
}

module.exports = Usuarios;
