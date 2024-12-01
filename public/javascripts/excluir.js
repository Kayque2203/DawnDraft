const divExcluirPersonagem = document.getElementsByClassName('divExcluirPersonagem')[0];
const btnCancelar = document.getElementById('btnCancelar');
const spanDeletarHis = document.getElementsByClassName('spanDeletarHis')[0];
const sectionConteudo = document.getElementById('sectionConteudo');

const sectionConteudo2 = document.getElementById('sectionConteudo2');

const body = document.getElementsByTagName('body')[0]

spanDeletarHis.addEventListener('click', () => {
    divExcluirPersonagem.style.display = "flex";
    window.scroll(0,0);
    sectionConteudo.style.opacity = "0";
    body.style.backgroundColor = "grey";
    sectionConteudo2.style.opacity = "0";
})

btnCancelar.addEventListener('click', () => {
    divExcluirPersonagem.style.display = "none";
    sectionConteudo.style.opacity = "1";
    body.style.backgroundColor = "#fcfbee";
    sectionConteudo2.style.opacity = "1 ";
})
