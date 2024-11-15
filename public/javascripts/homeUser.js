const notify = document.getElementById('containerNotify');
const spanNotify = document.getElementById('idNotificacao');
var teste = spanNotify.innerText
window.addEventListener('load', async () => {
   if(teste.length != 0){
        setInterval(() => {
            notify.style.animation = "esmaecerNotify 1s linear";
        }, 1500);

        setInterval(() => {
            notify.style.display = "none"
        }, 1900); 
   }
});
