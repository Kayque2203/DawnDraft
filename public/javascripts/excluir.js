const divExcluirPersonagem = document.getElementsByClassName('divExcluirPersonagem')[0];
const btnCancelar = document.getElementById('btnCancelar');
const spanDeletarHis = document.getElementsByClassName('spanDeletarHis')[0]

const body = document.getElementsByTagName('body')[0]

spanDeletarHis.addEventListener('click', () => {
    divExcluirPersonagem.style.display = "flex";
    window.scroll(0,0)
})

btnCancelar.addEventListener('click', () => {
    divExcluirPersonagem.style.display = "none"
})