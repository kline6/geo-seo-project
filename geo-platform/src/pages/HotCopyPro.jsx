import React, { useState, useEffect } from "react";
import { Copy, FileText, RefreshCw, RotateCcw, Trash2, Eye, ExternalLink, Link } from "lucide-react";

function HotCopyPro() {
  const [activeTab, setActiveTab] = useState("new");
  const [inputMode, setInputMode] = useState("paste");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [selectedModel, setSelectedModel] = useState("GPT-4.1");
  const [rewritten, setRewritten] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [records, setRecords] = useState([]);

  const loadRecords = () => fetch("/api/copy-records").then(r => r.json()).then(data => setRecords(Array.isArray(data) ? data : [])).catch(() => {});
  useEffect(() => { loadRecords(); }, []);

  const models = [
    { name: "GPT-5", desc: "Latest OpenAI flagship model" },
    { name: "GPT-4.1", desc: "Excellent all-round" },
  ];

  const handleFetchUrl = () => {
    if (!sourceUrl.trim()) return;
    setIsFetching(true);
    // Simulate URL fetching
    setTimeout(() => {
      setOriginalTitle("采集的文章标题");
      setOriginalContent("这是从URL采集到的文章内容。在实际版本中，系统会通过后端爬虫抓取页面内容，提取正文并填充到此处。\n\n支持主流新闻网站、博客平台的内容提取。");
      setIsFetching(false);
    }, 1500);
  };

  const handleRewrite = () => {
    const content = inputMode === "url" ? originalContent : originalContent;
    if (!content.trim()) return;
    setIsRewriting(true);
    setRewritten("");
    setTimeout(() => {
      const result = "## " + (originalTitle || "改写文章") + "\n\n" +
        "以下是AI改写后的内容：\n\n" +
        content.split("\n").map(p => {
          if (!p.trim()) return "";
          return "> " + p + "\n";
        }).join("\n") +
        "\n---\n*由 " + selectedModel + " 改写*";
      setRewritten(result);
      setIsRewriting(false);
      fetch("/api/copy-records", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original_title: originalTitle, original_content: content, rewritten_content: result, model_used: selectedModel, source_type: inputMode })
      }).then(loadRecords);
    }, 2000);
  };

  const handleReset = () => {
    setOriginalTitle(""); setOriginalContent(""); setSourceUrl(""); setRewritten("");
  };

  const handleDeleteRecord = (id) => {
    if (confirm("确定删除?")) fetch("/api/copy-records/" + id, { method: "DELETE" }).then(loadRecords);
  };

  const sectionTitle = { display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, marginBottom: 16 };
  const sectionBar = { width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2, flexShrink: 0 };
  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none" };
  const labelStyle = { fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-secondary)" };

  return (
    <div className="page" >
      <div className="page-header">
        <div>
          <h2>全网爆文复刻</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>输入原文内容，AI自动改写为高质量原创文章</p>
        </div>
        <button onClick={handleReset} style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
          <RotateCcw size={14} /> 重置
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setActiveTab("new")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, background: activeTab === "new" ? "var(--accent-yellow)" : "var(--bg-card)", color: activeTab === "new" ? "#000" : "var(--text-secondary)" }}>
          <Copy size={16} /> 新建复刻
        </button>
        <button onClick={() => { setActiveTab("records"); loadRecords(); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, background: activeTab === "records" ? "var(--accent-yellow)" : "var(--bg-card)", color: activeTab === "records" ? "#000" : "var(--text-secondary)" }}>
          <FileText size={16} /> 复刻记录
        </button>
      </div>

      {activeTab === "new" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
          {/* Left: Config */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 24 }}>
            <div style={sectionTitle}><div style={sectionBar} /> 复刻配置</div>

            {/* Input Mode Toggle */}
            <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-color)", marginBottom: 20 }}>
              <button onClick={() => setInputMode("paste")} style={{ flex: 1, padding: "10px 0", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, background: inputMode === "paste" ? "var(--accent-yellow)" : "var(--bg-secondary)", color: inputMode === "paste" ? "#000" : "var(--text-secondary)" }}>
                粘贴原文内容
              </button>
              <button onClick={() => setInputMode("url")} style={{ flex: 1, padding: "10px 0", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, background: inputMode === "url" ? "var(--accent-yellow)" : "var(--bg-secondary)", color: inputMode === "url" ? "#000" : "var(--text-secondary)" }}>
                输入URL采集
              </button>
            </div>

            {/* URL Mode */}
            {inputMode === "url" && (
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>原文URL</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://example.com/article" style={{ ...inputStyle, flex: 1 }} />
                  <button onClick={handleFetchUrl} disabled={isFetching} style={{ padding: "10px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: isFetching ? "wait" : "pointer", fontWeight: 500, fontSize: 13, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}>
                    {isFetching ? <><RefreshCw size={14} className="spin" /> 采集中</> : <><Link size={14} /> 采集</>}
                  </button>
                </div>
              </div>
            )}

            {/* Title */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>原文标题</label>
              <input value={originalTitle} onChange={e => setOriginalTitle(e.target.value)} placeholder="输入原文标题" maxLength={200} style={inputStyle} />
              <div style={{ textAlign: "right", fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>{originalTitle.length} / 200</div>
            </div>

            {/* Content */}
            {inputMode === "paste" && (
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>原文内容</label>
                <textarea value={originalContent} onChange={e => setOriginalContent(e.target.value)} placeholder="粘贴原文内容，AI将自动改写为原创文章..." maxLength={10000} rows={8} style={{ ...inputStyle, resize: "vertical" }} />
                <div style={{ textAlign: "right", fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>{originalContent.length} / 10000</div>
              </div>
            )}

            {/* URL content preview */}
            {inputMode === "url" && originalContent && (
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>采集内容预览</label>
                <div style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", fontSize: 13, maxHeight: 200, overflowY: "auto", whiteSpace: "pre-wrap", color: "var(--text-secondary)" }}>{originalContent}</div>
              </div>
            )}

            {/* Model Selection */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>改写模型</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {models.map(m => (
                  <div key={m.name} onClick={() => setSelectedModel(m.name)}
                    style={{ padding: "12px 14px", borderRadius: 8, border: selectedModel === m.name ? "2px solid var(--accent-yellow)" : "1px solid var(--border-color)", background: selectedModel === m.name ? "rgba(245,166,35,0.08)" : "var(--bg-secondary)", cursor: "pointer" }}>
                    <div style={{ fontSize: 14, fontWeight: selectedModel === m.name ? 600 : 400, color: selectedModel === m.name ? "var(--accent-yellow)" : "var(--text-primary)" }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleRewrite} disabled={isRewriting || (!originalContent && inputMode === "paste") || (!sourceUrl && inputMode === "url")}
              style={{ width: "100%", padding: "10px 0", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: isRewriting ? "wait" : "pointer", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {isRewriting ? <><RefreshCw size={16} className="spin" /> AI改写中...</> : "开始复刻"}
            </button>
          </div>

          {/* Right: Result */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 24, minHeight: 500 }}>
            <div style={sectionTitle}><div style={sectionBar} /> 复刻结果</div>
            {rewritten ? (
              <div>
                <div style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap", marginBottom: 16 }}>{rewritten}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => navigator.clipboard?.writeText(rewritten)} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-primary)", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
                    <Copy size={14} /> 复制
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, color: "var(--text-secondary)" }}>
                <Copy size={48} style={{ marginBottom: 16, opacity: 0.2 }} />
                <p style={{ fontSize: 14 }}>输入原文内容后，点击"开始复刻"</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>AI 将自动改写为高质量原创内容</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "records" && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead><tr style={{ borderBottom: "1px solid var(--border-color)" }}>
              {["原标题", "来源", "模型", "字数", "时间", "操作"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "var(--text-secondary)", fontSize: 13 }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>暂无记录</td></tr>
              ) : records.map(r => (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "12px 16px" }}>{r.original_title || "未命名"}</td>
                  <td style={{ padding: "12px 16px" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: "rgba(245,166,35,0.15)", color: "var(--accent-yellow)" }}>{r.source_type || "paste"}</span></td>
                  <td style={{ padding: "12px 16px" }}>{r.model_used}</td>
                  <td style={{ padding: "12px 16px" }}>{r.original_content?.length || 0}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{r.created_at?.split("T")[0]}</td>
                  <td style={{ padding: "12px 16px", display: "flex", gap: 6 }}>
                    <button onClick={() => { setOriginalTitle(r.original_title); setOriginalContent(r.original_content); setRewritten(r.rewritten_content || ""); setActiveTab("new"); }} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-primary)", cursor: "pointer", fontSize: 12 }}><Eye size={12} /></button>
                    <button onClick={() => handleDeleteRecord(r.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--accent-red)", background: "transparent", color: "var(--accent-red)", cursor: "pointer", fontSize: 12 }}><Trash2 size={12} /></button>
                  </td>
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
