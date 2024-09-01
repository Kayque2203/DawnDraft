<?php // Arquivo de cadastro de usuarios
    
    include "../config/conexaoBD.php"; // Importando a classe de conexão com o banco de dados 

    class AdicionandoUsuarios {

        // PROPIEDADES DA CLASSE
        private $nome;
        private $email;
        private $telefone;
        private $senha;
        private $novaConexaoBd; // Propiedade que tera o comando de conexao com o bd

        public $inserindoDados; // Vai nos retornar algumas infos dos usuarios cadastrados, pode ser que seja ultil mais para frente se não for podemos retirala ou deixa-la private

        // constrututor
        function __construct($nomeUsuario, $emailUsuario, $telefoneUsuario, $senhaUsuario){
            $this -> setNome($nomeUsuario);
            $this -> setEmail($emailUsuario);
            $this -> setTelefone($telefoneUsuario);
            $this -> setSenha($senhaUsuario);
            $this -> novaConexaoBd = new ConexaoBd('Usuarios');
        }

        // Setter para o atributo nome
        public function setNome($setandoNome){

            $this -> nome =  $setandoNome;

        }

        // Setter para o atributo email
        public function setEmail($setandoEmail){

            $this -> email = $setandoEmail;

        }

        // Setter para o atributo Telefone
        public function setTelefone($setandoTelefone){

            $this -> telefone = $setandoTelefone;

        }

        // Setter para o atributo Senha Falta adicionar a criptografia a senha
        public function setSenha($setandoSenha){

            $this -> senha = $setandoSenha;

        }

        // Metodos Para inserir os usuarios no banco de dados 
        public function adicionaUsuario() {
            // Tratamento de exeções para adionar usuarios.
            try {
                // esse metodo adiciona novos usuarios ao banco de dados, pode parecer confuso com esse tanto de $this e ->, mas fazer oq é o php :(
                $this -> inserindoDados =  $this -> novaConexaoBd -> getCollections() -> insertOne([
                    "Nome" => $this -> nome,
                    "Email" => $this -> email,
                    "Telefone" => $this -> telefone,
                    "Senha" => $this -> senha
                ]);

            } catch (Exception $e) {
                // Caso aconteça algum erro Ele emitira essa mensagem juntamente com o erro
                echo "Infelizmente um erro inesperado aconteceu :( .\n Erro: { $e }";

            }

        }
    }
?>
