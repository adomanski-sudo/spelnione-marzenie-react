// ZMIANA 1: Używamy 'import' zamiast 'require'
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

// Konfiguracja zmiennych środowiskowych
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// PULA POŁĄCZEŃ (Tutaj bez zmian w logice, tylko składnia)
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

// --- TWOJE ENDPOINTY (Logika zostaje ta sama) ---

// Marzenia
app.get('/api/dreams', (req, res) => {
    const sql = `
        SELECT dreams.*, users.first_name, users.last_name, users.image as userImage 
        FROM dreams 
        JOIN users ON dreams.idUser = users.id
        ORDER BY dreams.date DESC
    `;
    db.query(sql, (err, data) => {
        if(err) return res.status(500).json(err);
        return res.json(data);
    })
});

// Szukanie
app.get('/api/search', (req, res) => {
    const { q, type } = req.query; 
    const searchTerm = q ? `%${q}%` : '%'; 

    let sql = '';
    let params = [searchTerm, searchTerm];

    if (type === 'users') {
        sql = `SELECT * FROM users WHERE first_name LIKE ? OR last_name LIKE ?`;
    } else {
        sql = `
            SELECT dreams.*, users.first_name, users.last_name, users.image as userImage 
            FROM dreams 
            JOIN users ON dreams.idUser = users.id
            WHERE dreams.title LIKE ? OR dreams.description LIKE ?
            ORDER BY dreams.date DESC;
        `;
    }

    db.query(sql, params, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Użytkownik (Twój profil - ID 2)
app.get('/api/user', (req, res) => {
    // Zakładamy na sztywno ID 2, tak jak miałeś w zmiennej activUser
    const sql = `SELECT * FROM users WHERE id = 2`;
    db.query(sql, (err, data) => {
        if(err) return res.status(500).json(err);
        return res.json(data);
    })
});

// Znajomi (wszyscy poza ID 2)
app.get('/api/friends', (req, res) => {
    const sql = `SELECT * FROM users WHERE id != 2`;
    db.query(sql, (err, data) => {
        if(err) return res.status(500).json(err);
        return res.json(data);
    });
});

app.get('/api/feed', (req, res) => {
    const sql = `
        SELECT 
            d.id, 
            d.title, 
            d.is_fulfilled, 
            d.date, 
            u.first_name, 
            u.last_name, 
            u.image as userImage
        FROM dreams d
        JOIN users u ON d.idUser = u.id
        ORDER BY d.date DESC 
        LIMIT 5
    `;
    
    db.query(sql, (err, data) => {
        if(err) return res.status(500).json(err);
        return res.json(data);
    });
});

// USUWANIE MARZENIA
app.delete('/api/dreams/:id', (req, res) => {
    const id = req.params.id;
    // W prawdziwej aplikacji sprawdzilibyśmy tu, czy ID usera się zgadza (auth)
    // Na potrzeby demo usuwamy "jak leci"
    // const sql = "DELETE FROM dreams WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if(err) return res.status(500).json(err);
        return res.json({ message: "Usunięto", result });
    });
});

// PROFIL INNEGO UŻYTKOWNIKA (Info + Marzenia)
app.get('/api/users/:id/full', (req, res) => {
    const userId = req.params.id;
    
    // Zapytanie 1: Pobierz dane usera
    const sqlUser = "SELECT first_name, last_name, description, image FROM users WHERE id = ?";
    
    // Zapytanie 2: Pobierz jego marzenia
    const sqlDreams = "SELECT * FROM dreams WHERE idUser = ? ORDER BY date DESC";

    db.query(sqlUser, [userId], (err, userData) => {
        if (err) return res.status(500).json(err);
        if (userData.length === 0) return res.status(404).json("User not found");

        db.query(sqlDreams, [userId], (err, dreamsData) => {
            if (err) return res.status(500).json(err);
            
            // Zwracamy obiekt łączony
            res.json({
                user: userData[0],
                dreams: dreamsData
            });
        });
    });
});


// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: "Backend działa na Vercel (ES Modules)!", time: new Date() });
});

// ZMIANA 2: Używamy 'export default' zamiast 'module.exports'
export default app;