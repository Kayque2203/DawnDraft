const notify = document.getElementById('containerNotifyErro');
const spanNotify = document.getElementById('idNotificacaoErro');
var teste = spanNotify.innerText; // Mudar o nome dessa variavel dps

window.addEventListener('load', async () => {
   if(teste.length != 0){
        setInterval(() => {
            notify.style.animation = "esmaecerNotify 1s linear";
        }, 2000);

        setInterval(() => {
            notify.style.display = "none"
        }, 2400); 
   }
});
