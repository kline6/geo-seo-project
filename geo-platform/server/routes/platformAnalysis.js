const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM platform_analysis ORDER BY id');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { platform_name, visibility, trend, is_up } = req.body;
    const result = await pool.query(
      'INSERT INTO platform_analysis (platform_name, visibility, trend, is_up) VALUES ($1,$2,$3,$4) RETURNING *',
      [platform_name, visibility || 0, trend || '+0%', is_up !== false]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { platform_name, visibility, trend, is_up } = req.body;
    const result = await pool.query(
      'UPDATE platform_analysis SET platform_name=$1, visibility=$2, trend=$3, is_up=$4 WHERE id=$5 RETURNING *',
      [platform_name, visibility, trend, is_up, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM platform_analysis WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;