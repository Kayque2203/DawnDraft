const btnVerSenha = document.getElementById('verSenha');
const inputSenha = document.getElementById('senha');

btnVerSenha.addEventListener('click', () => {
    if (inputSenha.type == "password" || inputSenha.type == "") 
    {
        inputSenha.type = "text"
    }
    else
    {
        inputSenha.type = "password"
    }
})