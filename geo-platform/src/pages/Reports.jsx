import React, { useState, useEffect } from "react";
import { BarChart3, FileText, Plus, Trash2, TrendingUp, Target, CheckCircle, Stethoscope, RefreshCw } from "lucide-react";

function Reports() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ keywords: 0, articles: 0, published: 0, diagnoses: 0 });
  const [trendData, setTrendData] = useState([]);
  const [categories, setCategories] = useState([]);

  const load = () => {
    fetch("/api/reports").then(r => r.json()).then(data => setReports(Array.isArray(data) ? data : [])).catch(() => {});
    fetch("/api/dashboard").then(r => r.json()).then(d => {
      setStats({ keywords: d.keywordCount || 0, articles: d.articleCount || 0, published: 0, diagnoses: d.diagnosisCount || 0 });
    }).catch(() => {});
    fetch("/api/keywords").then(r => r.json()).then(data => {
      const kw = Array.isArray(data) ? data : [];
      const catMap = {};
      kw.forEach(k => { const c = k.category || "未分类"; catMap[c] = (catMap[c] || 0) + 1; });
      const total = kw.length || 1;
      const colors = ["#60a5fa", "#4ade80", "#f5a623", "#f472b6", "#a78bfa"];
      setCategories(Object.entries(catMap).map(([name, count], i) => ({ name, count, pct: Math.round(count / total * 100), color: colors[i % colors.length] })));
    }).catch(() => {});
    // Generate mock trend data
    const days = ["06-07", "06-08", "06-09", "06-10", "06-11", "06-12", "06-13"];
    setTrendData(days.map((d, i) => ({ date: d, value: 55 + Math.round(Math.random() * 25) })));
  };
  useEffect(() => { load(); }, []);

  const handleGenerate = () => {
    fetch("/api/reports", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "数据报告 " + new Date().toLocaleDateString(), report_type: "auto" })
    }).then(() => load());
  };

  const handleDelete = (id) => { if (confirm("确定删除?")) fetch("/api/reports/" + id, { method: "DELETE" }).then(load); };

  // SVG Line Chart
  const chartW = 600, chartH = 180, padL = 40, padB = 24;
  const maxVal = Math.max(...trendData.map(d => d.value), 80);
  const points = trendData.map((d, i) => ({
    x: padL + (i / Math.max(trendData.length - 1, 1)) * (chartW - padL - 20),
    y: chartH - padB - (d.value / maxVal) * (chartH - padB - 10),
    label: d.date,
    value: d.value,
  }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = linePath + ` L ${points[points.length - 1]?.x || 0} ${chartH - padB} L ${points[0]?.x || 0} ${chartH - padB} Z`;

  // Donut chart for categories
  const donutR = 60, donutStroke = 24, donutCx = 80, donutCy = 80;
  let cumPct = 0;
  const donutSegments = categories.map(cat => {
    const start = cumPct;
    cumPct += cat.pct;
    return { ...cat, start, end: cumPct };
  });

  const statCards = [
    { label: "关键词总数", value: stats.keywords, sub: "已收录", icon: Target, color: "#f5a623" },
    { label: "文章总数", value: stats.articles, sub: "已创建", icon: FileText, color: "#f5a623" },
    { label: "已发布", value: stats.published, sub: "发布成功", icon: CheckCircle, color: "#4ade80" },
    { label: "诊断次数", value: stats.diagnoses, sub: "已完成", icon: Stethoscope, color: "#f5a623" },
  ];

  return (
    <div className="page" >
      <div className="page-header">
        <div>
          <h2>数据报表</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>查看数据概览、趋势分析和报表管理</p>
        </div>
        <button onClick={handleGenerate} style={{ marginLeft: "auto", padding: "8px 16px", borderRadius: 8, border: "1px solid var(--accent-yellow)", background: "transparent", color: "var(--accent-yellow)", cursor: "pointer", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
          <Plus size={14} /> 生成报表
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {statCards.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{s.sub}</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: s.color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={18} color={s.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Visibility Trend */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            <div style={{ width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2 }} /> 可见度趋势
          </div>
          {trendData.length > 0 ? (
            <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: "100%", height: 200 }}>
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map(pct => {
                const y = chartH - padB - pct * (chartH - padB - 10);
                return <g key={pct}><line x1={padL} y1={y} x2={chartW - 20} y2={y} stroke="#2a2a2a" strokeWidth="1" /><text x={padL - 6} y={y + 4} textAnchor="end" fill="#666" fontSize="10">{Math.round(pct * maxVal)}</text></g>;
              })}
              {/* Area fill */}
              <path d={areaPath} fill="rgba(245,166,35,0.1)" />
              {/* Line */}
              <path d={linePath} fill="none" stroke="var(--accent-yellow)" strokeWidth="2" strokeLinejoin="round" />
              {/* Dots */}
              {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--accent-yellow)" stroke="var(--bg-card)" strokeWidth="2" />)}
              {/* X labels */}
              {points.map((p, i) => <text key={i} x={p.x} y={chartH - 4} textAnchor="middle" fill="#666" fontSize="10">{p.label}</text>)}
            </svg>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>暂无趋势数据</div>
          )}
        </div>

        {/* Keyword Categories */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            <div style={{ width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2 }} /> 关键词分类
          </div>
          {categories.length > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                {donutSegments.map((seg, i) => {
                  const startAngle = (seg.start / 100) * 360 - 90;
                  const endAngle = (seg.end / 100) * 360 - 90;
                  const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
                  const r = donutR;
                  const x1 = donutCx + r * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = donutCy + r * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = donutCx + r * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = donutCy + r * Math.sin((endAngle * Math.PI) / 180);
                  return <path key={i} d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`} fill="none" stroke={seg.color} strokeWidth={donutStroke} strokeLinecap="round" />;
                })}
                <text x={donutCx} y={donutCy + 4} textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="600">{categories.reduce((s, c) => s + c.count, 0)}</text>
              </svg>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {categories.map(c => (
                  <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{c.name}</span>
                    <span style={{ color: c.color, fontWeight: 500 }}>{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>暂无分类数据</div>
          )}
        </div>
      </div>

      {/* Reports List */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-color)", fontSize: 15, fontWeight: 600 }}>报表记录</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead><tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            {["标题", "类型", "时间", "操作"].map(h => (
              <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontWeight: 500, color: "var(--text-secondary)", fontSize: 13 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {reports.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>暂无报表，点击"生成报表"创建</td></tr>
            ) : reports.map(r => (
              <tr key={r.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "12px 24px" }}>{r.title}</td>
                <td style={{ padding: "12px 24px" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: "rgba(100,150,255,0.1)", color: "#6096ff" }}>{r.report_type}</span></td>
                <td style={{ padding: "12px 24px", color: "var(--text-secondary)" }}>{r.created_at?.split("T")[0]}</td>
                <td style={{ padding: "12px 24px" }}>
                  <button onClick={() => handleDelete(r.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--accent-red)", background: "transparent", color: "var(--accent-red)", cursor: "pointer", fontSize: 12 }}><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
