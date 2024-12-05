const btnVerSenha2 = document.getElementById('VerSenha');
const inputSenha2 = document.getElementById('Senha');

btnVerSenha2.addEventListener('click', () => {
    console.log('foi')
    if (inputSenha2.type == "password" || inputSenha2.type == "") 
    {
        inputSenha2.type = "text";
        btnVerSenha2.innerText = "Ocultar senha";
    }
    else
    {
        inputSenha2.type = "password";
        btnVerSenha2.innerText = "Ver senha";
    }
});