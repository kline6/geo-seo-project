// Generator script for all GEO Platform pages
const fs = require('fs');
const P = 'E:/iso project/geo-platform/src/pages';

// ===== AiDiagnosis.jsx =====
fs.writeFileSync(P + '/AiDiagnosis.jsx', `import React, { useState, useEffect } from "react";
import { Stethoscope, Search, Plus, FileText, Eye, TrendingUp, AlertTriangle, CheckCircle, Trash2, Edit3 } from "lucide-react";

function AiDiagnosis() {
  const [activeTab, setActiveTab] = useState("reports");
  const [diagnoses, setDiagnoses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", diagnosis_type: "website", status: "pending", score: "" });

  const load = () => fetch("/api/diagnoses").then(r => r.json()).then(setDiagnoses).catch(() => {});
  useEffect(() => { load(); }, []);

  const stats = {
    total: diagnoses.length,
    avg: diagnoses.filter(d => d.score).length ? Math.round(diagnoses.filter(d => d.score).reduce((s, d) => s + d.score, 0) / diagnoses.filter(d => d.score).length) : 0,
    pending: diagnoses.filter(d => d.status === "in_progress" || d.status === "pending").length,
  };

  const handleSubmit = () => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? "/api/diagnoses/" + editItem.id : "/api/diagnoses";
    fetch(url, { method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, score: form.score ? parseInt(form.score) : null })
    }).then(() => { setShowForm(false); setEditItem(null); setForm({ name: "", diagnosis_type: "website", status: "pending", score: "" }); load(); });
  };

  const handleDelete = (id) => {
    if (!confirm("确定删除此诊断?")) return;
    fetch("/api/diagnoses/" + id, { method: "DELETE" }).then(load);
  };

  const handleEdit = (d) => {
    setEditItem(d);
    setForm({ name: d.name, diagnosis_type: d.diagnosis_type || "website", status: d.status, score: d.score || "" });
    setShowForm(true);
  };

  const statusLabel = (s) => ({ completed: "完成", in_progress: "进行中", pending: "待处理" }[s] || s);
  const statusBadge = (s) => ({ completed: "badge-success", in_progress: "badge-warning", pending: "badge-info" }[s] || "badge-info");

  return (
    <div className="page">
      <div className="page-header">
        <h2>AI 诊断</h2>
        <p>分析和诊断您的 AI 可见度状况</p>
      </div>
      <div className="stat-grid">
        <div className="stat-block"><div className="stat-label">总诊断数</div><div className="stat-value yellow">{stats.total}</div></div>
        <div className="stat-block"><div className="stat-label">平均得分</div><div className="stat-value">{stats.avg}</div></div>
        <div className="stat-block"><div className="stat-label">待处理</div><div className="stat-value">{stats.pending}</div></div>
        <div className="stat-block"><div className="stat-label">完成率</div><div className="stat-value yellow">{stats.total ? Math.round(diagnoses.filter(d => d.status === "completed").length / stats.total * 100) : 0}%</div></div>
      </div>
      <div className="tabs">
        <button className={\`tab \${activeTab === "reports" ? "active" : ""}\`} onClick={() => setActiveTab("reports")}><FileText size={14} style={{ marginRight: 6 }} /> 诊断报告</button>
        <button className={\`tab \${activeTab === "new" ? "active" : ""}\`} onClick={() => { setActiveTab("new"); setEditItem(null); setForm({ name: "", diagnosis_type: "website", status: "pending", score: "" }); setShowForm(true); }}><Plus size={14} style={{ marginRight: 6 }} /> 新建诊断</button>
      </div>
      {activeTab === "reports" && (
        <table className="data-table">
          <thead><tr><th>ID</th><th>诊断名称</th><th>类型</th><th>日期</th><th>状态</th><th>得分</th><th>操作</th></tr></thead>
          <tbody>
            {diagnoses.map(d => (
              <tr key={d.id}>
                <td>{d.id}</td><td>{d.name}</td><td>{d.diagnosis_type}</td><td>{d.date?.split("T")[0]}</td>
                <td><span className={\`badge \${statusBadge(d.status)}\`}>{statusLabel(d.status)}</span></td>
                <td>{d.score ? <span style={{ color: d.score >= 70 ? "var(--accent-green)" : "var(--accent-yellow)" }}>{d.score}%</span> : "—"}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => handleEdit(d)}><Edit3 size={12} /></button>
                  <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12, color: "var(--accent-red)" }} onClick={() => handleDelete(d.id)}><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {(activeTab === "new" || showForm) && (
        <div className="info-card" style={{ maxWidth: 500 }}>
          <h4>{editItem ? "编辑诊断" : "新建诊断"}</h4>
          <div className="form-group"><label>诊断名称</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="输入诊断名称..." /></div>
          <div className="form-group"><label>诊断类型</label><select className="form-input" value={form.diagnosis_type} onChange={e => setForm({...form, diagnosis_type: e.target.value})}>
            <option value="website">网站可见度</option><option value="keyword">关键词覆盖</option><option value="competitor">竞争对手</option><option value="content">内容质量</option>
          </select></div>
          <div className="form-group"><label>得分 (可选)</label><input className="form-input" type="number" value={form.score} onChange={e => setForm({...form, score: e.target.value})} placeholder="0-100" /></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={handleSubmit}>{editItem ? "保存" : "创建"}</button>
            <button className="btn btn-secondary" onClick={() => { setShowForm(false); setEditItem(null); }}>取消</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default AiDiagnosis;
`, 'utf8');
console.log('AiDiagnosis.jsx written');

