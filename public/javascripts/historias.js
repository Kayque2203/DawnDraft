const textArea = document.getElementsByTagName('textarea')[0];

// window.addEventListener("input", () => {
//     alert('Teste')
// })

textArea.addEventListener('input', () => {
    textArea.style.height = "auto";
    textArea.style.height = (textArea.scrollHeight) + "px";
});
