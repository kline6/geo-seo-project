const fs = require('fs');
const P = 'E:/iso project/geo-platform/src/pages';

// ===== Settings.jsx =====
fs.writeFileSync(P + '/Settings.jsx', `import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, RefreshCw, Check, X, Eye, EyeOff } from "lucide-react";

function Settings() {
  const [settings, setSettings] = useState([]);
  const [activeProvider, setActiveProvider] = useState(null);
  const [showKeys, setShowKeys] = useState({});
  const [editForms, setEditForms] = useState({});

  const load = () => fetch("/api/settings").then(r => r.json()).then(data => {
    setSettings(data);
    if (data.length > 0 && !activeProvider) {
      setActiveProvider(data[0].id);
      const forms = {};
      data.forEach(s => { forms[s.id] = { ...s }; });
      setEditForms(forms);
    }
  }).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleSave = (id) => {
    const form = editForms[id];
    if (!form) return;
    fetch("/api/settings/" + id, { method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, max_tokens: parseInt(form.max_tokens) || 4096 })
    }).then(() => { alert("保存成功!"); load(); });
  };

  const toggleShowKey = (id) => setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));

  const providerColors = {
    "Google Gemini": "#4285f4",
    "OpenAI": "#10a37f",
    "Anthropic Claude": "#d97706",
    "xAI Grok": "#1d9bf0",
    "Mistral": "#ff6f00",
    "XiaoMi MiMo": "#ff6900"
  };

  const active = settings.find(s => s.id === activeProvider);
  const activeForm = active ? editForms[active.id] : null;

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, background: "rgba(245,166,35,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SettingsIcon size={24} color="var(--accent-yellow)" />
          </div>
          <div>
            <h2>AI API 配置</h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>配置 Gemini、OpenAI、Anthropic 等 AI 服务的 API 密钥</p>
          </div>
        </div>
      </div>

      {/* Provider tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {settings.map(s => (
          <button key={s.id} onClick={() => setActiveProvider(s.id)}
            style={{ padding: "8px 16px", borderRadius: 8, border: activeProvider === s.id ? "2px solid " + (providerColors[s.provider] || "var(--accent-yellow)") : "1px solid var(--border-color)", background: activeProvider === s.id ? (providerColors[s.provider] || "var(--accent-yellow)") + "20" : "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.enabled ? "#4ade80" : "#ef4444" }} />
            {s.provider}
          </button>
        ))}
      </div>

      {/* Active provider config */}
      {active && activeForm && (
        <div className="info-card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: (providerColors[active.provider] || "#333") + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: providerColors[active.provider] || "#fff" }}>
              {active.provider[0]}
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>{active.provider}</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>配置 {active.provider} API 进行 AI 写作和诊断</p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <span className={\`badge \${activeForm.enabled ? "badge-success" : "badge-danger"}\`}>{activeForm.enabled ? "已启用" : "未启用"}</span>
            </div>
          </div>

          <div className="form-group">
            <label>API Key</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="form-input" type={showKeys[active.id] ? "text" : "password"} value={activeForm.api_key || ""} onChange={e => setEditForms(prev => ({ ...prev, [active.id]: { ...prev[active.id], api_key: e.target.value } }))} placeholder={"输入 " + active.provider + " API Key..."} style={{ flex: 1 }} />
              <button className="btn btn-secondary" onClick={() => toggleShowKey(active.id)} style={{ padding: "8px 12px" }}>{showKeys[active.id] ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </div>

          <div className="form-group">
            <label>API 地址</label>
            <input className="form-input" value={activeForm.api_url || ""} onChange={e => setEditForms(prev => ({ ...prev, [active.id]: { ...prev[active.id], api_url: e.target.value } }))} />
          </div>

          <div className="form-group">
            <label>模型</label>
            <input className="form-input" value={activeForm.model || ""} onChange={e => setEditForms(prev => ({ ...prev, [active.id]: { ...prev[active.id], model: e.target.value } }))} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label>最大Token数</label>
              <input className="form-input" type="number" value={activeForm.max_tokens || 4096} onChange={e => setEditForms(prev => ({ ...prev, [active.id]: { ...prev[active.id], max_tokens: e.target.value } }))} />
            </div>
            <div className="form-group">
              <label>启用状态</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                <span style={{ color: activeForm.enabled ? "var(--text-secondary)" : "var(--accent-red)", fontSize: 13 }}>禁用</span>
                <div onClick={() => setEditForms(prev => ({ ...prev, [active.id]: { ...prev[active.id], enabled: !prev[active.id].enabled } }))}
                  style={{ width: 48, height: 24, borderRadius: 12, background: activeForm.enabled ? "var(--accent-yellow)" : "#444", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: activeForm.enabled ? 26 : 2, transition: "left 0.2s" }} />
                </div>
                <span style={{ color: activeForm.enabled ? "var(--accent-yellow)" : "var(--text-secondary)", fontSize: 13 }}>启用</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button className="btn btn-primary" onClick={() => handleSave(active.id)}><Save size={16} /> 保存 {active.provider} 配置</button>
            <button className="btn btn-secondary" onClick={load}><RefreshCw size={16} /> 重置</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Settings;
`, 'utf8');
console.log('Settings.jsx written');

