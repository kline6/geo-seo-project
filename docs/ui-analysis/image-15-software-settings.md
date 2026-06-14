# GEO Platform - Image 15: Software Settings (系统管理 - 软件设置)

> Source: `ea8e4238462d46c3501cbc6bcbf4b03f.png`

## Page Overview

**设置** - Desktop application settings. Unified settings page for configuring AI API keys with a compact tabbed interface. Shows 6 AI providers with connection status indicators.

## Top Bar Breadcrumb

`首页 > 设置 >`

## Sidebar

`软件设置` is active (yellow left border) — appears to be a standalone menu item under 系统管理 or at the bottom of sidebar.

Other visible sidebar items:
- 数据分析
- AI 工具
- SEO & GEO
- 信任度评分
- 个人中心
- 系统管理
- 内容管理
- 资源管理
- 发布管理
- SEO与认证
- 数据与记录

## Page Header

- Title: `设置` (bold)
- Subtitle: `配置您的 GEO Platform 桌面应用`

## Section: AI API 配置

Title: `🔑 AI API 配置` (yellow, with key icon)
Description: `配置至少一个 AI 服务商的 API Key，即可使用所有 AI 功能`

### Provider Tabs (Horizontal)

| # | Provider          | Status | Active |
|---|-------------------|--------|--------|
| 1 | Google Gemini     | 🔴 Red | No     |
| 2 | OpenAI            | 🔴 Red | No     |
| 3 | Anthropic Claude  | 🔴 Red | No     |
| 4 | xAI Grok          | 🔴 Red | No     |
| 5 | Mistral           | 🔴 Red | No     |
| 6 | 小米 MiMo         | 🟢 Green (underlined) | Yes |

Status indicators:
- 🔴 Red dot = Not configured / Disconnected
- 🟢 Green dot = Configured and connected

### Active Tab: 小米 MiMo

#### Field 1: API Key

- Label: `API Key`
- Input: password field (masked with dots `••••••••`)
- Visibility toggle: 👁 eye icon (show/hide)
- Current value: Set (masked)

#### Field 2: API URL

- Label: `API URL`
- Input: text
- Value: `https://token-plan-sgp.xiaomimimo.com/v1/chat/completions`

#### Field 3: 模型 (Model)

- Label: `模型`
- Input: text
- Value: `mimo-v2.5-pro`

#### Field 4: 最大Token数 (Max Tokens)

- Label: `最大Token数`
- Input: number with +/- stepper buttons
- Value: `32768`
- Controls: `−` decrease, `+` increase

#### Action Buttons

- `测试连接` (yellow filled) — test API connection
- `重置为默认` (text link) — reset to provider defaults

## Bottom Section (partially visible)

- `⚙ 默认AI模型` section (scrolled, not fully visible)
- Likely: select default model for each feature type

## Functional Logic

### Compact Settings Flow

This page provides a streamlined settings experience compared to the admin AI API config page:

```
1. Select provider tab → 2. Enter API key → 3. Configure URL/model/tokens → 4. Test → 5. Save
```

### Provider Default Configurations

Each provider has sensible defaults:

| Provider         | Default API URL                                              | Default Model        | Default Max Tokens |
|------------------|--------------------------------------------------------------|----------------------|-------------------|
| Google Gemini    | `https://generativelanguage.googleapis.com/v1beta/models/`   | gemini-2.0-flash     | 8192              |
| OpenAI           | `https://api.openai.com/v1/chat/completions`                 | gpt-4.1              | 4096              |
| Anthropic Claude | `https://api.anthropic.com/v1/messages`                      | claude-sonnet-4-20250514 | 8192          |
| xAI Grok         | `https://api.x.ai/v1/chat/completions`                       | grok-3               | 4096              |
| Mistral          | `https://api.mistral.ai/v1/chat/completions`                 | mistral-large        | 8192              |
| 小米 MiMo        | `https://token-plan-sgp.xiaomimimo.com/v1/chat/completions` | mimo-v2.5-pro        | 32768             |

### Max Tokens Stepper

- Step value: 1024 (increments by powers of 2)
- Min: 512
- Max: 128000 (depends on model)
- Quick presets: 4096, 8192, 16384, 32768, 65536

### Connection Test

```
POST /api/settings/test-connection
Body: {
  provider: string
  apiKey: string
  apiUrl: string
  model: string
}
Response: {
  success: boolean
  latency: number
  model: string
  error?: string
}
```

### Settings Persistence

Settings stored locally (desktop app) or in user-specific DB:

```
GET  /api/settings/ai              - Get all provider settings
PUT  /api/settings/ai/:provider    - Save provider settings
POST /api/settings/ai/:provider/test - Test connection
POST /api/settings/ai/:provider/reset - Reset to defaults
GET  /api/settings/defaults        - Get default configurations
```

### Global Config vs Per-Provider Config

- **Global**: default model selection, fallback chain
- **Per-provider**: API key, URL, model, max tokens, enabled status

### Desktop App Specifics

This appears to be a **desktop application** (Electron/Tauri):
- Settings stored in local config file
- API keys in system keychain (encrypted)
- No server-side auth needed (single user)
- Local database for data storage

## API Endpoints

```
GET    /api/settings/ai                    - Get all settings
PUT    /api/settings/ai/:provider          - Save provider config
POST   /api/settings/ai/:provider/test     - Test connection
POST   /api/settings/ai/:provider/reset    - Reset to defaults
GET    /api/settings/defaults              - Get default model configs
PATCH  /api/settings/default-model         - Set default model per feature
```

## Data Model

```
SoftwareSettings {
  aiProviders: {
    gemini: { apiKey, apiUrl, model, maxTokens, enabled }
    openai: { apiKey, apiUrl, model, maxTokens, enabled }
    anthropic: { apiKey, apiUrl, model, maxTokens, enabled }
    xai: { apiKey, apiUrl, model, maxTokens, enabled }
    mistral: { apiKey, apiUrl, model, maxTokens, enabled }
    mimo: { apiKey, apiUrl, model, maxTokens, enabled }
  }
  defaultModels: {
    writing: string
    diagnosis: string
    replication: string
    chat: string
  }
  language: 'CN' | 'EN'
  theme: 'dark' | 'light'
}
```

## Difference from Image 14 (AI API 配置)

| Aspect          | Image 14 (AI API 配置)          | Image 15 (软件设置)              |
|-----------------|--------------------------------|----------------------------------|
| Location        | 系统管理 submenu                | Standalone 软件设置              |
| UI Style        | Card-based, vertical scroll    | Tab-based, compact               |
| Providers       | 2 visible (Gemini, OpenAI)     | 6 tabs (all providers)           |
| Detail Level    | Full admin config              | User-facing quick setup          |
| Extra Fields    | Save per-provider + Save all   | Max tokens stepper, model field  |
| Target User     | Admin / Developer              | End user                         |
| Desktop App     | Could be web or desktop        | Clearly desktop (桌面应用)       |
