const express = require('express');
const mysql = require('mysql2'); // Używamy mysql2, bo jest nowszy i lepszy
const cors = require('cors');
require('dotenv').config(); // <--- TO ŁADUJE ZMIENNE Z PLIKU .ENV

const app = express();
app.use(cors());
app.use(express.json());

// Do testów, później będzie tutaj zmienna z systemu logowania
const activUser = 2;

// KONFIGURACJA POŁĄCZENIA
// Teraz pobieramy dane z process.env
// Pula sama zarządza utrzymaniem połączenia przy życiu (Keep-Alive)
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

// WAŻNE DLA VERCEL: Exportujemy aplikację, zamiast tylko nasłuchiwać
// Lokalnie nadal używamy app.listen
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}...`);
});

// To przyda się później dla Vercel
module.exports = app;