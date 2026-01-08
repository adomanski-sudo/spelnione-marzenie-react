// ZMIANA 1: Używamy 'import' zamiast 'require'
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import cookieParser from "cookie-parser"; // <- czytanie ciastków.

// --- ZMIANA TUTAJ: ---
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// --- KONFIGURACJA MIDDLEWARE (Kolejność jest święta!) ---
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json()); // Żeby czytał JSONy z formularza
app.use(cookieParser()); // <--- Żeby czytał ciasteczka (accessToken)
app.use(cors({
  origin: "http://localhost:5173", // frontend
  credentials: true, // Pozwól na ciasteczka
}));

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

// KONFIGURACJA E-MAIL
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // true dla portu 465, false dla innych
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Weryfikacja czy poczta działa (odpali się przy starcie serwera)
transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ Błąd konfiguracji SMTP:", error);
  } else {
    console.log("✅ Gotowy do wysyłania e-maili z no-reply@spelnionemarzenie.pl");
  }
});

// --- TESTOWY ENDPOINT DO WYSYŁKI MAILA ---
app.post('/api/send-test-email', (req, res) => {
  const { email } = req.body; // Pobieramy adres docelowy z żądania

  if (!email) {
      return res.status(400).json("Podaj adres email!");
  }

  const mailOptions = {
    from: `"Spełnione Marzenie" <${process.env.SMTP_USER}>`, // Ładna nazwa nadawcy
    to: email, // Adres, na który wysyłamy (Twój prywatny)
    subject: '🚀 Test systemów: Spełnione Marzenie',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h1 style="color: #2563eb;">Witaj w świecie żywych!</h1>
        <p>Jeśli to czytasz, to znaczy, że konfiguracja SMTP działa poprawnie.</p>
        <p>Twoja aplikacja właśnie wysłała tego maila samodzielnie.</p>
        <hr>
        <p style="font-size: 12px; color: #666;">Wiadomość wygenerowana automatycznie z localhost.</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Błąd wysyłki:", error);
      return res.status(500).json(error);
    }
    console.log("✅ Email wysłany: " + info.response);
    res.status(200).json("Wiadomość wysłana pomyślnie!");
  });
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
        res
        .cookie("accessToken", token, {
            httpOnly: true, // Bezpieczeństwo: JS nie ma dostępu do ciastka
            secure: false,  // Na localhost: false. Na produkcji (https): true
            sameSite: "lax",
        })
        .status(200)
        .json(others); // Zwracamy dane użytkownika (bez hasła)
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

// 2. POBIERANIE DANYCH ZALOGOWANEGO UŻYTKOWNIKA (Mój Profil)
app.get('/api/user', (req, res) => {
    const token = req.headers.authorization;

    // Jeśli brak tokena (użytkownik niezalogowany), nie zwracamy błędu 500,
    // tylko pustą odpowiedź lub null. Frontend sobie z tym poradzi (pokaże przycisk "Zaloguj").
    if (!token) {
        return res.json(null); 
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) return res.status(403).json("Token nieważny");

        const userId = decodedUser.id; // To jest to magiczne ID z tokena!

        const sql = "SELECT * FROM users WHERE id = ?";
        db.query(sql, [userId], (err, data) => {
            if (err) return res.status(500).json(err);
            // Nie chcemy odsyłać hasła, nawet zaszyfrowanego, dla bezpieczeństwa
            // (opcjonalnie można usunąć data[0].password)
            return res.json(data);
        });
    });
});

// POBIERANIE ZNAJOMYCH (Logika hybrydowa)
app.get('/api/friends', (req, res) => {
    const token = req.headers.authorization;

    // --- SCENARIUSZ 1: Użytkownik NIEZALOGOWANY ---
    // Pokazujemy wszystkich użytkowników (jako "społeczność" do odkrycia)
    if (!token) {
        // Wybieramy konkretne kolumny, żeby nie wysyłać hasła!
        const sqlAll = "SELECT id, first_name, last_name, image, description FROM users";
        
        db.query(sqlAll, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.json(data);
        });
        return; // Kończymy funkcję, żeby nie szła dalej
    }

    // --- SCENARIUSZ 2: Użytkownik ZALOGOWANY ---
    // Pokazujemy tylko tych, którzy są w tabeli friendships ze statusem 'accepted'
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) return res.status(403).json("Token nieważny");

        const userId = decodedUser.id;

        const sqlFriends = `
            SELECT u.id, u.first_name, u.last_name, u.image, u.description
            FROM friendships f
            JOIN users u ON (
                (f.user_id1 = ? AND f.user_id2 = u.id) 
                OR 
                (f.user_id2 = ? AND f.user_id1 = u.id)
            )
            WHERE f.status = 'accepted'
        `;

        db.query(sqlFriends, [userId, userId], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.json(data);
        });
    });
});

