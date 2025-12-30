import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
  };

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Pobieramy tylko podstawowe dane do kafelków wyboru (ID, Imię, Zdjęcie)
    const [rows] = await connection.execute(
      'SELECT id, first_name, last_name, image FROM users'
    );

    await connection.end();

    res.status(200).json(rows);

  } catch (error) {
    res.status(500).json({ error: 'Błąd pobierania listy użytkowników' });
  }
}