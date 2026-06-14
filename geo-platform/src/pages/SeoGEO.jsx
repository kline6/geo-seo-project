import React, { useState, useEffect } from "react";
import { Search, TrendingUp, Target, Plus, Trash2, Edit3, BarChart3 } from "lucide-react";

function SeoGEO() {
  const [keywords, setKeywords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ keyword: "", volume: 0, visibility: 0, position: 0, status: "active" });

  const load = () => fetch("/api/seo-keywords").then(r => r.json()).then(data => setKeywords(Array.isArray(data) ? data : [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const filtered = keywords.filter(k => k.keyword.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalVol = keywords.reduce((s, k) => s + (k.volume || 0), 0);
  const avgVis = keywords.length ? Math.round(keywords.reduce((s, k) => s + (k.visibility || 0), 0) / keywords.length) : 0;
  const avgPos = keywords.length ? (keywords.reduce((s, k) => s + (k.position || 0), 0) / keywords.length).toFixed(1) : "—";

  const handleSubmit = () => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? "/api/seo-keywords/" + editItem.id : "/api/seo-keywords";
    fetch(url, { method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, volume: parseInt(form.volume), visibility: parseInt(form.visibility), position: parseInt(form.position) })
    }).then(() => { setShowForm(false); setEditItem(null); setForm({ keyword: "", volume: 0, visibility: 0, position: 0, status: "active" }); load(); });
  };

  const handleDelete = (id) => { if (confirm("确定删除此关键词?")) fetch("/api/seo-keywords/" + id, { method: "DELETE" }).then(load); };

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none" };
  const labelStyle = { fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-secondary)" };
  const sectionBar = { width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2, flexShrink: 0 };

  return (
    <div className="page" >
      <div className="page-header">
        <h2>SEO & GEO</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>关键词管理与 AI 搜索引擎优化分析</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "监控关键词", value: keywords.length, icon: Target, color: "var(--accent-yellow)" },
          { label: "平均可见度", value: avgVis + "%", icon: TrendingUp, color: "var(--accent-yellow)" },
          { label: "平均排名", value: "#" + avgPos, icon: BarChart3, color: "var(--accent-yellow)" },
          { label: "总搜索量", value: totalVol.toLocaleString(), icon: Search, color: "var(--accent-yellow)" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(245,166,35,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={18} color={s.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search + Add */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="搜索关键词..."
            style={{ ...inputStyle, paddingLeft: 36 }} />
        </div>
        <button onClick={() => { setEditItem(null); setForm({ keyword: "", volume: 0, visibility: 0, position: 0, status: "active" }); setShowForm(true); }}
          style={{ padding: "8px 16px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500, fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
          <Plus size={14} /> 添加关键词
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 32, width: 480 }}>
            <h3 style={{ marginBottom: 20 }}>{editItem ? "编辑关键词" : "添加关键词"}</h3>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>关键词</label><input value={form.keyword} onChange={e => setForm(p => ({ ...p, keyword: e.target.value }))} style={inputStyle} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div><label style={labelStyle}>月搜索量</label><input type="number" value={form.volume} onChange={e => setForm(p => ({ ...p, volume: e.target.value }))} style={inputStyle} /></div>
              <div><label style={labelStyle}>可见度 (%)</label><input type="number" value={form.visibility} onChange={e => setForm(p => ({ ...p, visibility: e.target.value }))} style={inputStyle} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div><label style={labelStyle}>当前排名</label><input type="number" value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} style={inputStyle} /></div>
              <div><label style={labelStyle}>状态</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                  <option value="active">活跃</option><option value="monitoring">监控中</option><option value="inactive">已暂停</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}>取消</button>
              <button onClick={handleSubmit} style={{ padding: "8px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500 }}>{editItem ? "保存" : "添加"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead><tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            {["关键词", "月搜索量", "可见度", "当前排名", "状态", "操作"].map(h => (
              <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "var(--text-secondary)", fontSize: 13 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>暂无关键词数据</td></tr>
            ) : filtered.map(k => (
              <tr key={k.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "12px 16px", fontWeight: 500 }}>{k.keyword}</td>
                <td style={{ padding: "12px 16px", color: "var(--accent-yellow)" }}>{(k.volume || 0).toLocaleString()}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 80, height: 6, borderRadius: 3, background: "var(--bg-secondary)", overflow: "hidden" }}>
                      <div style={{ width: k.visibility + "%", height: "100%", borderRadius: 3, background: k.visibility >= 70 ? "var(--accent-green)" : k.visibility >= 50 ? "var(--accent-yellow)" : "var(--accent-red)" }} />
                    </div>
                    <span>{k.visibility}%</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>#{k.position}</td>
                <td style={{ padding: "12px 16px" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: k.status === "active" ? "rgba(74,222,128,0.15)" : k.status === "monitoring" ? "rgba(245,166,35,0.15)" : "rgba(100,150,255,0.1)", color: k.status === "active" ? "var(--accent-green)" : k.status === "monitoring" ? "var(--accent-yellow)" : "#6096ff" }}>{k.status === "active" ? "活跃" : k.status === "monitoring" ? "监控中" : "已暂停"}</span></td>
                <td style={{ padding: "12px 16px", display: "flex", gap: 6 }}>
                  <button onClick={() => { setEditItem(k); setForm({ keyword: k.keyword, volume: k.volume, visibility: k.visibility, position: k.position, status: k.status }); setShowForm(true); }}
                    style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontSize: 12 }}><Edit3 size={12} /></button>
                  <button onClick={() => handleDelete(k.id)}
                    style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--accent-red)", background: "transparent", color: "var(--accent-red)", cursor: "pointer", fontSize: 12 }}><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SeoGEO;
