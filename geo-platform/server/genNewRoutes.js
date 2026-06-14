const fs = require('fs');
const routesDir = 'E:/iso project/geo-platform/server/routes';

const routes = [
  { file: 'settings.js', table: 'app_settings', cols: ['provider','api_key','api_url','model','max_tokens','enabled'] },
  { file: 'backlinks.js', table: 'backlinks', cols: ['source_url','target_url','anchor_text','link_type','da_score','status'] },
  { file: 'keywordTracking.js', table: 'keyword_tracking', cols: ['keyword','target_url','google_rank','geo_visibility','search_volume','competition','cpc'] },
  { file: 'reports.js', table: 'reports', cols: ['title','report_type','data'] },
  { file: 'mediaOutlets.js', table: 'media_outlets', cols: ['name','region','da_score','monthly_traffic','category','response_time','selected'] },
  { file: 'pressReleases.js', table: 'press_releases', cols: ['brand_name','language','title','content','media_ids','status'] },
  { file: 'copyRecords.js', table: 'copy_records', cols: ['original_title','original_content','rewritten_title','rewritten_content','model_used','source_type','status'] },
];

routes.forEach(r => {
  const placeholders = r.cols.map((_, i) => '$' + (i+1)).join(', ');
  const setClause = r.cols.map((c, i) => c + '=$' + (i+1)).join(', ');
  const vals = r.cols.map(c => 'Cols.' + c).join(', ');
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
  fs.writeFileSync(routesDir + '/' + r.file, content, 'utf8');
  console.log('Created: ' + r.file);
});

// Auth routes
const authContent = `const express = require('express');
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
`;
fs.writeFileSync(routesDir + '/auth.js', authContent, 'utf8');
console.log('Created: auth.js');

console.log('All new routes created');