const fs = require('fs');
const P = 'E:/iso project/geo-platform/src/pages';

// ===== KeywordTracking.jsx =====
fs.writeFileSync(P + '/KeywordTracking.jsx', `import React, { useState, useEffect } from "react";
import { Target, Plus, Trash2, Edit3, TrendingUp, BarChart3, Trophy, Search } from "lucide-react";

function KeywordTracking() {
  const [keywords, setKeywords] = useState([]);
  const [form, setForm] = useState({ keyword: "", target_url: "" });

  const load = () => fetch("/api/keyword-tracking").then(r => r.json()).then(setKeywords).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSubmit = () => {
    if (!form.keyword) return;
    fetch("/api/keyword-tracking", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    }).then(() => { setForm({ keyword: "", target_url: "" }); load(); });
  };
  const handleDelete = (id) => { if (confirm("确定删除?")) fetch("/api/keyword-tracking/" + id, { method: "DELETE" }).then(load); };

  const total = keywords.length;
  const top10 = keywords.filter(k => (k.google_rank || 0) > 0 && (k.google_rank || 0) <= 10).length;
  const avgRank = total ? Math.round(keywords.reduce((s, k) => s + (k.google_rank || 0), 0) / total) : 0;
  const avgVis = total ? Math.round(keywords.reduce((s, k) => s + (k.geo_visibility || 0), 0) / total) : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, background: "rgba(74,222,128,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Target size={24} color="var(--accent-green)" />
          </div>
          <div><h2>SEO关键词追踪</h2><p style={{ fontSize: 14, color: "var(--text-secondary)" }}>追踪目标关键词在谷歌搜索和AI引擎中的排名变化</p></div>
        </div>
      </div>

      {/* Add form */}
      <div className="info-card" style={{ marginBottom: 20 }}>
        <h4 style={{ display: "flex", alignItems: "center", gap: 8 }}><Plus size={16} color="var(--accent-yellow)" /> 添加关键词追踪</h4>
        <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "end" }}>
          <div className="form-group" style={{ margin: 0, flex: 1 }}><label>关键词</label><input className="form-input" value={form.keyword} onChange={e => setForm({...form, keyword: e.target.value})} placeholder="输入关键词" /></div>
          <div className="form-group" style={{ margin: 0, flex: 2 }}><label>目标URL</label><input className="form-input" value={form.target_url} onChange={e => setForm({...form, target_url: e.target.value})} placeholder="https://example.com/page" /></div>
          <button className="btn btn-primary" onClick={handleSubmit} style={{ height: 42 }}>添加追踪</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat-block"><div className="stat-label">追踪关键词</div><div className="stat-value yellow">{total}</div></div>
        <div className="stat-block"><div className="stat-label">前10排名</div><div className="stat-value" style={{ color: "#4ade80" }}>{top10}</div></div>
        <div className="stat-block"><div className="stat-label">平均排名</div><div className="stat-value yellow">#{avgRank}</div></div>
        <div className="stat-block"><div className="stat-label">平均GEO可见度</div><div className="stat-value yellow">{avgVis}%</div></div>
      </div>

      {/* Table */}
      <div className="info-card">
        <h4>关键词列表</h4>
        <table className="data-table" style={{ marginTop: 12 }}>
          <thead><tr><th>关键词</th><th>目标URL</th><th>谷歌排名</th><th>GEO可见度</th><th>搜索量</th><th>竞争度</th><th>CPC</th><th>操作</th></tr></thead>
          <tbody>
            {keywords.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>暂无数据</td></tr>
            ) : keywords.map(k => (
              <tr key={k.id}>
                <td style={{ fontWeight: 500 }}>{k.keyword}</td>
                <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.target_url || "—"}</td>
                <td><span style={{ color: (k.google_rank || 0) <= 10 ? "var(--accent-green)" : "var(--text-primary)" }}>#{k.google_rank || "—"}</span></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="progress-bar" style={{ width: 60, height: 6 }}><div className={\`fill \${(k.geo_visibility||0) >= 70 ? "green" : (k.geo_visibility||0) >= 50 ? "yellow" : "red"}\`} style={{ width: (k.geo_visibility || 0) + "%" }} /></div>
                    <span>{k.geo_visibility || 0}%</span>
                  </div>
                </td>
                <td>{(k.search_volume || 0).toLocaleString()}</td>
                <td>{k.competition || 0}</td>
                <td>\${k.cpc || 0}</td>
                <td><button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12, color: "var(--accent-red)" }} onClick={() => handleDelete(k.id)}><Trash2 size={12} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default KeywordTracking;
`, 'utf8');
console.log('KeywordTracking.jsx written');

