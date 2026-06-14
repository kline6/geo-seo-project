import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Stethoscope, Plus, Trash2, FileText, ChevronDown } from "lucide-react";

function AiDiagnosis() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "create";
  const setActiveTab = (tab) => setSearchParams({ tab });

  const [diagnoses, setDiagnoses] = useState([]);
  const [form, setForm] = useState({
    brand_name: "",
    domain: "",
    keyword_ids: [],
    competitors: [],
    language: "CN",
  });
  const [keywords, setKeywords] = useState([]);

  const load = () => fetch("/api/diagnoses").then(r => r.json()).then(setDiagnoses).catch(() => {});
  const loadKeywords = () => fetch("/api/keywords").then(r => r.json()).then(data => setKeywords(Array.isArray(data) ? data : [])).catch(() => {});
  useEffect(() => { load(); loadKeywords(); }, []);

  const addCompetitor = () => setForm(prev => ({ ...prev, competitors: [...prev.competitors, ""] }));
  const removeCompetitor = (idx) => setForm(prev => ({ ...prev, competitors: prev.competitors.filter((_, i) => i !== idx) }));
  const updateCompetitor = (idx, val) => setForm(prev => ({ ...prev, competitors: prev.competitors.map((c, i) => i === idx ? val : c) }));

  const handleSubmit = () => {
    if (!form.brand_name.trim()) return alert("请输入品牌名称");
    fetch("/api/diagnoses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.brand_name,
        diagnosis_type: "geo_brand",
        domain: form.domain,
        keywords: form.keyword_ids.join(","),
        competitors: form.competitors.filter(Boolean).join(","),
        language: form.language,
        status: "pending",
      }),
    }).then(() => {
      alert("诊断已创建，正在分析...");
      setForm({ brand_name: "", domain: "", keyword_ids: [], competitors: [], language: "CN" });
      setActiveTab("reports");
      load();
    }).catch(() => alert("创建失败"));
  };

  const handleDelete = (id) => {
    if (!confirm("确定删除此诊断?")) return;
    fetch("/api/diagnoses/" + id, { method: "DELETE" }).then(load);
  };

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none" };
  const labelStyle = { fontSize: 14, fontWeight: 500, marginBottom: 6, display: "block" };

  return (
    <div className="page" >
      {activeTab === "reports" ? (
        <>
          <div className="page-header">
            <h2>AI 诊断</h2>
            <button onClick={() => setActiveTab("create")} style={{ padding: "8px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500, fontSize: 14 }}>
              <Plus size={16} style={{ marginRight: 6, verticalAlign: -3 }} />新建诊断
            </button>
          </div>
          {diagnoses.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
              <Stethoscope size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p>暂无诊断报告</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {diagnoses.map(d => (
                <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(245,166,35,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FileText size={20} color="var(--accent-yellow)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{d.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                        {d.diagnosis_type === "geo_brand" ? "GEO品牌诊断" : d.diagnosis_type} · {d.status === "completed" ? "已完成" : d.status === "in_progress" || d.status === "pending" ? "分析中" : d.status}
                        {d.score ? ` · 评分 ${d.score}` : ""}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(d.id)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid var(--border-color)", background: "transparent", color: "var(--accent-red)", cursor: "pointer", fontSize: 13 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="page-header">
            <h2>新建诊断</h2>
            <button onClick={() => setActiveTab("reports")} style={{ padding: "8px 20px", borderRadius: 8, background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border-color)", cursor: "pointer", fontWeight: 500, fontSize: 14 }}>
              <FileText size={16} style={{ marginRight: 6, verticalAlign: -3 }} />诊断报告
            </button>
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 32 }}>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}><span style={{ color: "var(--accent-red)", marginRight: 4 }}>*</span>品牌名称</label>
              <input value={form.brand_name} onChange={e => setForm(prev => ({ ...prev, brand_name: e.target.value }))} placeholder="输入品牌名称，如：小米科技" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>品牌域名</label>
              <input value={form.domain} onChange={e => setForm(prev => ({ ...prev, domain: e.target.value }))} placeholder="example.com（可选）" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>关联关键词</label>
              <div style={{ position: "relative" }}>
                <select value="" onChange={e => { if (e.target.value && !form.keyword_ids.includes(e.target.value)) setForm(prev => ({ ...prev, keyword_ids: [...prev.keyword_ids, e.target.value] })); e.target.value = ""; }}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                  <option value="">选择关键词</option>
                  {keywords.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                </select>
                <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-secondary)" }} />
              </div>
              {form.keyword_ids.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {form.keyword_ids.map(kid => {
                    const kw = keywords.find(k => k.id == kid);
                    return kw ? (
                      <span key={kid} style={{ padding: "4px 10px", borderRadius: 14, background: "rgba(245,166,35,0.15)", color: "var(--accent-yellow)", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                        {kw.name}
                        <button onClick={() => setForm(prev => ({ ...prev, keyword_ids: prev.keyword_ids.filter(x => x !== kid) }))} style={{ background: "none", border: "none", color: "var(--accent-yellow)", cursor: "pointer", padding: 0, fontSize: 14, lineHeight: 1 }}>×</button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>竞品品牌</label>
              {form.competitors.map((comp, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input value={comp} onChange={e => updateCompetitor(idx, e.target.value)} placeholder={`竞品 ${idx + 1}`} style={{ ...inputStyle, flex: 1 }} />
                  <button onClick={() => removeCompetitor(idx)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid var(--border-color)", background: "transparent", color: "var(--accent-red)", cursor: "pointer" }}><Trash2 size={14} /></button>
                </div>
              ))}
              <button onClick={addCompetitor} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", background: "none", border: "none", color: "var(--accent-yellow)", cursor: "pointer", fontSize: 14 }}>
                <Plus size={14} /> 添加竞品
              </button>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>诊断语言</label>
              <div style={{ position: "relative" }}>
                <select value={form.language} onChange={e => setForm(prev => ({ ...prev, language: e.target.value }))} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                  <option value="CN">CN 中文</option>
                  <option value="EN">EN English</option>
                  <option value="JP">JP 日本語</option>
                  <option value="KR">KR 한국어</option>
                </select>
                <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-secondary)" }} />
              </div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>选择AI模型回答的语言，影响诊断查询和结果</p>
            </div>
            <button onClick={handleSubmit} style={{ padding: "10px 32px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
              开始诊断
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AiDiagnosis;
