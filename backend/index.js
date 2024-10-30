// backend/index.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');  // Client PostgreSQL

const app = express();
app.use(cors());

// Configurer la connexion à la base de données
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reviews'); // Assure-toi d'avoir une table 'reviews'
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur de récupération des données:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
});

app.listen(3000, () => {
  console.log('Listening for requests on port 3000');
});
