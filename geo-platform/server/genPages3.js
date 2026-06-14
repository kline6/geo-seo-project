const fs = require('fs');
const P = 'E:/iso project/geo-platform/src/pages';

// ===== SeoGEO.jsx =====
fs.writeFileSync(P + '/SeoGEO.jsx', `import React, { useState, useEffect } from "react";
import { Search, TrendingUp, Globe, Target, Plus, Trash2, Edit3 } from "lucide-react";

function SeoGEO() {
  const [keywords, setKeywords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ keyword: "", volume: 0, visibility: 0, position: 0, status: "active" });

  const load = () => fetch("/api/seo-keywords").then(r => r.json()).then(setKeywords).catch(() => {});
  useEffect(() => { load(); }, []);

  const filtered = keywords.filter(k => k.keyword.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalVol = keywords.reduce((s, k) => s + (k.volume || 0), 0);
  const avgVis = keywords.length ? Math.round(keywords.reduce((s, k) => s + (k.visibility || 0), 0) / keywords.length) : 0;
  const avgPos = keywords.length ? (keywords.reduce((s, k) => s + (k.position || 0), 0) / keywords.length).toFixed(1) : 0;

  const handleSubmit = () => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? "/api/seo-keywords/" + editItem.id : "/api/seo-keywords";
    fetch(url, { method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, volume: parseInt(form.volume), visibility: parseInt(form.visibility), position: parseInt(form.position) })
    }).then(() => { setShowForm(false); setEditItem(null); setForm({ keyword: "", volume: 0, visibility: 0, position: 0, status: "active" }); load(); });
  };
  const handleEdit = (k) => { setEditItem(k); setForm({ keyword: k.keyword, volume: k.volume, visibility: k.visibility, position: k.position, status: k.status }); setShowForm(true); };
  const handleDelete = (id) => { if (confirm("确定删除此关键词?")) fetch("/api/seo-keywords/" + id, { method: "DELETE" }).then(load); };

  return (
    <div className="page">
      <div className="page-header"><h2>SEO & GEO</h2><p>关键词管理与 AI 搜索引擎优化分析</p></div>
      <div className="stat-grid">
        <div className="stat-block"><div className="stat-label">监控关键词</div><div className="stat-value yellow">{keywords.length}</div></div>
        <div className="stat-block"><div className="stat-label">平均可见度</div><div className="stat-value">{avgVis}%</div></div>
        <div className="stat-block"><div className="stat-label">平均排名</div><div className="stat-value yellow">{avgPos}</div></div>
        <div className="stat-block"><div className="stat-label">总搜索量</div><div className="stat-value">{totalVol.toLocaleString()}</div></div>
      </div>
      <div className="tabs">
        <button className="tab active">关键词管理</button>
      </div>
      <div className="toolbar">
        <div className="search-box"><Search size={16} color="#888" /><input placeholder="搜索关键词..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setForm({ keyword: "", volume: 0, visibility: 0, position: 0, status: "active" }); setShowForm(true); }}><Plus size={16} /> 添加关键词</button>
      </div>
      {showForm && (
        <div className="info-card" style={{ maxWidth: 500, marginBottom: 16 }}>
          <h4>{editItem ? "编辑关键词" : "添加关键词"}</h4>
          <div className="form-group"><label>关键词</label><input className="form-input" value={form.keyword} onChange={e => setForm({...form, keyword: e.target.value})} /></div>
          <div className="form-group"><label>月搜索量</label><input className="form-input" type="number" value={form.volume} onChange={e => setForm({...form, volume: e.target.value})} /></div>
          <div className="form-group"><label>可见度 (%)</label><input className="form-input" type="number" value={form.visibility} onChange={e => setForm({...form, visibility: e.target.value})} /></div>
          <div className="form-group"><label>当前排名</label><input className="form-input" type="number" value={form.position} onChange={e => setForm({...form, position: e.target.value})} /></div>
          <div className="form-group"><label>状态</label><select className="form-input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
            <option value="active">活跃</option><option value="monitoring">监控中</option><option value="inactive">已暂停</option>
          </select></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={handleSubmit}>{editItem ? "保存" : "添加"}</button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>取消</button>
          </div>
        </div>
      )}
      <table className="data-table">
        <thead><tr><th>关键词</th><th>月搜索量</th><th>可见度</th><th>当前排名</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          {filtered.map(k => (
            <tr key={k.id}>
              <td style={{ fontWeight: 500 }}>{k.keyword}</td>
              <td>{(k.volume || 0).toLocaleString()}</td>
              <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="progress-bar" style={{ width: 80, height: 6 }}><div className={\`fill \${k.visibility >= 70 ? "green" : k.visibility >= 50 ? "yellow" : "red"}\`} style={{ width: k.visibility + "%" }} /></div>
                <span>{k.visibility}%</span>
              </div></td>
              <td>#{k.position}</td>
              <td><span className={\`badge \${k.status === "active" ? "badge-success" : k.status === "monitoring" ? "badge-warning" : "badge-info"}\`}>{k.status === "active" ? "活跃" : k.status === "monitoring" ? "监控中" : "已暂停"}</span></td>
              <td style={{ display: "flex", gap: 6 }}>
                <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => handleEdit(k)}><Edit3 size={12} /></button>
                <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12, color: "var(--accent-red)" }} onClick={() => handleDelete(k.id)}><Trash2 size={12} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default SeoGEO;
`, 'utf8');
console.log('SeoGEO.jsx written');

