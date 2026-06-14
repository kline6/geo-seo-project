const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const weekly = await pool.query('SELECT * FROM analysis_data WHERE period_type = $1 ORDER BY id', ['weekly']);
    const platformData = await pool.query('SELECT * FROM platform_analysis ORDER BY id');
    res.json({ weekly: weekly.rows, platforms: platformData.rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { day_name, visibility, traffic, period_type } = req.body;
    const result = await pool.query(
      'INSERT INTO analysis_data (day_name, visibility, traffic, period_type) VALUES ($1,$2,$3,$4) RETURNING *',
      [day_name, visibility || 0, traffic || 0, period_type || 'weekly']
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { day_name, visibility, traffic, period_type } = req.body;
    const result = await pool.query(
      'UPDATE analysis_data SET day_name=$1, visibility=$2, traffic=$3, period_type=$4 WHERE id=$5 RETURNING *',
      [day_name, visibility, traffic, period_type, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM analysis_data WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;