// ===== Materials.jsx =====
fs.writeFileSync(P + '/Materials.jsx', `import React, { useState, useEffect } from "react";
import { FolderOpen, Upload, Search, Image, FileText, Film, Music, Plus, Trash2, Edit3 } from "lucide-react";

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", type: "image", size: "0KB", category: "图片素材" });

  const load = () => fetch("/api/materials").then(r => r.json()).then(setMaterials).catch(() => {});
  useEffect(() => { load(); }, []);

  const categories = ["全部", "图片素材", "文档模板", "视频素材", "数据文件", "音频素材"];
  const filtered = materials.filter(m =>
    (activeCategory === "全部" || m.category === activeCategory) &&
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const typeIcons = { image: Image, document: FileText, video: Film, spreadsheet: FileText, audio: Music };

  const handleSubmit = () => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? "/api/materials/" + editItem.id : "/api/materials";
    fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      .then(() => { setShowForm(false); setEditItem(null); setForm({ name: "", type: "image", size: "0KB", category: "图片素材" }); load(); });
  };

  const handleEdit = (m) => { setEditItem(m); setForm({ name: m.name, type: m.type, size: m.size, category: m.category }); setShowForm(true); };
  const handleDelete = (id) => { if (confirm("确定删除?")) fetch("/api/materials/" + id, { method: "DELETE" }).then(load); };

  return (
    <div className="page">
      <div className="page-header"><h2>素材库</h2><p>管理您的内容素材和资源文件</p></div>
      <div className="stat-grid">
        <div className="stat-block"><div className="stat-label">素材总数</div><div className="stat-value yellow">{materials.length}</div></div>
        <div className="stat-block"><div className="stat-label">图片素材</div><div className="stat-value">{materials.filter(m => m.type === "image").length}</div></div>
        <div className="stat-block"><div className="stat-label">文档模板</div><div className="stat-value">{materials.filter(m => m.type === "document").length}</div></div>
        <div className="stat-block"><div className="stat-label">音频素材</div><div className="stat-value">{materials.filter(m => m.type === "audio").length}</div></div>
      </div>
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-box"><Search size={16} color="#888" /><input placeholder="搜索素材..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
          <div style={{ display: "flex", gap: 6 }}>
            {categories.map(c => (<button key={c} className={\`tab \${activeCategory === c ? "active" : ""}\`} onClick={() => setActiveCategory(c)} style={{ padding: "6px 12px", fontSize: 13 }}>{c}</button>))}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setForm({ name: "", type: "image", size: "0KB", category: "图片素材" }); setShowForm(true); }}><Plus size={16} /> 上传素材</button>
      </div>
      {showForm && (
        <div className="info-card" style={{ maxWidth: 500, marginBottom: 16 }}>
          <h4>{editItem ? "编辑素材" : "新增素材"}</h4>
          <div className="form-group"><label>名称</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div className="form-group"><label>类型</label><select className="form-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
            <option value="image">图片</option><option value="document">文档</option><option value="video">视频</option><option value="spreadsheet">表格</option><option value="audio">音频</option>
          </select></div>
          <div className="form-group"><label>分类</label><select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            {categories.slice(1).map(c => <option key={c}>{c}</option>)}
          </select></div>
          <div className="form-group"><label>大小</label><input className="form-input" value={form.size} onChange={e => setForm({...form, size: e.target.value})} /></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={handleSubmit}>{editItem ? "保存" : "创建"}</button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>取消</button>
          </div>
        </div>
      )}
      <table className="data-table">
        <thead><tr><th>名称</th><th>类型</th><th>分类</th><th>大小</th><th>上传日期</th><th>操作</th></tr></thead>
        <tbody>
          {filtered.map(m => {
            const Icon = typeIcons[m.type] || FileText;
            const typeLabel = { image: "图片", document: "文档", video: "视频", spreadsheet: "表格", audio: "音频" }[m.type] || m.type;
            return (
              <tr key={m.id}>
                <td style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon size={16} color="var(--accent-yellow)" /> {m.name}</td>
                <td>{typeLabel}</td>
                <td><span className="badge badge-info">{m.category}</span></td>
                <td>{m.size}</td>
                <td>{m.upload_date?.split("T")[0]}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => handleEdit(m)}><Edit3 size={12} /></button>
                  <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12, color: "var(--accent-red)" }} onClick={() => handleDelete(m.id)}><Trash2 size={12} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default Materials;
`, 'utf8');
console.log('Materials.jsx written');

