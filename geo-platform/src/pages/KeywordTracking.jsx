import React, { useState, useEffect } from "react";
import { Target, Trophy, BarChart3, TrendingUp, Trash2, RefreshCw, Search } from "lucide-react";

function KeywordTracking() {
  const [keywords, setKeywords] = useState([]);
  const [form, setForm] = useState({ keyword: "", target_url: "" });

  const load = () => fetch("/api/keyword-tracking").then(r => r.json()).then(data => setKeywords(Array.isArray(data) ? data : [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSubmit = () => {
    if (!form.keyword.trim()) return;
    fetch("/api/keyword-tracking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      .then(() => { setForm({ keyword: "", target_url: "" }); load(); });
  };

  const handleDelete = (id) => { if (confirm("确定删除?")) fetch("/api/keyword-tracking/" + id, { method: "DELETE" }).then(load); };

  const total = keywords.length;
  const top10 = keywords.filter(k => (k.google_rank || 0) > 0 && (k.google_rank || 0) <= 10).length;
  const avgRank = total ? Math.round(keywords.reduce((s, k) => s + (k.google_rank || 0), 0) / total) : 0;
  const avgVis = total ? Math.round(keywords.reduce((s, k) => s + (k.geo_visibility || 0), 0) / total) : 0;

  const summaryCards = [
    { label: "追踪关键词", value: total, icon: Target, color: "#f5a623" },
    { label: "前10排名", value: top10, icon: Trophy, color: "#f5a623" },
    { label: "平均排名", value: "#" + avgRank, icon: BarChart3, color: "#f5a623" },
    { label: "平均GEO可见度", value: avgVis + "%", icon: TrendingUp, color: "#f5a623" },
  ];

  const inputStyle = { padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none" };

  return (
    <div className="page" >
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, background: "rgba(74,222,128,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Target size={24} color="var(--accent-green)" />
          </div>
          <div>
            <h2>SEO关键词追踪</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>追踪目标关键词在谷歌搜索和AI引擎中的排名变化</p>
          </div>
        </div>
      </div>

      {/* Add Tracking Form */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
          <div style={{ width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2 }} /> 添加关键词追踪
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 13, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>关键词</label>
            <input value={form.keyword} onChange={e => setForm(p => ({ ...p, keyword: e.target.value }))} placeholder="输入关键词" style={{ ...inputStyle, width: 200 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 13, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>目标URL</label>
            <input value={form.target_url} onChange={e => setForm(p => ({ ...p, target_url: e.target.value }))} placeholder="https://example.com/page" style={{ ...inputStyle, width: 300 }} />
          </div>
          <button onClick={handleSubmit} style={{ padding: "10px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500, fontSize: 14, whiteSpace: "nowrap" }}>添加追踪</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        {summaryCards.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: s.color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={18} color={s.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600 }}>
            <div style={{ width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2 }} /> 关键词列表
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead><tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            {["关键词", "目标URL", "谷歌排名", "GEO可见度", "搜索量", "竞争度", "CPC", "最后检测", "操作"].map(h => (
              <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 500, color: "var(--text-secondary)", fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {keywords.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>暂无数据</td></tr>
            ) : keywords.map(k => (
              <tr key={k.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "12px 14px", fontWeight: 500 }}>{k.keyword}</td>
                <td style={{ padding: "12px 14px", color: "var(--accent-yellow)", fontSize: 12, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.target_url || "—"}</td>
                <td style={{ padding: "12px 14px" }}><span style={{ color: (k.google_rank || 0) <= 10 ? "var(--accent-green)" : "var(--text-primary)", fontWeight: 600 }}>#{k.google_rank || "—"}</span></td>
                <td style={{ padding: "12px 14px" }}><span style={{ color: (k.geo_visibility || 0) > 50 ? "var(--accent-green)" : "var(--accent-red)" }}>{k.geo_visibility || 0}%</span></td>
                <td style={{ padding: "12px 14px", color: "var(--accent-yellow)" }}>{(k.search_volume || 0).toLocaleString()}</td>
                <td style={{ padding: "12px 14px" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: k.competition === "high" ? "rgba(239,68,68,0.15)" : k.competition === "medium" ? "rgba(245,166,35,0.15)" : "rgba(74,222,128,0.15)", color: k.competition === "high" ? "var(--accent-red)" : k.competition === "medium" ? "var(--accent-yellow)" : "var(--accent-green)" }}>{k.competition || "—"}</span></td>
                <td style={{ padding: "12px 14px" }}>${(k.cpc || 0).toFixed(2)}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--text-secondary)" }}>{k.last_checked?.split("T")[0] || "—"}</td>
                <td style={{ padding: "12px 14px" }}>
                  <button onClick={() => handleDelete(k.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--accent-red)", background: "transparent", color: "var(--accent-red)", cursor: "pointer", fontSize: 12 }}><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default KeywordTracking;
