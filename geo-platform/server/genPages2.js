const fs = require('fs');
const P = 'E:/iso project/geo-platform/src/pages';

// ===== DataAnalysis.jsx =====
fs.writeFileSync(P + '/DataAnalysis.jsx', `import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, TrendingDown, Eye, Users, ArrowUpRight, ArrowDownRight, Plus, Trash2, Edit3 } from "lucide-react";

function DataAnalysis() {
  const [activeTab, setActiveTab] = useState("overview");
  const [weekly, setWeekly] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ day_name: "", visibility: 0, traffic: 0 });

  const load = () => {
    fetch("/api/analysis").then(r => r.json()).then(d => { setWeekly(d.weekly || []); setPlatforms(d.platforms || []); }).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const maxTraffic = Math.max(...weekly.map(d => d.traffic), 1);

  const handleSubmit = () => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? "/api/analysis/" + editItem.id : "/api/analysis";
    fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, visibility: parseInt(form.visibility), traffic: parseInt(form.traffic) }) })
      .then(() => { setShowForm(false); setEditItem(null); setForm({ day_name: "", visibility: 0, traffic: 0 }); load(); });
  };
  const handleEdit = (d) => { setEditItem(d); setForm({ day_name: d.day_name, visibility: d.visibility, traffic: d.traffic }); setShowForm(true); };
  const handleDelete = (id) => { if (confirm("确定删除?")) fetch("/api/analysis/" + id, { method: "DELETE" }).then(load); };

  const handlePlatSubmit = () => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? "/api/platform-analysis/" + editItem.id : "/api/platform-analysis";
    fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, visibility: parseInt(form.visibility) }) })
      .then(() => { setShowForm(false); setEditItem(null); load(); });
  };

  const handlePlatformDelete = (id) => { if (confirm("确定删除?")) fetch("/api/platform-analysis/" + id, { method: "DELETE" }).then(load); };

  const totalTraffic = weekly.reduce((s, d) => s + (d.traffic || 0), 0);
  const avgVis = weekly.length ? Math.round(weekly.reduce((s, d) => s + (d.visibility || 0), 0) / weekly.length) : 0;

  return (
    <div className="page">
      <div className="page-header"><h2>数据分析</h2><p>监控和分析您的 GEO 优化效果</p></div>
      <div className="stat-grid">
        <div className="stat-block"><div className="stat-label">平均可见度</div><div className="stat-value yellow">{avgVis}%</div></div>
        <div className="stat-block"><div className="stat-label">总流量</div><div className="stat-value">{totalTraffic.toLocaleString()}</div></div>
        <div className="stat-block"><div className="stat-label">数据天数</div><div className="stat-value">{weekly.length}</div></div>
        <div className="stat-block"><div className="stat-label">平台数</div><div className="stat-value yellow">{platforms.length}</div></div>
      </div>
      <div className="tabs">
        <button className={\`tab \${activeTab === "overview" ? "active" : ""}\`} onClick={() => { setActiveTab("overview"); setShowForm(false); }}>趋势概览</button>
        <button className={\`tab \${activeTab === "platform" ? "active" : ""}\`} onClick={() => { setActiveTab("platform"); setShowForm(false); }}>平台分析</button>
      </div>
      {activeTab === "overview" && (
        <>
          <div style={{ marginBottom: 12, textAlign: "right" }}>
            <button className="btn btn-primary" onClick={() => { setEditItem(null); setForm({ day_name: "", visibility: 0, traffic: 0 }); setShowForm(true); }}><Plus size={16} /> 添加数据</button>
          </div>
          {showForm && activeTab === "overview" && (
            <div className="info-card" style={{ maxWidth: 400, marginBottom: 16 }}>
              <h4>{editItem ? "编辑数据" : "新增数据"}</h4>
              <div className="form-group"><label>星期</label><select className="form-input" value={form.day_name} onChange={e => setForm({...form, day_name: e.target.value})}>
                {["周一","周二","周三","周四","周五","周六","周日"].map(d => <option key={d}>{d}</option>)}
              </select></div>
              <div className="form-group"><label>可见度</label><input className="form-input" type="number" value={form.visibility} onChange={e => setForm({...form, visibility: e.target.value})} /></div>
              <div className="form-group"><label>流量</label><input className="form-input" type="number" value={form.traffic} onChange={e => setForm({...form, traffic: e.target.value})} /></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" onClick={handleSubmit}>{editItem ? "保存" : "创建"}</button>
                <button className="btn btn-secondary" onClick={() => setShowForm(false)}>取消</button>
              </div>
            </div>
          )}
          <div className="info-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><h4>本周趋势</h4></div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 200 }}>
              {weekly.map(d => (
                <div key={d.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative" }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{d.traffic}</span>
                  <div style={{ width: "100%", height: (d.traffic / maxTraffic) * 160, background: "linear-gradient(to top, var(--accent-yellow), var(--accent-yellow-dark))", borderRadius: "6px 6px 0 0" }} />
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span>{d.day_name}</span>
                    <span style={{ fontSize: 10, cursor: "pointer" }} onClick={() => handleEdit(d)}><Edit3 size={10} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {activeTab === "platform" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <button className="btn btn-primary" onClick={() => { setEditItem(null); setForm({ platform_name: "", visibility: 0, trend: "+0%", is_up: true }); setShowForm(true); }}><Plus size={16} /> 添加平台</button>
          </div>
          {showForm && activeTab === "platform" && (
            <div className="info-card" style={{ maxWidth: 400, marginBottom: 8 }}>
              <h4>{editItem ? "编辑平台" : "新增平台"}</h4>
              <div className="form-group"><label>平台名称</label><input className="form-input" value={form.platform_name || ""} onChange={e => setForm({...form, platform_name: e.target.value})} /></div>
              <div className="form-group"><label>可见度</label><input className="form-input" type="number" value={form.visibility || 0} onChange={e => setForm({...form, visibility: e.target.value})} /></div>
              <div className="form-group"><label>趋势</label><input className="form-input" value={form.trend || "+0%"} onChange={e => setForm({...form, trend: e.target.value})} /></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" onClick={handlePlatSubmit}>{editItem ? "保存" : "创建"}</button>
                <button className="btn btn-secondary" onClick={() => setShowForm(false)}>取消</button>
              </div>
            </div>
          )}
          {platforms.map(p => (
            <div key={p.id} className="info-card" style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 120, fontSize: 14, fontWeight: 500 }}>{p.platform_name}</div>
              <div style={{ flex: 1 }}><div className="progress-bar"><div className={\`fill \${p.visibility >= 70 ? "green" : "yellow"}\`} style={{ width: p.visibility + "%" }} /></div></div>
              <div style={{ width: 60, textAlign: "right", fontSize: 16, fontWeight: 600 }}>{p.visibility}%</div>
              <div style={{ width: 60, textAlign: "right", display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                {p.is_up ? <ArrowUpRight size={14} color="var(--accent-green)" /> : <ArrowDownRight size={14} color="var(--accent-red)" />}
                <span style={{ color: p.is_up ? "var(--accent-green)" : "var(--accent-red)", fontSize: 13 }}>{p.trend}</span>
              </div>
              <button className="btn btn-secondary" style={{ padding: "4px 8px" }} onClick={() => { setEditItem(p); setForm({ platform_name: p.platform_name, visibility: p.visibility, trend: p.trend, is_up: p.is_up }); setShowForm(true); }}><Edit3 size={12} /></button>
              <button className="btn btn-secondary" style={{ padding: "4px 8px", color: "var(--accent-red)" }} onClick={() => handlePlatformDelete(p.id)}><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default DataAnalysis;
`, 'utf8');
console.log('DataAnalysis.jsx written');

