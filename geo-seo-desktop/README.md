# GEO SEO Desktop - 桌面版 GEO 优化工具

基于 Electron 的桌面应用程序，提供离线 GEO 优化和 SEO 审计功能。

## 功能特性

- **Markdown 编辑器**: 内置代码高亮和预览
- **SEO 审计**: 分析页面 SEO 问题
- **GEO 诊断**: 评估内容在 AI 搜索中的表现
- **知识库管理**: 管理 SEO 和 GEO 知识
- **离线使用**: 无需网络连接

## 快速开始

### 1. 安装依赖
```bash
pnpm install
```

### 2. 启动开发服务器
```bash
pnpm dev
```

### 3. 打包桌面应用
```bash
pnpm build
```

## 项目结构

```
geo-seo-desktop/
├── src/
│   ├── components/       # React 组件
│   │   ├── AuditDiffCard.tsx
│   │   ├── GeoCheckPanel.tsx
│   │   ├── MarkdownPreview.tsx
│   │   └── MetadataPanel.tsx
│   ├── pages/            # 页面组件
│   │   ├── Dashboard.tsx
│   │   ├── Editor.tsx
│   │   └── Settings.tsx
│   ├── stores/           # 状态管理
│   └── hooks/            # 自定义 Hooks
├── python-engine/        # Python 后端
├── electron/             # Electron 主进程
└── scripts/              # 开发脚本
```

## 技术栈

- Electron
- Vite
- React 18
- TypeScript
- Tailwind CSS
- Better-SQLite3

## Python 引擎

项目包含 Python 后端用于 SEO 分析：

```bash
cd python-engine
pip install -r requirements.txt
python server.py
```

## 开发

```bash
# 启动 Vite 开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 打包 Electron 应用
pnpm electron:build
```
