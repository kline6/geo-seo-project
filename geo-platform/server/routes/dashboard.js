const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const kw = await pool.query('SELECT COUNT(*) as count FROM keywords');
    const articles = await pool.query('SELECT COUNT(*) as count FROM articles');
    const diags = await pool.query('SELECT COUNT(*) as count FROM diagnoses');
    const avgVis = await pool.query('SELECT COALESCE(AVG(visibility), 0) as avg FROM keywords');
    const plans = await pool.query('SELECT * FROM plans ORDER BY id DESC LIMIT 5');
    const goals = await pool.query('SELECT COUNT(*) as count FROM goals WHERE status = $1', ['active']);
    
    const tasksResult = await pool.query('SELECT pt.*, p.title as plan_title FROM plan_tasks pt JOIN plans p ON pt.plan_id = p.id ORDER BY pt.id DESC LIMIT 5');
    
    res.json({
      keywordCount: parseInt(kw.rows[0].count),
      articleCount: parseInt(articles.rows[0].count),
      diagnosisCount: parseInt(diags.rows[0].count),
      avgVisibility: Math.round(parseFloat(avgVis.rows[0].avg)),
      activeGoals: parseInt(goals.rows[0].count),
      recentTasks: tasksResult.rows.map(t => ({
        title: t.title,
        planTitle: t.plan_title,
        done: t.done
      }))
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;