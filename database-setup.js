// database-setup.js
const sqlite3 = require('sqlite3').verbose();

// O nome do arquivo do nosso banco de dados
const DB_SOURCE = 'contacts.db';

// Conecta ao banco de dados (ou cria se não existir)
const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
        // Não foi possível conectar ao banco de dados
        console.error(err.message);
        throw err;
    } else {
        console.log('Conectado ao banco de dados SQLite.');

        // SQL para criar a tabela de contatos
        const createTableSql = `
            CREATE TABLE contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                service TEXT,
                message TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Executa o comando para criar a tabela
        db.run(createTableSql, (err) => {
            if (err) {
                // Tabela já foi criada
                console.log('A tabela "contacts" já existe.');
            } else {
                console.log('Tabela "contacts" criada com sucesso.');
            }
        });
    }
});

// Fecha a conexão com o banco de dados
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conexão com o banco de dados fechada.');
});