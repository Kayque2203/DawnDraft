const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");
const dadosSensiveis = require('../dadosSensiveis.json');

class Email {
    #TOKEN
    #transporte
    #DawnDraft
    #EmailUsuario

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
    }

    enviarEmailDeVerificacao(){

        let codigoVerificacao = "";

        for (let index = 0; index < 6; index++) {
           
            codigoVerificacao += Math.floor(Math.random()*9);
            
        }

        this.#transporte.sendMail({
            from: this.#DawnDraft,
            to: this.#EmailUsuario,
            subject: "Verificação De Email",
            text: `Código De Verificação ${codigoVerificacao}`,
            category: "Integration Test",
        }).then(console.log, console.error);

    }
}

module.exports = Email;
