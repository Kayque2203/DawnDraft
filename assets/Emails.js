const nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");
const dadosSensiveis = require('../dadosSensiveis.json');

class Email {
    #TOKEN
    #transporte
    #DawnDraft
    #EmailUsuario
    #CodigoVerificacao

    constructor(emailUsuario) {
        this.#TOKEN = dadosSensiveis.TOKEN2;
        this.#transporte = Nodemailer.createTransport(
            MailtrapTransport({
              token: this.#TOKEN,
            })
        );
        this.#DawnDraft = {
            address: "hello@demomailtrap.com",
            name: "DawnDraft"
        };
        this.#EmailUsuario = emailUsuario;

        let codigoVerificacao = "";

        for (let index = 0; index < 6; index++) {
           
            codigoVerificacao += Math.floor(Math.random()*9);
            
        }

        this.#CodigoVerificacao = codigoVerificacao;
    }

    get getCodigoVerificacaoEmail(){
        return this.#CodigoVerificacao;
    }

    async enviarEmailDeVerificacao(){
        let emailEnviado = await this.#transporte.sendMail({
            from: this.#DawnDraft,
            to: this.#EmailUsuario,
            subject: "Verificação De Email",
            text: `Código De Verificação ${this.#CodigoVerificacao}`,
            category: "Validação De Email",
        });

       return emailEnviado.success;
    }

    // Envia Link Para Mudar Senha
    async enviarEmailComLinkSenha(){
        let emailEnviado = await this.#transporte.sendMail({
            from: this.#DawnDraft,
            to: this.#EmailUsuario,
            subject: "Verificação De Email",
            text: `LINK Para Alterar Senha: \n http://localhost:3000/LoginECadastro/esqueciMinhaSenha/:${this.#CodigoVerificacao}`,
            category: "Recuperar Acesso A Conta",
        });

        return emailEnviado.success;
    }
}

module.exports = Email;
