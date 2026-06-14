const express = require('express');
const router = express.Router();
const pool = require('../db');

// ========== Conversation CRUD ==========

// List all conversations
router.get('/conversations', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, 
        (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = c.id) as message_count,
        (SELECT content FROM chat_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
       FROM conversations c ORDER BY c.updated_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new conversation
router.post('/conversations', async (req, res) => {
  try {
    const { title } = req.body;
    const result = await pool.query(
      'INSERT INTO conversations (title) VALUES ($1) RETURNING *',
      [title || '新对话']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a conversation and its messages
router.delete('/conversations/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM conversations WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rename a conversation
router.put('/conversations/:id', async (req, res) => {
  try {
    const { title } = req.body;
    await pool.query('UPDATE conversations SET title = $1, updated_at = NOW() WHERE id = $2', [title, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== Messages ==========

// Get messages for a conversation
router.get('/conversations/:id/messages', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM chat_messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== Chat (send message with history) ==========

router.post('/', async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      const convResult = await pool.query(
        'INSERT INTO conversations (title) VALUES ($1) RETURNING id',
        [message.slice(0, 30)]
      );
      convId = convResult.rows[0].id;
    }

    // Save user message to DB
    await pool.query(
      'INSERT INTO chat_messages (conversation_id, role, content) VALUES ($1, $2, $3)',
      [convId, 'user', message]
    );

    // Load full conversation history from DB
    const historyResult = await pool.query(
      'SELECT role, content FROM chat_messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [convId]
    );
    const history = historyResult.rows;

    // Get enabled AI provider config
    const settingsResult = await pool.query(
      "SELECT * FROM app_settings WHERE enabled = true AND api_key IS NOT NULL AND api_key != '' ORDER BY CASE WHEN provider = 'mimo' THEN 0 ELSE 1 END LIMIT 1"
    );

    if (settingsResult.rows.length === 0) {
      const reply = '请先在设置中配置 AI API Key。\n\n路径：设置 → 小米 MiMo → 输入 API Key → 保存';
      await pool.query(
        'INSERT INTO chat_messages (conversation_id, role, content) VALUES ($1, $2, $3)',
        [convId, 'assistant', reply]
      );
      return res.json({ reply, conversationId: convId });
    }

    const provider = settingsResult.rows[0];
    const apiKey = provider.api_key;
    const apiUrl = provider.api_url;
    const model = provider.model;

    if (!apiKey) {
      const reply = 'API Key 未配置，请在设置页面配置。';
      await pool.query(
        'INSERT INTO chat_messages (conversation_id, role, content) VALUES ($1, $2, $3)',
        [convId, 'assistant', reply]
      );
      return res.json({ reply, conversationId: convId });
    }

    const systemPrompt = `你是 GEO Platform 的 AI 智能助手，专门帮助用户进行 SEO/GEO 优化分析。
你可以帮助用户：
1. GEO品牌分析 - 分析品牌在AI搜索引擎中的可见度
2. SEO技术检测 - 检测网站SEO技术指标
3. AI信任度评分 - 评估内容被AI引用的概率
4. 关键词扩展 - 智能扩展相关长尾关键词
5. 文章生成 - 生成SEO优化的文章内容
6. 品牌对比 - 多品牌AI可见度对比分析

请用中文回答，保持专业且简洁。如果用户之前问过相关问题，请参考之前的对话内容保持连贯性。`;

    // Build messages array: system + full history
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...history.map(m => ({ role: m.role, content: m.content }))
    ];

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: apiMessages,
        max_tokens: 2048,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(120000),
    });

    let reply;
    if (!response.ok) {
      const errText = await response.text();
      console.error('AI API error:', response.status, errText);
      reply = `AI 服务调用失败 (${response.status})，请检查 API Key 配置。\n\n当前使用: ${provider.provider} (${model})`;
    } else {
      const data = await response.json();
      reply = data.choices?.[0]?.message?.content || '未获取到回复内容。';
    }

    // Save AI reply to DB
    await pool.query(
      'INSERT INTO chat_messages (conversation_id, role, content) VALUES ($1, $2, $3)',
      [convId, 'assistant', reply]
    );

    // Update conversation timestamp and title if first message
    await pool.query(
      'UPDATE conversations SET updated_at = NOW() WHERE id = $1',
      [convId]
    );

    // Auto-update title from first user message
    const msgCount = await pool.query(
      'SELECT COUNT(*) FROM chat_messages WHERE conversation_id = $1 AND role = $2',
      [convId, 'user']
    );
    if (parseInt(msgCount.rows[0].count) === 1) {
      await pool.query(
        'UPDATE conversations SET title = $1 WHERE id = $2',
        [message.slice(0, 30), convId]
      );
    }

    res.json({ reply, conversationId: convId, model });

  } catch (err) {
    console.error('Chat error:', err.message);
    res.json({ reply: `请求失败: ${err.message}\n\n请检查后端服务是否正常运行。` });
  }
});

module.exports = router;
