import React, { useState, useEffect } from "react";
import { Send, Globe, MapPin, CheckSquare, Square, FileText, Sparkles, RefreshCw, ChevronDown } from "lucide-react";

function MediaPublish() {
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [activeRegion, setActiveRegion] = useState("全部");
  const [form, setForm] = useState({ brand_name: "", language: "zh", linked_article: "", title: "", content: "" });
  const [articles, setArticles] = useState([]);
  const [releases, setReleases] = useState([]);
  const [showRecords, setShowRecords] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadMedia = () => fetch("/api/media-outlets").then(r => r.json()).then(data => setMedia(Array.isArray(data) ? data : [])).catch(() => {});
  const loadReleases = () => fetch("/api/press-releases").then(r => r.json()).then(data => setReleases(Array.isArray(data) ? data : [])).catch(() => {});
  const loadArticles = () => fetch("/api/articles").then(r => r.json()).then(data => setArticles(Array.isArray(data) ? data : [])).catch(() => {});
  useEffect(() => { loadMedia(); loadReleases(); loadArticles(); }, []);

  const regions = ["全部地区", ...new Set(media.map(m => m.region).filter(Boolean))];
  const filtered = media.filter(m => activeRegion === "全部地区" || m.region === activeRegion);

  const toggleMedia = (id) => {
    setSelectedMedia(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAiGenerate = () => {
    if (!form.brand_name.trim()) return alert("请先输入品牌名称");
    setIsGenerating(true);
    setTimeout(() => {
      setForm(prev => ({
        ...prev,
        title: `${form.brand_name}发布重大战略升级，引领行业创新发展`,
        content: `${form.brand_name}今日宣布全面战略升级，推出多项创新举措。\n\n此次升级涵盖产品、技术和服务三大核心领域，旨在为用户提供更优质的体验。\n\n${form.brand_name}CEO表示："我们始终坚持以用户为中心，此次战略升级将为客户带来更大价值。"\n\n据了解，此次升级将在未来6个月内逐步落地，预计将覆盖全球主要市场。`,
      }));
      setIsGenerating(false);
    }, 2000);
  };

  const handleSubmit = () => {
    if (!form.brand_name || !form.title || !form.content) return alert("请填写完整信息");
    fetch("/api/press-releases", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, media_ids: selectedMedia.join(","), status: "submitted" })
    }).then(() => { alert("发布成功!"); setForm({ brand_name: "", language: "zh", linked_article: "", title: "", content: "" }); setSelectedMedia([]); loadReleases(); });
  };

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none" };
  const labelStyle = { fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-secondary)" };

  return (
    <div className="page" >
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, background: "rgba(245,140,50,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={24} color="#f48c06" />
          </div>
          <div>
            <h2>权威媒体新闻发布</h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>整合全球55+权威媒体资源，一键发布新闻稿</p>
          </div>
        </div>
        <button onClick={() => setShowRecords(!showRecords)} style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
          📋 发布记录 ({releases.length})
        </button>
      </div>

      {/* Region Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {regions.map(r => (
          <button key={r} onClick={() => setActiveRegion(r)} style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, background: activeRegion === r ? "var(--accent-yellow)" : "var(--bg-card)", color: activeRegion === r ? "#000" : "var(--text-secondary)" }}>
            {r}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, alignItems: "start" }}>
        {/* Media Grid */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600 }}>
              <div style={{ width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2 }} />
              选择权威媒体
            </div>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>已选 <span style={{ color: "var(--accent-yellow)", fontWeight: 600 }}>{selectedMedia.length}</span> 个媒体</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {filtered.map(m => (
              <div key={m.id} onClick={() => toggleMedia(m.id)}
                style={{ padding: 16, background: selectedMedia.includes(m.id) ? "rgba(245,166,35,0.08)" : "var(--bg-secondary)", border: selectedMedia.includes(m.id) ? "2px solid var(--accent-yellow)" : "1px solid var(--border-color)", borderRadius: 12, cursor: "pointer", transition: "all 0.2s", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  {selectedMedia.includes(m.id) ? <CheckSquare size={18} color="var(--accent-yellow)" /> : <Square size={18} color="var(--text-secondary)" />}
                  <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, background: "rgba(245,166,35,0.2)", color: "var(--accent-yellow)", fontWeight: 500 }}>推荐</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10 }}>{m.domain || m.name}</div>
                <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                  <span>DA: <strong style={{ color: (m.da_score || 0) >= 90 ? "var(--accent-green)" : "var(--text-primary)" }}>{m.da_score || 0}</strong></span>
                  <span>{m.monthly_traffic || "—"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12 }}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(100,150,255,0.1)", color: "#6096ff" }}>{m.category || "权威媒体"}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{m.response_time || "48h"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Press Release Form */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 24, position: "sticky", top: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, marginBottom: 20 }}>
            <div style={{ width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2 }} />
            新闻稿内容
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>品牌名称</label>
            <input value={form.brand_name} onChange={e => setForm(p => ({ ...p, brand_name: e.target.value }))} placeholder="输入品牌名称" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>语言</label>
            <div style={{ position: "relative" }}>
              <select value={form.language} onChange={e => setForm(p => ({ ...p, language: e.target.value }))} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                <option value="zh">中文</option><option value="en">English</option><option value="ja">日本語</option>
              </select>
              <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-secondary)" }} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>关联文章 (可选)</label>
            <div style={{ position: "relative" }}>
              <select value={form.linked_article} onChange={e => setForm(p => ({ ...p, linked_article: e.target.value }))} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                <option value="">选择已有文章</option>
                {articles.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
              <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-secondary)" }} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>新闻稿标题</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="输入新闻稿标题" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 6 }}>
            <label style={labelStyle}>新闻稿内容</label>
            <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="输入新闻稿内容..." rows={8} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "var(--text-secondary)", marginBottom: 16 }}>{(form.content || "").length} / 10000</div>

          <button onClick={handleAiGenerate} disabled={isGenerating} style={{ width: "100%", padding: "8px 0", borderRadius: 8, border: "1px solid var(--accent-yellow)", background: "transparent", color: "var(--accent-yellow)", cursor: isGenerating ? "wait" : "pointer", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 12 }}>
            {isGenerating ? <><RefreshCw size={14} className="spin" /> 生成中...</> : <><Sparkles size={14} /> AI辅助生成新闻稿</>}
          </button>

          <button onClick={handleSubmit} disabled={selectedMedia.length === 0}
            style={{ width: "100%", padding: "10px 0", borderRadius: 8, background: selectedMedia.length > 0 ? "var(--accent-yellow)" : "var(--bg-secondary)", color: selectedMedia.length > 0 ? "#000" : "var(--text-secondary)", border: "none", cursor: selectedMedia.length > 0 ? "pointer" : "not-allowed", fontWeight: 600, fontSize: 14 }}>
            发布到 {selectedMedia.length} 个媒体
          </button>
        </div>
      </div>

      {/* Records */}
      {showRecords && (
        <div style={{ marginTop: 20, background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>发布记录</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead><tr style={{ borderBottom: "1px solid var(--border-color)" }}>
              {["标题", "品牌", "语言", "媒体数", "状态", "时间"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 500, color: "var(--text-secondary)", fontSize: 13 }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {releases.length === 0 ? <tr><td colSpan={6} style={{ textAlign: "center", padding: "30px 0", color: "var(--text-secondary)" }}>暂无发布记录</td></tr>
              : releases.map(r => (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "10px 14px" }}>{r.title}</td>
                  <td style={{ padding: "10px 14px" }}>{r.brand_name}</td>
                  <td style={{ padding: "10px 14px" }}>{r.language}</td>
                  <td style={{ padding: "10px 14px" }}>{(r.media_ids || "").split(",").filter(Boolean).length}</td>
                  <td style={{ padding: "10px 14px" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: r.status === "published" ? "rgba(74,222,128,0.15)" : "rgba(245,166,35,0.15)", color: r.status === "published" ? "var(--accent-green)" : "var(--accent-yellow)" }}>{r.status}</span></td>
                  <td style={{ padding: "10px 14px", color: "var(--text-secondary)" }}>{r.created_at?.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MediaPublish;
