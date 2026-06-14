import React, { useState, useEffect } from "react";
import { Send, Globe, Plus, Trash2, Edit3, ExternalLink, Share2 } from "lucide-react";

function Publish() {
  const [articles, setArticles] = useState([]);
  const [platformsList, setPlatformsList] = useState([]);
  const [activeTab, setActiveTab] = useState("articles");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: "", platform: "微信公众号", status: "draft", views: 0 });

  const loadArticles = () => fetch("/api/publishes").then(r => r.json()).then(data => setArticles(Array.isArray(data) ? data : [])).catch(() => {});
  const loadPlatforms = () => fetch("/api/platforms").then(r => r.json()).then(data => setPlatformsList(Array.isArray(data) ? data : [])).catch(() => {});
  useEffect(() => { loadArticles(); loadPlatforms(); }, []);

  const statusLabel = (s) => ({ published: "已发布", draft: "草稿", reviewing: "审核中" }[s] || s);
  const statusColor = (s) => ({ published: "var(--accent-green)", draft: "var(--accent-yellow)", reviewing: "#6096ff" }[s] || "var(--text-secondary)");

  const handleSubmit = () => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? "/api/publishes/" + editItem.id : "/api/publishes";
    fetch(url, { method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, views: parseInt(form.views) || 0, publish_date: new Date().toISOString().split("T")[0] })
    }).then(() => { setShowForm(false); setEditItem(null); setForm({ title: "", platform: "微信公众号", status: "draft", views: 0 }); loadArticles(); });
  };

  const handleDelete = (id) => { if (confirm("确定删除?")) fetch("/api/publishes/" + id, { method: "DELETE" }).then(loadArticles); };
  const togglePlatform = (p) => { fetch("/api/platforms/" + p.id, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, connected: !p.connected }) }).then(loadPlatforms); };

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none" };
  const labelStyle = { fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-secondary)" };
  const sectionTitle = { display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, marginBottom: 16 };
  const sectionBar = { width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2, flexShrink: 0 };

  return (
    <div className="page" >
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, background: "rgba(99,102,241,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Send size={24} color="#6366f1" />
          </div>
          <div><h2>发布管理</h2><p style={{ color: "var(--text-secondary)", fontSize: 13 }}>多平台内容发布与管理</p></div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "已发布文章", value: articles.filter(a => a.status === "published").length, color: "var(--accent-green)" },
          { label: "总浏览量", value: articles.reduce((s, a) => s + (a.views || 0), 0).toLocaleString(), color: "var(--text-primary)" },
          { label: "已连接平台", value: platformsList.filter(p => p.connected).length, color: "var(--accent-yellow)" },
          { label: "待审核", value: articles.filter(a => a.status === "reviewing").length, color: "#6096ff" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {[{ id: "articles", label: "文章管理", icon: Edit3 }, { id: "platforms", label: "平台接入", icon: Share2 }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, background: activeTab === tab.id ? "rgba(245,166,35,0.15)" : "transparent", color: activeTab === tab.id ? "var(--accent-yellow)" : "var(--text-secondary)" }}>
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "articles" && (
        <>
          <div style={{ textAlign: "right", marginBottom: 16 }}>
            <button onClick={() => { setEditItem(null); setForm({ title: "", platform: "微信公众号", status: "draft", views: 0 }); setShowForm(true); }}
              style={{ padding: "8px 16px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500, fontSize: 13, display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
              <Plus size={14} /> 新建文章
            </button>
          </div>

          {showForm && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 32, width: 480 }}>
                <h3 style={{ marginBottom: 20 }}>{editItem ? "编辑文章" : "新建文章"}</h3>
                <div style={{ marginBottom: 14 }}><label style={labelStyle}>标题</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} /></div>
                <div style={{ marginBottom: 14 }}><label style={labelStyle}>平台</label>
                  <select value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                    {["微信公众号", "知乎专栏", "CSDN", "掘金", "小红书", "微博", "Facebook", "Twitter"].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}><label style={labelStyle}>状态</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                    <option value="draft">草稿</option><option value="reviewing">审核中</option><option value="published">已发布</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button onClick={() => setShowForm(false)} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}>取消</button>
                  <button onClick={handleSubmit} style={{ padding: "8px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500 }}>{editItem ? "保存" : "创建"}</button>
                </div>
              </div>
            </div>
          )}

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead><tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                {["标题", "平台", "状态", "发布日期", "浏览量", "操作"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "var(--text-secondary)", fontSize: 13 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {articles.length === 0 ? <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>暂无文章</td></tr>
                : articles.map(a => (
                  <tr key={a.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 500 }}>{a.title}</td>
                    <td style={{ padding: "12px 16px" }}>{a.platform}</td>
                    <td style={{ padding: "12px 16px" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: statusColor(a.status) + "20", color: statusColor(a.status) }}>{statusLabel(a.status)}</span></td>
                    <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{a.publish_date?.split("T")[0] || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>{(a.views || 0).toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", display: "flex", gap: 6 }}>
                      <button onClick={() => { setEditItem(a); setForm({ title: a.title, platform: a.platform, status: a.status, views: a.views }); setShowForm(true); }}
                        style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontSize: 12 }}><Edit3 size={12} /></button>
                      <button onClick={() => handleDelete(a.id)}
                        style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--accent-red)", background: "transparent", color: "var(--accent-red)", cursor: "pointer", fontSize: 12 }}><Trash2 size={12} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "platforms" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {platformsList.map(p => (
            <div key={p.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>{p.icon}</span>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: 4 }}>{p.name}</div>
                  <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: p.connected ? "rgba(74,222,128,0.15)" : "rgba(245,166,35,0.15)", color: p.connected ? "var(--accent-green)" : "var(--accent-yellow)" }}>{p.connected ? "已连接" : "未连接"}</span>
                </div>
              </div>
              <button onClick={() => togglePlatform(p)} style={{ padding: "6px 14px", borderRadius: 6, border: p.connected ? "1px solid var(--border-color)" : "none", background: p.connected ? "transparent" : "var(--accent-yellow)", color: p.connected ? "var(--text-secondary)" : "#000", cursor: "pointer", fontSize: 13 }}>{p.connected ? "断开" : "接入"}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Publish;
