# GEO Platform - Image 14: AI API Configuration (系统管理 - AI API 配置)

> Source: `4c024dbfa45218b6951ced8ccb9d7c77.png`

## Page Overview

**AI API 配置** - System administration page for configuring API keys for multiple AI providers. This is the backbone that powers all AI features across the platform.

## Top Bar Breadcrumb

`首页 > AI API 配置 >`

## Sidebar (系统管理 submenu expanded)

Visible items under 系统管理:
- 内容管理
- 资源管理
- 发布管理
- SEO与认证
- 数据与记录

(There's also a separate `软件设置` item at the bottom)

## Page Header

- Orange gear/settings icon (in circle)
- Title: `AI API 配置` (bold)
- Subtitle: `配置 Gemini、OpenAI、Anthropic 等 AI 服务的 API 密钥`
- Button: `保存所有配置` (yellow outlined, top right)

## Provider 1: Google Gemini

- Icon: Google Gemini logo (blue/white)
- Title: `Google Gemini`
- Subtitle: `配置 Google Gemini API 进行 AI 写作和诊断`
- Status badge: `未连接` (red/grey)
- Action: `测试连接` button (outlined)

### Fields

| # | Field     | Type         | Value/Placeholder                              | Editable |
|---|-----------|--------------|------------------------------------------------|----------|
| 1 | API Key   | Password     | `输入 Gemini API Key (AlzaSy...)`              | Yes      |
| 2 | API 地址  | Text input   | `https://generativelanguage.googleapis.com/v1beta/models/` | Yes |
| 3 | 启用状态  | Toggle switch | 禁用 ← → 启用                                  | Yes      |

- Button: `保存 Gemini 配置` (yellow outlined)

## Provider 2: OpenAI

- Icon: OpenAI logo (green/black)
- Title: `OpenAI`
- Subtitle: `配置 OpenAI API (GPT-4, GPT-5 等)`
- Status badge: `未连接` (red/grey)
- Action: `测试连接` button (outlined)

### Fields

| # | Field     | Type         | Value/Placeholder                              | Editable |
|---|-----------|--------------|------------------------------------------------|----------|
| 1 | API Key   | Password     | `输入 OpenAI API Key (sk-...)`                 | Yes      |
| 2 | API 地址  | Text input   | `https://api.openai.com/v1/chat/completions`   | Yes      |
| 3 | 启用状态  | Toggle switch | 禁用 ← → 启用 (currently ON)                  | Yes      |

(More fields likely below - scrolled)

## Functional Logic

### Configuration Persistence

```
GET  /api/admin/ai-config               - Get all provider configs
PUT  /api/admin/ai-config               - Save all configs
POST /api/admin/ai-config/:provider     - Save single provider config
POST /api/admin/ai-config/:provider/test - Test connection
```

### Provider Configuration Schema

```
AIProviderConfig {
  provider: 'gemini' | 'openai' | 'anthropic' | 'xai' | 'mistral' | 'mimo'
  apiKey: string (encrypted at rest)
  apiUrl: string
  enabled: boolean
  status: 'connected' | 'disconnected' | 'error'
  lastTestedAt?: datetime
  models: string[]         // available models
  defaultModel: string     // default model to use
  maxTokens: number        // max token limit
  temperature?: number     // generation temperature
  rateLimitRpm?: number    // requests per minute
}
```

### Connection Test Flow

```
POST /api/admin/ai-config/gemini/test
Body: { apiKey: string, apiUrl: string }
Response: {
  success: boolean
  status: 'connected' | 'error'
  latency: number (ms)
  model?: string           // responding model name
  error?: string           // error message if failed
}
```

Test sends a minimal completion request to validate:
1. API key is valid
2. API URL is reachable
3. Account has sufficient quota
4. Model is available

### API Key Security

- Keys encrypted at rest (AES-256)
- Never returned in full via API (masked: `sk-...xxxx`)
- Stored in environment-specific config or encrypted DB
- Access logged for audit trail

### Enable/Disable Logic

When a provider is disabled:
- All AI features using that provider become unavailable
- Fallback to next available provider (if configured)
- UI shows "provider not configured" messages

```
PATCH /api/admin/ai-config/:provider/toggle
Body: { enabled: boolean }
```

### Multi-Provider Routing

The platform routes AI requests based on:

| Feature              | Preferred Provider     | Fallback                    |
|----------------------|------------------------|-----------------------------|
| AI写作               | OpenAI GPT-5           | Gemini → Claude             |
| GEO诊断              | Gemini                 | OpenAI → Claude             |
| 关键词扩展           | OpenAI                 | Gemini                      |
| 品牌对比             | Claude                 | GPT-5 → Gemini              |
| 热文改写             | GPT-5 / GPT-4.1        | Claude → Gemini             |
| 新闻稿生成           | GPT-5                  | Gemini → Claude             |

### Rate Limiting

Per-provider rate limiting:
- Track requests per minute per provider
- Queue requests when limit approached
- Automatic retry with exponential backoff

## API Endpoints

```
GET    /api/admin/ai-config                  - Get all provider configs
PUT    /api/admin/ai-config                  - Save all configs at once
POST   /api/admin/ai-config/:provider        - Save single provider
GET    /api/admin/ai-config/:provider        - Get single provider
POST   /api/admin/ai-config/:provider/test   - Test connection
PATCH  /api/admin/ai-config/:provider/toggle - Enable/disable
GET    /api/admin/ai-config/status           - Get all provider statuses
GET    /api/admin/ai-config/usage            - Get API usage stats
```

## Data Model

```
AIConfig {
  providers: AIProviderConfig[]
  defaultProvider: string
  fallbackChain: string[]
  globalRateLimit: number
  updatedAt: datetime
  updatedBy: string
}
```

## UI Design Notes

- Each provider is a separate card/section
- Status badges: green=connected, red=disconnected, yellow=error
- Toggle switches for enable/disable
- Password fields with show/hide toggle
- `测试连接` provides immediate feedback
- `保存所有配置` batch saves all changes
