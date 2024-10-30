// backend/index.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json()); // Pour parser les requêtes JSON

// Configurer la connexion à la base de données
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

// Fonction pour créer la table "utilisateur" si elle n'existe pas
// const initDb = async () => {
//   try {
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS utilisateur (
//         id SERIAL PRIMARY KEY,
//         nom VARCHAR(50),
//         email VARCHAR(100) UNIQUE,
//         age INTEGER
//       );
//     `);
//     console.log("Table 'utilisateur' créée ou déjà existante.");
//   } catch (err) {
//     console.error("Erreur lors de la création de la table:", err);
//   }
// };

// CRUD pour utilisateur

// Lire tous les utilisateurs
app.get('/utilisateurs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM utilisateur');
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Lire un utilisateur par ID
app.get('/utilisateurs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM utilisateur WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
  }
});

// Créer un nouvel utilisateur
app.post('/utilisateurs', async (req, res) => {
  const { nom, email, age } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO utilisateur (nom, email, age) VALUES ($1, $2, $3) RETURNING *',
      [nom, email, age]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la création de l\'utilisateur:', err);
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// Mettre à jour un utilisateur par ID
app.put('/utilisateurs/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, email, age } = req.body;
  try {
    const result = await pool.query(
      'UPDATE utilisateur SET nom = $1, email = $2, age = $3 WHERE id = $4 RETURNING *',
      [nom, email, age, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

// Supprimer un utilisateur par ID
app.delete('/utilisateurs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM utilisateur WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', err);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

// Initialise la table à l'initialisation du serveur
// initDb();

app.listen(3000, () => {
  console.log('Listening for requests on port 3000');
});