// ===== TrustScore.jsx =====
fs.writeFileSync(P + '/TrustScore.jsx', `import React, { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, Info, Shield, Star, TrendingUp, RefreshCw, Plus, Trash2, Edit3 } from "lucide-react";

function TrustScore() {
  const [factors, setFactors] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showFactorForm, setShowFactorForm] = useState(false);
  const [showSuggForm, setShowSuggForm] = useState(false);
  const [editFactor, setEditFactor] = useState(null);
  const [editSugg, setEditSugg] = useState(null);
  const [factorForm, setFactorForm] = useState({ factor_name: "", score: 0, weight: "10%", description: "" });
  const [suggForm, setSuggForm] = useState({ suggestion_text: "", priority: "medium", impact: "+0%" });

  const load = () => {
    fetch("/api/trust").then(r => r.json()).then(d => { setFactors(d.factors || []); setSuggestions(d.suggestions || []); }).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const totalScore = factors.length ? Math.round(factors.reduce((a, f) => a + f.score * parseFloat(f.weight) / 100, 0) * 100) / 100 : 0;
  const grade = totalScore >= 80 ? "A" : totalScore >= 70 ? "B+" : totalScore >= 60 ? "B" : "C";
  const gradeColor = totalScore >= 80 ? "var(--accent-green)" : totalScore >= 70 ? "var(--accent-yellow)" : "var(--accent-red)";

  const handleFactorSubmit = () => {
    const method = editFactor ? "PUT" : "POST";
    const url = editFactor ? "/api/trust/factors/" + editFactor.id : "/api/trust/factors";
    fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...factorForm, score: parseInt(factorForm.score) }) })
      .then(() => { setShowFactorForm(false); setEditFactor(null); load(); });
  };
  const handleSuggSubmit = () => {
    const method = editSugg ? "PUT" : "POST";
    const url = editSugg ? "/api/trust/suggestions/" + editSugg.id : "/api/trust/suggestions";
    fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(suggForm) })
      .then(() => { setShowSuggForm(false); setEditSugg(null); load(); });
  };
  const handleDeleteFactor = (id) => { if (confirm("确定删除?")) fetch("/api/trust/factors/" + id, { method: "DELETE" }).then(load); };
  const handleDeleteSugg = (id) => { if (confirm("确定删除?")) fetch("/api/trust/suggestions/" + id, { method: "DELETE" }).then(load); };

  return (
    <div className="page">
      <div className="page-header"><h2>信任度评分</h2><p>评估您的内容在 AI 搜索中的信任度和权威性</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, marginBottom: 24 }}>
        <div className="info-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
          <div style={{ width: 120, height: 120, borderRadius: "50%", border: \`4px solid \${gradeColor}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: gradeColor }}>{totalScore}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>满分100</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>信任评级：{grade}</div>
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 12 }} onClick={load}><RefreshCw size={16} /> 重新评估</button>
        </div>
        <div className="info-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4>评分因素分析</h4>
            <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => { setEditFactor(null); setFactorForm({ factor_name: "", score: 0, weight: "10%", description: "" }); setShowFactorForm(true); }}><Plus size={12} /> 添加因素</button>
          </div>
          {showFactorForm && (
            <div style={{ padding: "12px 0", borderBottom: "1px solid var(--border-color)" }}>
              <div className="form-group"><label>因素名称</label><input className="form-input" value={factorForm.factor_name} onChange={e => setFactorForm({...factorForm, factor_name: e.target.value})} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div className="form-group"><label>分数</label><input className="form-input" type="number" value={factorForm.score} onChange={e => setFactorForm({...factorForm, score: e.target.value})} /></div>
                <div className="form-group"><label>权重</label><input className="form-input" value={factorForm.weight} onChange={e => setFactorForm({...factorForm, weight: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>描述</label><input className="form-input" value={factorForm.description} onChange={e => setFactorForm({...factorForm, description: e.target.value})} /></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" onClick={handleFactorSubmit}>{editFactor ? "保存" : "添加"}</button>
                <button className="btn btn-secondary" onClick={() => setShowFactorForm(false)}>取消</button>
              </div>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
            {factors.map(f => (
              <div key={f.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 14 }}>{f.factor_name} <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>({f.weight})</span></span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: f.score >= 75 ? "var(--accent-green)" : f.score >= 60 ? "var(--accent-yellow)" : "var(--accent-red)" }}>{f.score}</span>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }} onClick={() => { setEditFactor(f); setFactorForm({ factor_name: f.factor_name, score: f.score, weight: f.weight, description: f.description }); setShowFactorForm(true); }}><Edit3 size={12} /></button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent-red)" }} onClick={() => handleDeleteFactor(f.id)}><Trash2 size={12} /></button>
                  </div>
                </div>
                <div className="progress-bar"><div className={\`fill \${f.score >= 75 ? "green" : f.score >= 60 ? "yellow" : "red"}\`} style={{ width: f.score + "%" }} /></div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{f.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="tabs">
        <button className={\`tab \${activeTab === "overview" ? "active" : ""}\`} onClick={() => setActiveTab("overview")}>优化建议</button>
        <button className={\`tab \${activeTab === "history" ? "active" : ""}\`} onClick={() => setActiveTab("history")}>评分历史</button>
      </div>
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ textAlign: "right" }}>
            <button className="btn btn-primary" onClick={() => { setEditSugg(null); setSuggForm({ suggestion_text: "", priority: "medium", impact: "+0%" }); setShowSuggForm(true); }}><Plus size={16} /> 添加建议</button>
          </div>
          {showSuggForm && (
            <div className="info-card" style={{ marginBottom: 8 }}>
              <div className="form-group"><label>建议内容</label><textarea className="form-input" value={suggForm.suggestion_text} onChange={e => setSuggForm({...suggForm, suggestion_text: e.target.value})} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div className="form-group"><label>优先级</label><select className="form-input" value={suggForm.priority} onChange={e => setSuggForm({...suggForm, priority: e.target.value})}>
                  <option value="high">高</option><option value="medium">中</option><option value="low">低</option>
                </select></div>
                <div className="form-group"><label>预估影响</label><input className="form-input" value={suggForm.impact} onChange={e => setSuggForm({...suggForm, impact: e.target.value})} /></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" onClick={handleSuggSubmit}>{editSugg ? "保存" : "添加"}</button>
                <button className="btn btn-secondary" onClick={() => setShowSuggForm(false)}>取消</button>
              </div>
            </div>
          )}
          {suggestions.map(s => (
            <div key={s.id} className="info-card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.priority === "high" ? "rgba(239,68,68,0.15)" : s.priority === "medium" ? "rgba(245,166,35,0.15)" : "rgba(96,165,250,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {s.priority === "high" ? <AlertTriangle size={16} color="var(--accent-red)" /> : <Info size={16} color={s.priority === "medium" ? "var(--accent-yellow)" : "#60a5fa"} />}
              </div>
              <div style={{ flex: 1, fontSize: 14 }}>{s.suggestion_text}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--accent-green)" }}>{s.impact}</div>
              <span className={\`badge \${s.priority === "high" ? "badge-danger" : s.priority === "medium" ? "badge-warning" : "badge-info"}\`}>{s.priority === "high" ? "高" : s.priority === "medium" ? "中" : "低"}优先</span>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }} onClick={() => { setEditSugg(s); setSuggForm({ suggestion_text: s.suggestion_text, priority: s.priority, impact: s.impact }); setShowSuggForm(true); }}><Edit3 size={12} /></button>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent-red)" }} onClick={() => handleDeleteSugg(s.id)}><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default TrustScore;
`, 'utf8');
console.log('TrustScore.jsx written');

