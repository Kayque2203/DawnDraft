// Teste de criptografia
var aesjs = require('aes-js');
var dadosSensiveis = require('./dadosSensiveis.json');

class Criptografacao{
    static criptografar(senha){
        let senhaEmBytes = aesjs.utils.utf8.toBytes(senha);
        let aesCtr = new aesjs.ModeOfOperation.ctr(dadosSensiveis.ChaveCriptografia, new aesjs.Counter(5));
        let cripto = aesCtr.encrypt(senhaEmBytes);
        let criptografiaHexadecimal = aesjs.utils.hex.fromBytes(cripto);

        return criptografiaHexadecimal;
    }

    static descriptografa(){
        // Parte de descriptografar
    }
}