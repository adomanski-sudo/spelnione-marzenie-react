import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  // 1. Pobieramy ID z adresu URL
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

    // 2. Pobieramy marzenia TYLKO dla tego userId
    const [rows] = await connection.execute(
      'SELECT * FROM dreams WHERE idUser = ?',
      [userId]
    );

    await connection.end();

    res.status(200).json(rows);

  } catch (error) {
    console.error('Błąd bazy danych:', error);
    res.status(500).json({ error: 'Nie udało się pobrać marzeń' });
  }
}