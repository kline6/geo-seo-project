import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ClipboardList, Flag, Workflow,
  LayoutDashboard, Bot, Stethoscope, FolderOpen, PenTool, Copy, Send,
  BarChart3, Wrench, Search, CheckCircle, ChevronDown, ChevronsLeft,
  Link2, Target, FileText, Globe, Settings, Share2,
} from "lucide-react";

export const menuItems = [
  { id: "dashboard", label: "工作台", icon: LayoutDashboard, path: "/", iconColor: "blue" },
  { id: "ai-assistant", label: "AI 智能助手", icon: Bot, path: "/ai-assistant", iconColor: "purple" },
  { id: "ai-diagnosis", label: "AI 诊断", icon: Stethoscope, path: "/ai-diagnosis", hasSubmenu: true, iconColor: "green",
    subItems: [
      { id: "diagnosis-create", label: "新建诊断", path: "/ai-diagnosis", tab: "create" },
      { id: "diagnosis-reports", label: "诊断报告", path: "/ai-diagnosis", tab: "reports" },
    ]
  },
  { id: "materials", label: "素材库", icon: FolderOpen, path: "/materials", hasSubmenu: true, iconColor: "orange",
    subItems: [
      { id: "materials-keywords", label: "关键词", path: "/materials", tab: "keywords" },
      { id: "materials-knowledge", label: "知识库", path: "/materials", tab: "knowledge" },
    ]
  },
  { id: "ai-writing", label: "AI 写作", icon: PenTool, path: "/ai-writing", hasSubmenu: true, iconColor: "pink",
    subItems: [
      { id: "writing-templates", label: "写作模板", path: "/ai-writing", tab: "templates" },
      { id: "writing-tasks", label: "写作任务", path: "/ai-writing", tab: "workbench" },
    ]
  },
  { id: "hot-copy", label: "热文复制", icon: Copy, path: "/hot-copy", hasSubmenu: true, iconColor: "cyan",
    subItems: [
      { id: "hot-copy-single", label: "单篇复制", path: "/hot-copy", tab: "" },
      { id: "hot-copy-batch", label: "批量复制", path: "/hot-copy-pro", tab: "" },
    ]
  },
  { id: "publish", label: "发布", icon: Send, path: "/publish", hasSubmenu: true, iconColor: "indigo",
    subItems: [
      { id: "publish-media", label: "媒体发稿", path: "/media-publish", tab: "" },
      { id: "publish-articles", label: "文章管理", path: "/publish", tab: "" },
    ]
  },
  { id: "data-analysis", label: "数据分析", icon: BarChart3, path: "/data-analysis", hasSubmenu: true, iconColor: "teal",
    subItems: [
      { id: "data-overview", label: "数据概览", path: "/data-analysis", tab: "" },
      { id: "data-reports", label: "分析报告", path: "/reports", tab: "" },
    ]
  },
  { id: "ai-tools", label: "AI 工具", icon: Wrench, path: "/ai-tools", hasSubmenu: true, iconColor: "amber",
    subItems: [
      { id: "tools-keyword-index", label: "关键词指数", path: "/ai-tools", tab: "keyword-index" },
      { id: "tools-ai-expand", label: "AI 拓展", path: "/ai-tools", tab: "ai-expand" },
      { id: "tools-manual-expand", label: "手动拓展", path: "/ai-tools", tab: "manual-expand" },
    ]
  },
  { id: "seo-geo", label: "SEO & GEO", icon: Search, path: "/seo-geo", hasSubmenu: true, iconColor: "emerald",
    subItems: [
      { id: "seo-keywords", label: "关键词追踪", path: "/keyword-tracking", tab: "" },
      { id: "seo-backlinks", label: "反向链接", path: "/backlinks", tab: "" },
      { id: "seo-main", label: "SEO优化", path: "/seo-geo", tab: "" },
    ]
  },
  { id: "plan-mode", label: "工作流", icon: Workflow, path: "/plan-mode", iconColor: "purple" },
  { id: "trust-score", label: "信任度评分", icon: CheckCircle, path: "/trust-score", iconColor: "sky" },
  { id: "settings", label: "软件设置", icon: Settings, path: "/settings", iconColor: "amber" },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (id) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const basePath = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get("tab") || "";

  const isActivePath = (path) => {
    if (path === "/") return basePath === "/";
    return basePath === path;
  };

  const isSubActive = (sub) => {
    const subBase = sub.path;
    if (basePath !== subBase) return false;
    if (sub.tab) {
      return currentTab === sub.tab;
    }
    return !currentTab || currentTab === "";
  };

  const isAnySubActive = (item) => {
    if (!item.hasSubmenu || !item.subItems) return false;
    return item.subItems.some(sub => isSubActive(sub));
  };

  const handleSubClick = (sub) => {
    if (sub.tab) {
      navigate(`${sub.path}?tab=${sub.tab}`);
    } else {
      navigate(sub.path);
    }
  };

  return (
    <div className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">G</div>
        {!collapsed && (
          <div className="logo-text-group">
            <span className="logo-title">GEO Platform</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const parentActive = isActivePath(item.path);
          const anySubActive = isAnySubActive(item);
          const isActive = parentActive || anySubActive;
          const isExpanded = expandedMenus[item.id] || anySubActive;

          return (
            <div key={item.id}>
              {item.hasSubmenu ? (
                <div
                  className={`nav-item ${isActive ? "active" : ""} ${anySubActive ? "parent-active" : ""}`}
                  style={{ textDecoration: "none", cursor: "pointer" }}
                  title={collapsed ? item.label : undefined}
                  onClick={() => {
                    if (collapsed) {
                      handleSubClick(item.subItems[0]);
                    } else {
                      toggleMenu(item.id);
                    }
                  }}
                >
                  <div className={`nav-item-icon ${item.iconColor}`}>
                    <Icon size={16} />
                  </div>
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && (
                    <ChevronDown size={14} style={{ marginLeft: "auto", opacity: 0.5, transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  style={{ textDecoration: "none" }}
                  title={collapsed ? item.label : undefined}
                >
                  <div className={`nav-item-icon ${item.iconColor}`}>
                    <Icon size={16} />
                  </div>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )}
              {!collapsed && item.hasSubmenu && isExpanded && item.subItems && (
                <div className="submenu-container" style={{ paddingLeft: 52 }}>
                  {item.subItems.map(sub => (
                    <div
                      key={sub.id}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSubClick(sub); }}
                      className={`submenu-item ${isSubActive(sub) ? "active" : ""}`}
                      style={{ cursor: "pointer" }}
                    >
                      {sub.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="user-card">
            <div className="user-avatar">G</div>
            <div className="user-info">
              <span className="user-name">GEO用户</span>
              <span className="user-plan">永久至尊国际版</span>
            </div>
          </div>
        )}
        <button className="sidebar-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          <ChevronsLeft size={18} style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

