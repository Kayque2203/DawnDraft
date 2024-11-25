const { ObjectId } = require('mongodb');
const ConexaoBD = require('../conexaoBD/conexaoBD');

const Conexao = new ConexaoBD();

class Mensagens {
    Assunto;
    Mensagem;
    EmailResposta;

    constructor(assunto, email, mensagem) {
        this.Assunto = assunto;
        this.Mensagem = mensagem;
        this.EmailResposta = email;

        this.ColecaoMensagens = Conexao.getCollections('Mensagens')
    }

    async enviandoMensagem () {
        let postandoMsgNoBanco = await this.ColecaoMensagens.insertOne({
            "Assunto" : this.Assunto,
            "EmailDeREsposta" : this.EmailResposta,
            "Mensagem" : this.Mensagem
        })

        return postandoMsgNoBanco.insertedId
    }

    static async BuscaTodasAsMensagens () {
        let mensagens = await Conexao.getCollections('Mensagens').find().toArray();

        return mensagens;
    }

    static async BuscarUmaMensagem (idMensagem) {
        let mensagem = await Conexao.getCollections('Mensagens').findOne({ _id : new ObjectId(idMensagem) });

        return mensagem;
    }
}

module.exports = Mensagens;