// ===== MediaPublish.jsx =====
fs.writeFileSync(P + '/MediaPublish.jsx', `import React, { useState, useEffect } from "react";
import { Send, Globe, MapPin, CheckSquare, Square } from "lucide-react";

function MediaPublish() {
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [activeRegion, setActiveRegion] = useState("全部");
  const [form, setForm] = useState({ brand_name: "", language: "zh", title: "", content: "" });
  const [releases, setReleases] = useState([]);
  const [showRecords, setShowRecords] = useState(false);

  const loadMedia = () => fetch("/api/media-outlets").then(r => r.json()).then(setMedia).catch(() => {});
  const loadReleases = () => fetch("/api/press-releases").then(r => r.json()).then(setReleases).catch(() => {});
  useEffect(() => { loadMedia(); loadReleases(); }, []);

  const regions = ["全部", ...new Set(media.map(m => m.region).filter(Boolean))];
  const filtered = media.filter(m => activeRegion === "全部" || m.region === activeRegion);

  const toggleMedia = (id) => {
    setSelectedMedia(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubmit = () => {
    fetch("/api/press-releases", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, media_ids: selectedMedia.join(","), status: "submitted" })
    }).then(() => { alert("发布成功!"); setForm({ brand_name: "", language: "zh", title: "", content: "" }); setSelectedMedia([]); loadReleases(); });
  };

  return (
    <div className="page" style={{ maxWidth: 1200 }}>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, background: "rgba(245,166,35,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Globe size={24} color="var(--accent-yellow)" />
          </div>
          <div><h2>权威媒体新闻发布</h2><p style={{ fontSize: 14, color: "var(--text-secondary)" }}>整合全球55+权威媒体资源，一键发布新闻稿</p></div>
        </div>
        <button className="btn btn-secondary" style={{ marginLeft: "auto" }} onClick={() => setShowRecords(!showRecords)}>发布记录 ({releases.length})</button>
      </div>

      {/* Region tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {regions.map(r => (
          <button key={r} className={\`tab \${activeRegion === r ? "active" : ""}\`} onClick={() => setActiveRegion(r)}>{r}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
        {/* Media list */}
        <div className="info-card">
          <h4>选择权威媒体 <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 400 }}>已选{selectedMedia.length}个媒体</span></h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            {filtered.map(m => (
              <div key={m.id} onClick={() => toggleMedia(m.id)} style={{ padding: 16, background: selectedMedia.includes(m.id) ? "rgba(245,166,35,0.1)" : "var(--bg-secondary)", border: "1px solid " + (selectedMedia.includes(m.id) ? "var(--accent-yellow)" : "var(--border-color)"), borderRadius: 12, cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  {selectedMedia.includes(m.id) ? <CheckSquare size={18} color="var(--accent-yellow)" /> : <Square size={18} color="var(--text-secondary)" />}
                  <span className="badge badge-warning" style={{ fontSize: 10 }}>推荐</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{m.name}</div>
                <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 12, color: "var(--text-secondary)" }}>
                  <span>DA: {m.da_score}</span><span>{m.monthly_traffic}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12 }}>
                  <span className="badge badge-info">{m.category}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{m.response_time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Press release form */}
        <div className="info-card" style={{ height: "fit-content", position: "sticky", top: 24 }}>
          <h4>新闻稿内容</h4>
          <div className="form-group"><label>品牌名称</label><input className="form-input" value={form.brand_name} onChange={e => setForm({...form, brand_name: e.target.value})} placeholder="输入品牌名称" /></div>
          <div className="form-group"><label>语言</label><select className="form-input" value={form.language} onChange={e => setForm({...form, language: e.target.value})}>
            <option value="zh">中文</option><option value="en">English</option>
          </select></div>
          <div className="form-group"><label>新闻稿标题</label><input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="输入新闻稿标题" /></div>
          <div className="form-group"><label>新闻稿内容</label><textarea className="form-input" value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="输入新闻稿内容..." style={{ minHeight: 200 }} /></div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", textAlign: "right", marginBottom: 12 }}>{(form.content || "").length} / 10000</div>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleSubmit} disabled={selectedMedia.length === 0}>发布到 {selectedMedia.length} 个媒体</button>
        </div>
      </div>

      {/* Records */}
      {showRecords && (
        <div className="info-card" style={{ marginTop: 20 }}>
          <h4>发布记录</h4>
          <table className="data-table" style={{ marginTop: 12 }}>
            <thead><tr><th>标题</th><th>品牌</th><th>状态</th><th>时间</th></tr></thead>
            <tbody>
              {releases.length === 0 ? <tr><td colSpan={4} style={{ textAlign: "center", padding: 20, color: "var(--text-secondary)" }}>暂无记录</td></tr>
              : releases.map(r => (
                <tr key={r.id}><td>{r.title}</td><td>{r.brand_name}</td><td><span className="badge badge-success">{r.status}</span></td><td>{r.created_at?.split("T")[0]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default MediaPublish;
`, 'utf8');
console.log('MediaPublish.jsx written');

