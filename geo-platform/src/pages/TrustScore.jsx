import React, { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, Info, Shield, Star, TrendingUp, RefreshCw, Plus, Trash2, Edit3 } from "lucide-react";

function TrustScore() {
  const [factors, setFactors] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showFactorForm, setShowFactorForm] = useState(false);
  const [showSuggForm, setShowSuggForm] = useState(false);
  const [editFactor, setEditFactor] = useState(null);
  const [editSugg, setEditSugg] = useState(null);
  const [factorForm, setFactorForm] = useState({ factor_name: "", score: 0, weight: "10%", description: "" });
  const [suggForm, setSuggForm] = useState({ suggestion_text: "", priority: "medium", impact: "+0%" });

  const load = () => {
    fetch("/api/trust").then(r => r.json()).then(d => { setFactors(d.factors || []); setSuggestions(d.suggestions || []); }).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const totalScore = factors.length ? Math.round(factors.reduce((a, f) => a + f.score * parseFloat(f.weight) / 100, 0) * 100) / 100 : 0;
  const grade = totalScore >= 80 ? "A" : totalScore >= 70 ? "B+" : totalScore >= 60 ? "B" : "C";
  const gradeColor = totalScore >= 80 ? "var(--accent-green)" : totalScore >= 70 ? "var(--accent-yellow)" : "var(--accent-red)";

  const handleFactorSubmit = () => {
    const method = editFactor ? "PUT" : "POST";
    const url = editFactor ? "/api/trust/factors/" + editFactor.id : "/api/trust/factors";
    fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...factorForm, score: parseInt(factorForm.score) }) })
      .then(() => { setShowFactorForm(false); setEditFactor(null); load(); });
  };
  const handleSuggSubmit = () => {
    const method = editSugg ? "PUT" : "POST";
    const url = editSugg ? "/api/trust/suggestions/" + editSugg.id : "/api/trust/suggestions";
    fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(suggForm) })
      .then(() => { setShowSuggForm(false); setEditSugg(null); load(); });
  };
  const handleDeleteFactor = (id) => { if (confirm("确定删除?")) fetch("/api/trust/factors/" + id, { method: "DELETE" }).then(load); };
  const handleDeleteSugg = (id) => { if (confirm("确定删除?")) fetch("/api/trust/suggestions/" + id, { method: "DELETE" }).then(load); };

  return (
    <div className="page">
      <div className="page-header"><h2>信任度评分</h2><p>评估您的内容在 AI 搜索中的信任度和权威性</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, marginBottom: 24 }}>
        <div className="info-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
          <div style={{ width: 120, height: 120, borderRadius: "50%", border: `4px solid ${gradeColor}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: gradeColor }}>{totalScore}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>满分100</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>信任评级：{grade}</div>
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 12 }} onClick={load}><RefreshCw size={16} /> 重新评估</button>
        </div>
        <div className="info-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4>评分因素分析</h4>
            <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => { setEditFactor(null); setFactorForm({ factor_name: "", score: 0, weight: "10%", description: "" }); setShowFactorForm(true); }}><Plus size={12} /> 添加因素</button>
          </div>
          {showFactorForm && (
            <div style={{ padding: "12px 0", borderBottom: "1px solid var(--border-color)" }}>
              <div className="form-group"><label>因素名称</label><input className="form-input" value={factorForm.factor_name} onChange={e => setFactorForm({...factorForm, factor_name: e.target.value})} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div className="form-group"><label>分数</label><input className="form-input" type="number" value={factorForm.score} onChange={e => setFactorForm({...factorForm, score: e.target.value})} /></div>
                <div className="form-group"><label>权重</label><input className="form-input" value={factorForm.weight} onChange={e => setFactorForm({...factorForm, weight: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>描述</label><input className="form-input" value={factorForm.description} onChange={e => setFactorForm({...factorForm, description: e.target.value})} /></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" onClick={handleFactorSubmit}>{editFactor ? "保存" : "添加"}</button>
                <button className="btn btn-secondary" onClick={() => setShowFactorForm(false)}>取消</button>
              </div>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
            {factors.map(f => (
              <div key={f.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 14 }}>{f.factor_name} <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>({f.weight})</span></span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: f.score >= 75 ? "var(--accent-green)" : f.score >= 60 ? "var(--accent-yellow)" : "var(--accent-red)" }}>{f.score}</span>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }} onClick={() => { setEditFactor(f); setFactorForm({ factor_name: f.factor_name, score: f.score, weight: f.weight, description: f.description }); setShowFactorForm(true); }}><Edit3 size={12} /></button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent-red)" }} onClick={() => handleDeleteFactor(f.id)}><Trash2 size={12} /></button>
                  </div>
                </div>
                <div className="progress-bar"><div className={`fill ${f.score >= 75 ? "green" : f.score >= 60 ? "yellow" : "red"}`} style={{ width: f.score + "%" }} /></div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{f.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="tabs">
        <button className={`tab ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>优化建议</button>
        <button className={`tab ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>评分历史</button>
      </div>
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ textAlign: "right" }}>
            <button className="btn btn-primary" onClick={() => { setEditSugg(null); setSuggForm({ suggestion_text: "", priority: "medium", impact: "+0%" }); setShowSuggForm(true); }}><Plus size={16} /> 添加建议</button>
          </div>
          {showSuggForm && (
            <div className="info-card" style={{ marginBottom: 8 }}>
              <div className="form-group"><label>建议内容</label><textarea className="form-input" value={suggForm.suggestion_text} onChange={e => setSuggForm({...suggForm, suggestion_text: e.target.value})} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div className="form-group"><label>优先级</label><select className="form-input" value={suggForm.priority} onChange={e => setSuggForm({...suggForm, priority: e.target.value})}>
                  <option value="high">高</option><option value="medium">中</option><option value="low">低</option>
                </select></div>
                <div className="form-group"><label>预估影响</label><input className="form-input" value={suggForm.impact} onChange={e => setSuggForm({...suggForm, impact: e.target.value})} /></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" onClick={handleSuggSubmit}>{editSugg ? "保存" : "添加"}</button>
                <button className="btn btn-secondary" onClick={() => setShowSuggForm(false)}>取消</button>
              </div>
            </div>
          )}
          {suggestions.map(s => (
            <div key={s.id} className="info-card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.priority === "high" ? "rgba(239,68,68,0.15)" : s.priority === "medium" ? "rgba(245,166,35,0.15)" : "rgba(96,165,250,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {s.priority === "high" ? <AlertTriangle size={16} color="var(--accent-red)" /> : <Info size={16} color={s.priority === "medium" ? "var(--accent-yellow)" : "#60a5fa"} />}
              </div>
              <div style={{ flex: 1, fontSize: 14 }}>{s.suggestion_text}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--accent-green)" }}>{s.impact}</div>
              <span className={`badge ${s.priority === "high" ? "badge-danger" : s.priority === "medium" ? "badge-warning" : "badge-info"}`}>{s.priority === "high" ? "高" : s.priority === "medium" ? "中" : "低"}优先</span>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }} onClick={() => { setEditSugg(s); setSuggForm({ suggestion_text: s.suggestion_text, priority: s.priority, impact: s.impact }); setShowSuggForm(true); }}><Edit3 size={12} /></button>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent-red)" }} onClick={() => handleDeleteSugg(s.id)}><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default TrustScore;
