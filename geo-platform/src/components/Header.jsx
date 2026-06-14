import React from "react";
import { useLocation } from "react-router-dom";
import { Globe, LogOut } from "lucide-react";

const pageNames = {
  "/": "工作台",
  "/ai-assistant": "AI 智能助手",
  "/ai-diagnosis": "AI 诊断",
  "/materials": "素材库",
  "/ai-writing": "AI 写作",
  "/hot-copy": "热文复制",
  "/hot-copy-pro": "热文复制 Pro",
  "/publish": "文章管理",
  "/media-publish": "媒体发稿",
  "/data-analysis": "数据分析",
  "/reports": "分析报告",
  "/ai-tools": "AI 工具",
  "/seo-geo": "SEO & GEO",
  "/keyword-tracking": "关键词追踪",
  "/backlinks": "反向链接",
  "/trust-score": "信任度评分",
  "/plan-mode": "工作流",
  "/settings": "软件设置",
  "/goals": "目标管理",
};

function Header({ user, onLogout }) {
  const location = useLocation();
  const pageName = pageNames[location.pathname] || "GEO Platform";

  return (
    <div className="header">
      <div className="header-left">
        <div className="breadcrumb">
          <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{pageName}</span>
        </div>
      </div>

      <div className="header-right">
        <button className="lang-selector"><Globe size={14} /> CN <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></button>
        <div className="header-user">
          <div className="header-avatar">{user?.display_name?.[0] || "G"}</div>
          <span style={{ fontSize: 13 }}>{user?.display_name || "GEO用户"}</span>
          {onLogout && <button onClick={onLogout} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", marginLeft: 4 }} title="退出登录"><LogOut size={14} /></button>}
        </div>
      </div>
    </div>
  );
}

export default Header;