// ===== AiAssistant.jsx =====
fs.writeFileSync(P + '/AiAssistant.jsx', `import React, { useState } from "react";
import { Bot, Send, User, Sparkles, RotateCcw, Copy } from "lucide-react";

const initialMessages = [
  { role: "assistant", content: "你好！我是 GEO 智能助手，可以帮你进行内容优化、关键词分析、AI 可见度诊断等。请问有什么可以帮你的？" },
];

function AiAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    const aiMsg = { role: "assistant", content: "正在分析您的需求...\\n\\n这是一个模拟回复。在实际版本中，这里会接入 AI API 来提供实时的回答和建议。" };
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--header-height) - 48px)" }}>
      <div className="page-header"><h2>AI 智能助手</h2><p>与 AI 对话，获取 GEO 优化建议</p></div>
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 0 16px" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: msg.role === "user" ? "#333" : "var(--accent-yellow)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {msg.role === "user" ? <User size={18} color="#fff" /> : <Bot size={18} color="#000" />}
              </div>
              <div style={{ maxWidth: "70%", padding: "12px 16px", borderRadius: 12, background: msg.role === "user" ? "var(--accent-yellow)" : "var(--bg-card)", color: msg.role === "user" ? "#000" : "var(--text-primary)", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap", border: msg.role !== "user" ? "1px solid var(--border-color)" : "none" }}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, paddingTop: 12, borderTop: "1px solid var(--border-color)" }}>
          <textarea className="form-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="输入你的问题..." rows={2} style={{ flex: 1, minHeight: 48, resize: "none" }} />
          <button className="btn btn-primary" onClick={handleSend} style={{ alignSelf: "flex-end", height: 48 }}><Send size={18} /></button>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {["帮我分析关键词", "如何提高AI可见度", "生成一篇SEO文章"].map(q => (
            <button key={q} className="btn btn-secondary" onClick={() => setInput(q)} style={{ fontSize: 12, padding: "6px 12px" }}><Sparkles size={12} /> {q}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
export default AiAssistant;
`, 'utf8');
console.log('AiAssistant.jsx written');

console.log('Batch 3 done');