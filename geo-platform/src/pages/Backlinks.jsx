import React, { useState, useEffect } from "react";
import { Link, Plus, Trash2, CheckCircle, ExternalLink, ChevronDown } from "lucide-react";

function Backlinks() {
  const [backlinks, setBacklinks] = useState([]);
  const [form, setForm] = useState({ source_url: "", target_url: "", anchor_text: "", link_type: "dofollow" });

  const load = () => fetch("/api/backlinks").then(r => r.json()).then(data => setBacklinks(Array.isArray(data) ? data : [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSubmit = () => {
    if (!form.source_url || !form.target_url) return;
    fetch("/api/backlinks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, da_score: 0, status: "active" }) })
      .then(() => { setForm({ source_url: "", target_url: "", anchor_text: "", link_type: "dofollow" }); load(); });
  };

  const handleDelete = (id) => { if (confirm("确定删除?")) fetch("/api/backlinks/" + id, { method: "DELETE" }).then(load); };

  const total = backlinks.length;
  const valid = backlinks.filter(b => b.status === "valid" || b.status === "active").length;
  const dofollow = backlinks.filter(b => b.link_type === "dofollow").length;
  const highDA = backlinks.filter(b => (b.da_score || 0) >= 70).length;

  const summaryCards = [
    { label: "总外链", value: total, icon: Link, color: "#f5a623" },
    { label: "有效外链", value: valid, icon: CheckCircle, color: "#4ade80" },
    { label: "Dofollow", value: dofollow, icon: ExternalLink, color: "#f5a623" },
    { label: "高DA(70+)", value: highDA, icon: "🏆", color: "#f5a623" },
  ];

  const inputStyle = { padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none" };

  return (
    <div className="page" >
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, background: "rgba(245,140,50,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Link size={24} color="#f48c06" />
          </div>
          <div>
            <h2>外链管理</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>管理来自权威媒体和社交媒体的高质量外链</p>
          </div>
        </div>
      </div>

      {/* Add Form */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
          <div style={{ width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2 }} /> 添加外链
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4, display: "block" }}>来源URL</label>
            <input value={form.source_url} onChange={e => setForm(p => ({ ...p, source_url: e.target.value }))} placeholder="https://news.example.com/article" style={{ ...inputStyle, width: "100%" }} />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4, display: "block" }}>目标URL</label>
            <input value={form.target_url} onChange={e => setForm(p => ({ ...p, target_url: e.target.value }))} placeholder="https://yoursite.com/page" style={{ ...inputStyle, width: "100%" }} />
          </div>
          <div style={{ width: 140 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4, display: "block" }}>锚文本</label>
            <input value={form.anchor_text} onChange={e => setForm(p => ({ ...p, anchor_text: e.target.value }))} placeholder="品牌名" style={{ ...inputStyle, width: "100%" }} />
          </div>
          <div style={{ width: 140 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4, display: "block" }}>类型</label>
            <div style={{ position: "relative" }}>
              <select value={form.link_type} onChange={e => setForm(p => ({ ...p, link_type: e.target.value }))} style={{ ...inputStyle, width: "100%", appearance: "none", cursor: "pointer" }}>
                <option value="dofollow">Dofollow</option><option value="nofollow">Nofollow</option><option value="sponsored">Sponsored</option><option value="ugc">UGC</option>
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-secondary)" }} />
            </div>
          </div>
          <button onClick={handleSubmit} style={{ padding: "10px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500, fontSize: 14, whiteSpace: "nowrap" }}>添加外链</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        {summaryCards.map(s => (
          <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600 }}>
            <div style={{ width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2 }} /> 外链列表
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead><tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            {["来源域名", "来源URL", "锚文本", "DA", "类型", "状态", "发现时间", "操作"].map(h => (
              <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 500, color: "var(--text-secondary)", fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {backlinks.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>暂无数据</td></tr>
            ) : backlinks.map(b => {
              let domain = "";
              try { domain = new URL(b.source_url).hostname; } catch { domain = b.source_url; }
              return (
                <tr key={b.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "12px 14px" }}>{domain}</td>
                  <td style={{ padding: "12px 14px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, color: "var(--accent-yellow)" }}>{b.source_url}</td>
                  <td style={{ padding: "12px 14px" }}>{b.anchor_text || "—"}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: (b.da_score || 0) >= 70 ? "var(--accent-green)" : "var(--text-primary)" }}>{b.da_score || "—"}</td>
                  <td style={{ padding: "12px 14px" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: b.link_type === "dofollow" ? "rgba(74,222,128,0.15)" : "rgba(100,150,255,0.1)", color: b.link_type === "dofollow" ? "var(--accent-green)" : "#6096ff" }}>{b.link_type}</span></td>
                  <td style={{ padding: "12px 14px" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: (b.status === "active" || b.status === "valid") ? "rgba(74,222,128,0.15)" : "rgba(239,68,68,0.15)", color: (b.status === "active" || b.status === "valid") ? "var(--accent-green)" : "var(--accent-red)" }}>{b.status || "active"}</span></td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--text-secondary)" }}>{b.created_at?.split("T")[0] || "—"}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <button onClick={() => handleDelete(b.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--accent-red)", background: "transparent", color: "var(--accent-red)", cursor: "pointer", fontSize: 12 }}><Trash2 size={12} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Backlinks;
