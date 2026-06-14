const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const { search, status, sort, limit } = req.query;
    let query = 'SELECT * FROM keywords';
    const params = [];
    const conditions = [];
    if (search) { conditions.push(`(keyword ILIKE $${params.length + 1} OR name ILIKE $${params.length + 1})`); params.push(`%${search}%`); }
    if (status && status !== 'all') { conditions.push(`status = $${params.length + 1}`); params.push(status); }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    if (sort === 'volume') query += ' ORDER BY search_volume DESC';
    else query += ' ORDER BY id DESC';
    if (limit) query += ` LIMIT ${parseInt(limit)}`;
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM keywords WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { keyword, name, volume, search_volume, visibility, position, category, status } = req.body;
    const kw = keyword || name;
    const vol = volume || search_volume || 0;
    const result = await pool.query(
      'INSERT INTO keywords (keyword, name, volume, search_volume, visibility, position, category, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [kw, name || kw, vol, vol, visibility || 0, position || 0, category || 'SEO', status || 'active']
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { keyword, name, volume, search_volume, visibility, position, category, status } = req.body;
    const result = await pool.query(
      'UPDATE keywords SET keyword=COALESCE($1,keyword), name=COALESCE($2,name), volume=COALESCE($3,volume), search_volume=COALESCE($4,search_volume), visibility=COALESCE($5,visibility), position=COALESCE($6,position), category=COALESCE($7,category), status=COALESCE($8,status) WHERE id=$9 RETURNING *',
      [keyword, name, volume, search_volume, visibility, position, category, status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM keywords WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
