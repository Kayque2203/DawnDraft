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
            // text: `Código De Verificação ${this.#CodigoVerificacaoEmail}`,
            html: `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verificação de email</title>
                <style>
                    *{
                        margin : 0px;
                        padding : 0px;
                        box-sizing: border-box;
                    }

                    body {
                        width: 100%;
                        margin: 0;
                        font: 12.5pt "Lucida Grande", Helvetica, Arial, sans-serif;
                        font-family: "Sora", sans-serif;
                    }

                    section{
                        padding: 50px;

                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }

                    header{
                        display: flex;
                        width: 100%;
                        justify-content: center;
                        align-items: center;
                        background: linear-gradient(to bottom, #ff9101, #f8eb59c2);
                        margin: 0%;
                        padding: 10pt;
                        align-items: center;
                    }

                    h1{
                        text-wrap: nowrap;
                    }

                    .boxTituloLogo{
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .logo-nav{
                        width: 50pt;
                        height: auto;
                        border-radius: 50%;
                    }

                    span{
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <header class="header">
                    <div class="boxTituloLogo">
                        <h1 class="h1-home" translate="no">Dawn Draft</h1>
                    </div>
                </header>
                <section>
                    <h2>Verificação de email!</h2>
                    <br/>
                    <h3>Código de verificação: <span> ${this.#CodigoVerificacaoEmail} </span></h3>
                </section>
            </body>
            </html>`
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
