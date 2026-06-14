import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  PenTool, Plus, Trash2, Copy, Save, RefreshCw,
  Sparkles, Clock, ChevronDown,
} from "lucide-react";

const defaultTemplates = [
  { id: "seo-blog", name: "SEO优化博客文章", description: "生成SEO优化的专业博客文章", prompt: "写一篇关于{{topic}}的SEO优化博客文章，目标关键词：{{keywords}}", visibility: "public", usageCount: 0 },
  { id: "product-desc", name: "产品描述文案", description: "撰写引人注目的产品描述", prompt: "为{{product}}撰写一段引人注目的产品描述，突出卖点：{{features}}", visibility: "public", usageCount: 0 },
];

const writingStyles = [
  { id: "professional", name: "专业严谨", desc: "适合行业报告、白皮书等正式内容", icon: "📄" },
  { id: "casual", name: "轻松活泼", desc: "适合社交媒体、博客等轻松内容", icon: "😊" },
  { id: "tutorial", name: "教学指导", desc: "适合教程、操作指南", icon: "📚" },
  { id: "news", name: "新闻报道", desc: "适合新闻稿、行业动态", icon: "📰" },
  { id: "marketing", name: "营销推广", desc: "适合广告文案、推广内容", icon: "📢" },
];

function AiWriting() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "templates";
  const setActiveTab = (tab) => setSearchParams({ tab });

  const [writingTab, setWritingTab] = useState("write");
  const [templates, setTemplates] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [title, setTitle] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [requirements, setRequirements] = useState("");
  const [style, setStyle] = useState("professional");
  const [generated, setGenerated] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const loadTemplates = () => fetch("/api/ai-writes").then(r => r.json()).then(data => {
    const saved = Array.isArray(data) ? data : [];
    setTemplates([...defaultTemplates.map(t => ({ ...t, usageCount: 0 })), ...saved.filter(d => d.template)]);
  }).catch(() => setTemplates([...defaultTemplates]));

  const loadHistory = () => fetch("/api/ai-writes").then(r => r.json()).then(data => {
    setHistory(Array.isArray(data) ? data.filter(d => !d.template) : []);
  }).catch(() => {});

  useEffect(() => { loadTemplates(); loadHistory(); }, []);

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [tplForm, setTplForm] = useState({ name: "", description: "", prompt: "", visibility: "public" });

  const handleAddTemplate = () => {
    if (!tplForm.name.trim()) return;
    fetch("/api/ai-writes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...tplForm, template: true, title: tplForm.name, content: tplForm.prompt, word_count: 0 }),
    }).then(() => { setShowTemplateForm(false); setTplForm({ name: "", description: "", prompt: "", visibility: "public" }); loadTemplates(); });
  };

  const handleDeleteTemplate = (id) => {
    if (defaultTemplates.find(t => t.id === id)) return;
    if (confirm("确定删除此模板?")) fetch("/api/ai-writes/" + id, { method: "DELETE" }).then(loadTemplates);
  };

  const handleGenerate = async () => {
    if (!requirements.trim()) return alert("请填写写作要求");
    setIsGenerating(true);
    setGenerated("");
    const styleObj = writingStyles.find(s => s.id === style);
    const tplName = templateId ? templates.find(t => t.id === templateId)?.name : "";

    const prompt = `你是一位专业的SEO/GEO内容创作者。请根据以下要求生成一篇高质量文章：

标题：${title || "（自动生成）"}
写作风格：${styleObj?.name || "专业严谨"}（${styleObj?.desc || ""}）
${tplName ? "使用模板：" + tplName : ""}

写作要求：
${requirements}

请生成完整的文章，包含：
1. 引人入胜的标题
2. 引言（概述主题和价值）
3. 正文（3-5个主要章节，每个有小标题和详细内容）
4. 包含具体数据、案例或实操建议
5. 总结与行动建议

要求内容专业、有深度、SEO友好，字数1200-2000字。`;

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const data = await resp.json();
      const content = data.reply || "未获取到内容";
      setGenerated(content);
    } catch (err) {
      setGenerated("生成失败: " + err.message + "\n\n请检查后端服务和 API Key 配置。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => { navigator.clipboard.writeText(generated); alert("已复制到剪贴板"); };
  const handleSave = () => {
    if (!generated) return;
    fetch("/api/ai-writes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title || "AI生成文章", content: generated, word_count: generated.length, template: false }),
    }).then(() => { alert("已保存"); loadHistory(); });
  };

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none" };
  const labelStyle = { fontSize: 14, fontWeight: 500, marginBottom: 6, display: "block" };
  const sectionTitle = { display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, marginBottom: 16 };
  const sectionBar = { width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2 };

  return (
    <div className="page">
      <div className="page-header">
        <h2>AI 写作</h2>
        <button onClick={() => setActiveTab(activeTab === "templates" ? "workbench" : "templates")} style={{ padding: "8px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500, fontSize: 14 }}>
          {activeTab === "templates" ? "进入写作" : "写作模板"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setActiveTab("templates")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, background: activeTab === "templates" ? "var(--accent-yellow)" : "var(--bg-card)", color: activeTab === "templates" ? "#000" : "var(--text-secondary)" }}>
          <PenTool size={16} /> 写作模板
        </button>
        <button onClick={() => setActiveTab("workbench")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, background: activeTab === "workbench" ? "var(--accent-yellow)" : "var(--bg-card)", color: activeTab === "workbench" ? "#000" : "var(--text-secondary)" }}>
          <Sparkles size={16} /> 写作工作台
        </button>
      </div>

      {activeTab === "templates" ? (
        <>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="搜索模板..." style={inputStyle} />
            </div>
            <button onClick={() => setShowTemplateForm(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500, fontSize: 14 }}>
              <Plus size={16} /> 新建模板
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {filteredTemplates.map(tpl => (
              <div key={tpl.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>{tpl.name}</h3>
                  {!defaultTemplates.find(d => d.id === tpl.id) && (
                    <button onClick={() => handleDeleteTemplate(tpl.id)} style={{ background: "none", border: "none", color: "var(--accent-red)", cursor: "pointer" }}><Trash2 size={16} /></button>
                  )}
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>{tpl.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: "rgba(245,166,35,0.15)", color: "var(--accent-yellow)" }}>{tpl.visibility === "public" ? "公开" : "私有"}</span>
                  <button onClick={() => { setTemplateId(tpl.id); setActiveTab("workbench"); }} style={{ padding: "6px 16px", borderRadius: 6, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>使用模板</button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ display: "flex", gap: 20, flex: 1, minHeight: 0 }}>
          <div style={{ width: 420, flexShrink: 0, background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 24 }}>
            <div style={sectionTitle}><div style={sectionBar} /> 写作配置</div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>文章标题</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="输入文章标题..." style={{ ...inputStyle, flex: 1 }} />
                <button onClick={() => { if (!requirements.trim()) return alert("请先填写写作要求"); setTitle(`关于${requirements.slice(0, 10)}的深度分析`); }} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "transparent", color: "var(--accent-yellow)", cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }}>AI建议</button>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>写作模板 (可选)</label>
              <div style={{ position: "relative" }}>
                <select value={templateId} onChange={e => setTemplateId(e.target.value)} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                  <option value="">选择预设模板</option>
                  {defaultTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-secondary)" }} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>写作要求</label>
              <textarea value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="描述您想要的内容，越详细越好。例如：写一篇关于品牌营销的深度文章，包含具体案例和实操建议..." maxLength={2000} rows={5} style={{ ...inputStyle, resize: "vertical" }} />
              <div style={{ textAlign: "right", fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>{requirements.length} / 2000</div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>写作风格</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
                {writingStyles.map(s => (
                  <div key={s.id} onClick={() => setStyle(s.id)}
                    style={{ padding: "12px", borderRadius: 8, border: style === s.id ? "2px solid var(--accent-yellow)" : "1px solid var(--border-color)", background: style === s.id ? "rgba(245,166,35,0.08)" : "var(--bg-secondary)", cursor: "pointer", textAlign: "center" }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleGenerate} disabled={isGenerating} style={{ width: "100%", padding: "10px 0", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: isGenerating ? "wait" : "pointer", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {isGenerating ? <><RefreshCw size={16} className="spin" /> 生成中...</> : <><Sparkles size={16} /> 开始生成</>}
            </button>
          </div>

          <div style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 24, minHeight: 500 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={sectionTitle}><div style={sectionBar} /> 生成结果</div>
              {generated && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={handleCopy} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-primary)", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}><Copy size={12} /> 复制</button>
                  <button onClick={handleSave} style={{ padding: "6px 12px", borderRadius: 6, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}><Save size={12} /> 保存</button>
                </div>
              )}
            </div>
            {generated ? (
              <div style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{generated}</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, color: "var(--text-secondary)" }}>
                <RefreshCw size={48} style={{ marginBottom: 16, opacity: 0.2 }} />
                <p style={{ fontSize: 14 }}>配置写作参数后，点击"开始生成"</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>AI 将根据您的要求自动生成高质量内容</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showTemplateForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 32, width: 480 }}>
            <h3 style={{ marginBottom: 20 }}>新建模板</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>模板名称</label>
              <input value={tplForm.name} onChange={e => setTplForm(prev => ({ ...prev, name: e.target.value }))} placeholder="输入模板名称" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>描述</label>
              <input value={tplForm.description} onChange={e => setTplForm(prev => ({ ...prev, description: e.target.value }))} placeholder="简短描述模板用途" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Prompt 模板</label>
              <textarea value={tplForm.prompt} onChange={e => setTplForm(prev => ({ ...prev, prompt: e.target.value }))} placeholder="使用 {{变量名}} 作为占位符" rows={4} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowTemplateForm(false)} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}>取消</button>
              <button onClick={handleAddTemplate} style={{ padding: "8px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500 }}>创建</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AiWriting;
