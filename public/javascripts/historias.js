const textArea = document.getElementsByTagName('textarea')[0];

window.addEventListener("load", () => {
    textArea.style.height = "auto";
    textArea.style.height = (textArea.scrollHeight) + "px";
})

textArea.addEventListener('input', () => {
    textArea.style.height = "auto";
    textArea.style.height = (textArea.scrollHeight) + "px";
});
