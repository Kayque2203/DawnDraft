const formularioLogin = document.getElementById('formularioLogin');

const formularioCadastro = document.getElementById('formularioCadastro');

const spnaCadastrese = document.getElementById('spnaCadastrese');

const spanEntrar = document.getElementById('spanEntrar');

const formularios = document.getElementsByClassName('formularios')[0];

spnaCadastrese.addEventListener('click', () => {
    revelaFormCadastro()
})

spanEntrar.addEventListener('click', async () => {
    revelaFormLogin()
})

function revelaFormCadastro () {
    formularioLogin.style.opacity = 0;
    formularios.style.animation = "girando 1s linear";

    formularioLogin.style.display = 'none';
    formularioCadastro.style.display = "flex"
    formularioCadastro.style.opacity = 1;
}

function revelaFormLogin () {
    formularioCadastro.style.opacity = 0;
    formularios.style.animation = "girandoDeVolta 1s linear";
   
    formularioCadastro.style.display = 'none';
    formularioLogin.style.display = "flex";
    formularioLogin.style.opacity = 1;
}
