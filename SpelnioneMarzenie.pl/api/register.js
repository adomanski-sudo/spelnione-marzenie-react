import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  // Akceptujemy tylko metodę POST (wysyłanie danych)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoda niedozwolona. Użyj POST.' });
  }

  const { first_name, last_name, email, password } = req.body;

  // Szybka walidacja
  if (!email || !password || !first_name) {
    return res.status(400).json({ error: 'Brakuje wymaganych danych (imię, email, hasło).' });
  }

  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
  };

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Czy email już istnieje w bazie
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      await connection.end();
      return res.status(409).json({ error: 'Taki użytkownik już istnieje!' });
    }

    // Haszowanie hasła - 10 rund
    const hashedPassword = await bcrypt.hash(password, 10);

    // Dodanie użytkownika 
    const [result] = await connection.execute(
      'INSERT INTO users (first_name, last_name, email, password, image) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, hashedPassword, 'img/profil/default.jpg']
    );

    await connection.end();

    // Sukces!
    res.status(201).json({ message: 'Konto utworzone pomyślnie!', userId: result.insertId });

    // Albo nie...
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd serwera podczas rejestracji.' });
  }
}