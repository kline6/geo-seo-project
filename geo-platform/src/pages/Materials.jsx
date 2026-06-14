import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FolderOpen, Plus, Trash2, Search, Key, FileText, BookOpen, ChevronDown } from "lucide-react";

function Materials() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "keywords";
  const setActiveTab = (tab) => setSearchParams({ tab });

  const [keywords, setKeywords] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showKeywordForm, setShowKeywordForm] = useState(false);
  const [showKnowledgeForm, setShowKnowledgeForm] = useState(false);
  const [kwForm, setKwForm] = useState({ name: "", category: "SEO优化", search_volume: 0 });
  const [kbForm, setKbForm] = useState({ title: "", category: "产品介绍", content: "", source: "" });

  const loadKw = () => fetch("/api/keywords").then(r => r.json()).then(data => setKeywords(Array.isArray(data) ? data : [])).catch(() => {});
  const loadKb = () => fetch("/api/materials").then(r => r.json()).then(data => setKnowledge(Array.isArray(data) ? data : [])).catch(() => {});
  useEffect(() => { loadKw(); loadKb(); }, []);

  const filteredKw = keywords.filter(k =>
    (statusFilter === "all" || (statusFilter === "active" ? k.status !== "paused" : k.status === "paused")) &&
    k.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddKeyword = () => {
    if (!kwForm.name.trim()) return;
    fetch("/api/keywords", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(kwForm) })
      .then(() => { setShowKeywordForm(false); setKwForm({ name: "", category: "SEO优化", search_volume: 0 }); loadKw(); });
  };
  const handleDeleteKeyword = (id) => { if (confirm("确定删除?")) fetch("/api/keywords/" + id, { method: "DELETE" }).then(loadKw); };
  const handleToggleKeyword = (kw) => {
    fetch("/api/keywords/" + kw.id, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...kw, status: kw.status === "paused" ? "active" : "paused" }) }).then(loadKw);
  };

  const handleAddKnowledge = () => {
    if (!kbForm.title.trim()) return;
    fetch("/api/materials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: kbForm.title, type: "document", category: kbForm.category, size: kbForm.content.length + "字" }) })
      .then(() => { setShowKnowledgeForm(false); setKbForm({ title: "", category: "产品介绍", content: "", source: "" }); loadKb(); });
  };
  const handleDeleteKnowledge = (id) => { if (confirm("确定删除?")) fetch("/api/materials/" + id, { method: "DELETE" }).then(loadKb); };

  const kwCategories = ["SEO优化", "GEO优化", "内容营销", "品牌建设"];
  const kbCategories = ["产品介绍", "技术文档", "常见问题", "品牌资料", "行业知识", "竞品分析"];

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none" };
  const labelStyle = { fontSize: 14, fontWeight: 500, marginBottom: 6, display: "block" };

  const renderKeywordCards = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {filteredKw.map(kw => (
        <div key={kw.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{kw.name}</h3>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: kw.status === "paused" ? "rgba(245,166,35,0.2)" : "rgba(74,222,128,0.2)", color: kw.status === "paused" ? "var(--accent-yellow)" : "var(--accent-green)" }}>
                  {kw.status === "paused" ? "已暂停" : "已激活"}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{kw.category || "未分类"}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "16px 0", padding: "12px 0", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>搜索量</div><div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent-yellow)" }}>{(kw.search_volume || 0).toLocaleString()}</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>AI可见度</div><div style={{ fontSize: 18, fontWeight: 700, color: kw.visibility > 0 ? "var(--accent-green)" : "var(--accent-red)" }}>{kw.visibility || 0}%</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>AI提及</div><div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent-green)" }}>{kw.mentions || 0}</div></div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => handleToggleKeyword(kw)} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontSize: 12 }}>
              {kw.status === "paused" ? "激活" : "暂停"}
            </button>
            <button onClick={() => handleDeleteKeyword(kw.id)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border-color)", background: "transparent", color: "var(--accent-red)", cursor: "pointer" }}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderKnowledgeTable = () => (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>标题</th>
            <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>分类</th>
            <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>类型</th>
            <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>大小</th>
            <th style={{ textAlign: "right", padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {knowledge.map(k => (
            <tr key={k.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
              <td style={{ padding: "12px 16px" }}>{k.name}</td>
              <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{k.category || "未分类"}</td>
              <td style={{ padding: "12px 16px" }}>
                <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 12, background: "rgba(245,166,35,0.15)", color: "var(--accent-yellow)" }}>{k.type || "文档"}</span>
              </td>
              <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{k.size || "-"}</td>
              <td style={{ padding: "12px 16px", textAlign: "right" }}>
                <button onClick={() => handleDeleteKnowledge(k.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border-color)", background: "transparent", color: "var(--accent-red)", cursor: "pointer" }}>
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
          {knowledge.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px 16px", color: "var(--text-secondary)" }}>暂无知识库数据</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h2>素材库</h2>
        <button onClick={() => activeTab === "keywords" ? setShowKeywordForm(true) : setShowKnowledgeForm(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500, fontSize: 14 }}>
          <Plus size={16} /> 添加{activeTab === "keywords" ? "关键词" : "知识"}
        </button>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setActiveTab("keywords")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, background: activeTab === "keywords" ? "var(--accent-yellow)" : "var(--bg-card)", color: activeTab === "keywords" ? "#000" : "var(--text-secondary)" }}>
          <Key size={16} /> 关键词
        </button>
        <button onClick={() => setActiveTab("knowledge")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, background: activeTab === "knowledge" ? "var(--accent-yellow)" : "var(--bg-card)", color: activeTab === "knowledge" ? "#000" : "var(--text-secondary)" }}>
          <BookOpen size={16} /> 知识库
        </button>
      </div>

      {activeTab === "keywords" ? (
        <>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="搜索关键词..." style={{ ...inputStyle, paddingLeft: 36 }} />
            </div>
            <div style={{ position: "relative" }}>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: "10px 32px 10px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 14, appearance: "none", cursor: "pointer" }}>
                <option value="all">全部状态</option>
                <option value="active">已激活</option>
                <option value="paused">已暂停</option>
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-secondary)" }} />
            </div>
          </div>
          {filteredKw.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
              <Key size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p>暂无关键词</p>
            </div>
          ) : renderKeywordCards()}
        </>
      ) : renderKnowledgeTable()}

      {/* Add Keyword Modal */}
      {showKeywordForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 32, width: 440 }}>
            <h3 style={{ marginBottom: 20 }}>添加关键词</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>关键词名称</label>
              <input value={kwForm.name} onChange={e => setKwForm(prev => ({ ...prev, name: e.target.value }))} placeholder="输入关键词" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>分类</label>
              <select value={kwForm.category} onChange={e => setKwForm(prev => ({ ...prev, category: e.target.value }))} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                {kwCategories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowKeywordForm(false)} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}>取消</button>
              <button onClick={handleAddKeyword} style={{ padding: "8px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500 }}>确定</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Knowledge Modal */}
      {showKnowledgeForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 32, width: 500 }}>
            <h3 style={{ marginBottom: 20 }}>添加知识</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>标题</label>
              <input value={kbForm.title} onChange={e => setKbForm(prev => ({ ...prev, title: e.target.value }))} placeholder="知识标题" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>分类</label>
              <select value={kbForm.category} onChange={e => setKbForm(prev => ({ ...prev, category: e.target.value }))} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                {kbCategories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>内容</label>
              <textarea value={kbForm.content} onChange={e => setKbForm(prev => ({ ...prev, content: e.target.value }))} placeholder="输入知识内容..." rows={5} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowKnowledgeForm(false)} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}>取消</button>
              <button onClick={handleAddKnowledge} style={{ padding: "8px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500 }}>确定</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Materials;
