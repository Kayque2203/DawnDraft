const express = require('express');
const sql = require('mssql');

const app = express();
const port = 3000;

// Configuração da conexão com o SQL Server
const dbConfig = {
    server: 'ITLNB064\SQLEXPRESS',          // Nome ou IP do servidor SQL Server
    database: 'DB_DawnDraft',        // Nome do banco de dados
    options: {
        encrypt: false,           // Ajuste conforme necessário (true para Azure, false para local)
        trustServerCertificate: true // Necessário se estiver usando certificados autoassinados
    },
    trustedConnection: true       // Habilita a autenticação do Windows
};

// Middleware para interpretar JSON
app.use(express.json());

// Endpoint para obter dados
app.get('/usuarios', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM Usuarios');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Endpoint para inserir dados
app.post('/usuarios', async (req, res) => {
    const { nome, cpf, email, celular, cartao, cvv, vencimento } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('nome', sql.NVarChar, nome)
            .input('cpf', sql.NVarChar, cpf)
            .input('email', sql.NVarChar, email)
            .input('celular', sql.NVarChar, celular)
            .input('cartao', sql.NVarChar, cartao)
            .input('cvv', sql.NVarChar, cvv)
            .input('vencimento', sql.NVarChar, vencimento)
            .query('INSERT INTO Usuarios (nome, cpf, email, celular, cartao, cvv, vencimento) VALUES (@nome, @cpf, @email, @celular, @cartao, @cvv, @vencimento)');
        res.send('Usuário adicionado com sucesso');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
