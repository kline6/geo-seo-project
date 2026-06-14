const fs = require('fs');
const P = 'E:/iso project/geo-platform/src/pages';

// ===== LoginPage.jsx =====
fs.writeFileSync(P + '/LoginPage.jsx', `import React, { useState } from "react";
import { Bot, Lock, User, Eye, EyeOff } from "lucide-react";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!username || !password) { setError("请输入用户名和密码"); return; }
    
    const url = isRegister ? "/api/auth/register" : "/api/auth/login";
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, display_name: displayName || username })
    }).then(r => {
      if (!r.ok) throw new Error("登录失败");
      return r.json();
    }).then(user => {
      localStorage.setItem("geo_user", JSON.stringify(user));
      onLogin(user);
    }).catch(err => setError(err.message || "登录失败"));
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 400, padding: 40, background: "#141414", borderRadius: 16, border: "1px solid #2a2a2a" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, background: "var(--accent-yellow)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28, fontWeight: 700, color: "#000" }}>G</div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>GEO Platform</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>AI搜索优化工作台</p>
        </div>

        {error && <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.15)", borderRadius: 8, color: "var(--accent-red)", fontSize: 13, marginBottom: 16 }}>{error}</div>}

        <div className="form-group">
          <label>用户名</label>
          <div style={{ position: "relative" }}>
            <input className="form-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="请输入用户名" style={{ paddingLeft: 36 }} />
            <User size={16} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-secondary)" }} />
          </div>
        </div>

        <div className="form-group">
          <label>密码</label>
          <div style={{ position: "relative" }}>
            <input className="form-input" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="请输入密码" style={{ paddingLeft: 36, paddingRight: 36 }} />
            <Lock size={16} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-secondary)" }} />
            <button onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 8, top: 8, background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
        </div>

        {isRegister && (
          <div className="form-group">
            <label>显示名称</label>
            <input className="form-input" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="可选" />
          </div>
        )}

        <button className="btn btn-primary" style={{ width: "100%", height: 44, marginTop: 8 }} onClick={handleSubmit}>{isRegister ? "注册" : "登录"}</button>
        
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={() => { setIsRegister(!isRegister); setError(""); }} style={{ background: "none", border: "none", color: "var(--accent-yellow)", cursor: "pointer", fontSize: 13 }}>{isRegister ? "已有账号？去登录" : "没有账号？注册"}</button>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "var(--text-secondary)" }}>
          默认账号: admin / admin123
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
`, 'utf8');
console.log('LoginPage.jsx written');

// ===== Reports.jsx =====
fs.writeFileSync(P + '/Reports.jsx', `import React, { useState, useEffect } from "react";
import { BarChart3, FileText, Plus, Trash2, TrendingUp } from "lucide-react";

function Reports() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ keywords: 0, articles: 0, published: 0, diagnoses: 0 });
  const [trendData, setTrendData] = useState([]);

  const load = () => {
    fetch("/api/reports").then(r => r.json()).then(setReports).catch(() => {});
    fetch("/api/dashboard").then(r => r.json()).then(d => {
      setStats({ keywords: d.keywordCount || 0, articles: d.articleCount || 0, published: 0, diagnoses: d.diagnosisCount || 0 });
    }).catch(() => {});
    fetch("/api/analysis").then(r => r.json()).then(d => setTrendData(d.weekly || [])).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const handleGenerate = () => {
    fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "数据报告 " + new Date().toLocaleDateString(), report_type: "auto" })
    }).then(() => load());
  };

  const handleDelete = (id) => { if (confirm("确定删除?")) fetch("/api/reports/" + id, { method: "DELETE" }).then(load); };

  return (
    <div className="page" style={{ maxWidth: 1200 }}>
      <div className="page-header">
        <div><h2>数据报表</h2><p style={{ fontSize: 14, color: "var(--text-secondary)" }}>查看数据概览、趋势分析和报表管理</p></div>
        <button className="btn btn-primary" onClick={handleGenerate} style={{ marginLeft: "auto" }}><Plus size={16} /> 生成报表</button>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat-block"><div className="stat-label">关键词总数</div><div className="stat-value yellow">{stats.keywords}</div><div style={{ fontSize: 12, color: "var(--text-secondary)" }}>已收录</div></div>
        <div className="stat-block"><div className="stat-label">文章总数</div><div className="stat-value">{stats.articles}</div><div style={{ fontSize: 12, color: "var(--text-secondary)" }}>已创建</div></div>
        <div className="stat-block"><div className="stat-label">已发布</div><div className="stat-value" style={{ color: "#4ade80" }}>{stats.published}</div><div style={{ fontSize: 12, color: "var(--text-secondary)" }}>发布成功</div></div>
        <div className="stat-block"><div className="stat-label">诊断次数</div><div className="stat-value yellow">{stats.diagnoses}</div><div style={{ fontSize: 12, color: "var(--text-secondary)" }}>已完成</div></div>
      </div>

      {/* Charts placeholder */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>
        <div className="info-card">
          <h4>可见度趋势</h4>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 200, marginTop: 16 }}>
            {trendData.map(d => {
              const maxT = Math.max(...trendData.map(x => x.traffic || 1));
              return (
                <div key={d.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>{d.visibility}</span>
                  <div style={{ width: "100%", height: (d.traffic / maxT) * 160, background: "linear-gradient(to top, var(--accent-yellow), var(--accent-yellow-dark))", borderRadius: "4px 4px 0 0" }} />
                  <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>{d.day_name}</span>
                </div>
              );
            })}
            {trendData.length === 0 && <div style={{ width: "100%", textAlign: "center", color: "var(--text-secondary)", padding: 40 }}>暂无数据</div>}
          </div>
        </div>
        <div className="info-card">
          <h4>关键词分类</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            {[{ name: "品牌建设", color: "#f5a623", pct: 25 }, { name: "GEO优化", color: "#4ade80", pct: 30 }, { name: "SEO优化", color: "#60a5fa", pct: 25 }, { name: "内容建设", color: "#f472b6", pct: 20 }].map(c => (
              <div key={c.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span>{c.name}</span><span style={{ color: c.color }}>{c.pct}%</span>
                </div>
                <div className="progress-bar"><div className="fill" style={{ width: c.pct + "%", background: c.color }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports list */}
      <div className="info-card">
        <h4>报表记录</h4>
        <table className="data-table" style={{ marginTop: 12 }}>
          <thead><tr><th>标题</th><th>类型</th><th>时间</th><th>操作</th></tr></thead>
          <tbody>
            {reports.length === 0 ? <tr><td colSpan={4} style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>暂无报表，点击"生成报表"创建</td></tr>
            : reports.map(r => (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td><span className="badge badge-info">{r.report_type}</span></td>
                <td>{r.created_at?.split("T")[0]}</td>
                <td><button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12, color: "var(--accent-red)" }} onClick={() => handleDelete(r.id)}><Trash2 size={12} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Reports;
`, 'utf8');
console.log('Reports.jsx written');

console.log('Batch 3 done');