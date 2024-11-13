const { ObjectId } = require('mongodb');
const conexao = require('../conexaoBD/conexaoBD');

const Conexao = new conexao();

class Personagens {
    // Propiedades
    #Nome;
    #Idade;
    #Personalidade;
    #Hobies;
    #MairoesSonhos;
    #MairoesTraumas;
    #ObjetivoNaHistoria;
    #InformacoesRelevantesAParte;
    #CorDaPele;
    #CaracteristicasOlhos;
    #CaracteristicasCabelo;
    #Altura;
    #Peso;
    #RoupasEAcessorios;
    #ResumoPersonagem;

    #ColecaoPersonagem;
    #Usuario;


    // Construtor da classe
    constructor(nomePersonagem = "", idadePersonagem ="", personalidadePersonagem = "", hobiesPersonagem = "", sonhosDoPersonagens = "", traumasDoPersonagem = "", objetivoDopersonagemNaHistoria = "", infosRelevantes = "", idUsuario, corPele = "", caracOlhos = "", caracCabelo = "" , alturaPers = "", pesoPers = "", acessoriosRoupas = "", resumoPers = ""){
        this.#Nome = nomePersonagem;
        this.#Idade = idadePersonagem;
        this.#Personalidade = personalidadePersonagem;
        this.#Hobies = hobiesPersonagem;
        this.#MairoesSonhos = sonhosDoPersonagens;
        this.#MairoesTraumas = traumasDoPersonagem;
        this.#ObjetivoNaHistoria = objetivoDopersonagemNaHistoria;
        this.#InformacoesRelevantesAParte = infosRelevantes;

        this.#CorDaPele = corPele;
        this.#CaracteristicasOlhos = caracOlhos;
        this.#CaracteristicasCabelo = caracCabelo;
        this.#Altura = alturaPers;
        this.#Peso = pesoPers;
        this.#RoupasEAcessorios = acessoriosRoupas;
        this.#ResumoPersonagem = resumoPers;

        this.#Usuario = new ObjectId(idUsuario);
        this.#ColecaoPersonagem = Conexao.getCollections('Personagens');
    }

    // Metodo da classe para adicionar novos personagens
    async adicionaPersonagem(){
         // Adiciona um novo personagem no banco de dados
        let novoPersonagem = await this.#ColecaoPersonagem.insertOne({
            "Nome" : this.#Nome,
            "Idade" : this.#Idade,
            "Personalidade" : this.#Personalidade,
            "Hobies" : this.#Hobies,
            "MairoesSonhos" : this.#MairoesSonhos,
            "MairoesTraumas" : this.#MairoesTraumas,
            "ObjetivoNaHistoria" : this.#ObjetivoNaHistoria,
            "InformacoesRelevantesAParte": this.#InformacoesRelevantesAParte,
            "CorDaPele" : this.#CorDaPele,
            "CaracteristicaDosOlhos" : this.#CaracteristicasOlhos,
            "CaracteristicasDoCabelo" : this.#CaracteristicasCabelo,
            "Altura" : this.#Altura,
            "Peso" : this.#Peso,
            "RoupasEAcessorios" : this.#RoupasEAcessorios,
            "ResumoPersonagem" : this.#ResumoPersonagem,
            "Usuario" : this.#Usuario
        });

        // Retorna o id do personagem recem adicionado
        return novoPersonagem.insertedId;
    }
    
    async atualizaPersonagem(idPersonagem){
        let personagemAtualizado = await this.#ColecaoPersonagem.updateOne(
            {
                _id : new ObjectId(idPersonagem)
            },
            {
                $set : {
                   "Nome" : this.#Nome,
                    "Idade" : this.#Idade,
                    "Personalidade" : this.#Personalidade,
                    "Hobies" : this.#Hobies,
                    "MairoesSonhos" : this.#MairoesSonhos,
                    "MairoesTraumas" : this.#MairoesTraumas,
                    "ObjetivoNaHistoria" : this.#ObjetivoNaHistoria,
                    "InformacoesRelevantesAParte": this.#InformacoesRelevantesAParte,
                    "CorDaPele" : this.#CorDaPele,
                    "CaracteristicaDosOlhos" : this.#CaracteristicasOlhos,
                    "CaracteristicasDoCabelo" : this.#CaracteristicasCabelo,
                    "Altura" : this.#Altura,
                    "Peso" : this.#Peso,
                    "RoupasEAcessorios" : this.#RoupasEAcessorios,
                    "ResumoPersonagem" : this.#ResumoPersonagem,
                    "Usuario" : this.#Usuario
                },
                $currentDate : {lastModified : true}
            }
        );

        return personagemAtualizado;
    }

    // Métodos Estaticos
    static async buscaPersonagens(idUsuario){
        let personagensBuscados = await Conexao.getCollections('Personagens').find({Usuario : new ObjectId(idUsuario)}).toArray()

        return personagensBuscados;
    }

    static async buscaPersonagem(idPersongem){
        let personagemEncontrado = await Conexao.getCollections('Personagens').findOne({_id : new ObjectId(idPersongem)});

        return personagemEncontrado;
    }

    static async deletarPersonagem(idPErsonagem){
        let personagemDeletado = await Conexao.getCollections('Personagens').deleteOne({ _id : new ObjectId(idPErsonagem)});

        return personagemDeletado;
    }

    static async deletarTodosPersonagensPeloIdUsuario(idUsuario){
        let personagensDeletados = await Conexao.getCollections('Personagens').deleteMany({Usuario : new ObjectId(idUsuario)});

        return personagensDeletados;
    }

    static async buscaHistoriasDoPersonagem(idPersonagem){
        // Buscando os capitulos das historias em que o personagem esta 
        let historiasDoPersonagem = await Conexao.getCollections('PersonagensCapitulo').find({
            "Personagem" : new ObjectId(idPersonagem)
        }).toArray()


        return historiasDoPersonagem;
    }
}

module.exports = Personagens;
