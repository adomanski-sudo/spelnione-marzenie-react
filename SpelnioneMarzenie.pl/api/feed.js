// api/feed.js
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

    // ZMIANA: Pobieramy 20 losowych marzeń naraz (zamiast 1)
    const [rows] = await connection.execute(`
      SELECT 
        dreams.dream_id,
        dreams.title, 
        dreams.icon, 
        users.first_name, 
        users.image AS user_image
      FROM dreams 
      JOIN users ON dreams.idUser = users.id 
      ORDER BY RAND() 
      LIMIT 20
    `);

    await connection.end();

    // Zwracamy tablicę (paczkę), a nie pojedynczy obiekt
    res.status(200).json(rows);

  } catch (error) {
    res.status(500).json({ error: 'Błąd feedu' });
  }
}