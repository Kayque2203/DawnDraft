<?php

include "../config/conexaoBD.php"; // Importando a classe de conexão com o banco de dados 

class ADicionaHistoria {
    private $usuario;

    private $novaConexaoBd; // Propiedade que tera o comando de conexao com o bd
    public $inserindoDados; // Vai nos retornar algumas infos dos usuarios cadastrados, pode ser que seja ultil mais para frente se não for podemos retirala ou deixa-la private

    private $personagem1;
    private $personagem2;
    private $personagem3;

    private $historia1;
    private $historia2;
    private $historia3;

    private $cenario1;
    private $cenario2;
    private $cenario3;

    private $Dialogo1;
    private $Dialogo2;
    private $Dialogo3;

    function __construct($Personagem1, $Personagem2, $Personagem3, $Historia1, $Historia2, $Historia3, $CenarioHistoria1, $CenarioHistoria2, $CenarioHistoria3, $dialogo1, $dialogo2 ,$dialogo3){

       $this -> setpersonagem1($Personagem1);
       $this -> setpersonagem2($Personagem2);
       $this -> setpersonagem3($Personagem3);

       $this -> sethistoria1($Historia1);
       $this -> sethistoria2($Historia2);
       $this -> sethistoria3($Historia3);

       $this -> setcenarioHistoria1($CenarioHistoria1); 
       $this -> setcenarioHistoria2($CenarioHistoria2); 
       $this -> setcenarioHistoria3($CenarioHistoria3); 

       $this -> setDialogo1($dialogo1);
       $this -> setDialogo2($dialogo2);
       $this -> setDialogo3($dialogo3);

       $this -> novaConexaoBd = new conexaoBD('Historias');

    }


    public function setUsuario($setandoUsuario){

        $this -> usuario = $setandoUsuario;

    }

    // Setter para o atributo Personagem1
    public function setpersonagem1($setandoPersonagem1){

        $this -> personagem1 = $setandoPersonagem1;

    }

    // 
    public function setpersonagem2($setandoPersonagem2){

        $this -> personagem2 = $setandoPersonagem2;

    }

    //
    public function setpersonagem3($setandoPersonagem3){

        $this -> personagem3 = $setandoPersonagem3;

    }

    //
    public function sethistoria1($setandoHistoria1){

        $this -> historia1 = $setandoHistoria1;

    }

    //
    public function sethistoria2($setandoHistoria2){

        $this -> historia2 = $setandoHistoria2;

    }

    //
    public function sethistoria3($setandoHistoria3){

        $this -> historia3 = $setandoHistoria3;

    }


    // 
    public function setCenarioHistoria1($setandoCenarioHistoria1){

        $this ->  cenario1 = $setandoCenarioHistoria1;

    }

    public function setCenarioHistoria2($setandoCenarioHistoria2){

        $this -> cenario2 = $setandoCenarioHistoria2;

    }

    public function setCenarioHistoria3($setandoCenarioHistoria3){

        $this -> cenario3 = $setandoCenarioHistoria3;

    }
    
    // 

    public function setDialogo1($setandoDialogo1){

        $this -> Dialogo1 = $setandoDialogo1;

    }

    public function setDialogo2($setandoDialogo2){

        $this -> Dialogo2 = $setandoDialogo2;

    }

    public function setDialogo3 ($setandoDialogo3){

        $this -> Dialogo3 = $setandoDialogo3;

    }

    // Metodo adicionar

    public function adicionandoHistoria() {
        // Tratamento de exeções para adionar usuarios.
        try {
            // esse metodo adiciona novos usuarios ao banco de dados, pode parecer confuso com esse tanto de $this e ->, mas fazer oq é o php :(
            $this -> inserindoDados =  $this -> novaConexaoBd -> getCollections() -> insertOne([
                "Usuario" => "1",

                "Personagem1" => $this -> personagem1,
                "Personagem2" => $this -> personagem2,
                "Personagem3" => $this -> personagem3,

                "Historia1" => $this -> historia1,
                "Historia2" => $this -> historia2,
                "Historia3" => $this -> historia3,

                "Cenarios1" => $this -> cenario1,
                "Cenarios2" => $this -> cenario2,
                "Cenarios3" => $this -> cenario3,

                "Dialogos1" => $this -> Dialogo1,
                "Dialogos2" => $this -> Dialogo2,
                "Dialogos3" => $this -> Dialogo3,

            ]);
                
            } catch (Exception $e) {
            // Caso aconteça algum erro Ele emitira essa mensagem juntamente com o erro
            echo "Infelizmente um erro inesperado aconteceu :( .\n Erro: { $e }";

        }

    }
}

$teste = new ADicionaHistoria("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12");

$teste -> adicionandoHistoria();