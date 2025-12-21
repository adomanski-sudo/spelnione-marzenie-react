const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Vercel automatycznie obsługuje HTTPS, więc CORS jest mniej restrykcyjny, 
// ale dla bezpieczeństwa zostawiamy (można ustawić origin na swoją domenę)
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// ENDPOINTY (bez zmian)
app.get('/dreams', (req, res) => {
    const sql = `
        SELECT dreams.*, users.first_name, users.last_name, users.image as userImage 
        FROM dreams 
        JOIN users ON dreams.idUser = users.id
        ORDER BY dreams.date desc
    `;
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
});

app.get('/user', (req, res) => {
    const sql = `
        select * from users where users.id = ${activUser}`;
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
});

// ENDPOINT WYSZUKIWANIA
app.get('/search', (req, res) => {
    const { q, type } = req.query; 

    // 1. Zmieniamy logikę: Jeśli 'q' jest puste, szukamy wszystkiego ('%')
    const searchTerm = q ? `%${q}%` : '%'; 

    let sql = '';
    let params = [searchTerm, searchTerm];

    if (type === 'users') {
        // Szukamy użytkowników (Imię LUB Nazwisko)
        // Jeśli searchTerm to '%', zwróci wszystkich
        sql = `SELECT * FROM users WHERE first_name LIKE ? OR last_name LIKE ?`;
    } else {
        // Szukamy marzeń
        sql = `
            SELECT dreams.*, users.first_name, users.last_name, users.image as userImage 
            FROM dreams 
            JOIN users ON dreams.idUser = users.id
            WHERE dreams.title LIKE ? OR dreams.description LIKE ?
            ORDER BY dreams.date DESC
            `;
    }

    db.query(sql, params, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// ENDPOINT: Pobierz listę potencjalnych znajomych (wszyscy poza mną)
app.get('/friends', (req, res) => {
    // activUser to ta zmienna = 2, którą masz zdefiniowaną na górze pliku
    const sql = `SELECT * FROM users WHERE id != ?`; 
    
    db.query(sql, [activUser], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// TESTOWY ENDPOINT (żeby sprawdzić czy działa)
app.get('/api/health', (req, res) => {
    res.json({ status: "Backend działa na Vercel!", time: new Date() });
});

// WAŻNE: Na końcu NIE MA app.listen. Zamiast tego jest eksport:
module.exports = app;