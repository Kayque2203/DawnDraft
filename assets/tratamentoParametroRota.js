function trataParametrosDeRota (parametroRota){
    let parametroDeRota = ''
    
    for (const caracter of parametroRota) {
        if ( caracter !=':' && caracter != '<' && caracter != '>' && caracter != '{' && caracter != '}') {
            parametroDeRota += caracter;
        }
    }

    return parametroDeRota;
}

module.exports = trataParametrosDeRota;