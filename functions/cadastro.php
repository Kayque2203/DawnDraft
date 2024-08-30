<?php // Arquivo de cadastro de usuarios

// Falta testar, Estudar uma biblioteca de criptografia para criptografar as senhas antes de mandar para o banco de dados
// para testar é preciso mover a pasta do repositório para a pasta htdocs do xampp, mas tbm é presiso instalar a extenção do mongodb no xampp antes se não da erro *OBS é um role instalar essa extenção dps explico como faz

    require "../config/conexaoBD.php";

    class AdicionandoUsuarios{

        // PROPIEDADES DA CLASSE
        private $nome;
        private $email;
        private $telefone;
        private $senha;

        // constrututor
        function __construct($nomeUsuario, $sobrenomeUsuario){
            $this -> setNome($nomeUsuario);
            $this -> setSobrenome($sobrenomeUsuario);
        }

        // Setter para o atributo nome
        public function setNome($setandoNome){

            $this -> nome =  $setandoNome;

        }

        public function setEmail($setandoEmail){

            $this -> email = $setandoEmail;

        }

        public function setTelefone($setandoTelefone){

            $this -> telefone = $setandoTelefone;

        }

        public function setSenha($setandoSenha){

            $this -> senha = $setandoSenha;

        }

        // Metodos da classe
        public function adicionandoUsuario(){
        
            try {

                $inserindoDados = $colecaoUsuarios -> insertOne([
                    "Nome" => $this -> nome,
                    "Email" => $this -> Email,
                    "Telefone" => $this -> telefone,
                    "Senha" => $this -> senha
                ]);

            } catch (Exception $e) {
                echo "Infelizmente um erro inesperado aconteceu :( .\n Erro: { $e }";
            }

        }
    }
?>