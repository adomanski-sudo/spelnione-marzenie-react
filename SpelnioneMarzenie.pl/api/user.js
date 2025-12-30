import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  // 1. Pobieramy ID z adresu URL (np. ?id=1)
  const userId = req.query.id || 1; 

  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
  };

  try {
    const connection = await mysql.createConnection(dbConfig);

    // 2. Używamy zmiennej userId w zapytaniu SQL
    const [rows] = await connection.execute(
      'SELECT id, first_name, last_name, description, image FROM users WHERE id = ?',
      [userId]
    );

    await connection.end();

    if (rows.length > 0) {
        res.status(200).json(rows[0]);
    } else {
        res.status(404).json({ error: 'Użytkownik nieznany' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Błąd pobierania profilu' });
  }
}