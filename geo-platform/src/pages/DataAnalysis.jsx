import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Trash2, Edit3, Globe } from "lucide-react";

function DataAnalysis() {
  const [weekly, setWeekly] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ day_name: "", visibility: 0, traffic: 0 });

  const load = () => {
    fetch("/api/analysis").then(r => r.json()).then(d => { setWeekly(d.weekly || []); setPlatforms(d.platforms || []); }).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const maxTraffic = Math.max(...weekly.map(d => d.traffic || 0), 1);
  const totalTraffic = weekly.reduce((s, d) => s + (d.traffic || 0), 0);
  const avgVis = weekly.length ? Math.round(weekly.reduce((s, d) => s + (d.visibility || 0), 0) / weekly.length) : 0;

  const handleSubmit = () => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? "/api/analysis/" + editItem.id : "/api/analysis";
    fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, visibility: parseInt(form.visibility), traffic: parseInt(form.traffic) }) })
      .then(() => { setShowForm(false); setEditItem(null); load(); });
  };
  const handleDelete = (id) => { if (confirm("确定删除?")) fetch("/api/analysis/" + id, { method: "DELETE" }).then(load); };

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none" };
  const labelStyle = { fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-secondary)" };
  const sectionBar = { width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2, flexShrink: 0 };

  return (
    <div className="page" >
      <div className="page-header">
        <h2>数据分析</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>监控和分析 GEO 优化效果</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "平均可见度", value: avgVis + "%", color: "var(--accent-yellow)" },
          { label: "总流量", value: totalTraffic.toLocaleString(), color: "var(--text-primary)" },
          { label: "数据天数", value: weekly.length, color: "var(--accent-yellow)" },
          { label: "平台数", value: platforms.length, color: "var(--accent-yellow)" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {[{ id: "overview", label: "趋势概览", icon: TrendingUp }, { id: "platform", label: "平台分析", icon: Globe }].map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, background: activeTab === tab.id ? "rgba(245,166,35,0.15)" : "transparent", color: activeTab === tab.id ? "var(--accent-yellow)" : "var(--text-secondary)" }}>
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          <div style={{ textAlign: "right", marginBottom: 16 }}>
            <button onClick={() => { setEditItem(null); setForm({ day_name: "", visibility: 0, traffic: 0 }); setShowForm(true); }}
              style={{ padding: "8px 16px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500, fontSize: 13, display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
              <Plus size={14} /> 添加数据
            </button>
          </div>

          {showForm && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 32, width: 420 }}>
                <h3 style={{ marginBottom: 20 }}>{editItem ? "编辑数据" : "新增数据"}</h3>
                <div style={{ marginBottom: 14 }}><label style={labelStyle}>星期</label>
                  <select value={form.day_name} onChange={e => setForm(p => ({ ...p, day_name: e.target.value }))} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                    {["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  <div><label style={labelStyle}>可见度</label><input type="number" value={form.visibility} onChange={e => setForm(p => ({ ...p, visibility: e.target.value }))} style={inputStyle} /></div>
                  <div><label style={labelStyle}>流量</label><input type="number" value={form.traffic} onChange={e => setForm(p => ({ ...p, traffic: e.target.value }))} style={inputStyle} /></div>
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button onClick={() => setShowForm(false)} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}>取消</button>
                  <button onClick={handleSubmit} style={{ padding: "8px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500 }}>{editItem ? "保存" : "创建"}</button>
                </div>
              </div>
            </div>
          )}

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
              <div style={sectionBar} /> 本周趋势
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 200 }}>
              {weekly.map(d => (
                <div key={d.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{d.traffic}</span>
                  <div style={{ width: "100%", height: (d.traffic / maxTraffic) * 150, background: "linear-gradient(to top, var(--accent-yellow), var(--accent-yellow-dark))", borderRadius: "4px 4px 0 0" }} />
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", textAlign: "center" }}>
                    <div>{d.day_name}</div>
                    <div style={{ marginTop: 2, display: "flex", gap: 4, justifyContent: "center" }}>
                      <span onClick={() => { setEditItem(d); setForm({ day_name: d.day_name, visibility: d.visibility, traffic: d.traffic }); setShowForm(true); }} style={{ cursor: "pointer" }}><Edit3 size={10} /></span>
                      <span onClick={() => handleDelete(d.id)} style={{ cursor: "pointer", color: "var(--accent-red)" }}><Trash2 size={10} /></span>
                    </div>
                  </div>
                </div>
              ))}
              {weekly.length === 0 && <div style={{ width: "100%", textAlign: "center", color: "var(--text-secondary)", padding: 40 }}>暂无数据</div>}
            </div>
          </div>
        </>
      )}

      {activeTab === "platform" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {platforms.map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 20px", background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 10 }}>
              <div style={{ width: 120, fontSize: 14, fontWeight: 500 }}>{p.platform_name}</div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 8, borderRadius: 4, background: "var(--bg-secondary)", overflow: "hidden" }}>
                  <div style={{ width: p.visibility + "%", height: "100%", borderRadius: 4, background: p.visibility >= 70 ? "var(--accent-green)" : "var(--accent-yellow)" }} />
                </div>
              </div>
              <div style={{ width: 60, textAlign: "right", fontSize: 16, fontWeight: 600 }}>{p.visibility}%</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {p.is_up ? <ArrowUpRight size={14} color="var(--accent-green)" /> : <ArrowDownRight size={14} color="var(--accent-red)" />}
                <span style={{ color: p.is_up ? "var(--accent-green)" : "var(--accent-red)", fontSize: 13 }}>{p.trend}</span>
              </div>
            </div>
          ))}
          {platforms.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>暂无平台数据</div>}
        </div>
      )}
    </div>
  );
}

export default DataAnalysis;
