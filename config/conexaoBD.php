<?php

    require_once __DIR__ . '../vendor/autoload.php';

    // Estabelecendo a conexão
    $client = new MongoDB\Client('mongodb://localhost:27017/');

    // nao sei, mas esta ai para fazer o teste
    $database = $client -> test;

    // Selecionando a coleção
    $colecaoUsuarios = $client -> selectCollection('DawnDraft', 'Usuarios');

    // Testando a conexão
    try {

        $database->command(['ping' => 1]); // Manda um comando de ping para o servidor onde esta o bd

    } catch (\Throwable $th) {

        echo "Infelizmente Ocorreu um erro :( \n erro: $th";

    }

    $teste = "Deu Certo";

?>