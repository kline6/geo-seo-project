const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM copy_records ORDER BY id');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM copy_records WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const Cols = req.body;
    const result = await pool.query(
      'INSERT INTO copy_records (original_title, original_content, rewritten_title, rewritten_content, model_used, source_type, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [Cols.original_title, Cols.original_content, Cols.rewritten_title, Cols.rewritten_content, Cols.model_used, Cols.source_type, Cols.status]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const Cols = req.body;
    const result = await pool.query(
      'UPDATE copy_records SET original_title=$1, original_content=$2, rewritten_title=$3, rewritten_content=$4, model_used=$5, source_type=$6, status=$7 WHERE id=$8 RETURNING *',
      [Cols.original_title, Cols.original_content, Cols.rewritten_title, Cols.rewritten_content, Cols.model_used, Cols.source_type, Cols.status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM copy_records WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
