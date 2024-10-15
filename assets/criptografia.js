// Importa a bibioteca aes-js de criptografação
var aesjs = require('aes-js');

// Importa o arquivo json com os dados sensiveis incluindo a chave de criptografação.
var dadosSensiveis = require('../dadosSensiveis.json');

class Criptografacao {

    static criptografar(senha){
        // Coverte a senha para bytes
        let senhaEmBytes = aesjs.utils.utf8.toBytes(senha);

        // Criptgrafa a senha
        let aesCtr = new aesjs.ModeOfOperation.ctr(dadosSensiveis.ChaveCriptografia, new aesjs.Counter(5));
        let cripto = aesCtr.encrypt(senhaEmBytes);

        // Converte a criptografia de bytes para hexadecimal para que possamos ver 
        let criptografiaHexadecimal = aesjs.utils.hex.fromBytes(cripto);

        // retorna a senha criptografada
        return criptografiaHexadecimal;
    }

    static descriptografa(senha){
        // Converte a criptografia Do formato Hexadecimal para bytes
        let criptoEmBytes = aesjs.utils.hex.toBytes(senha);

        // Descriptografa os bytes
        let aesCtr = new aesjs.ModeOfOperation.ctr(dadosSensiveis.ChaveCriptografia, new aesjs.Counter(5));
		let descriptografaParaBytes = aesCtr.decrypt(criptoEmBytes);
 
        // Converte para a nossa cadeia de caracteres
		let senhaDescriptografada = aesjs.utils.utf8.fromBytes(descriptografaParaBytes);
		
        // retorna senha descriptografada
        return senhaDescriptografada
    }
}

// EXPORTA A CLASSE DE CRIPTOGRAFAÇÃO
module.exports = Criptografacao;
