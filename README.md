# GEO SEO Project

一个包含多个子项目的 GEO (Generative Engine Optimization) SEO 工具集合，用于优化网站在 AI 搜索引擎中的可见性和排名。

## 项目结构

```
geo-seo-project/
├── astro-paper/                    # Astro Paper 博客模板
├── awesome-generative-engine-optimization/  # GEO 资源集合
├── docs/                          # 项目文档
├── geo-ai-agent/                  # GEO AI Agent
├── geo-platform/                  # GEO 平台 (Vite + React)
├── geo-platform-specs/            # GEO 平台规范
├── geo-seo-desktop/               # GEO SEO 桌面应用 (Electron)
├── getcito/                       # AI Monitor 工具 (Next.js)
└── package.json
```

## 子项目说明

### 1. **astro-paper**
基于 Astro 的博客模板，用于创建 SEO 优化的博客网站。

**启动方式：**
```bash
cd astro-paper
pnpm install
pnpm dev
```

### 2. **geo-platform**
GEO 优化工作台，支持 AI 搜索分析和优化建议。

**启动方式：**
```bash
cd geo-platform
pnpm install
pnpm dev
```

**功能：**
- AI 搜索引擎分析
- 内容优化建议
- 竞争对手分析

### 3. **geo-seo-desktop**
基于 Electron 的桌面应用，提供离线 GEO 优化工具。

**启动方式：**
```bash
cd geo-seo-desktop
pnpm install
pnpm dev
```

**功能：**
- Markdown 编辑器
- SEO 审计工具
- GEO 诊断面板
- 知识库管理

### 4. **getcito (AI Monitor)**
AI Monitor 全合一工具，支持 AEO、GEO 分析。

**启动方式：**
```bash
cd getcito
pnpm install
pnpm dev
```

**功能：**
- AI 搜索引擎查询分析
- 品牌提及追踪
- 竞争对手分析
- 多 AI 提供商支持 (OpenAI, Gemini, Perplexity 等)

## 环境要求

- **Node.js**: v18 或更高版本
- **pnpm**: 推荐使用 (npm install -g pnpm)
- **Python**: 某些子项目需要 (用于服务器端)

## 配置

### 环境变量

在 `getcito` 目录下创建 `.env` 文件：

```env
# OpenAI
OPENAI_API_KEY=your-openai-key

# Firebase
FIREBASE_API_KEY=your-firebase-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id

# 其他 AI 提供商
GEMINI_API_KEY=your-gemini-key
PERPLEXITY_API_KEY=your-perplexity-key
```

### 数据库

- **geo-platform** 使用 PostgreSQL
- **getcito** 使用 Firebase Firestore

## 技术栈

- **前端**: React, Next.js, Astro, Vite
- **后端**: Node.js, Express, Firebase
- **桌面**: Electron
- **样式**: Tailwind CSS
- **状态管理**: Zustand, React Query

## 开发

1. 克隆仓库
2. 进入需要开发的子项目目录
3. 安装依赖
4. 启动开发服务器

```bash
git clone https://github.com/kline6/geo-seo-project.git
cd geo-seo-project
cd <子项目目录>
pnpm install
pnpm dev
```

## 部署

### Vercel (Next.js 项目)
```bash
cd getcito
vercel
```

### Electron 打包
```bash
cd geo-seo-desktop
pnpm build
```

## 许可证

详见各子项目的 LICENSE 文件。

## 联系方式

如有问题，请提交 Issue 或联系维护者。
