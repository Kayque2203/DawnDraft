document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio do formulário
        alert('Salve paeee'); // Exibe a mensagem
        // Se quiser permitir o envio após mostrar a mensagem, você pode adicionar o código para isso aqui.
        // Exemplo: this.submit(); 
    });
});