// ===== AiWriting.jsx =====
fs.writeFileSync(P + '/AiWriting.jsx', `import React, { useState } from "react";
import { PenTool, Plus, Copy, Wand2, FileText, Save, RefreshCw, Trash2 } from "lucide-react";

function AiWriting() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("professional");
  const [generated, setGenerated] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadHistory = () => fetch("/api/ai-writes").then(r => r.json()).then(setHistory).catch(() => {});
  const handleShowHistory = () => { loadHistory(); setShowHistory(!showHistory); };

  const handleGenerate = () => {
    if (!topic) return;
    setIsGenerating(true);
    setTimeout(() => {
      const content = \`# \${topic}\n\n这是一篇由 AI 生成的关于「\${topic}」的文章。\n\n## 引言\n\n在当今数字时代，\${topic} 已经成为企业和个人关注的焦点。本文将深入探讨相关内容，帮助您更好地理解和应用。\n\n## 核心要点\n\n1. **关键概念**：理解基础原理是成功的第一步\n2. **实践应用**：将理论转化为实际行动\n3. **优化策略**：持续改进以获得最佳效果\n\n## 总结\n\n通过本文的介绍，您应该对 \${topic} 有了更清晰的认识。建议结合实际场景进行深入探索。\n\n---\n*本文由 AI 写作助手生成，建议人工审核后使用。*\`;
      setGenerated(content);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSave = () => {
    if (!generated) return;
    fetch("/api/ai-writes", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: topic, content: generated, keywords, tone, word_count: generated.length })
    }).then(() => { alert("已保存!"); loadHistory(); });
  };

  const handleDelete = (id) => { if (confirm("确定删除?")) fetch("/api/ai-writes/" + id, { method: "DELETE" }).then(loadHistory); };

  return (
    <div className="page">
      <div className="page-header"><h2>AI 写作</h2><p>使用 AI 高效生成优质内容</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="info-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h4>写作配置</h4>
              <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={handleShowHistory}>{showHistory ? "关闭历史" : "历史记录"}</button>
            </div>
            <div className="form-group" style={{ marginTop: 12 }}><label>主题 / 标题</label><input className="form-input" placeholder="输入文章主题..." value={topic} onChange={e => setTopic(e.target.value)} /></div>
            <div className="form-group"><label>关键词（逗号分隔）</label><input className="form-input" placeholder="GEO, SEO, 内容营销..." value={keywords} onChange={e => setKeywords(e.target.value)} /></div>
            <div className="form-group"><label>语气风格</label><select className="form-input" value={tone} onChange={e => setTone(e.target.value)}>
              <option value="professional">专业正式</option><option value="casual">轻松活泼</option><option value="technical">技术深度</option><option value="persuasive">营销推广</option>
            </select></div>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? <><RefreshCw size={16} className="spin" /> 生成中...</> : <><Wand2 size={16} /> AI 生成</>}
            </button>
          </div>
          {showHistory && (
            <div className="info-card"><h4>历史记录 ({history.length})</h4>
              <div style={{ maxHeight: 300, overflowY: "auto", marginTop: 8 }}>
                {history.map(h => (
                  <div key={h.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ cursor: "pointer", flex: 1 }} onClick={() => { setGenerated(h.content); setTopic(h.title); }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{h.title}</div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{h.created_at?.split("T")[0]}</div>
                    </div>
                    <button className="btn btn-secondary" style={{ padding: "2px 6px" }} onClick={() => handleDelete(h.id)}><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="info-card" style={{ minHeight: 400 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h4>内容预览</h4>
            {generated && (
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-secondary" style={{ padding: "4px 12px", fontSize: 12 }} onClick={() => navigator.clipboard?.writeText(generated)}><Copy size={12} /> 复制</button>
                <button className="btn btn-primary" style={{ padding: "4px 12px", fontSize: 12 }} onClick={handleSave}><Save size={12} /> 保存</button>
              </div>
            )}
          </div>
          {generated ? (
            <div style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap", color: "var(--text-primary)" }}>{generated}</div>
          ) : (
            <div className="empty-state" style={{ padding: "60px 20px" }}>
              <div className="empty-icon"><PenTool size={36} /></div>
              <h3>等待生成</h3>
              <p>填写主题后，点击"AI 生成"按钮</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default AiWriting;
`, 'utf8');
console.log('AiWriting.jsx written');

