const iptnSenha = document.getElementById('inputSenhaCad');
const iptnConfirmarSenha = document.getElementById('inputConfirmarSenhaCad');

const botaoVerSenha = document.getElementById('VerSenhaCadastro')

botaoVerSenha.addEventListener('click', () => {
    if (iptnSenha.type == 'c' || iptnSenha.type == "")
    {
        iptnSenha.type = "text";
        iptnConfirmarSenha.type = "text";
    }
    else
    {
        iptnSenha.type = "password";
        iptnConfirmarSenha.type = "password";
    }
})
