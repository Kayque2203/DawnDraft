<?php

    require_once __DIR__ . '/../vendor/autoload.php'; // Importando o arquivo autoload do composer não sei bem ao certo oq ele faz

    // Nessa eu tive que pedir ajuda
    class ConexaoBD {
        private $client;
        private $colecoes;
    
        function __construct( $nomeColecao ,$url = 'mongodb://localhost:27017/', $databaseName = 'DawnDraft' ){
            $this -> client = new MongoDB\Client($url);
            $this -> setColecoes($nomeColecao, $databaseName);
        }

        // Getters
        public function getCollections(){
            return $this -> colecoes;
        }

        public function getClient(){
            return $this -> client;
        }

        //Setters
        public function setColecoes($setColecao , $nomeBD){
            $this -> colecoes = $this -> client -> selectCollection($nomeBD, $setColecao);
        }
    }

?>