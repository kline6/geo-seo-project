const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const goalsResult = await pool.query('SELECT * FROM goals ORDER BY id');
    const goals = goalsResult.rows;
    for (const goal of goals) {
      const msResult = await pool.query('SELECT * FROM goal_milestones WHERE goal_id = $1 ORDER BY id', [goal.id]);
      goal.milestones = msResult.rows;
    }
    res.json(goals);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM goals WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const goal = result.rows[0];
    const msResult = await pool.query('SELECT * FROM goal_milestones WHERE goal_id = $1 ORDER BY id', [goal.id]);
    goal.milestones = msResult.rows;
    res.json(goal);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { title, description, category, progress, deadline, status, milestones } = req.body;
    const goalResult = await client.query(
      'INSERT INTO goals (title, description, category, progress, deadline, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [title, description || '', category || '', progress || 0, deadline || null, status || 'active']
    );
    const goal = goalResult.rows[0];
    if (milestones && milestones.length > 0) {
      for (const ms of milestones) {
        await client.query(
          'INSERT INTO goal_milestones (goal_id, title, done) VALUES ($1, $2, $3)',
          [goal.id, ms.title, ms.done || false]
        );
      }
    }
    await client.query('COMMIT');
    const msResult = await pool.query('SELECT * FROM goal_milestones WHERE goal_id = $1 ORDER BY id', [goal.id]);
    goal.milestones = msResult.rows;
    res.json(goal);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally { client.release(); }
});

router.put('/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { title, description, category, progress, deadline, status, milestones } = req.body;
    const result = await client.query(
      'UPDATE goals SET title=$1, description=$2, category=$3, progress=$4, deadline=$5, status=$6 WHERE id=$7 RETURNING *',
      [title, description, category, progress, deadline, status, req.params.id]
    );
    if (result.rows.length === 0) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Not found' }); }
    if (milestones) {
      await client.query('DELETE FROM goal_milestones WHERE goal_id = $1', [req.params.id]);
      for (const ms of milestones) {
        await client.query(
          'INSERT INTO goal_milestones (goal_id, title, done) VALUES ($1, $2, $3)',
          [req.params.id, ms.title, ms.done || false]
        );
      }
    }
    await client.query('COMMIT');
    const goal = result.rows[0];
    const msResult = await pool.query('SELECT * FROM goal_milestones WHERE goal_id = $1 ORDER BY id', [goal.id]);
    goal.milestones = msResult.rows;
    res.json(goal);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally { client.release(); }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM goals WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;