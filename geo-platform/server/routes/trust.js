const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const factors = await pool.query('SELECT * FROM trust_factors ORDER BY id');
    const suggestions = await pool.query('SELECT * FROM trust_suggestions ORDER BY id');
    res.json({ factors: factors.rows, suggestions: suggestions.rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/factors', async (req, res) => {
  try {
    const { factor_name, score, weight, description } = req.body;
    const result = await pool.query(
      'INSERT INTO trust_factors (factor_name, score, weight, description) VALUES ($1,$2,$3,$4) RETURNING *',
      [factor_name, score || 0, weight || '0%', description || '']
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/factors/:id', async (req, res) => {
  try {
    const { factor_name, score, weight, description } = req.body;
    const result = await pool.query(
      'UPDATE trust_factors SET factor_name=$1, score=$2, weight=$3, description=$4 WHERE id=$5 RETURNING *',
      [factor_name, score, weight, description, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/factors/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM trust_factors WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/suggestions', async (req, res) => {
  try {
    const { suggestion_text, priority, impact } = req.body;
    const result = await pool.query(
      'INSERT INTO trust_suggestions (suggestion_text, priority, impact) VALUES ($1,$2,$3) RETURNING *',
      [suggestion_text, priority || 'medium', impact || '+0%']
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/suggestions/:id', async (req, res) => {
  try {
    const { suggestion_text, priority, impact } = req.body;
    const result = await pool.query(
      'UPDATE trust_suggestions SET suggestion_text=$1, priority=$2, impact=$3 WHERE id=$4 RETURNING *',
      [suggestion_text, priority, impact, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/suggestions/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM trust_suggestions WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;