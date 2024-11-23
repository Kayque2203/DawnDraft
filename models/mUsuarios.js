const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD.js');
const Criptografia = require('../assets/criptografia.js');
const Historias = require('../models/mHistorias.js');
const PersonagensCapitulo = require('../models/mPersonagensCapitulo.js');
const Personagens = require('../models/mPersonagens.js');
const CenariosCapitulo = require('./mCenariosCapitulo.js');

const Conexao = new conexao();

class Usuarios {
    #nome;
    #email;
    #senha;

    constructor( nomeUsuario = '', emailUsuario = '', senhaUsuario = '' ) {
        this.setUsuario(nomeUsuario);
        this.setEmail(emailUsuario);
        this.setSenha(senhaUsuario);
    }

    // Setters
    setUsuario(nomeUsuario){
        this.#nome = nomeUsuario;
    }

    setEmail(emailUsuario){
        this.#email = emailUsuario;
    }

    setSenha(senhaUsuario){
        this.#senha = Criptografia.criptografar(senhaUsuario);
    }

    // Metodos
    async adicionarUsuario(){

        let novoUser = await Conexao.getCollections('Usuarios').insertOne({
            "Nome" : this.#nome,
            "Email" : this.#email,
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
                    "Senha" : this.#senha
                }
            }
        );

        return usuarioAserAtualizado.modifiedCount == 0? false : true;
    }

    // Staticos 
    static async AtualizaEmailUsuario (idUsuario, novoEmailUsuario) {
        let usuarioAserAtualizado = await Conexao.getCollections('Usuarios').updateOne(
            {
                _id : new ObjectId(idUsuario)
            },
            {
                $set : {
                    "Email" : novoEmailUsuario
                }
            }
        );

        return usuarioAserAtualizado.modifiedCount == 0? false : true;
    }

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

    // Redefine senha do usuario na funcionalidade de esqueci minha senha!!!
    static async redefinirSenhaUsuario(emailUsuario, novaSenha){
        let usuarioARedefinirSenha = await Conexao.getCollections('Usuarios').updateOne(
            {
                "Email" : emailUsuario
            },
            {
                $set : {
                    "Senha" : novaSenha
                }
            }
        );

        return usuarioARedefinirSenha;
    }

    // Verificar isso aqui dps
    static async deletarUsuario(idUsuario){
        let cenariosDoCapitulo = await CenariosCapitulo.ExcluirTodosOsCenariosDosCapitulosPeloIdUsuario(idUsuario)
        let personagensDoCapituloDeletados = await PersonagensCapitulo.deletarTodosPersonagensDoCapituloPeloIdUsuario(idUsuario);
        let personagens = await Personagens.deletarTodosPersonagensPeloIdUsuario(idUsuario);
        let historiasDeletadas = await Historias.deleteTodasHistoriasDoUser(idUsuario);
        let usuarioDeletado = await Conexao.getCollections('Usuarios').deleteOne({_id: new ObjectId(idUsuario)});
        return usuarioDeletado
    }
}

module.exports = Usuarios;
