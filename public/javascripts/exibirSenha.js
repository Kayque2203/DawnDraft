const btnVerSenha = document.getElementById('verSenha');
const inputSenha = document.getElementById('senha');

btnVerSenha.addEventListener('click', () => {
    if (inputSenha.type == "password" || inputSenha.type == "") 
    {
        inputSenha.type = "text";
        btnVerSenha.innerText = "Ocultar senha";
    }
    else
    {
        inputSenha.type = "password";
        btnVerSenha.innerText = "Ver senha";
    }
});


