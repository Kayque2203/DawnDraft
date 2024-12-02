const inputFile = document.getElementById('imagemPerfil');

const labelFotoPerfil = document.getElementById('labelFotoPerfil');

const btnSalvarFotoPerfil = document.getElementById('btnSalvarFotoPerfil');

const imagemPerfil = document.getElementById('fotoPerfil');

const linkRemoverFoto = document.getElementById('linkRemoverFoto');

var arquivo = inputFile.files;

inputFile.addEventListener('input', () => {
    labelFotoPerfil.innerText = "Escolher Outra";
    btnSalvarFotoPerfil.style.display = "block";
    linkRemoverFoto.style.display = "none"

    const reader = new FileReader();

    reader.onload = (e) => {
        const fotoPerfil = document.getElementsByClassName('fotoPerfil')[0];
        fotoPerfil.src= e.target.result;
    }

    reader.readAsDataURL(event.target.files[0]);
});
