# GetCito - AI Monitor 全合一工具

AIO (All-In-One) / AEO (Answer Engine Optimization) / GEO (Generative Engine Optimization) 工具

## 功能特性

- **AI 搜索分析**: 支持 ChatGPT, Gemini, Perplexity 等多个 AI 提供商
- **品牌追踪**: 监控 AI 搜索引擎中的品牌提及
- **竞争对手分析**: 分析竞品在 AI 搜索中的表现
- **多用户支持**: Firebase 认证系统

## 快速开始

### 1. 安装依赖
```bash
pnpm install
```

### 2. 配置环境变量
创建 `.env` 文件：
```env
OPENAI_API_KEY=sk-your-openai-key
FIREBASE_API_KEY=your-firebase-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
```

### 3. 启动开发服务器
```bash
pnpm dev
```

访问 http://localhost:3000

## 环境变量说明

| 变量名 | 说明 | 必需 |
|--------|------|------|
| OPENAI_API_KEY | OpenAI API 密钥 | ✅ |
| FIREBASE_API_KEY | Firebase 配置 | ✅ |
| GEMINI_API_KEY | Google Gemini API | ❌ |
| PERPLEXITY_API_KEY | Perplexity API | ❌ |

## 技术栈

- Next.js 15
- React 19
- Firebase
- TanStack Query
- Tailwind CSS

## 项目结构

```
getcito/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React 组件
│   ├── hooks/            # 自定义 Hooks
│   ├── lib/              # 工具函数
│   └── firebase/         # Firebase 配置
├── scripts/              # 开发脚本
└── public/               # 静态资源
```

## 开发脚本

```bash
# 清理并启动
pnpm dev:clean

# 安全模式启动
pnpm dev:safe

# 指定端口启动
pnpm dev:port

# 健康检查
pnpm health
```
