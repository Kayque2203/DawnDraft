<?php
// Verifica se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recebe o email do formulário
    $email = $_POST['email'];
    
    // Verifica se o campo email não está vazio
    if (!empty($email)) {
        // Conexão com banco de dados (caso esteja usando MySQL)
        $servername = "localhost";
        $username = "usuario";
        $password = "senha";
        $dbname = "meu_banco";

        // Criando a conexão
        $conn = new mysqli($servername, $username, $password, $dbname);

        // Verifica a conexão
        if ($conn->connect_error) {
            die("Conexão falhou: " . $conn->connect_error);
        }

        // Preparando e executando o SQL para salvar o email
        $sql = "INSERT INTO emails (email) VALUES ('$email')";

        if ($conn->query($sql) === TRUE) {
            echo "Email salvo com sucesso!";
        } else {
            echo "Erro ao salvar o email: " . $conn->error;
        }

        // Fechando a conexão
        $conn->close();

        // Alternativa: Salvar o email em um arquivo texto
        // file_put_contents('emails.txt', $email . PHP_EOL, FILE_APPEND);
    } else {
        echo "Por favor, insira um email.";
    }
}
?>