// ===== Backlinks.jsx =====
fs.writeFileSync(P + '/Backlinks.jsx', `import React, { useState, useEffect } from "react";
import { Link, Plus, Trash2, Edit3, ExternalLink, CheckCircle, Clock, AlertCircle } from "lucide-react";

function Backlinks() {
  const [backlinks, setBacklinks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ source_url: "", target_url: "", anchor_text: "", link_type: "dofollow", da_score: 0 });

  const load = () => fetch("/api/backlinks").then(r => r.json()).then(setBacklinks).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSubmit = () => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? "/api/backlinks/" + editItem.id : "/api/backlinks";
    fetch(url, { method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, da_score: parseInt(form.da_score) || 0 })
    }).then(() => { setShowForm(false); setEditItem(null); setForm({ source_url: "", target_url: "", anchor_text: "", link_type: "dofollow", da_score: 0 }); load(); });
  };
  const handleEdit = (b) => { setEditItem(b); setForm({ source_url: b.source_url, target_url: b.target_url, anchor_text: b.anchor_text, link_type: b.link_type, da_score: b.da_score }); setShowForm(true); };
  const handleDelete = (id) => { if (confirm("确定删除?")) fetch("/api/backlinks/" + id, { method: "DELETE" }).then(load); };

  const total = backlinks.length;
  const valid = backlinks.filter(b => b.status === "valid").length;
  const dofollow = backlinks.filter(b => b.link_type === "dofollow").length;
  const highDA = backlinks.filter(b => (b.da_score || 0) >= 70).length;

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, background: "rgba(245,166,35,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Link size={24} color="var(--accent-yellow)" />
          </div>
          <div><h2>外链管理</h2><p style={{ fontSize: 14, color: "var(--text-secondary)" }}>管理来自权威媒体和社交媒体的高质量外链</p></div>
        </div>
      </div>

      {/* Add form */}
      <div className="info-card" style={{ marginBottom: 20 }}>
        <h4 style={{ display: "flex", alignItems: "center", gap: 8 }}><Plus size={16} color="var(--accent-yellow)" /> 添加外链</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", gap: 12, marginTop: 12, alignItems: "end" }}>
          <div className="form-group" style={{ margin: 0 }}><label>来源URL</label><input className="form-input" value={form.source_url} onChange={e => setForm({...form, source_url: e.target.value})} placeholder="https://news.example.com/article" /></div>
          <div className="form-group" style={{ margin: 0 }}><label>目标URL</label><input className="form-input" value={form.target_url} onChange={e => setForm({...form, target_url: e.target.value})} placeholder="https://yoursite.com/page" /></div>
          <div className="form-group" style={{ margin: 0 }}><label>锚文本</label><input className="form-input" value={form.anchor_text} onChange={e => setForm({...form, anchor_text: e.target.value})} placeholder="品牌名" /></div>
          <div className="form-group" style={{ margin: 0 }}><label>类型</label><select className="form-input" value={form.link_type} onChange={e => setForm({...form, link_type: e.target.value})} style={{ width: 120 }}>
            <option value="dofollow">Dofollow</option><option value="nofollow">Nofollow</option>
          </select></div>
          <button className="btn btn-primary" onClick={handleSubmit} style={{ height: 42 }}>{editItem ? "更新" : "添加外链"}</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat-block"><div className="stat-label">总外链</div><div className="stat-value yellow">{total}</div></div>
        <div className="stat-block"><div className="stat-label">有效外链</div><div className="stat-value" style={{ color: "#4ade80" }}>{valid}</div></div>
        <div className="stat-block"><div className="stat-label">Dofollow</div><div className="stat-value" style={{ color: "#60a5fa" }}>{dofollow}</div></div>
        <div className="stat-block"><div className="stat-label">高DA(70+)</div><div className="stat-value yellow">{highDA}</div></div>
      </div>

      {/* Table */}
      <div className="info-card">
        <h4>外链列表</h4>
        <table className="data-table" style={{ marginTop: 12 }}>
          <thead><tr><th>来源域名</th><th>来源URL</th><th>锚文本</th><th>DA</th><th>类型</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {backlinks.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>暂无数据</td></tr>
            ) : backlinks.map(b => (
              <tr key={b.id}>
                <td>{new URL(b.source_url).hostname}</td>
                <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.source_url}</td>
                <td>{b.anchor_text}</td>
                <td><span style={{ color: (b.da_score || 0) >= 70 ? "var(--accent-green)" : "var(--text-primary)" }}>{b.da_score}</span></td>
                <td><span className={\`badge \${b.link_type === "dofollow" ? "badge-success" : "badge-info"}\`}>{b.link_type}</span></td>
                <td><span className="badge badge-warning">{b.status || "pending"}</span></td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => handleEdit(b)}><Edit3 size={12} /></button>
                  <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12, color: "var(--accent-red)" }} onClick={() => handleDelete(b.id)}><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Backlinks;
`, 'utf8');
console.log('Backlinks.jsx written');

console.log('Batch Settings+Backlinks done');