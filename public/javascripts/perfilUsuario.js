const inputFile = document.getElementById('imagemPerfil');

const labelFotoPerfil = document.getElementById('labelFotoPerfil');

const btnSalvarFotoPerfil = document.getElementById('btnSalvarFotoPerfil');

const imagemPerfil = document.getElementById('fotoPerfil')

var arquivo = inputFile.files;

inputFile.addEventListener('input', () => {
    console.log(inputFile.value)
    labelFotoPerfil.innerText = "Escolher Outra";
    btnSalvarFotoPerfil.style.display = "block";
    imagemPerfil.innerHTML = "";
    imagemPerfil.innerHTML = `<img class="fotoPerfil" src="${inputFile.value}" alt="FotoPerfil" id="fotoPerfil">`;
});
