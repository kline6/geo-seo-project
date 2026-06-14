const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password_hash = $2', [username, password]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    res.json({ id: user.id, username: user.username, display_name: user.display_name, role: user.role });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password, display_name } = req.body;
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, display_name) VALUES ($1, $2, $3) RETURNING id, username, display_name, role',
      [username, password, display_name || username]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