// ===== HotCopyPro.jsx =====
fs.writeFileSync(P + '/HotCopyPro.jsx', `import React, { useState, useEffect } from "react";
import { Copy, FileText, RefreshCw, Save, Trash2, RotateCcw } from "lucide-react";

function HotCopyPro() {
  const [activeTab, setActiveTab] = useState("new");
  const [inputMode, setInputMode] = useState("paste");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [selectedModel, setSelectedModel] = useState("GPT-4.1");
  const [rewritten, setRewritten] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [records, setRecords] = useState([]);

  const loadRecords = () => fetch("/api/copy-records").then(r => r.json()).then(setRecords).catch(() => {});
  useEffect(() => { loadRecords(); }, []);

  const models = [
    { name: "GPT-5", desc: "Latest OpenAI flagship model" },
    { name: "GPT-4.1", desc: "Excellent all-round" },
    { name: "Claude 3.5", desc: "Best for long-form" },
    { name: "Gemini Pro", desc: "Google latest" },
  ];

  const handleRewrite = () => {
    if (!originalContent) return;
    setIsRewriting(true);
    setTimeout(() => {
      const result = "## " + (originalTitle || "改写文章") + "\\n\\n" +
        "以下是AI改写后的内容：\\n\\n" +
        originalContent.split("\\n").map(p => {
          if (!p.trim()) return "";
          return "> " + p + "\\n";
        }).join("\\n") +
        "\\n---\\n*由 " + selectedModel + " 改写*";
      setRewritten(result);
      setIsRewriting(false);
      // Save record
      fetch("/api/copy-records", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original_title: originalTitle, original_content: originalContent, rewritten_content: result, model_used: selectedModel, source_type: inputMode })
      }).then(loadRecords);
    }, 2000);
  };

  const handleReset = () => { setOriginalTitle(""); setOriginalContent(""); setRewritten(""); };

  return (
    <div className="page" style={{ maxWidth: 1200 }}>
      <div className="page-header">
        <div><h2>全网爆文复刻</h2><p style={{ fontSize: 14, color: "var(--text-secondary)" }}>输入原文内容，AI自动改写为高质量原创文章</p></div>
        <button className="btn btn-secondary" onClick={handleReset} style={{ marginLeft: "auto" }}><RotateCcw size={16} /> 重置</button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button className={\`btn \${activeTab === "new" ? "btn-primary" : "btn-secondary"}\`} onClick={() => setActiveTab("new")}><Copy size={16} /> 新建复刻</button>
        <button className={\`btn \${activeTab === "records" ? "btn-primary" : "btn-secondary"}\`} onClick={() => { setActiveTab("records"); loadRecords(); }}><FileText size={16} /> 复刻记录 ({records.length})</button>
      </div>

      {activeTab === "new" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Config */}
          <div className="info-card">
            <h4>复刻配置</h4>
            <div style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 16 }}>
              <button className={\`tab \${inputMode === "paste" ? "active" : ""}\`} onClick={() => setInputMode("paste")}>粘贴原文内容</button>
              <button className={\`tab \${inputMode === "url" ? "active" : ""}\`} onClick={() => setInputMode("url")}>输入URL采集</button>
            </div>
            <div className="form-group"><label>原文标题</label><input className="form-input" value={originalTitle} onChange={e => setOriginalTitle(e.target.value)} placeholder="输入原文标题" maxLength={200} /><div style={{ fontSize: 11, color: "var(--text-secondary)", textAlign: "right" }}>{originalTitle.length} / 200</div></div>
            <div className="form-group"><label>原文内容</label><textarea className="form-input" value={originalContent} onChange={e => setOriginalContent(e.target.value)} placeholder="粘贴原文内容，AI将自动改写为原创文章..." style={{ minHeight: 200 }} maxLength={10000} /><div style={{ fontSize: 11, color: "var(--text-secondary)", textAlign: "right" }}>{originalContent.length} / 10000</div></div>
            <div className="form-group"><label>改写模型</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {models.map(m => (
                  <div key={m.name} onClick={() => setSelectedModel(m.name)} style={{ padding: "10px 14px", background: selectedModel === m.name ? "rgba(245,166,35,0.1)" : "var(--bg-secondary)", border: "1px solid " + (selectedModel === m.name ? "var(--accent-yellow)" : "var(--border-color)"), borderRadius: 8, cursor: "pointer" }}>
                    <div style={{ fontSize: 14, fontWeight: selectedModel === m.name ? 600 : 400, color: selectedModel === m.name ? "var(--accent-yellow)" : "var(--text-primary)" }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleRewrite} disabled={isRewriting || !originalContent}>
              {isRewriting ? <><RefreshCw size={16} className="spin" /> AI改写中...</> : "开始复刻"}
            </button>
          </div>

          {/* Result */}
          <div className="info-card">
            <h4>复刻结果</h4>
            {rewritten ? (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap", color: "var(--text-primary)" }}>{rewritten}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <button className="btn btn-secondary" onClick={() => navigator.clipboard?.writeText(rewritten)}><Copy size={14} /> 复制</button>
                </div>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: "80px 20px" }}>
                <div className="empty-icon"><Copy size={36} /></div>
                <h3>输入原文内容后，点击"开始复刻"</h3>
                <p>AI 将自动改写为高质量原创内容</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "records" && (
        <div className="info-card">
          <table className="data-table">
            <thead><tr><th>原标题</th><th>模型</th><th>状态</th><th>时间</th><th>操作</th></tr></thead>
            <tbody>
              {records.length === 0 ? <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>暂无记录</td></tr>
              : records.map(r => (
                <tr key={r.id}>
                  <td>{r.original_title || "未命名"}</td>
                  <td><span className="badge badge-info">{r.model_used}</span></td>
                  <td><span className="badge badge-success">{r.status}</span></td>
                  <td>{r.created_at?.split("T")[0]}</td>
                  <td><button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => { setOriginalTitle(r.original_title); setOriginalContent(r.original_content); setRewritten(r.rewritten_content || ""); setActiveTab("new"); }}>查看</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default HotCopyPro;
`, 'utf8');
console.log('HotCopyPro.jsx written');

console.log('Batch 2 done');