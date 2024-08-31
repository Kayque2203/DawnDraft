<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadatrado com sucesso</title>
</head>
<body>

    <?php
        require "../functions/cadastro.php";

        $nome = $_POST['nome'] ?? "Não Pode ser nulo";
        $email = $_POST['email'] ?? "Não Pode ser nulo";
        $telefone = $_POST['celular'] ?? "Não Pode ser nulo";
        $senha = $_POST['senha'] ?? "Não Pode ser nulo";

        // $novoUsuario = new AdicionandoUsuarios($nome, $email, $telefone, $senha);

        $novoUsuario = new AdicionandoUsuarios("Teste", "teste@teste.com", "11 3333333", "123");

        $novoUsuario -> adicionaUsuario();


    ?>
    
</body>
</html>