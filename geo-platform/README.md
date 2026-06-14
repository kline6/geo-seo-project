# GEO Platform - AI 搜索优化工作台

GEO (Generative Engine Optimization) 优化平台，帮助网站优化在 AI 搜索引擎中的表现。

## 功能特性

- **AI 搜索分析**: 分析内容在 AI 搜索中的表现
- **优化建议**: 提供 GEO 优化建议
- **竞争对手分析**: 对比竞品的 AI 搜索表现
- **可视化报告**: 数据图表和报告

## 快速开始

### 1. 安装依赖
```bash
pnpm install
```

### 2. 启动开发服务器
```bash
pnpm dev
```

访问 http://localhost:5173

### 3. 启动 Electron 桌面版
```bash
pnpm electron:dev
```

## 后端服务

如需启动后端服务：

```bash
# 启动 PostgreSQL 数据库
# 然后运行
pnpm server

# 或同时启动前后端
pnpm dev:all
```

## 技术栈

- Vite
- React 18
- Electron
- Express
- PostgreSQL
- Tailwind CSS

## 项目结构

```
geo-platform/
├── src/                # 前端源码
│   ├── components/     # React 组件
│   ├── pages/          # 页面组件
│   └── styles/         # 样式文件
├── server/             # 后端服务
│   ├── index.js        # 服务器入口
│   └── db.js           # 数据库配置
├── electron/           # Electron 主进程
└── public/             # 静态资源
```

## 环境要求

- Node.js v18+
- PostgreSQL (可选)
- Python (可选，用于某些功能)
