const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM media_outlets ORDER BY id');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM media_outlets WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const Cols = req.body;
    const result = await pool.query(
      'INSERT INTO media_outlets (name, region, da_score, monthly_traffic, category, response_time, selected) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [Cols.name, Cols.region, Cols.da_score, Cols.monthly_traffic, Cols.category, Cols.response_time, Cols.selected]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const Cols = req.body;
    const result = await pool.query(
      'UPDATE media_outlets SET name=$1, region=$2, da_score=$3, monthly_traffic=$4, category=$5, response_time=$6, selected=$7 WHERE id=$8 RETURNING *',
      [Cols.name, Cols.region, Cols.da_score, Cols.monthly_traffic, Cols.category, Cols.response_time, Cols.selected, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM media_outlets WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
