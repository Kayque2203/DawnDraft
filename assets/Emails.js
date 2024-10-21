const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");
const dadosSensiveis = require('../dadosSensiveis.json');

class Email {
    #TOKEN
    #transporte
    #DawnDraft
    #EmailUsuario
    #CodigoVerificacaoEmail

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

        this.#CodigoVerificacaoEmail = codigoVerificacao;
    }

    get getCodigoVerificacaoEmail(){
        return this.#CodigoVerificacaoEmail;
    }

    async enviarEmailDeVerificacao(){
        let emailEnviado = await this.#transporte.sendMail({
            from: this.#DawnDraft,
            to: this.#EmailUsuario,
            subject: "Verificação De Email",
            text: `Código De Verificação ${this.#CodigoVerificacaoEmail}`,
            category: "Integration Test",
        });

       return emailEnviado.success;
    }

    // Envia Link Para Mudar Senha
    async enviarEmailComLinkSenha(){
        let emailEnviado = await this.#transporte.sendMail({
            from: this.#DawnDraft,
            to: this.#EmailUsuario,
            subject: "Verificação De Email",
            text: `LINK Para Alterar Senha: \n http://localhost:3000/LoginECadastro/esqueciMinhaSenha/:${this.#CodigoVerificacaoEmail}`,
            category: "Integration Test",
        });

        return emailEnviado.success;
    }
}

module.exports = Email;
