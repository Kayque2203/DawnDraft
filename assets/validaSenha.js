class ValidacaoSenha {
    #Senha;
    #Minusculas = /[a-z]/;
    #Maiuscalas = /[A-Z]/;
    #Numeros = /[0-9]/;
    #CaracteresEspeciais = /[!@#$%&*(){}|?:<>,.]/;

    constructor(senha) {
        this. #Senha = senha;
    }

    ValidacaoDaSenha () {
        if (this.#Senha.length < 8) 
        {
            return { Valida: false, Erro: "A senha deve conter no minimo 8 caracters!"};    
        }

        if (!this.#Minusculas.test(this.#Senha))
        {
            return { Valida: false, Erro: "A senha deve conter ao menos uma letra minuscula!"};
        }

        if (!this.#Maiuscalas.test(this.#Senha)) 
        {
            return { Valida: false, Erro: "A senha deve conter ao menos uma letra maiuscula!"};    
        }

        if (!this.#Numeros.test(this.#Numeros)) 
        {
            return { Valida: false, Erro: "A senha deve conter ao menos um numero!"};
        }

        if (!this.#CaracteresEspeciais.test(this.#Senha))
        {
            return { Valida: false, Erro: "A senha deve conter ao menos um caracter especial ( !@#$%&*(){}|?:<>,. ) !"};
        }

        return { Valida: true, Erro: ""};
    }
}

module.exports = ValidacaoSenha;
