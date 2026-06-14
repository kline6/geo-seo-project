const fs = require('fs');
const path = require('path');

const pages = {};

pages['Dashboard.jsx'] = `import React, { useState, useEffect } from 'react';
import {
  Search, Globe, Stethoscope, Shield, TrendingUp, BarChart3,
  FileText, Target, Clock, ChevronRight, Sparkles, Eye, Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [hotTopics, setHotTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setStats).catch(() => {});
    fetch('/api/hot-copies').then(r => r.json()).then(data => {
      setHotTopics(data.slice(0, 4).map((a, i) => ({
        rank: i + 1, title: a.title, tag: a.keywords ? a.keywords.split(',')[0] : '',
        views: a.heat + '',
      })));
    }).catch(() => {});
  }, []);

  const kwCount = stats?.keywordCount ?? 0;
  const artCount = stats?.articleCount ?? 0;
  const diagCount = stats?.diagnosisCount ?? 0;
  const avgVis = stats?.avgVisibility ?? 0;

  const aiQuickActions = [
    { icon: Search, label: 'SEO\u4F18\u5316', desc: '\u63D0\u5347\u641C\u7D22\u5F15\u64CE\u6392\u540D', color: '#3b82f6', path: '/seo-geo' },
    { icon: Globe, label: 'GEO\u4F18\u5316', desc: 'AI\u5F15\u64CE\u53EF\u89C1\u5EA6\u63D0\u5347', color: '#f5a623', path: '/seo-geo' },
    { icon: Stethoscope, label: 'AI\u8BCA\u65AD', desc: '\u8BCA\u65ADAI\u53EF\u89C1\u5EA6\u95EE\u9898', color: '#ef4444', path: '/ai-diagnosis' },
    { icon: Shield, label: '\u4FE1\u4EFB\u5EA6\u68C0\u6D4B', desc: '\u8BC4\u4F30\u54C1\u724C\u4FE1\u4EFB\u5EA6', color: '#4ade80', path: '/trust-score' },
  ];

  const recentTasks = (stats?.recentTasks || []).map(t => ({
    title: t.title,
    status: t.done ? '\u5DF2\u5B8C\u6210' : '\u8FDB\u884C\u4E2D',
    statusColor: t.done ? '#4ade80' : '#f5a623',
  }));

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div className="welcome-avatar">G</div>
        <div className="welcome-text">
          <h1>{'\u6B22\u8FCE\u56DE\u6765\uFF0C'}<span>{'GEO\u7528\u6237'}</span></h1>
          <p>{'GEO \u4F18\u5316\u5DE5\u4F5C\u53F0'}<span>{' | '}</span></p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-chip"><span className="dot green" /><span className="value">{kwCount}</span><span className="label">{'\u5173\u952E\u8BCD'}</span></div>
        <div className="stat-chip"><span className="dot yellow" /><span className="value">{artCount}</span><span className="label">{'\u6587\u7AE0'}</span></div>
        <div className="stat-chip"><span className="dot red" /><span className="value">{diagCount}</span><span className="label">{'\u8BCA\u65AD'}</span></div>
        <div className="stat-chip"><span className="dot blue" /><span className="value">{stats?.activeGoals ?? 0}</span><span className="label">{'\u76EE\u6807'}</span></div>
      </div>

      <div className="section-card metric-cards-section">
        <div className="section-header"><div className="section-title">{'\u6570\u636E\u6982\u89C8'}</div></div>
        <div className="metric-cards">
          <div className="metric-card">
            <div className="metric-info"><h3>{'\u5173\u952E\u8BCD\u603B\u6570'}</h3><div className="metric-value highlight">{kwCount}</div></div>
            <div className="metric-icon"><Target size={20} /></div>
          </div>
          <div className="metric-card">
            <div className="metric-info"><h3>{'\u6587\u7AE0\u603B\u6570'}</h3><div className="metric-value highlight">{artCount}</div></div>
            <div className="metric-icon"><FileText size={20} /></div>
          </div>
          <div className="metric-card">
            <div className="metric_info"><h3>{'\u8BCA\u65AD\u62A5\u544A'}</h3><div className="metric-value">{diagCount}</div></div>
            <div className="metric-icon"><Stethoscope size={20} /></div>
          </div>
          <div className="metric-card">
            <div className="metric-info"><h3>{'\u5E73\u5747\u53EF\u89C1\u5EA6'}</h3><div className="metric-value highlight">{avgVis}%</div></div>
            <div className="metric-icon"><TrendingUp size={20} /></div>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-header"><div className="section-title">{'AI\u52A9\u624B\u5FEB\u6377\u64CD\u4F5C'}</div></div>
        <div className="ai-actions-grid">
          {aiQuickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div key={index} className="ai-action-card" style={{ borderColor: action.color + '30', cursor: 'pointer' }}
                onClick={() => navigate(action.path)}>
                <div className="ai-action-icon" style={{ background: action.color + '15', color: action.color }}><Icon size={22} /></div>
                <div className="ai-action-info"><h4>{action.label}</h4><p>{action.desc}</p></div>
                <ChevronRight size={16} className="ai-action-arrow" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="bottom-grid">
        <div className="section-card">
          <div className="section-header">
            <div className="section-title">{'\u4ECA\u65E5\u70ED\u70B9'}</div>
            <button className="view-all-btn" onClick={() => navigate('/hot-copy')}>{'\u67E5\u770B\u5168\u90E8'} <ChevronRight size={14} /></button>
          </div>
          <div className="hot-topics-list">
            {hotTopics.map((topic) => (
              <div key={topic.rank} className="hot-topic-item">
                <div className="topic-rank">{topic.rank}</div>
                <div className="topic-content">
                  <div className="topic-title">{topic.title}</div>
                  <div className="topic-meta">
                    <span className="topic-tag">{topic.tag}</span>
                    <span className="topic-views"><Eye size={12} /> {topic.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="section-card">
          <div className="section-header">
            <div className="section-title">{'\u8FD1\u671F\u4EFB\u52A1'}</div>
            <button className="view-all-btn" onClick={() => navigate('/plan-mode')}>{'\u67E5\u770B\u5168\u90E8'} <ChevronRight size={14} /></button>
          </div>
          <div className="recent-tasks-list">
            {recentTasks.map((task, index) => (
              <div key={index} className="recent-task-item">
                <div className="task-icon-wrapper">
                  <div className="task-icon" style={{ background: task.statusColor + '15', color: task.statusColor }}><Zap size={16} /></div>
                </div>
                <div className="task-content">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    <span className="task-status" style={{ color: task.statusColor }}>{task.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
`;

const basePath = 'E:/iso project/geo-platform/src/pages';
Object.entries(pages).forEach(([file, content]) => {
  fs.writeFileSync(path.join(basePath, file), content, 'utf8');
  console.log('Written: ' + file);
});