// ===== HotCopy.jsx =====
fs.writeFileSync(P + '/HotCopy.jsx', `import React, { useState, useEffect } from "react";
import { Copy, ExternalLink, TrendingUp, Search, RefreshCw, Plus, Trash2, Edit3 } from "lucide-react";

function HotCopy() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: "", source: "", heat: 50, keywords: "", url: "" });

  const load = () => fetch("/api/hot-copies").then(r => r.json()).then(setArticles).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleCopy = (id, title) => { navigator.clipboard?.writeText(title).catch(() => {}); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };
  const filtered = articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()) || (a.keywords || "").toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSubmit = () => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? "/api/hot-copies/" + editItem.id : "/api/hot-copies";
    fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, heat: parseInt(form.heat) }) })
      .then(() => { setShowForm(false); setEditItem(null); setForm({ title: "", source: "", heat: 50, keywords: "", url: "" }); load(); });
  };
  const handleEdit = (a) => { setEditItem(a); setForm({ title: a.title, source: a.source, heat: a.heat, keywords: a.keywords || "", url: a.url || "" }); setShowForm(true); };
  const handleDelete = (id) => { if (confirm("确定删除?")) fetch("/api/hot-copies/" + id, { method: "DELETE" }).then(load); };

  return (
    <div className="page">
      <div className="page-header"><h2>热文复制</h2><p>发现热门内容，一键复制优化标题和关键词</p></div>
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-box"><Search size={16} color="#888" /><input placeholder="搜索热文关键词..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setForm({ title: "", source: "", heat: 50, keywords: "", url: "" }); setShowForm(true); }}><Plus size={16} /> 添加热文</button>
      </div>
      {showForm && (
        <div className="info-card" style={{ maxWidth: 500, marginBottom: 16 }}>
          <h4>{editItem ? "编辑热文" : "新增热文"}</h4>
          <div className="form-group"><label>标题</label><input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
          <div className="form-group"><label>来源</label><input className="form-input" value={form.source} onChange={e => setForm({...form, source: e.target.value})} /></div>
          <div className="form-group"><label>热度</label><input className="form-input" type="number" value={form.heat} onChange={e => setForm({...form, heat: e.target.value})} /></div>
          <div className="form-group"><label>关键词 (逗号分隔)</label><input className="form-input" value={form.keywords} onChange={e => setForm({...form, keywords: e.target.value})} /></div>
          <div className="form-group"><label>URL</label><input className="form-input" value={form.url} onChange={e => setForm({...form, url: e.target.value})} /></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={handleSubmit}>{editItem ? "保存" : "创建"}</button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>取消</button>
          </div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(article => (
          <div key={article.id} className="info-card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px" }}>
            <div style={{ width: 48, height: 48, background: article.heat >= 90 ? "rgba(245,166,35,0.15)" : "var(--bg-secondary)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <TrendingUp size={20} color={article.heat >= 90 ? "var(--accent-yellow)" : "var(--text-secondary)"} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{article.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "var(--text-secondary)" }}>
                <span>{article.source}</span><span>·</span>
                <span style={{ color: "var(--accent-yellow)" }}>热度 {article.heat}</span><span>·</span>
                <div style={{ display: "flex", gap: 4 }}>{(article.keywords || "").split(",").filter(Boolean).map(k => <span key={k} className="badge badge-info" style={{ fontSize: 11 }}>{k}</span>)}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button className="btn btn-primary" style={{ padding: "6px 14px", fontSize: 13 }} onClick={() => handleCopy(article.id, article.title)}><Copy size={14} /> {copiedId === article.id ? "已复制" : "复制标题"}</button>
              <button className="btn btn-secondary" style={{ padding: "6px 10px", fontSize: 13 }} onClick={() => handleEdit(article)}><Edit3 size={14} /></button>
              <button className="btn btn-secondary" style={{ padding: "6px 10px", fontSize: 13, color: "var(--accent-red)" }} onClick={() => handleDelete(article.id)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default HotCopy;
`, 'utf8');
console.log('HotCopy.jsx written');