app.get('/api/feed', (req, res) => {
    // Używamy grawisów (`), żeby baza nie myliła nazwy kolumny 'date' z typem danych DATE
    const sql = `
        SELECT 
            d.id,
            d.title,
            d.is_fulfilled,
            d.date, 
            d.type,
            u.first_name,
            u.last_name,
            u.image as userImage
        FROM dreams d
        JOIN users u ON d.idUser = u.id  
        ORDER BY d.date DESC
        LIMIT 5
    `;

    // DEBUGOWANIE: Wypisz błąd w terminalu VS Code, jeśli zapytanie padnie
    db.query(sql, (err, data) => {
        if (err) {
            console.log("---------------------------------");
            console.error("❌ BŁĄD SQL W /api/feed:");
            console.error(err); // To pokaże konkretny powód błędu
            console.log("---------------------------------");
            return res.status(500).json(err);
        }
        return res.json(data);
    });
});

// USUWANIE MARZENIA :(
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

// --- DODAWANIE MARZENIA (Wersja Czysta 2.0) ---
app.post("/api/dreams", (req, res) => {
  // 1. Sprawdzamy, czy w ogóle mamy ciasteczka
    console.log("🍪 Ciasteczka odebrane przez serwer:", req.cookies);

  if (!req.cookies) return res.status(401).json("Błąd serwera: Brak obsługi cookies.");
  
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Nie jesteś zalogowany!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token jest nieważny!");

    // 2. Przygotowanie danych (obsługa ceny)
    // Frontend wyśle nam gotowe liczby lub null, ale dla pewności:
    const minPrice = req.body.price_min || null;
    const maxPrice = req.body.price_max || null;

    // 3. Zapytanie SQL
    const q = "INSERT INTO dreams (`title`, `description`, `price_min`, `price_max`, `date`, `idUser`, `image`, `type`, `is_public`, `is_fulfilled`) VALUES (?)";

    const values = [
      req.body.title,         // title
      req.body.description,   // description
      minPrice,               // price_min
      maxPrice,               // price_max
      new Date(),             // date (timestamp)
      userInfo.id,            // idUser (z tokena)
      req.body.image,         // image
      req.body.type,          // type (gift/time/smile)
      req.body.is_public,     // is_public (1 lub 0)
      0                       // is_fulfilled (Domyślnie 0 - niespełnione)
    ];

    // 4. Wykonanie zapytania
    db.query(q, [values], (err, data) => {
      if (err) {
        console.error("❌ CRITICAL SQL ERROR:", err); // Zobaczysz to w terminalu
        return res.status(500).json(err);
      }
      console.log("✅ SUKCES! Marzenie dodane ID:", data.insertId);
      return res.status(200).json("Marzenie dodane pomyślnie.");
    });
  });
});



// AKTUALIZACJA ISTNIEJĄCEGO MARZENIA
app.put('/api/dreams/:id', (req, res) => {
    const token = req.headers.authorization;
    const dreamId = req.params.id;
    
    if (!token) return res.status(401).json("Brak autoryzacji!");

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) return res.status(403).json("Token nieważny!");

        const userId = decodedUser.id;
        const { title, description, category, image, price } = req.body;

        // Ważne: W warunku WHERE sprawdzamy idUser, żeby nikt nie edytował cudzych marzeń!
        const sql = "UPDATE dreams SET title=?, description=?, category=?, image=?, price_min=?, price_max=?, type=?, is_public=? WHERE id=? AND idUser=?";
        const values = [title, description, category, image, price_min, price_max, dreamId, userId, is_public];

        db.query(sql, values, (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.affectedRows === 0) return res.status(404).json("Nie znaleziono marzenia lub brak uprawnień.");
            
            return res.json("Marzenie zaktualizowane!");
        });
    });
});

// AKTUALIZACJA DANYCH UŻYTKOWNIKA
app.put('/api/user', (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json("Brak autoryzacji!");

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) return res.status(403).json("Token nieważny!");

        // Pobieramy dane z formularza
        const { first_name, last_name, description, image, password } = req.body;
        const userId = decodedUser.id;

        // Logika dla hasła: Jeśli użytkownik wpisał nowe hasło, szyfrujemy je.
        // Jeśli pole jest puste, nie ruszamy hasła w bazie.
        let sql = "";
        let values = [];

        if (password && password.length > 0) {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            
            sql = "UPDATE users SET first_name=?, last_name=?, description=?, image=?, password=? WHERE id=?";
            values = [first_name, last_name, description, image, hashedPassword, userId];
        } else {
            sql = "UPDATE users SET first_name=?, last_name=?, description=?, image=? WHERE id=?";
            values = [first_name, last_name, description, image, userId];
        }

        db.query(sql, values, (err, result) => {
            if (err) return res.status(500).json(err);

            // Pobieramy zaktualizowanego użytkownika, żeby odesłać go do Frontendu
            // (Dzięki temu awatar w rogu zmieni się od razu po zapisaniu!)
            const getUserSql = "SELECT * FROM users WHERE id = ?";
            db.query(getUserSql, [userId], (err, data) => {
                if (err) return res.status(500).json(err);
                
                const { password, ...updatedUser } = data[0];
                // Doklejamy token, żeby nie wylogowało usera
                res.status(200).json({ ...updatedUser, token }); 
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