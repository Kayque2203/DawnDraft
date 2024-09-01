<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadatrado com sucesso</title>
</head>
<body>

    <?php

        require "../functions/cadastro.php"; // Importando a classe para cadastrar novos usuarios no banco de dados.

        // Pegando as informações dos inputs do formulario.
        $nome = $_POST['nome'] ?? "Não Pode ser nulo";
        $email = $_POST['email'] ?? "Não Pode ser nulo";
        $telefone = $_POST['celular'] ?? "Não Pode ser nulo";
        $senha = $_POST['senha'] ?? "Não Pode ser nulo";

        // Instanciando a calse para adicionar novos usuarios 
        $novoUsuario = new AdicionandoUsuarios($nome, $email, $telefone, $senha);

        // Chamando o metodo da classe que adiciona novos usuarios
        $novoUsuario -> adicionaUsuario();

        // 
        echo("<h1> Cadastro realizado com sucesso!!! </h1> \n <h2> AGORA CLIQUE NO LINK PARA FAZER LOGIN E APROVEITAR O SITE!!! </h2> \n <a href='./cadastro_e_login.html'>Logar</a>");
    ?>
    
</body>
</html>