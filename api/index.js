// ZMIANA 1: Używamy 'import' zamiast 'require'
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- ZMIANA TUTAJ: ---
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// PULA POŁĄCZEŃ
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

// --- SPRAWDZENIE: ---
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ BŁĄD POŁĄCZENIA Z BAZĄ DANYCH:", err.message);
        console.error("Sprawdź czy plik .env jest w GŁÓWNYM katalogu i czy IP jest dodane na SeoHost!");
    } else {
        console.log("✅ Połączono z bazą danych MySQL! (Pool działa)");
        connection.release(); // Bardzo ważne: oddajemy połączenie do puli!
    }
});

// 1. REJESTRACJA
app.post('/api/register', (req, res) => {
    const { email, password, first_name, last_name } = req.body;


    const checkSql = "SELECT * FROM users WHERE email = ?";

    db.query(checkSql, [email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length > 0) return res.status(409).json("Użytkownik już istnieje!");

        // Szyfrowanie hasła
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Generowanie awatara
        const image = `https://ui-avatars.com/api/?name=${first_name}+${last_name}&background=random`;
        
        const insertSql = "INSERT INTO users (`email`, `password`, `first_name`, `last_name`, `image`) VALUES (?)";
        const values = [email, hash, first_name, last_name, image];

        db.query(insertSql, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Użytkownik utworzony.");
        });
    });
});

// 2. LOGOWANIE
app.post('/api/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("Użytkownik nie znaleziony!");

        // Sprawdzenie czy hasło istnieje (dla starych kont)
        if (!data[0].password) return res.status(400).json("To konto nie ma hasła.");

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);

        if (!checkPassword) return res.status(400).json("Błędne hasło lub email!");

        // --- TWORZENIE TOKENA ---
        // Używamy zmiennej środowiskowej JWT_SECRET
        const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET, { expiresIn: '12h' });

        const { password, ...others } = data[0]; 
        
        // Zwracamy dane ORAZ token
        res.status(200).json({ ...others, token });
    });
});

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
// USUWANIE MARZENIA (Wersja Debuggowalna)
app.delete('/api/dreams/:id', (req, res) => {
    const dreamId = req.params.id;
    console.log(`[DELETE] Próba usunięcia marzenia ID: ${dreamId}`);

    // 1. Sprawdzenie tokena
    const token = req.headers.authorization;
    if (!token) {
        console.error("[DELETE] Brak tokena w nagłówku");
        return res.status(401).json("Brak uprawnień!");
    }

    // 2. Weryfikacja tokena
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) {
            console.error("[DELETE] Błąd weryfikacji tokena:", err.message);
            return res.status(403).json("Token jest nieważny!");
        }

        console.log(`[DELETE] Użytkownik z tokena: ID ${decodedUser.id}`);

        // 3. Sprawdzenie właściciela (czy marzenie istnieje i czyje jest)
        const checkOwnerSql = "SELECT * FROM dreams WHERE id = ?";
        
        db.query(checkOwnerSql, [dreamId], (err, data) => {
            if (err) {
                console.error("[DELETE] Błąd SQL (szukanie marzenia):", err);
                return res.status(500).json("Błąd bazy danych przy sprawdzaniu właściciela");
            }
            
            if (data.length === 0) {
                console.warn(`[DELETE] Nie znaleziono marzenia o ID ${dreamId}`);
                return res.status(404).json("Marzenie nie istnieje");
            }

            const dreamOwnerId = data[0].idUser; // Uwaga na wielkość liter w nazwie kolumny!
            console.log(`[DELETE] Właściciel marzenia z bazy: ${dreamOwnerId}`);

            // 4. Porównanie (używamy != żeby ominąć problem string vs number)
            if (dreamOwnerId != decodedUser.id) {
                console.warn(`[DELETE] Próba usunięcia cudzego marzenia! (User: ${decodedUser.id}, Owner: ${dreamOwnerId})`);
                return res.status(403).json("To nie Twoje marzenie! Nie możesz go usunąć.");
            }

            // 5. Usuwanie właściwe
            const deleteSql = "DELETE FROM dreams WHERE id = ?";
            db.query(deleteSql, [dreamId], (err, result) => {
                if (err) {
                    console.error("[DELETE] Błąd SQL (usuwanie):", err);
                    return res.status(500).json("Błąd bazy danych przy usuwaniu");
                }
                
                console.log(`[DELETE] Sukces! Usunięto marzenie ID ${dreamId}`);
                return res.json("Marzenie usunięte.");
            });
        });
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

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`✅ Backend działa lokalnie na porcie ${PORT}`);
    });
}

// ZMIANA 2: Używamy 'export default' zamiast 'module.exports'
export default app;