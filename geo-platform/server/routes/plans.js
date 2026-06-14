const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const plansResult = await pool.query('SELECT * FROM plans ORDER BY id');
    const plans = plansResult.rows;
    for (const plan of plans) {
      const tasksResult = await pool.query('SELECT * FROM plan_tasks WHERE plan_id = $1 ORDER BY id', [plan.id]);
      plan.tasks = tasksResult.rows;
    }
    res.json(plans);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM plans WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const plan = result.rows[0];
    const tasksResult = await pool.query('SELECT * FROM plan_tasks WHERE plan_id = $1 ORDER BY id', [plan.id]);
    plan.tasks = tasksResult.rows;
    res.json(plan);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { title, description, status, priority, start_date, end_date, progress, tasks } = req.body;
    const planResult = await client.query(
      'INSERT INTO plans (title, description, status, priority, start_date, end_date, progress) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [title, description || '', status || 'draft', priority || 'medium', start_date || null, end_date || null, progress || 0]
    );
    const plan = planResult.rows[0];
    if (tasks && tasks.length > 0) {
      for (const task of tasks) {
        await client.query(
          'INSERT INTO plan_tasks (plan_id, title, done) VALUES ($1, $2, $3)',
          [plan.id, task.title, task.done || false]
        );
      }
    }
    await client.query('COMMIT');
    const tasksResult = await pool.query('SELECT * FROM plan_tasks WHERE plan_id = $1 ORDER BY id', [plan.id]);
    plan.tasks = tasksResult.rows;
    res.json(plan);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally { client.release(); }
});

router.put('/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { title, description, status, priority, start_date, end_date, progress, tasks } = req.body;
    const result = await client.query(
      'UPDATE plans SET title=$1, description=$2, status=$3, priority=$4, start_date=$5, end_date=$6, progress=$7 WHERE id=$8 RETURNING *',
      [title, description, status, priority, start_date, end_date, progress, req.params.id]
    );
    if (result.rows.length === 0) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Not found' }); }
    if (tasks) {
      await client.query('DELETE FROM plan_tasks WHERE plan_id = $1', [req.params.id]);
      for (const task of tasks) {
        await client.query(
          'INSERT INTO plan_tasks (plan_id, title, done) VALUES ($1, $2, $3)',
          [req.params.id, task.title, task.done || false]
        );
      }
    }
    await client.query('COMMIT');
    const plan = result.rows[0];
    const tasksResult = await pool.query('SELECT * FROM plan_tasks WHERE plan_id = $1 ORDER BY id', [plan.id]);
    plan.tasks = tasksResult.rows;
    res.json(plan);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally { client.release(); }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM plans WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;