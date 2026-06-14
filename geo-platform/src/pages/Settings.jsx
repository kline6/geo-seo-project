import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Key, RefreshCw, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

const providers = [
  { id: "gemini", name: "Google Gemini", icon: "🔷", desc: "配置 Google Gemini API 进行 AI 写作和诊断", defaultUrl: "https://generativelanguage.googleapis.com/v1beta/models/", defaultModel: "gemini-2.0-flash", defaultTokens: 8192 },
  { id: "openai", name: "OpenAI", icon: "🟢", desc: "配置 OpenAI API (GPT-4, GPT-5 等)", defaultUrl: "https://api.openai.com/v1/chat/completions", defaultModel: "gpt-4.1", defaultTokens: 4096 },
  { id: "anthropic", name: "Anthropic Claude", icon: "🟠", desc: "配置 Anthropic Claude API", defaultUrl: "https://api.anthropic.com/v1/messages", defaultModel: "claude-sonnet-4-20250514", defaultTokens: 8192 },
  { id: "xai", name: "xAI Grok", icon: "⚫", desc: "配置 xAI Grok API", defaultUrl: "https://api.x.ai/v1/chat/completions", defaultModel: "grok-3", defaultTokens: 4096 },
  { id: "mistral", name: "Mistral", icon: "🔵", desc: "配置 Mistral AI API", defaultUrl: "https://api.mistral.ai/v1/chat/completions", defaultModel: "mistral-large", defaultTokens: 8192 },
  { id: "mimo", name: "小米 MiMo", icon: "🟡", desc: "配置小米 MiMo API", defaultUrl: "https://token-plan-sgp.xiaomimimo.com/v1/chat/completions", defaultModel: "mimo-v2.5-pro", defaultTokens: 32768 },
];

