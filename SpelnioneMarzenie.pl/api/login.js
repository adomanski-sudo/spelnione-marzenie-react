import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoda niedozwolona.' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Podaj email i hasło.' });
  }

  if (!checkPassword) return res.status(400).json("Błędne hasło!");
  const token = jwt.sign({ id: data[0].id }, SECRET_KEY, { expiresIn: '12h' });

  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
  };

  try {
    const connection = await mysql.createConnection(dbConfig);

    //Szukamy użytkownika po emailu (pobieramy też hasło i id)
    const [users] = await connection.execute(
      'SELECT id, first_name, last_name, password, image FROM users WHERE email = ?',
      [email]
    );

    await connection.end();

    // Jeśli nie znaleziono użytkownika
    if (users.length === 0) {
      return res.status(401).json({ error: 'Błędny email lub hasło.' });
    }

    const user = users[0];

    // Porównujemy hasła
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Błędny email lub hasło.' });
    }

    // SUKCES!
    // Odsyłamy dane użytkownika, ALE BEZ HASŁA!
    const userData = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        image: user.image
    };

    res.status(200).json({ message: 'Zalogowano pomyślnie!', user: userData, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd serwera logowania.' });
  }
}