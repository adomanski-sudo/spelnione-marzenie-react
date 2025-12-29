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

// --- REJESTRACJA ---
app.post('/api/register', (req, res) => {
    // Pobieramy dane z formularza
    const { email, password, first_name, last_name } = req.body;

    // 1. Sprawdź, czy taki email już istnieje
    const checkSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkSql, [email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length > 0) return res.status(409).json("Użytkownik już istnieje!");

        // 2. Jeśli nie istnieje -> Zaszyfruj hasło
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // 3. Dodaj użytkownika do bazy
        // Domyślnie dajemy losowy awatar z UI Avatars, żeby nie było pusto
        const image = `https://ui-avatars.com/api/?name=${first_name}+${last_name}&background=random`;
        
        const insertSql = "INSERT INTO users (`email`, `password`, `first_name`, `last_name`, `image`) VALUES (?)";
        const values = [email, hash, first_name, last_name, image];

        db.query(insertSql, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Użytkownik utworzony.");
        });
    });
});

// --- LOGOWANIE ---
app.post('/api/login', (req, res) => {
    // 1. Sprawdź czy user istnieje
    const sql = "SELECT * FROM users WHERE email = ?";
    
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("Użytkownik nie znaleziony!");

        // 2. Sprawdź czy hasło pasuje do tego zaszyfrowanego w bazie
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);

        if (!checkPassword) return res.status(400).json("Błędne hasło lub email!");

        // 3. Jeśli wszystko OK -> Zwróć dane użytkownika (bez hasła!)
        const { password, ...others } = data[0]; 
        res.status(200).json(others);
    });
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


// WAŻNE DLA VERCEL: Exportujemy aplikację, zamiast tylko nasłuchiwać
// Lokalnie nadal używamy app.listen
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}...`);
});

// To przyda się później dla Vercel
module.exports = app;