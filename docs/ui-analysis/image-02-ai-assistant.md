# GEO Platform - Image 2: AI Assistant (AI 智能助手)

> Source: `869a2f756c8bb58cf3b116c6d1e3bfe9.png`

## Page Overview

**AI 智能助手** - Central AI-powered chat interface that integrates all platform capabilities into a conversational workflow. Supports natural language input and auto-routes to appropriate tools.

## Top Bar Breadcrumb

`首页 > AI智能助手 >`

## Page Header

- Yellow chat bubble icon (in circle)
- Title: `AI智能助手`
- Subtitle: `SEO/GEO智能分析，对话式AI助手 + 一键自动化工作流`
- Button: `ℹ 使用指南` (outlined, opens help modal)

## Mode Tabs

| Tab         | Icon | Active | Description                                    |
|-------------|------|--------|------------------------------------------------|
| 对话模式    | 💬   | Yes    | 自由对话，输入需求AI自动调用工具分析            |
| 工作流模式  | ⚙    | No     | Predefined automation workflows                |

## Left Panel: 对话列表 (Conversation List)

- Header: `对话列表`
- Actions: download icon (export) + `+` yellow button (create new)
- Empty state: `暂无对话` / `点击上方 + 创建新对话`

### Conversation Management

| Action        | Trigger              | Behavior                           |
|---------------|----------------------|------------------------------------|
| 创建新对话    | Click `+` button     | New empty conversation             |
| 导出对话      | Click download icon  | Export as JSON/TXT                 |
| 删除对话      | Hover → click trash  | Delete with confirmation           |
| 切换对话      | Click conversation   | Load conversation history          |

### Help Text

```
↓ 导出按钮：保存对话记录
+ 新建按钮：开始新的对话
⋮ 悬停对话：显示删除按钮
```

## Right Panel: AI Assistant Main Area

### Capabilities Grid (6 cards, 2×3)

Title: `AI智能助手`
Subtitle: `用自然语言描述需求，AI自动调用工具完成分析。支持以下能力：`

| # | Capability        | Description                    | Icon                    | Backend Action              |
|---|-------------------|--------------------------------|-------------------------|-----------------------------|
| 1 | GEO品牌诊断       | 分析品牌在AI中的可见度          | 📊 bar chart            | `POST /api/diagnosis/brand` |
| 2 | SEO技术检测       | 检测网站SEO技术指标            | 🔍 magnifier            | `POST /api/seo/audit`       |
| 3 | AI信任度评分      | 评估内容被AI引用的概率          | 🛡 shield               | `POST /api/trust/score`     |
| 4 | 关键词扩展        | 智能扩展相关长尾关键词          | 🔑 key                  | `POST /api/keywords/expand` |
| 5 | 文章生成          | 生成SEO优化的文章内容          | 📄 document             | `POST /api/writing/generate`|
| 6 | 品牌对比          | 多品牌AI可见度对比分析          | ⚖ balance              | `POST /api/diagnosis/compare`|

### Quick Start Prompts (Clickable Tags)

`点击下方问题直接开始对话：`

| Prompt                       | Target Capability     |
|------------------------------|-----------------------|
| 分析华为的AI可见度           | GEO品牌诊断           |
| 检测 example.com 的SEO       | SEO技术检测           |
| 扩展关键词：AI营销           | 关键词扩展            |
| 评估内容信任度               | AI信任度评分          |
| 比较华为和小米               | 品牌对比              |

### Input Area

- Placeholder: `输入你的需求，例如：分析华为的AI可见度 / 检测 example.com 的SEO / 扩展关键词：AI营销`
- Yellow circular send button (▶)
- Helper: `按 Enter 发送 · Shift+Enter 换行`

## Functional Logic

### Chat Message Flow

```
User Input → NLP Intent Recognition → Route to Tool → Execute → Format Response → Display
```

1. **User sends message** via input box or quick prompt
2. **Intent recognition**: AI analyzes message to determine which capability to invoke
3. **Parameter extraction**: Extract brand name, URL, keywords, etc. from message
4. **Tool execution**: Call appropriate backend API
5. **Response formatting**: Format result as conversational response
6. **Display**: Show in chat with rich formatting (charts, tables, links)

### Intent Routing Examples

| User Message                    | Intent              | API Call                          |
|---------------------------------|---------------------|-----------------------------------|
| "分析华为的AI可见度"            | GEO品牌诊断         | `POST /api/diagnosis/brand {brand: "华为"}` |
| "检测 example.com 的SEO"        | SEO技术检测         | `POST /api/seo/audit {url: "example.com"}` |
| "扩展关键词：AI营销"            | 关键词扩展          | `POST /api/keywords/expand {seed: "AI营销"}` |
| "比较华为和小米"                | 品牌对比            | `POST /api/diagnosis/compare {brands: ["华为","小米"]}` |
| "写一篇关于GEO的文章"           | 文章生成            | `POST /api/writing/generate {topic: "GEO"}` |

### Conversation Persistence

```
GET    /api/conversations              - List all conversations
POST   /api/conversations              - Create new conversation
GET    /api/conversations/:id          - Get conversation with messages
DELETE /api/conversations/:id          - Delete conversation
POST   /api/conversations/:id/export   - Export as file
```

### Message Storage

```
Message {
  id: string
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  toolCalls?: Array<{
    tool: string
    params: object
    result: object
  }>
  timestamp: datetime
}
```

### AI Model Integration

- Backend calls LLM API (GPT-4/5 or custom model)
- System prompt includes available tools description
- Function calling / tool use for structured outputs
- Streaming response support for real-time display

### Workflow Mode (inferred)

When switching to 工作流模式:
- Shows predefined automation workflows
- Each workflow chains multiple tools together
- Example workflow: "Brand Launch" = keyword research → content creation → publish → track
- User can create custom workflows

## API Endpoints

```
POST   /api/chat/send                 - Send message and get AI response
GET    /api/chat/stream/:conversationId - SSE stream for real-time responses
POST   /api/tools/diagnosis           - Run brand diagnosis
POST   /api/tools/seo-audit           - Run SEO audit
POST   /api/tools/trust-score         - Calculate trust score
POST   /api/tools/keyword-expand      - Expand keywords
POST   /api/tools/article-generate    - Generate article
POST   /api/tools/brand-compare       - Compare brands
```
