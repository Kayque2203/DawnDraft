<?php

    require_once __DIR__ . '/../vendor/autoload.php'; // Importando o arquivo autoload do composer não sei bem ao certo oq ele faz

    // Nessa eu tive que pedir ajuda
    class ConexaoBD {
        private $client;
        private $colecaoUsuarios;
        private $colecaoHistorias;
    
        function __construct( $url = 'mongodb://localhost:27017/', $databaseName = 'DawnDraft' ){
            $this -> client = new MongoDB\Client($url);
            $this -> colecaoUsuarios = $this -> client -> selectCollection($databaseName, 'Usuarios');
            $this -> colecaoHistorias = $this -> client -> selectCollection($databaseName, 'Historias');
        }

        // Getters

        public function getCollections(){

            return $this -> colecaoUsuarios;

        }

        public function getCollectionHistoria(){

            return $this -> $colecaoHistorias;

        }

        public function getClient(){

            return $this -> client;

        }
    }

?>