function Settings() {
  const [activeProvider, setActiveProvider] = useState("mimo");
  const [configs, setConfigs] = useState({});
  const [showKeys, setShowKeys] = useState({});
  const [testResults, setTestResults] = useState({});
  const [isTesting, setIsTesting] = useState({});

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (data && typeof data === "object") setConfigs(data);
    }).catch(() => {});
  }, []);

  const getConfig = (id) => configs[id] || { apiKey: "", apiUrl: providers.find(p => p.id === id)?.defaultUrl || "", model: providers.find(p => p.id === id)?.defaultModel || "", maxTokens: providers.find(p => p.id === id)?.defaultTokens || 4096, enabled: false };

  const updateConfig = (id, field, value) => {
    setConfigs(prev => ({ ...prev, [id]: { ...getConfig(id), [field]: value } }));
  };

  const handleSave = () => {
    const cleanConfigs = {};
    for (const [key, val] of Object.entries(configs)) {
      cleanConfigs[key] = {
        apiKey: val.apiKey || "",
        apiUrl: val.apiUrl || "",
        model: val.model || "",
        maxTokens: val.maxTokens || 4096,
        enabled: !!val.enabled,
      };
    }
    fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cleanConfigs) })
      .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(d => { if (d.success) alert("配置已保存"); else alert("保存失败: " + (d.error || "未知错误")); })
      .catch(e => alert("保存失败: " + e.message));
  };

  const handleSaveProvider = (id) => {
    const cfg = getConfig(id);
    fetch(`/api/settings/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: cfg.apiKey || "", apiUrl: cfg.apiUrl || "", model: cfg.model || "", maxTokens: cfg.maxTokens || 4096, enabled: !!cfg.enabled }) })
      .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(d => { if (d.success) alert("配置已保存"); else alert("保存失败"); })
      .catch(e => alert("保存失败: " + e.message));
  };

  const handleTest = (id) => {
    setIsTesting(prev => ({ ...prev, [id]: true }));
    setTestResults(prev => ({ ...prev, [id]: null }));
    fetch(`/api/settings/${id}/test`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(getConfig(id)) })
      .then(r => r.json()).then(data => {
        setTestResults(prev => ({ ...prev, [id]: { success: data.success, latency: data.latency } }));
      }).catch(() => {
        setTestResults(prev => ({ ...prev, [id]: { success: false, error: "连接失败" } }));
      }).finally(() => setIsTesting(prev => ({ ...prev, [id]: false })));
  };

  const handleReset = (id) => {
    const p = providers.find(x => x.id === id);
    setConfigs(prev => ({ ...prev, [id]: { apiKey: getConfig(id).apiKey, apiUrl: p.defaultUrl, model: p.defaultModel, maxTokens: p.defaultTokens, enabled: getConfig(id).enabled } }));
  };

  const current = getConfig(activeProvider);
  const currentProvider = providers.find(p => p.id === activeProvider);

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none" };
  const labelStyle = { fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-secondary)" };

  return (
    <div className="page" >
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, background: "rgba(245,166,35,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SettingsIcon size={24} color="var(--accent-yellow)" />
          </div>
          <div>
            <h2>设置</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>配置您的 GEO Platform 桌面应用</p>
          </div>
        </div>
      </div>

      {/* AI API Config Section */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
          <div style={{ width: 4, height: 18, background: "var(--accent-yellow)", borderRadius: 2 }} /> 🔑 AI API 配置
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 16 }}>配置至少一个 AI 服务商的 API Key，即可使用所有 AI 功能</p>

        {/* Provider Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--border-color)", paddingBottom: 0, overflowX: "auto" }}>
          {providers.map(p => {
            const cfg = getConfig(p.id);
            const isConnected = cfg.apiKey && cfg.apiKey.length > 5;
            return (
              <button key={p.id} onClick={() => setActiveProvider(p.id)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", border: "none", borderBottom: activeProvider === p.id ? "2px solid var(--accent-yellow)" : "2px solid transparent", cursor: "pointer", fontSize: 13, fontWeight: 500, background: "transparent", color: activeProvider === p.id ? "var(--accent-yellow)" : "var(--text-secondary)", whiteSpace: "nowrap", marginBottom: -1 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: isConnected ? "var(--accent-green)" : "var(--accent-red)" }} />
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Provider Config Form */}
        {currentProvider && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 28 }}>{currentProvider.icon}</span>
              <div>
                <h3 style={{ fontSize: 16 }}>{currentProvider.name}</h3>
                <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{currentProvider.desc}</p>
              </div>
            </div>

            {/* API Key */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>API Key</label>
              <div style={{ position: "relative" }}>
                <input type={showKeys[activeProvider] ? "text" : "password"} value={current.apiKey || ""} onChange={e => updateConfig(activeProvider, "apiKey", e.target.value)}
                  placeholder={`输入 ${currentProvider.name} API Key`} style={{ ...inputStyle, paddingRight: 40 }} />
                <button onClick={() => setShowKeys(p => ({ ...p, [activeProvider]: !p[activeProvider] }))}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                  {showKeys[activeProvider] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* API URL */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>API URL</label>
              <input value={current.apiUrl || ""} onChange={e => updateConfig(activeProvider, "apiUrl", e.target.value)} style={inputStyle} />
            </div>

            {/* Model */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>模型</label>
              <input value={current.model || ""} onChange={e => updateConfig(activeProvider, "model", e.target.value)} style={inputStyle} />
            </div>

            {/* Max Tokens */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>最大Token数</label>
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <button onClick={() => updateConfig(activeProvider, "maxTokens", Math.max(512, (current.maxTokens || 4096) - 1024))}
                  style={{ width: 40, height: 40, borderRadius: "8px 0 0 8px", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", cursor: "pointer", fontSize: 18 }}>−</button>
                <input type="number" value={current.maxTokens || 4096} onChange={e => updateConfig(activeProvider, "maxTokens", parseInt(e.target.value) || 4096)}
                  style={{ width: 100, height: 40, textAlign: "center", border: "1px solid var(--border-color)", borderLeft: "none", borderRight: "none", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none" }} />
                <button onClick={() => updateConfig(activeProvider, "maxTokens", Math.min(128000, (current.maxTokens || 4096) + 1024))}
                  style={{ width: 40, height: 40, borderRadius: "0 8px 8px 0", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", cursor: "pointer", fontSize: 18 }}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button onClick={() => handleTest(activeProvider)} disabled={isTesting[activeProvider]}
                style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid var(--accent-yellow)", background: "transparent", color: "var(--accent-yellow)", cursor: isTesting[activeProvider] ? "wait" : "pointer", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                {isTesting[activeProvider] ? <><RefreshCw size={14} className="spin" /> 测试中</> : "测试连接"}
              </button>
              <button onClick={() => handleReset(activeProvider)} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontSize: 13 }}>
                重置为默认
              </button>
              {testResults[activeProvider] && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: testResults[activeProvider].success ? "var(--accent-green)" : "var(--accent-red)" }}>
                  {testResults[activeProvider].success ? <><CheckCircle size={14} /> 连接成功 {testResults[activeProvider].latency}ms</> : <><XCircle size={14} /> 连接失败</>}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Save All */}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleSave} style={{ padding: "10px 24px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
          保存所有配置
        </button>
      </div>
    </div>
  );
}

export default Settings;



