const { contextsKey } = require('express-validator/lib/base.js');
const Conexao = require('../conexaoBD/conexaoBD.js');

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

    // Metodos

    async adicionarUsuario(){
        try {

            let novoUser = await Conexao.Usuarios.insertOne({
                "Nome" : this.#nome,
                "Email" : this.#email,
                "Telefone" : this.#telefone,
                "Senha" : this.#senha
            })

            await Conexao.fecharConexao()

            return novoUser.insertedId;

        } catch (error) {
            console.log(error);
        }
        
    }

    async buscaUsuario(email) {
       
        let usuario =  await Conexao.Usuarios.findOne({"Email": email});

       await Conexao.fecharConexao();

       return usuario;

    }
}

module.exports = Usuarios;
