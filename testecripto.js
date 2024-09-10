// Teste de criptografia
var aesjs = require('aes-js');

var chave = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

var senha = "47826487EM";

var senhaEmBytes = aesjs.utils.utf8.toBytes(senha);

var aesCtr = new aesjs.ModeOfOperation.ctr(chave, new aesjs.Counter(5));

var criptografia = aesCtr.encrypt(senhaEmBytes);

var criptografiaHexadecimal = aesjs.utils.hex.fromBytes(criptografia);

console.log(criptografiaHexadecimal);