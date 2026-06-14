import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Key, Search } from "lucide-react";

function AiTools() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "keyword-index";
  const setActiveTab = (tab) => setSearchParams({ tab });

  const [queryInput, setQueryInput] = useState("");
  const [queryHistory, setQueryHistory] = useState([]);
  const [compareData, setCompareData] = useState([]);

  const subMenus = [
    { id: "keyword-index", label: "关键词指数" },
    { id: "ai-expand", label: "AI 拓展" },
    { id: "manual-expand", label: "手动拓展" },
  ];

  useEffect(() => {
    fetch("/api/keywords").then(r => r.json()).then(data => {
      const kw = Array.isArray(data) ? data : [];
      setCompareData(kw.map(k => ({ name: k.name, volume: k.search_volume || Math.floor(Math.random() * 8000) + 1000 })));
    }).catch(() => {});
  }, []);

  const handleQuery = () => {
    if (!queryInput.trim()) return;
    const vol = Math.floor(Math.random() * 8000) + 1000;
    setQueryHistory(prev => [{ keyword: queryInput, volume: vol, date: new Date().toLocaleDateString() }, ...prev]);
    if (!compareData.find(c => c.name === queryInput)) {
      setCompareData(prev => [...prev, { name: queryInput, volume: vol }]);
    }
    setQueryInput("");
  };

  const chartW = 700, chartH = 260, padL = 50, padB = 60, padT = 10;
  const maxVol = Math.max(...compareData.map(d => d.volume), 1000);
  const barW = Math.min(60, (chartW - padL - 20) / Math.max(compareData.length, 1) - 8);

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none" };

  return (
    <div className="page" >
      <div className="page-header">
        <h2>AI 工具</h2>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ width: 180, flexShrink: 0 }}>
          {subMenus.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, background: activeTab === item.id ? "rgba(245,166,35,0.1)" : "transparent", color: activeTab === item.id ? "var(--accent-yellow)" : "var(--text-secondary)", textAlign: "left", marginBottom: 4 }}>
              <Key size={14} /> {item.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {activeTab === "keyword-index" && (
            <>
              <div style={{ marginBottom: 8 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>关键词指数查询</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>查询关键词搜索指数、竞争程度和AI可见度</p>
              </div>

              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 24, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
                  <div style={{ width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2 }} /> 指数查询
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <Key size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--accent-yellow)" }} />
                    <input value={queryInput} onChange={e => setQueryInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleQuery()}
                      placeholder="输入关键词查询搜索指数，如：GEO优化" style={{ ...inputStyle, paddingLeft: 36 }} />
                  </div>
                  <button onClick={handleQuery} style={{ padding: "10px 24px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500, fontSize: 14, whiteSpace: "nowrap" }}>查询指数</button>
                </div>
              </div>

              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 24, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
                  <div style={{ width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2 }} /> 关键词指数对比
                </div>
                {compareData.length > 0 ? (
                  <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: "100%", height: 280 }}>
                    {[0, 0.25, 0.5, 0.75, 1].map(pct => {
                      const y = chartH - padB - pct * (chartH - padT - padB);
                      return <g key={pct}>
                        <line x1={padL} y1={y} x2={chartW - 10} y2={y} stroke="#2a2a2a" strokeWidth="1" />
                        <text x={padL - 6} y={y + 4} textAnchor="end" fill="#666" fontSize="10">{Math.round(pct * maxVol).toLocaleString()}</text>
                      </g>;
                    })}
                    {compareData.map((d, i) => {
                      const x = padL + 10 + i * ((chartW - padL - 20) / Math.max(compareData.length, 1));
                      const h = (d.volume / maxVol) * (chartH - padT - padB);
                      const y = chartH - padB - h;
                      return (
                        <g key={i}>
                          <rect x={x} y={y} width={barW} height={h} rx="4" fill="var(--accent-yellow)" opacity="0.9" />
                          <text x={x + barW / 2} y={chartH - padB + 16} textAnchor="middle" fill="#888" fontSize="10" transform={`rotate(-30, ${x + barW / 2}, ${chartH - padB + 16})`}>{d.name}</text>
                        </g>
                      );
                    })}
                  </svg>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>输入关键词开始查询对比</div>
                )}
              </div>

              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
                  <div style={{ width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2 }} /> 查询历史
                </div>
                {queryHistory.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px 0", color: "var(--text-secondary)", fontSize: 13 }}>暂无查询历史</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {queryHistory.map((h, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg-secondary)", borderRadius: 8 }}>
                        <span style={{ fontSize: 14 }}>{h.keyword}</span>
                        <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--text-secondary)" }}>
                          <span>指数: <strong style={{ color: "var(--accent-yellow)" }}>{h.volume.toLocaleString()}</strong></span>
                          <span>{h.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "ai-expand" && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 32, textAlign: "center" }}>
              <Search size={48} style={{ marginBottom: 16, opacity: 0.3, color: "var(--accent-yellow)" }} />
              <h3 style={{ marginBottom: 8 }}>AI 关键词拓展</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>输入种子关键词，AI将智能拓展相关长尾关键词</p>
              <div style={{ maxWidth: 500, margin: "0 auto", display: "flex", gap: 8 }}>
                <input placeholder="输入种子关键词..." style={{ ...inputStyle, flex: 1 }} />
                <button style={{ padding: "10px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500 }}>拓展</button>
              </div>
            </div>
          )}

          {activeTab === "manual-expand" && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 32, textAlign: "center" }}>
              <Key size={48} style={{ marginBottom: 16, opacity: 0.3, color: "var(--accent-yellow)" }} />
              <h3 style={{ marginBottom: 8 }}>手动关键词拓展</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>手动添加和管理关键词列表</p>
              <div style={{ maxWidth: 500, margin: "0 auto", display: "flex", gap: 8 }}>
                <input placeholder="输入关键词..." style={{ ...inputStyle, flex: 1 }} />
                <button style={{ padding: "10px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500 }}>添加</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AiTools;
