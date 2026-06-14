import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Pause, CheckCircle, XCircle, Clock, Zap, ChevronRight, Trash2, Plus, Bot, RefreshCw, MessageSquare } from "lucide-react";

const stepTypeIcons = {
  ai_chat: { icon: "🤖", color: "#8b5cf6", label: "AI 对话" },
  create_diagnosis: { icon: "🩺", color: "#22c55e", label: "创建诊断" },
  expand_keywords: { icon: "🔑", color: "#f59e0b", label: "关键词扩展" },
  keyword_index: { icon: "📊", color: "#06b6d4", label: "关键词指数" },
  ai_writing: { icon: "✍️", color: "#ec4899", label: "AI 写作" },
  check_trust: { icon: "🛡️", color: "#ef4444", label: "信任度检测" },
  generate_report: { icon: "📄", color: "#3b82f6", label: "生成报告" },
};

function WorkflowMode() {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWf, setSelectedWf] = useState(null);
  const [running, setRunning] = useState(false);
  const [stepResults, setStepResults] = useState({});
  const [runLog, setRunLog] = useState([]);
  const [userInput, setUserInput] = useState("");
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [newWf, setNewWf] = useState({ name: "", description: "", steps: [] });

  const loadWorkflows = useCallback(async () => {
    try {
      const resp = await fetch("/api/workflows");
      const data = await resp.json();
      setWorkflows(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { loadWorkflows(); }, [loadWorkflows]);

  const handleRunStep = async (wf, step) => {
    setRunLog(prev => [...prev, { time: new Date().toLocaleTimeString(), step: step.name, status: "running" }]);
    try {
      const resp = await fetch(`/api/workflows/${wf.id}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId: step.id, input: userInput }),
      });
      const data = await resp.json();
      setStepResults(prev => ({ ...prev, [step.id]: data.result }));
      setRunLog(prev => prev.map((l, i) => i === prev.length - 1 ? { ...l, status: "done" } : l));
      return data.result;
    } catch (e) {
      setRunLog(prev => prev.map((l, i) => i === prev.length - 1 ? { ...l, status: "error" } : l));
      return null;
    }
  };

  const handleRunAll = async (wf) => {
    setRunning(true);
    setStepResults({});
    setRunLog([{ time: new Date().toLocaleTimeString(), step: "开始执行工作流", status: "running" }]);

    for (const step of wf.steps) {
      await handleRunStep(wf, step);
    }

    setRunLog(prev => [...prev, { time: new Date().toLocaleTimeString(), step: "工作流执行完成", status: "done" }]);
    setRunning(false);
    loadWorkflows();
  };

  const handleDelete = async (id) => {
    if (!confirm("确定删除此工作流?")) return;
    await fetch(`/api/workflows/${id}`, { method: "DELETE" });
    if (selectedWf && selectedWf.id === id) setSelectedWf(null);
    loadWorkflows();
  };

  const handleCreate = async () => {
    if (!newWf.name.trim()) return alert("请输入工作流名称");
    const defaultSteps = [
      { id: "s1", type: "ai_chat", name: "AI 分析需求", prompt: "分析以下需求：" },
      { id: "s2", type: "expand_keywords", name: "关键词扩展", dependsOn: ["s1"] },
      { id: "s3", type: "generate_report", name: "生成报告", dependsOn: ["s2"] },
    ];
    await fetch("/api/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newWf.name, description: newWf.description, steps: defaultSteps }),
    });
    setShowCreate(false);
    setNewWf({ name: "", description: "", steps: [] });
    loadWorkflows();
  };

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none" };

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, background: "rgba(139,92,246,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={24} color="#8b5cf6" />
          </div>
          <div>
            <h2>工作流模式</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>串联平台功能，自动化执行多步骤任务</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => navigate("/ai-assistant")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border-color)", cursor: "pointer", fontSize: 13 }}><MessageSquare size={14} /> 对话模式</button>
          <button onClick={() => setShowCreate(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 8, background: "var(--accent-yellow)", color: "#000", border: "none", cursor: "pointer", fontWeight: 500, fontSize: 14 }}>
            <Plus size={16} /> 新建工作流
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, minHeight: 500 }}>
        {/* Workflow List */}
        <div style={{ width: 320, flexShrink: 0 }}>
          {workflows.map(wf => (
            <div key={wf.id}
              onClick={() => { setSelectedWf(wf); setStepResults({}); setRunLog([]); }}
              style={{ padding: "16px", background: selectedWf && selectedWf.id === wf.id ? "rgba(139,92,246,0.1)" : "var(--bg-card)", border: `1px solid ${selectedWf && selectedWf.id === wf.id ? "#8b5cf6" : "var(--border-color)"}`, borderRadius: 10, cursor: "pointer", marginBottom: 10, transition: "all 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{wf.name}</h3>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>{wf.description}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(wf.id); }} style={{ background: "none", border: "none", color: "var(--accent-red)", cursor: "pointer", opacity: 0.5, padding: 4 }}>
                  <Trash2 size={14} />
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                {wf.steps.map((step, i) => {
                  const st = stepTypeIcons[step.type] || { icon: "⚙️", color: "#666", label: step.type };
                  return (
                    <React.Fragment key={step.id}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, fontSize: 11, background: `${st.color}20`, color: st.color }}>
                        {st.icon} {step.name}
                      </span>
                      {i < wf.steps.length - 1 && <ChevronRight size={12} color="var(--text-secondary)" />}
                    </React.Fragment>
                  );
                })}
              </div>
              {wf.status !== 'idle' && (
                <div style={{ marginTop: 8, fontSize: 11, color: wf.status === 'completed' ? 'var(--accent-green)' : 'var(--accent-yellow)' }}>
                  {wf.status === 'completed' ? '✓ 已完成' : wf.status === 'running' ? '● 执行中...' : wf.status}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Workflow Detail */}
        <div style={{ flex: 1 }}>
          {selectedWf ? (
            <>
              {/* Input */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>输入参数</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="输入品牌名称或关键词，多个用逗号分隔..." style={{ ...inputStyle, flex: 1 }} />
                  <button onClick={() => handleRunAll(selectedWf)} disabled={running} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 8, background: running ? "#333" : "#8b5cf6", color: "#fff", border: "none", cursor: running ? "wait" : "pointer", fontWeight: 500, fontSize: 14, whiteSpace: "nowrap" }}>
                    {running ? <><RefreshCw size={16} className="spin" /> 执行中...</> : <><Play size={16} /> 一键执行全部</>}
                  </button>
                </div>
              </div>

              {/* Steps */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 10, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>执行步骤</div>
                {selectedWf.steps.map((step, i) => {
                  const st = stepTypeIcons[step.type] || { icon: "⚙️", color: "#666", label: step.type };
                  const result = stepResults[step.id];
                  const logEntry = runLog.find(l => l.step === step.name);
                  return (
                    <div key={step.id} style={{ display: "flex", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: i < selectedWf.steps.length - 1 ? "1px solid var(--border-color)" : "none" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${st.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                        {st.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 500, fontSize: 14 }}>步骤 {i + 1}: {step.name}</span>
                          <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: `${st.color}20`, color: st.color }}>{st.label}</span>
                          {logEntry && (
                            logEntry.status === "done" ? <CheckCircle size={14} color="var(--accent-green)" /> :
                            logEntry.status === "error" ? <XCircle size={14} color="var(--accent-red)" /> :
                            <Clock size={14} color="var(--accent-yellow)" className="spin" />
                          )}
                        </div>
                        {step.prompt && <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Prompt: {step.prompt}</div>}
                        {result && (
                          <div style={{ marginTop: 8, padding: "10px 14px", borderRadius: 8, background: "var(--bg-secondary)", fontSize: 13, lineHeight: 1.6, maxHeight: 200, overflowY: "auto", whiteSpace: "pre-wrap" }}>
                            {typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}
                          </div>
                        )}
                        <button onClick={() => handleRunStep(selectedWf, step)} disabled={running} style={{ marginTop: 6, padding: "4px 12px", borderRadius: 6, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontSize: 12 }}>
                          单步执行
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Run Log */}
              {runLog.length > 0 && (
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>执行日志</div>
                  {runLog.map((log, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 12 }}>
                      <span style={{ color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>{log.time}</span>
                      {log.status === "done" ? <CheckCircle size={12} color="var(--accent-green)" /> :
                       log.status === "error" ? <XCircle size={12} color="var(--accent-red)" /> :
                       <Clock size={12} color="var(--accent-yellow)" />}
                      <span>{log.step}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, color: "var(--text-secondary)" }}>
              <Zap size={48} style={{ marginBottom: 16, opacity: 0.2 }} />
              <p style={{ fontSize: 14 }}>选择左侧工作流查看详情</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>或点击"新建工作流"创建自定义流程</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: 32, width: 480 }}>
            <h3 style={{ marginBottom: 20 }}>新建工作流</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-secondary)" }}>工作流名称</label>
              <input value={newWf.name} onChange={e => setNewWf(prev => ({ ...prev, name: e.target.value }))} placeholder="如：品牌GEO全流程优化" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-secondary)" }}>描述</label>
              <input value={newWf.description} onChange={e => setNewWf(prev => ({ ...prev, description: e.target.value }))} placeholder="简短描述工作流用途" style={inputStyle} />
            </div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>默认包含: AI分析 → 关键词扩展 → 生成报告，可在创建后编辑步骤</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowCreate(false)} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}>取消</button>
              <button onClick={handleCreate} style={{ padding: "8px 20px", borderRadius: 8, background: "#8b5cf6", color: "#fff", border: "none", cursor: "pointer", fontWeight: 500 }}>创建</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}

export default WorkflowMode;

