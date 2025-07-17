/*
 * SERVIDOR BACK-END (server.js)
 *
 * Versão corrigida com a importação correta dos módulos
 * e integração com o banco de dados SQLite.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3').verbose();

// Define o caminho para o arquivo do banco de dados
const DB_SOURCE = 'contacts.db';

// Conecta ao banco de dados SQLite
const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        throw err;
    }
    console.log('Conectado ao banco de dados SQLite com sucesso.');
});

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares de Segurança e Configuração ---
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "https://fonts.googleapis.com/", "https://cdnjs.cloudflare.com/"],
        fontSrc: ["'self'", "https://fonts.gstatic.com/", "https://cdnjs.cloudflare.com/"],
        imgSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
    },
}));

const whitelist = ['https://www.insidetec.com.br', 'http://127.0.0.1:5500', 'http://localhost', null];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Acesso não permitido por CORS'));
        }
    },
};
app.use(cors(corsOptions));

const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
});

app.use(express.json());

// --- Rotas da API ---
const contactFormValidationRules = [
    body('name').trim().escape().notEmpty().withMessage('O nome é obrigatório.'),
    body('email').isEmail().withMessage('Forneça um e-mail válido.').normalizeEmail(),
    body('message').trim().escape().notEmpty().withMessage('A mensagem é obrigatória.'),
    body('phone').optional({ checkFalsy: true }).trim().escape(),
    body('service').optional({ checkFalsy: true }).trim().escape(),
];

app.post('/send-email', formLimiter, contactFormValidationRules, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0].msg;
        return res.status(422).json({ success: false, message: firstError, errors: errors.array() });
    }

    const { name, email, phone, service, message } = req.body;

    const insertSql = `INSERT INTO contacts (name, email, phone, service, message) VALUES (?,?,?,?,?)`;
    const params = [name, email, phone, service, message];

    db.run(insertSql, params, function(err) {
        if (err) {
            console.error('Erro ao salvar no banco de dados:', err.message);
        } else {
            console.log(`Novo contato salvo com o ID: ${this.lastID}`);
        }
    });

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        replyTo: email,
        to: process.env.RECIPIENT_EMAIL,
        subject: `Nova mensagem do formulário InsideTec: ${service || 'Contato Geral'}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Nova mensagem recebida pelo site InsideTec!</h2>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email de Contato:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
                <p><strong>Serviço de Interesse:</strong> ${service || 'Não especificado'}</p>
                <hr>
                <h3>Mensagem:</h3>
                <p style="background-color: #f4f4f4; border-left: 4px solid #ccc; padding: 10px;">
                    ${message}
                </p>
            </div>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar e-mail:', error);
            return res.status(500).json({ success: false, message: 'Ocorreu um erro interno ao enviar a mensagem.' });
        }
        console.log('E-mail enviado: %s', info.messageId);
        return res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso!' });
    });
});

// --- Servir Arquivos Estáticos e Inicialização ---
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Servidor back-end rodando na porta ${PORT}`);
});
