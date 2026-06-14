const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM backlinks ORDER BY id');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM backlinks WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const Cols = req.body;
    const result = await pool.query(
      'INSERT INTO backlinks (source_url, target_url, anchor_text, link_type, da_score, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [Cols.source_url, Cols.target_url, Cols.anchor_text, Cols.link_type, Cols.da_score, Cols.status]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const Cols = req.body;
    const result = await pool.query(
      'UPDATE backlinks SET source_url=$1, target_url=$2, anchor_text=$3, link_type=$4, da_score=$5, status=$6 WHERE id=$7 RETURNING *',
      [Cols.source_url, Cols.target_url, Cols.anchor_text, Cols.link_type, Cols.da_score, Cols.status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM backlinks WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
