import React, { useState, useEffect } from "react";
import { Flag, Plus, Target, CheckCircle2, Clock, TrendingUp, ChevronRight, Trophy, Star, BarChart3, Zap, Award, Trash2, Edit3, ListTodo } from "lucide-react";
import "../styles/pages.css";

const categoryColors = { "品牌建设": "#f5a623", "SEO优化": "#60a5fa", "信任度": "#4ade80", "流量增长": "#a78bfa", "内容建设": "#f472b6" };
const statusConfig = {
  active: { label: "进行中", color: "#4ade80", bg: "rgba(74,222,128,0.15)" },
  completed: { label: "已达成", color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
  paused: { label: "已暂停", color: "#f5a623", bg: "rgba(245,166,35,0.15)" },
};

function Goals() {
  const [goals, setGoals] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", category: "品牌建设", deadline: "", status: "active" });
  const [newMilestone, setNewMilestone] = useState("");

  const load = () => fetch("/api/goals").then(r => r.json()).then(setGoals).catch(() => {});
  useEffect(() => { load(); }, []);

  const filteredGoals = goals.filter(goal => {
    const matchTab = activeTab === "all" || goal.status === activeTab;
    const matchSearch = !searchQuery || goal.title.toLowerCase().includes(searchQuery.toLowerCase()) || (goal.description || "").toLowerCase().includes(searchQuery.toLowerCase()) || (goal.category || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  const toggleMilestone = (goalId, milestoneId) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const milestones = goal.milestones.map(m => m.id === milestoneId ? { ...m, done: !m.done } : m);
    const progress = Math.round((milestones.filter(m => m.done).length / milestones.length) * 100);
    const status = progress === 100 ? "completed" : goal.status === "completed" ? "active" : goal.status;
    fetch("/api/goals/" + goalId, { method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...goal, milestones, progress, status })
    }).then(() => load());
  };

  const handleGoalSubmit = () => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? "/api/goals/" + editItem.id : "/api/goals";
    fetch(url, { method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, milestones: editItem?.milestones || [], progress: editItem?.progress || 0 })
    }).then(() => { setShowForm(false); setEditItem(null); setForm({ title: "", description: "", category: "品牌建设", deadline: "", status: "active" }); load(); });
  };

  const handleDeleteGoal = (id) => { if (confirm("确定删除此目标?")) fetch("/api/goals/" + id, { method: "DELETE" }).then(load); };

  const addMilestone = (goalId) => {
    if (!newMilestone.trim()) return;
    const goal = goals.find(g => g.id === goalId);
    const milestones = [...(goal.milestones || []), { title: newMilestone, done: false }];
    fetch("/api/goals/" + goalId, { method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...goal, milestones, progress: Math.round((milestones.filter(m => m.done).length / milestones.length) * 100) })
    }).then(() => { setNewMilestone(""); load(); });
  };

  const handleDeleteMilestone = (goalId, msId) => {
    const goal = goals.find(g => g.id === goalId);
    const milestones = goal.milestones.filter(m => m.id !== msId);
    fetch("/api/goals/" + goalId, { method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...goal, milestones, progress: milestones.length ? Math.round((milestones.filter(m => m.done).length / milestones.length) * 100) : 0 })
    }).then(load);
  };

  const stats = { total: goals.length, completed: goals.filter(g => g.status === "completed").length, active: goals.filter(g => g.status === "active").length, avgProgress: goals.length ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length) : 0 };

  return (
    <div className="page">
      <div className="page-header"><h2>目标追踪</h2><p>设定和追踪关键业务目标，可视化进度</p></div>
      <div className="stat-grid">
        <div className="stat-block"><div className="stat-label">目标总数</div><div className="stat-value yellow">{stats.total}</div></div>
        <div className="stat-block"><div className="stat-label">已达成</div><div className="stat-value" style={{ color: "#60a5fa" }}>{stats.completed}</div></div>
        <div className="stat-block"><div className="stat-label">进行中</div><div className="stat-value" style={{ color: "#4ade80" }}>{stats.active}</div></div>
        <div className="stat-block"><div className="stat-label">平均进度</div><div className="stat-value yellow">{stats.avgProgress}%</div></div>
      </div>
      <div className="tabs">
        {[["all", "全部"], ["active", "进行中"], ["completed", "已达成"], ["paused", "已暂停"]].map(([k, v]) => (
          <button key={k} className={`tab ${activeTab === k ? "active" : ""}`} onClick={() => setActiveTab(k)}>{v}</button>
        ))}
      </div>
      <div className="toolbar">
        <div className="search-box"><input placeholder="搜索目标..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ border: "none", background: "none", outline: "none", color: "var(--text-primary)", fontSize: 14, width: 200 }} /></div>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setForm({ title: "", description: "", category: "品牌建设", deadline: "", status: "active" }); setShowForm(true); }}><Plus size={16} /> 创建目标</button>
      </div>
      {showForm && (
        <div className="info-card" style={{ maxWidth: 600, marginBottom: 16 }}>
          <h4>{editItem ? "编辑目标" : "新建目标"}</h4>
          <div className="form-group"><label>目标标题</label><input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
          <div className="form-group"><label>描述</label><textarea className="form-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div className="form-group"><label>分类</label><select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {Object.keys(categoryColors).map(c => <option key={c}>{c}</option>)}
            </select></div>
            <div className="form-group"><label>状态</label><select className="form-input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select></div>
          </div>
          <div className="form-group"><label>截止日期</label><input className="form-input" type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} /></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={handleGoalSubmit}>{editItem ? "保存" : "创建"}</button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>取消</button>
          </div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filteredGoals.map(goal => {
          const isExpanded = expandedGoal === goal.id;
          const completedMilestones = (goal.milestones || []).filter(m => m.done).length;
          const catColor = categoryColors[goal.category] || "#888";
          return (
            <div key={goal.id} className="info-card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", cursor: "pointer" }} onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{goal.title}</span>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500, color: statusConfig[goal.status]?.color || "#888", background: statusConfig[goal.status]?.bg || "rgba(136,136,136,0.15)" }}>{statusConfig[goal.status]?.label || goal.status}</span>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500, color: catColor, border: `1px solid ${catColor}30` }}>{goal.category}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>{goal.description}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}><div style={{ fontSize: 28, fontWeight: 700, color: "var(--accent-yellow)" }}>{goal.progress}%</div><div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{completedMilestones}/{(goal.milestones || []).length} 里程碑</div></div>
                <div style={{ width: 120, flexShrink: 0 }}><div className="progress-bar"><div className="fill" style={{ width: goal.progress + "%", background: goal.progress === 100 ? "#4ade80" : goal.progress > 50 ? "#f5a623" : "#60a5fa" }} /></div></div>
                <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  <button className="btn btn-secondary" style={{ padding: "4px 8px" }} onClick={(e) => { e.stopPropagation(); setEditItem(goal); setForm({ title: goal.title, description: goal.description, category: goal.category, deadline: goal.deadline || "", status: goal.status }); setShowForm(true); }}><Edit3 size={12} /></button>
                  <button className="btn btn-secondary" style={{ padding: "4px 8px", color: "var(--accent-red)" }} onClick={(e) => { e.stopPropagation(); handleDeleteGoal(goal.id); }}><Trash2 size={12} /></button>
                  <ChevronRight size={16} style={{ color: "var(--text-secondary)", transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </div>
              </div>
              {isExpanded && (
                <div style={{ borderTop: "1px solid var(--border-color)", padding: "16px 24px" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <input className="form-input" placeholder="添加新里程碑..." value={newMilestone} onChange={e => setNewMilestone(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addMilestone(goal.id); }} style={{ flex: 1 }} />
                    <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: 13 }} onClick={() => addMilestone(goal.id)}><Plus size={14} /> 添加</button>
                  </div>
                  {(goal.milestones || []).map(ms => (
                    <div key={ms.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, marginBottom: 4, background: "var(--bg-secondary)", border: "1px solid var(--border-color)", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); toggleMilestone(goal.id, ms.id); }}>
                      {ms.done ? <CheckCircle2 size={18} color="#4ade80" /> : <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--text-secondary)" }} />}
                      <span style={{ flex: 1, fontSize: 14, textDecoration: ms.done ? "line-through" : "none", color: ms.done ? "var(--text-secondary)" : "var(--text-primary)" }}>{ms.title}</span>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent-red)" }} onClick={(e) => { e.stopPropagation(); handleDeleteMilestone(goal.id, ms.id); }}><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {filteredGoals.length === 0 && (
        <div className="empty-state"><div className="empty-icon"><Flag size={40} /></div><h3>暂无目标</h3><p>设定您的第一个业务目标</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> 创建目标</button></div>
      )}
    </div>
  );
}
export default Goals;
