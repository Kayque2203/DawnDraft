const Nodemailer = require("nodemailer");
const dadosSensiveis = require('../dadosSensiveis.json');

class Email {
    #transporte
    #EmailUsuario   
    #CodigoVerificacaoEmail

    constructor(emailUsuario) {
        this.#transporte = Nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "dawndrafttcc@gmail.com",
                pass: dadosSensiveis.ChaveAPPGmail
            }
        });

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
            from: "DawnDraft",
            to: this.#EmailUsuario,
            subject: "Verificação De Email",
            text: `Código De Verificação ${this.#CodigoVerificacaoEmail}`,
        });

       return emailEnviado.accepted;
    }

    // Envia Link Para Mudar Senha
    async enviarEmailComLinkSenha(){
        let emailEnviado = await this.#transporte.sendMail({
            from: "DawnDraf",
            to: this.#EmailUsuario,
            subject: "Verificação De Email",
            text: `LINK Para Alterar Senha: \n http://localhost:3000/LoginECadastro/redefinirSenha/:${this.#EmailUsuario}/:${this.#CodigoVerificacaoEmail}`
        });

        return emailEnviado.response;
    }
}

module.exports = Email;
