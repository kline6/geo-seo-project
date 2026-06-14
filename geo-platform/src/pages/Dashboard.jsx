import React, { useState, useEffect } from 'react';
import {
  Stethoscope, PenTool, Target, BarChart3,
  TrendingUp, FileText, ChevronRight, Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [hotKeywords, setHotKeywords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setStats).catch(() => {});
    fetch('/api/keywords?sort=volume&limit=3').then(r => r.json()).then(data => {
      setHotKeywords(Array.isArray(data) ? data.slice(0, 3) : []);
    }).catch(() => {});
  }, []);

  const kwCount = stats?.keywordCount ?? 0;
  const artCount = stats?.articleCount ?? 0;
  const diagCount = stats?.diagnosisCount ?? 0;
  const avgVis = stats?.avgVisibility ?? 0;

  const quickActions = [
    { icon: Stethoscope, label: '新建诊断', desc: '分析AI可见度', path: '/ai-diagnosis' },
    { icon: PenTool, label: 'AI 写作', desc: '生成内容', path: '/ai-writing' },
    { icon: Target, label: '关键词', desc: '管理关键词', path: '/materials' },
    { icon: BarChart3, label: '数据分析', desc: '查看详细分析', path: '/reports' },
  ];

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div className="welcome-avatar">G</div>
        <div className="welcome-text">
          <h1>欢迎回来，<span>GEO用户</span></h1>
          <p>GEO 优化工作台<span> | </span></p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-chip"><span className="dot yellow" /><span className="value">{kwCount}</span><span className="label">关键词</span></div>
        <div className="stat-chip"><span className="dot yellow" /><span className="value">{artCount}</span><span className="label">文章</span></div>
        <div className="stat-chip"><span className="dot yellow" /><span className="value">{diagCount}</span><span className="label">诊断</span></div>
        <div className="stat-chip"><span className="dot yellow" /><span className="value">{avgVis}%</span><span className="label">可见度</span></div>
      </div>

      <div className="section-card metric-cards-section">
        <div className="section-header"><div className="section-title">数据概览</div></div>
        <div className="metric-cards">
          <div className="metric-card">
            <div className="metric-info"><h3>关键词总数</h3><div className="metric-value highlight">{kwCount}</div></div>
            <div className="metric-icon"><Target size={20} /></div>
          </div>
          <div className="metric-card">
            <div className="metric-info"><h3>文章总数</h3><div className="metric-value highlight">{artCount}</div></div>
            <div className="metric-icon"><FileText size={20} /></div>
          </div>
          <div className="metric-card">
            <div className="metric-info"><h3>诊断报告</h3><div className="metric-value">{diagCount}</div></div>
            <div className="metric-icon"><Stethoscope size={20} /></div>
          </div>
          <div className="metric-card">
            <div className="metric-info"><h3>平均可见度</h3><div className="metric-value highlight">{avgVis}%</div></div>
            <div className="metric-icon"><TrendingUp size={20} /></div>
          </div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="section-card">
          <div className="section-header">
            <div className="section-title">快捷操作</div>
          </div>
          <div className="ai-actions-grid">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div key={index} className="ai-action-card" style={{ cursor: 'pointer' }}
                  onClick={() => navigate(action.path)}>
                  <div className="ai-action-icon" style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--accent-yellow)' }}><Icon size={22} /></div>
                  <div className="ai-action-info"><h4>{action.label}</h4><p>{action.desc}</p></div>
                  <ChevronRight size={16} className="ai-action-arrow" />
                </div>
              );
            })}
          </div>
        </div>
        <div className="section-card">
          <div className="section-header">
            <div className="section-title">热门关键词</div>
            <button className="view-all-btn" onClick={() => navigate('/materials')}>查看全部 <ChevronRight size={14} /></button>
          </div>
          <div className="hot-topics-list">
            {hotKeywords.length > 0 ? hotKeywords.map((kw, i) => (
              <div key={kw.id || i} className="hot-topic-item">
                <div className="topic-rank">{i + 1}</div>
                <div className="topic-content">
                  <div className="topic-title">{kw.name}</div>
                  <div className="topic-meta">
                    <span className="topic-tag">Volume: {(kw.search_volume || 0).toLocaleString()}</span>
                    <span className="topic-views"><Eye size={12} /> {kw.visibility || 0}% 可见度</span>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '32px 0', fontSize: 14 }}>
                暂无关键词数据
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
