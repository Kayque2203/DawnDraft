const textAreaResumo = document.getElementsByTagName('textarea')[0];
const textAreaHistoria = document.getElementsByTagName('textarea')[1];
const textAreaRegras = document.getElementsByTagName('textarea')[2];


window.addEventListener("load", () => {
    textAreaResumo.style.height = "auto";
    textAreaResumo.style.height = (textAreaResumo.scrollHeight) + "px";

    textAreaHistoria.style.height = "auto";
    textAreaHistoria.style.height = (textAreaHistoria.scrollHeight) + "px";

    textAreaRegras.style.height = "auto";
    textAreaRegras.style.height = (textAreaRegras.scrollHeight) + "px";

})

textAreaResumo.addEventListener('input', () => {
    textAreaResumo.style.height = "auto";
    textAreaResumo.style.height = (textAreaResumo.scrollHeight) + "px";
});

textAreaHistoria.addEventListener('input', () => {
    textAreaHistoria.style.height = "auto";
    textAreaHistoria.style.height = (textAreaHistoria.scrollHeight) + "px";
})

textAreaRegras.addEventListener('input', () => {
    textAreaRegras.style.height = "auto";
    textAreaRegras.style.height = (textAreaRegras.scrollHeight) + "px";
})
