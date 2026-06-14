import React, { useState, useEffect } from "react";
import { Copy, TrendingUp, Search, Plus, Trash2, Edit3, ExternalLink, Eye } from "lucide-react";

function HotCopy() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: "", source: "", heat: 50, keywords: "", url: "" });

  const load = () => fetch("/api/hot-copies").then(r => r.json()).then(data => setArticles(Array.isArray(data) ? data : [])).catch(() => {});
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

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none" };
  const labelStyle = { fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-secondary)" };

  return (
    <div className="page" >
      <div className="page-header">
        <h2>热文管理</h2>
        <button onClick={() => { setEditItem(null); setForm({ title: "", source: "", heat: 50, keywords: "", url: "" }); setShowForm(true); }}
          style={{ padding: "8px 16px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500, fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
          <Plus size={14} /> 添加热文
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="搜索热文关键词..."
          style={{ ...inputStyle, paddingLeft: 36, maxWidth: 400 }} />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 32, width: 480 }}>
            <h3 style={{ marginBottom: 20 }}>{editItem ? "编辑热文" : "新增热文"}</h3>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>标题</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} /></div>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>来源</label><input value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} style={inputStyle} /></div>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>热度</label><input type="number" value={form.heat} onChange={e => setForm(p => ({ ...p, heat: e.target.value }))} style={inputStyle} /></div>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>关键词 (逗号分隔)</label><input value={form.keywords} onChange={e => setForm(p => ({ ...p, keywords: e.target.value }))} style={inputStyle} /></div>
            <div style={{ marginBottom: 20 }}><label style={labelStyle}>URL</label><input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} style={inputStyle} /></div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}>取消</button>
              <button onClick={handleSubmit} style={{ padding: "8px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500 }}>{editItem ? "保存" : "创建"}</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
            <Copy size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <p>暂无热文数据</p>
          </div>
        ) : filtered.map(article => (
          <div key={article.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 10, transition: "border-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent-yellow)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-color)"}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: (article.heat || 0) >= 80 ? "rgba(245,166,35,0.15)" : "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <TrendingUp size={20} color={(article.heat || 0) >= 80 ? "var(--accent-yellow)" : "var(--text-secondary)"} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{article.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--text-secondary)" }}>
                <span>{article.source}</span>
                <span>·</span>
                <span style={{ color: "var(--accent-yellow)" }}>热度 {article.heat}</span>
                <div style={{ display: "flex", gap: 4 }}>{(article.keywords || "").split(",").filter(Boolean).map(k => <span key={k} style={{ padding: "1px 6px", borderRadius: 4, fontSize: 10, background: "rgba(245,166,35,0.1)", color: "var(--accent-yellow)" }}>{k}</span>)}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={() => handleCopy(article.id, article.title)} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid var(--border-color)", background: copiedId === article.id ? "var(--accent-yellow)" : "transparent", color: copiedId === article.id ? "#000" : "var(--text-primary)", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                <Copy size={12} /> {copiedId === article.id ? "已复制" : "复制标题"}
              </button>
              <button onClick={() => handleEdit(article)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}><Edit3 size={14} /></button>
              <button onClick={() => handleDelete(article.id)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--accent-red)", background: "transparent", color: "var(--accent-red)", cursor: "pointer" }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HotCopy;
