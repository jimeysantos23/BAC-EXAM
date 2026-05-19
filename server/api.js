require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'tu_usuario',
  password: process.env.DB_PASSWORD || 'tu_contraseña',
  database: process.env.DB_DATABASE || 'bac_exam',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initDb() {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS valores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      limite_inferior INT,
      limite_superior INT,
      cantidad_filas INT,
      dif_mayor INT,
      promedio FLOAT
    )
  `;
  await pool.query(createTableSql);
}

initDb().catch((error) => {
  console.error('Error inicializando la base de datos:', error);
  process.exit(1);
});


app.post('/historial', async (req, res) => {
  const { lower, upper, count, maxDiff, average } = req.body;

  if (typeof lower !== 'number' || typeof upper !== 'number') {
    return res.status(400).json({ error: 'limite_inferior y limite_superior deben ser números.' });
  }

  if (typeof count !== 'number' || typeof maxDiff !== 'number' || typeof average !== 'number') {
    return res.status(400).json({ error: 'cantidad_filas, dif_mayor y promedio deben ser numéricos.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO valores (limite_inferior, limite_superior, cantidad_filas, dif_mayor, promedio) VALUES (?, ?, ?, ?, ?)',
      [lower, upper, count, maxDiff, average],
    );

    res.json({ insertedId: result.insertId, insertedRows: result.affectedRows });
  } catch (error) {
    console.error('Error guardando historial en la base de datos:', error);
    res.status(500).json({ error: 'Error guardando el historial.' });
  }
});

app.get('/historial', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, limite_inferior, limite_superior, cantidad_filas, dif_mayor, promedio FROM valores ORDER BY id DESC LIMIT 100',
    );

    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({ error: 'Error obteniendo el historial.' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});