// ===== Publish.jsx =====
fs.writeFileSync(P + '/Publish.jsx', `import React, { useState, useEffect } from "react";
import { Send, Globe, Calendar, FileText, Clock, CheckCircle, AlertCircle, Plus, Trash2, Edit3 } from "lucide-react";

function Publish() {
  const [activeTab, setActiveTab] = useState("articles");
  const [articles, setArticles] = useState([]);
  const [platformsList, setPlatformsList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: "", platform: "微信公众号", status: "draft", views: 0 });

  const loadArticles = () => fetch("/api/publishes").then(r => r.json()).then(setArticles).catch(() => {});
  const loadPlatforms = () => fetch("/api/platforms").then(r => r.json()).then(setPlatformsList).catch(() => {});
  useEffect(() => { loadArticles(); loadPlatforms(); }, []);

  const statusLabel = (s) => ({ published: "已发布", draft: "草稿", reviewing: "审核中" }[s] || s);
  const statusBadge = (s) => ({ published: "badge-success", draft: "badge-warning", reviewing: "badge-info" }[s] || "badge-info");

  const handleSubmit = () => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? "/api/publishes/" + editItem.id : "/api/publishes";
    fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, views: parseInt(form.views) || 0, publish_date: new Date().toISOString().split("T")[0] }) })
      .then(() => { setShowForm(false); setEditItem(null); setForm({ title: "", platform: "微信公众号", status: "draft", views: 0 }); loadArticles(); });
  };
  const handleEdit = (a) => { setEditItem(a); setForm({ title: a.title, platform: a.platform, status: a.status, views: a.views }); setShowForm(true); };
  const handleDelete = (id) => { if (confirm("确定删除?")) fetch("/api/publishes/" + id, { method: "DELETE" }).then(loadArticles); };
  const togglePlatform = (p) => { fetch("/api/platforms/" + p.id, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, connected: !p.connected }) }).then(loadPlatforms); };

  return (
    <div className="page">
      <div className="page-header"><h2>发布</h2><p>多平台内容发布与管理</p></div>
      <div className="stat-grid">
        <div className="stat-block"><div className="stat-label">已发布文章</div><div className="stat-value yellow">{articles.filter(a => a.status === "published").length}</div></div>
        <div className="stat-block"><div className="stat-label">总浏览量</div><div className="stat-value">{articles.reduce((s, a) => s + (a.views || 0), 0).toLocaleString()}</div></div>
        <div className="stat-block"><div className="stat-label">已连接平台</div><div className="stat-value yellow">{platformsList.filter(p => p.connected).length}</div></div>
        <div className="stat-block"><div className="stat-label">待审核</div><div className="stat-value">{articles.filter(a => a.status === "reviewing").length}</div></div>
      </div>
      <div className="tabs">
        <button className={\`tab \${activeTab === "articles" ? "active" : ""}\`} onClick={() => setActiveTab("articles")}>文章管理</button>
        <button className={\`tab \${activeTab === "platforms" ? "active" : ""}\`} onClick={() => setActiveTab("platforms")}>平台接入</button>
      </div>
      {activeTab === "articles" && (
        <>
          <div className="toolbar"><div /><button className="btn btn-primary" onClick={() => { setEditItem(null); setForm({ title: "", platform: "微信公众号", status: "draft", views: 0 }); setShowForm(true); }}><Plus size={16} /> 新建文章</button></div>
          {showForm && (
            <div className="info-card" style={{ maxWidth: 500, marginBottom: 16 }}>
              <h4>{editItem ? "编辑文章" : "新建文章"}</h4>
              <div className="form-group"><label>标题</label><input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div className="form-group"><label>平台</label><select className="form-input" value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}>
                {["微信公众号","知乎专栏","CSDN","掘金","小红书","微博"].map(p => <option key={p}>{p}</option>)}
              </select></div>
              <div className="form-group"><label>状态</label><select className="form-input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="draft">草稿</option><option value="reviewing">审核中</option><option value="published">已发布</option>
              </select></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" onClick={handleSubmit}>{editItem ? "保存" : "创建"}</button>
                <button className="btn btn-secondary" onClick={() => setShowForm(false)}>取消</button>
              </div>
            </div>
          )}
          <table className="data-table">
            <thead><tr><th>ID</th><th>标题</th><th>平台</th><th>状态</th><th>发布日期</th><th>浏览量</th><th>操作</th></tr></thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td><td>{a.title}</td><td>{a.platform}</td>
                  <td><span className={\`badge \${statusBadge(a.status)}\`}>{statusLabel(a.status)}</span></td>
                  <td>{a.publish_date?.split("T")[0] || "—"}</td><td>{(a.views || 0).toLocaleString()}</td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => handleEdit(a)}><Edit3 size={12} /></button>
                    <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12, color: "var(--accent-red)" }} onClick={() => handleDelete(a.id)}><Trash2 size={12} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {activeTab === "platforms" && (
        <div className="card-grid">
          {platformsList.map(p => (
            <div key={p.id} className="info-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>{p.icon}</span>
                <div><div style={{ fontSize: 15, fontWeight: 500 }}>{p.name}</div>
                <span className={\`badge \${p.connected ? "badge-success" : "badge-warning"}\`} style={{ marginTop: 4 }}>{p.connected ? "已连接" : "未连接"}</span></div>
              </div>
              <button className={\`btn \${p.connected ? "btn-secondary" : "btn-primary"}\`} style={{ padding: "6px 14px", fontSize: 13 }} onClick={() => togglePlatform(p)}>{p.connected ? "断开" : "接入"}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Publish;
`, 'utf8');
console.log('Publish.jsx written');

console.log('Batch 1 done');