const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM diagnoses ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM diagnoses WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { name, diagnosis_type, domain, keywords, competitors, language, status, score } = req.body;
    const result = await pool.query(
      'INSERT INTO diagnoses (name, diagnosis_type, domain, competitors, language, status, score) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [name, diagnosis_type || 'geo_brand', domain || '', competitors || '', language || 'CN', status || 'pending', score || null]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, diagnosis_type, domain, competitors, language, status, score } = req.body;
    const result = await pool.query(
      'UPDATE diagnoses SET name=$1, diagnosis_type=$2, domain=$3, competitors=$4, language=$5, status=$6, score=$7 WHERE id=$8 RETURNING *',
      [name, diagnosis_type, domain, competitors, language, status, score, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM diagnoses WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
