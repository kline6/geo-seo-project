const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');

const routes = [
  { file: 'diagnoses.js', table: 'diagnoses', cols: ['name','diagnosis_type','date','status','score'] },
  { file: 'materials.js', table: 'materials', cols: ['name','type','size','category','upload_date'] },
  { file: 'aiWrites.js', table: 'ai_writes', cols: ['title','content','template','keywords','tone','word_count'] },
  { file: 'hotCopies.js', table: 'hot_copies', cols: ['title','source','heat','keywords','url'] },
  { file: 'publishes.js', table: 'publishes', cols: ['title','platform','status','publish_date','views'] },
  { file: 'aiTools.js', table: 'ai_tools', cols: ['name','description','category','icon','color','popularity','uses','last_used'] },
  { file: 'seoKeywords.js', table: 'seo_keywords', cols: ['keyword','volume','visibility','position','prev_position','status','platform'] },
  { file: 'platforms.js', table: 'platforms', cols: ['name','icon','connected'] },
];

routes.forEach(r => {
  const placeholders = r.cols.map((_, i) => `$${i+1}`).join(', ');
  const setClause = r.cols.map((c, i) => `${c}=$${i+1}`).join(', ');
  const vals = r.cols.map(c => `Cols.${c}`).join(', ');
  const idParam = r.cols.length + 1;

  const content = `const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ${r.table} ORDER BY id');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ${r.table} WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const Cols = req.body;
    const result = await pool.query(
      'INSERT INTO ${r.table} (${r.cols.join(', ')}) VALUES (${placeholders}) RETURNING *',
      [${vals}]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const Cols = req.body;
    const result = await pool.query(
      'UPDATE ${r.table} SET ${setClause} WHERE id=$${idParam} RETURNING *',
      [${vals}, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM ${r.table} WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
`;
  fs.writeFileSync(path.join(routesDir, r.file), content, 'utf8');
  console.log(`Created ${r.file}`);
});
console.log('All CRUD routes generated');