<?php
// salvar_cadastro.php

// Configurações do banco de dados
$serverName = "localhost";
$connectionOptions = array(
    "Database" => "MeuBancoDeDados",
    "Uid" => "sa",
    "PWD" => "sua_senha"
);

// Estabelece a conexão
$conn = sqlsrv_connect($serverName, $connectionOptions);

// Verifica a conexão
if ($conn === false) {
    die(print_r(sqlsrv_errors(), true));
}

// Coleta dados do formulário
$nome = $_POST['nome'];
$cpf = $_POST['cpf'];
$email = $_POST['email'];
$celular = $_POST['celular'];

// Prepara a consulta SQL
$sql = "INSERT INTO Usuarios (nome, cpf, email, celular) VALUES (?, ?, ?, ?)";
$params = array($nome, $cpf, $email, $celular);

// Executa a consulta
$stmt = sqlsrv_query($conn, $sql, $params);

if ($stmt === false) {
    die(print_r(sqlsrv_errors(), true));
} else {
    echo "Cadastro realizado com sucesso!";
}

// Fecha a conexão
sqlsrv_close($conn);
?>
