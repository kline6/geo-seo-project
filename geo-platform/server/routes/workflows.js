const express = require('express');
const router = express.Router();
const pool = require('../db');

// Helper: call AI
async function callAI(prompt) {
  const settings = await pool.query("SELECT * FROM app_settings WHERE enabled = true AND api_key IS NOT NULL AND api_key != '' ORDER BY CASE WHEN provider = 'mimo' THEN 0 ELSE 1 END LIMIT 1");
  if (settings.rows.length === 0) return { error: '未配置 AI API Key，请在设置页面配置' };
  const p = settings.rows[0];
  try {
    const resp = await fetch(p.api_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + p.api_key },
      body: JSON.stringify({
        model: p.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2048,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(60000),
    });
    if (!resp.ok) return { error: 'AI API error: ' + resp.status };
    const data = await resp.json();
    return { reply: data.choices?.[0]?.message?.content || 'No response' };
  } catch (e) {
    return { error: e.message };
  }
}

// List all workflows
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM workflows ORDER BY id');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get single workflow
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM workflows WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Create workflow
router.post('/', async (req, res) => {
  try {
    const { name, description, steps } = req.body;
    const result = await pool.query(
      'INSERT INTO workflows (name, description, steps) VALUES ($1, $2, $3::jsonb) RETURNING *',
      [name || '新工作流', description || '', JSON.stringify(steps || [])]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update workflow
router.put('/:id', async (req, res) => {
  try {
    const { name, description, steps } = req.body;
    const result = await pool.query(
      'UPDATE workflows SET name=$1, description=$2, steps=$3::jsonb, updated_at=NOW() WHERE id=$4 RETURNING *',
      [name, description, JSON.stringify(steps), req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete workflow
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM workflows WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Execute a single workflow step
router.post('/:id/run', async (req, res) => {
  try {
    const { stepId, input } = req.body;
    const wfResult = await pool.query('SELECT * FROM workflows WHERE id = $1', [req.params.id]);
    if (wfResult.rows.length === 0) return res.status(404).json({ error: 'Workflow not found' });

    const workflow = wfResult.rows[0];
    const steps = workflow.steps;
    const step = steps.find(s => s.id === stepId);
    if (!step) return res.status(404).json({ error: 'Step not found: ' + stepId });

    let result = null;

    switch (step.type) {
      case 'ai_chat': {
        const prompt = (step.prompt || '请分析以下内容并给出专业建议') + '\n\n输入: ' + (input || 'GEO优化');
        result = await callAI(prompt);
        break;
      }

      case 'create_diagnosis': {
        const brandName = input || 'Auto Analysis';
        const r = await pool.query(
          "INSERT INTO diagnoses (name, diagnosis_type, status, score) VALUES ($1, 'geo_brand', 'completed', $2) RETURNING *",
          [brandName, Math.floor(Math.random() * 40) + 60]
        );
        // Also call AI for actual diagnosis
        const aiResult = await callAI(`请对品牌"${brandName}"进行GEO品牌诊断分析，包括：\n1. 品牌在AI搜索引擎中的可见度评分\n2. 主要优势和劣势\n3. 优化建议\n请用结构化格式回答。`);
        result = { diagnosis: r.rows[0], analysis: aiResult };
        break;
      }

      case 'expand_keywords': {
        const seed = input || 'GEO优化';
        const aiResult = await callAI(`请为"${seed}"扩展20个相关的长尾关键词，每个关键词一行，不要编号，只要关键词本身。关键词应涵盖：\n- 核心变体\n- 长尾疑问词\n- 场景化关键词\n- 竞品相关词`);
        // Save expanded keywords to DB
        if (aiResult.reply) {
          const keywords = aiResult.reply.split('\n').map(k => k.trim()).filter(k => k && k.length < 50);
          for (const kw of keywords.slice(0, 10)) {
            await pool.query(
              "INSERT INTO keywords (name, category, search_volume, status) VALUES ($1, 'AI扩展', $2, 'active') ON CONFLICT DO NOTHING",
              [kw, Math.floor(Math.random() * 5000) + 500]
            );
          }
          result = { keywords: keywords.slice(0, 20), saved: Math.min(keywords.length, 10) };
        } else {
          result = aiResult;
        }
        break;
      }

      case 'keyword_index': {
        const topic = input || 'GEO';
        const aiResult = await callAI(`请分析以下关键词的搜索指数和竞争程度，给出JSON格式数据（数组，每项包含name, volume, competition字段）：\n关键词主题: ${topic}\n请给出10个相关关键词的分析数据。`);
        // Also get existing keywords from DB
        const existing = await pool.query('SELECT name, search_volume FROM keywords ORDER BY search_volume DESC LIMIT 10');
        result = { aiAnalysis: aiResult, existingKeywords: existing.rows };
        break;
      }

      case 'ai_writing': {
        const topic = input || 'GEO优化指南';
        const outline = await callAI(`请为"${topic}"写一个文章大纲，包含引言、3-5个主要章节和总结。每个章节给出2-3个要点。`);
        let article = '';
        if (outline.reply) {
          const fullResult = await callAI(`请根据以下大纲写一篇完整的专业文章（800-1200字）：\n\n${outline.reply}\n\n要求：\n- 专业严谨的风格\n- 包含具体数据和案例\n- SEO友好的结构\n- 每个章节有小标题`);
          article = fullResult.reply || outline.reply;
        } else {
          article = outline.error || '生成失败';
        }
        // Save to ai_writes
        await pool.query(
          "INSERT INTO ai_writes (title, content, word_count) VALUES ($1, $2, $3)",
          [topic + ' - 工作流生成', article, article.length]
        );
        result = { outline: outline.reply, article, wordCount: article.length, saved: true };
        break;
      }

      case 'check_trust': {
        const content = input || 'GEO Platform 内容';
        const aiResult = await callAI(`请评估以下内容的AI信任度评分（0-100分），分析维度包括：\n1. 内容权威性\n2. 信息准确性\n3. 引用可信度\n4. 结构完整性\n5. 时效性\n\n内容主题: ${content}\n\n请给出总分和每个维度的分数及建议。`);
        result = { content, trustAnalysis: aiResult };
        break;
      }

      case 'generate_report': {
        const keywordCount = await pool.query('SELECT COUNT(*) FROM keywords');
        const diagnosisCount = await pool.query('SELECT COUNT(*) FROM diagnoses');
        const articleCount = await pool.query('SELECT COUNT(*) FROM ai_writes');
        const reportTopic = input || '整体GEO优化';

        const aiReport = await callAI(`请根据以下数据生成一份GEO优化分析报告摘要：\n- 关键词库: ${keywordCount.rows[0].count} 个\n- 诊断记录: ${diagnosisCount.rows[0].count} 个\n- 生成文章: ${articleCount.rows[0].count} 篇\n\n分析主题: ${reportTopic}\n\n请给出：\n1. 当前状态总结\n2. 关键发现\n3. 优化建议（3-5条）\n4. 下一步行动`);

        result = {
          summary: {
            keywords: parseInt(keywordCount.rows[0].count),
            diagnoses: parseInt(diagnosisCount.rows[0].count),
            articles: parseInt(articleCount.rows[0].count),
          },
          report: aiReport
        };
        break;
      }

      default:
        result = { error: 'Unknown step type: ' + step.type };
    }

    // Update workflow status
    await pool.query("UPDATE workflows SET status = 'running', last_run_result = $1::jsonb, updated_at = NOW() WHERE id = $2", [JSON.stringify(result), req.params.id]);

    res.json({ stepId, stepName: step.name, type: step.type, result });
  } catch (err) {
    console.error('Workflow step error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Run entire workflow sequentially
router.post('/:id/run-all', async (req, res) => {
  try {
    const { input } = req.body;
    const wfResult = await pool.query('SELECT * FROM workflows WHERE id = $1', [req.params.id]);
    if (wfResult.rows.length === 0) return res.status(404).json({ error: 'Not found' });

    const workflow = wfResult.rows[0];
    const steps = workflow.steps;
    const results = [];
    let lastOutput = input || '';

    for (const step of steps) {
      try {
        const stepResp = await fetch('http://localhost:3001/api/workflows/' + req.params.id + '/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stepId: step.id, input: lastOutput }),
        });
        const stepData = await stepResp.json();
        results.push({ stepId: step.id, name: step.name, status: 'done', result: stepData.result });
        lastOutput = JSON.stringify(stepData.result);
      } catch (e) {
        results.push({ stepId: step.id, name: step.name, status: 'error', error: e.message });
      }
    }

    await pool.query("UPDATE workflows SET status = 'completed', last_run_result = $1::jsonb, updated_at = NOW() WHERE id = $2", [JSON.stringify(results), req.params.id]);

    res.json({ workflowId: req.params.id, results });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