// ===== AiTools.jsx =====
fs.writeFileSync(P + '/AiTools.jsx', `import React, { useState, useEffect } from "react";
import { Wrench, Search, FileText, Globe, Shield, Code, Image, Zap, Clock, TrendingUp, Sparkles, BarChart3, Link, PenTool, Plus, Trash2, Edit3 } from "lucide-react";
import "../styles/pages.css";

const iconMap = { Code, FileText, Globe, Shield, Image, Zap, Link, Search, Sparkles, BarChart3, PenTool, Wrench };

function AiTools() {
  const [tools, setTools] = useState([]);
  const [activeCategory, setActiveCategory] = useState("全部");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", category: "SEO工具", color: "#3b82f6", popularity: 50, uses: 0 });

  const load = () => fetch("/api/ai-tools").then(r => r.json()).then(setTools).catch(() => {});
  useEffect(() => { load(); }, []);

  const categories = ["全部", "SEO工具", "内容工具", "性能工具", "分析工具", "AI工具"];
  const filtered = tools.filter(t => activeCategory === "全部" || t.category === activeCategory);
  const totalUses = tools.reduce((s, t) => s + (t.uses || 0), 0);
  const usedCount = tools.filter(t => (t.uses || 0) > 0).length;

  const handleSubmit = () => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? "/api/ai-tools/" + editItem.id : "/api/ai-tools";
    fetch(url, { method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, popularity: parseInt(form.popularity), uses: parseInt(form.uses), icon: form.icon || "Code" })
    }).then(() => { setShowForm(false); setEditItem(null); setForm({ name: "", description: "", category: "SEO工具", color: "#3b82f6", popularity: 50, uses: 0 }); load(); });
  };
  const handleEdit = (t) => { setEditItem(t); setForm({ name: t.name, description: t.description, category: t.category, color: t.color, popularity: t.popularity, uses: t.uses, icon: t.icon || "Code" }); setShowForm(true); };
  const handleDelete = (id) => { if (confirm("确定删除?")) fetch("/api/ai-tools/" + id, { method: "DELETE" }).then(load); };

  return (
    <div className="page">
      <div className="page-header"><h2>AI 工具</h2><p>智能工具集合，一站式 GEO 和 SEO 优化助手</p></div>
      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 24 }}>
        <div className="stat-block"><div className="stat-label">工具总数</div><div className="stat-value" style={{ color: "var(--accent-yellow)" }}>{tools.length}</div><div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>本月新增</div></div>
        <div className="stat-block"><div className="stat-label">已使用</div><div className="stat-value" style={{ color: "#4ade80" }}>{usedCount}</div><div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>常用 {tools.filter(t => (t.uses||0) > 100).length} 个</div></div>
        <div className="stat-block"><div className="stat-label">使用次数</div><div className="stat-value" style={{ color: "#60a5fa" }}>{totalUses.toLocaleString()}</div><div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>累计</div></div>
        <div className="stat-block"><div className="stat-label">分类数</div><div className="stat-value" style={{ color: "#c084fc" }}>{categories.length - 1}</div><div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>个类别</div></div>
      </div>
      <div className="toolbar">
        <div style={{ display: "flex", gap: 6 }}>
          {categories.map(c => (<button key={c} className={\`tab \${activeCategory === c ? "active" : ""}\`} onClick={() => setActiveCategory(c)}>{c}</button>))}
        </div>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setForm({ name: "", description: "", category: "SEO工具", color: "#3b82f6", popularity: 50, uses: 0, icon: "Code" }); setShowForm(true); }}><Plus size={16} /> 添加工具</button>
      </div>
      {showForm && (
        <div className="info-card" style={{ maxWidth: 500, marginBottom: 16 }}>
          <h4>{editItem ? "编辑工具" : "添加工具"}</h4>
          <div className="form-group"><label>名称</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div className="form-group"><label>描述</label><textarea className="form-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div className="form-group"><label>分类</label><select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            {categories.slice(1).map(c => <option key={c}>{c}</option>)}
          </select></div>
          <div className="form-group"><label>颜色</label><input className="form-input" type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} /></div>
          <div className="form-group"><label>热度</label><input className="form-input" type="number" value={form.popularity} onChange={e => setForm({...form, popularity: e.target.value})} /></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={handleSubmit}>{editItem ? "保存" : "创建"}</button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>取消</button>
          </div>
        </div>
      )}
      <div className="card-grid">
        {filtered.map(tool => {
          const Icon = iconMap[tool.icon] || Code;
          return (
            <div key={tool.id} className="info-card" style={{ cursor: "pointer", transition: "all 0.2s", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, background: (tool.color || "#3b82f6") + "15", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={22} color={tool.color || "#3b82f6"} />
                </div>
                <div style={{ flex: 1 }}><h4 style={{ marginBottom: 4 }}>{tool.name}</h4><span className="badge badge-info" style={{ fontSize: 11 }}>{tool.category}</span></div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="btn btn-secondary" style={{ padding: "4px 6px" }} onClick={() => handleEdit(tool)}><Edit3 size={12} /></button>
                  <button className="btn btn-secondary" style={{ padding: "4px 6px", color: "var(--accent-red)" }} onClick={() => handleDelete(tool.id)}><Trash2 size={12} /></button>
                </div>
              </div>
              <p style={{ marginBottom: 12 }}>{tool.description}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12, fontSize: 12, color: "var(--text-secondary)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><TrendingUp size={12} /> {tool.uses} 次使用</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {tool.last_used || "从未"}</span>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: "var(--text-secondary)" }}>热度</span>
                  <span style={{ color: tool.color }}>{tool.popularity}%</span>
                </div>
                <div className="progress-bar"><div className="fill" style={{ width: tool.popularity + "%", background: tool.color }} /></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default AiTools;
`, 'utf8');
console.log('AiTools.jsx written');

console.log('Batch 2 done');