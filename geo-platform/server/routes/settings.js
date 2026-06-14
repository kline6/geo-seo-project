const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all settings (keyed by provider ID, matching frontend)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM app_settings ORDER BY id');
    const configs = {};
    result.rows.forEach(r => {
      configs[r.provider] = {
        apiKey: r.api_key,
        apiUrl: r.api_url,
        model: r.model,
        maxTokens: r.max_tokens,
        enabled: r.enabled
      };
    });
    res.json(configs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Save all settings
router.put('/', async (req, res) => {
  try {
    const configs = req.body;
    for (const [provider, cfg] of Object.entries(configs)) {
      await pool.query(
        `INSERT INTO app_settings (provider, api_key, api_url, model, max_tokens, enabled, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,NOW())
         ON CONFLICT (provider) DO UPDATE SET api_key=$2, api_url=$3, model=$4, max_tokens=$5, enabled=$6, updated_at=NOW()`,
        [provider, cfg.apiKey || '', cfg.apiUrl || '', cfg.model || '', cfg.maxTokens || 4096, cfg.enabled || false]
      );
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Save single provider
router.put('/:provider', async (req, res) => {
  try {
    const { apiKey, apiUrl, model, maxTokens, enabled } = req.body;
    const p = req.params.provider;
    await pool.query(
      `INSERT INTO app_settings (provider, api_key, api_url, model, max_tokens, enabled, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,NOW())
       ON CONFLICT (provider) DO UPDATE SET api_key=$2, api_url=$3, model=$4, max_tokens=$5, enabled=$6, updated_at=NOW()`,
      [p, apiKey || '', apiUrl || '', model || '', maxTokens || 4096, enabled || false]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Test connection
router.post('/:provider/test', async (req, res) => {
  try {
    const { apiKey, apiUrl, model } = req.body;
    const url = apiUrl;
    const key = apiKey;
    if (!key) return res.json({ success: false, error: 'No API key provided' });

    const start = Date.now();
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: model || 'gpt-4',
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5,
      }),
      signal: AbortSignal.timeout(10000),
    });
    const latency = Date.now() - start;
    if (response.ok) {
      res.json({ success: true, latency });
    } else {
      const err = await response.text();
      res.json({ success: false, error: err, latency });
    }
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

module.exports = router;
