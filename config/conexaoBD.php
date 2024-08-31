<?php

    require_once __DIR__ . '/../vendor/autoload.php';

    class ConexaoBD {
        private $client;
        public $database;
        private $colecaoUsuarios;
    
        function __construct($url = 'mongodb://localhost:27017/', $databaseName = 'DawnDraft', $tt = "eee"  ){
            $this -> client = new MongoDB\Client($url);
            $this -> colecaoUsuarios = $this-> client -> selectCollection($databaseName, 'Usuarios');
            $this -> database = $tt;
        }

        // Getters

        public function getCollections($colecao){

            return $this -> $colecaoUsuarios;

        }

        public function getClient(){

            return $this -> client;

        }
    }

?>