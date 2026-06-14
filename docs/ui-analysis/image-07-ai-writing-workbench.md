# GEO Platform - Image 7: AI Writing Workbench (AI 写作 - 写作任务)

> Source: `f8e8561848aadb763034e65025195ef1.png`

## Page Overview

**AI写作工作台** - The core content generation workspace. Configurable writing parameters on the left, real-time AI-generated results on the right. Supports multiple styles, lengths, and languages.

## Top Bar Breadcrumb

`首页 > AI写作 >`

## Sidebar (AI 写作 submenu expanded)

- 写作模板
- 文章分类
- **写作任务** (active, yellow left border)
- 文章列表

## Page Header

- Title: `AI写作工作台` (bold, yellow)
- Subtitle: `智能生成高质量内容，支持多种风格、长度和语言`
- Button: `↻ 重置` (outlined, top right) — reset all fields

## Mode Tabs

| Tab     | Icon | Active | Description           |
|---------|------|--------|-----------------------|
| AI写作  | ✏    | Yes    | Writing configuration |
| 历史记录 | 🕐  | No     | Past generated articles |

## Two-Panel Layout

### Left Panel: 写作配置 (Writing Config)

Title: `| 写作配置` (yellow left border)

#### Field 1: 文章标题

- Label: `文章标题`
- Badge: `✨ AI推荐标题` (yellow, clickable — generates title via AI)
- Input: text
- Placeholder: `输入文章标题，例如：如何提升品牌影响力`
- Counter: `0 / 100`
- Validation: required, max 100 chars

#### Field 2: 写作模板 (可选)

- Label: `写作模板 (可选)`
- Input: dropdown/select
- Placeholder: `选择预设模板`
- Data source: User's templates from 写作模板 page
- When selected: auto-fills prompt requirements

#### Field 3: 写作要求

- Label: `写作要求`
- Input: textarea (multi-line, resizable)
- Placeholder: `描述您想要的内容，越详细越好。例如：写一篇关于品牌营销的深度文章，包含具体案例和实操建议...`
- Counter: `0 / 2000`
- Validation: required, max 2000 chars

#### Field 4: 写作风格

- Label: `写作风格`
- Selection cards (horizontal, scrollable)

| Style       | Icon | Description                              | Active |
|-------------|------|------------------------------------------|--------|
| 专业严谨    | 📄   | 适合行业报告、白皮书等正式内容            | Yes    |
| 轻松活泼    | 😊   | 适合社交媒体、博客等轻松内容              | No     |
| (more below)| ...  | (scrolled)                               |        |

Likely additional styles:
| Style       | Description                              |
|-------------|------------------------------------------|
| 教学指导    | 适合教程、操作指南                        |
| 新闻报道    | 适合新闻稿、行业动态                      |
| 营销推广    | 适合广告文案、推广内容                    |

### Right Panel: 生成结果 (Generation Result)

Title: `| 生成结果` (yellow left border)

Empty state:
- Large grey sparkle/loading icon
- Text: `配置写作参数后，点击"开始生成"`
- Subtext: `AI 将根据您的要求自动生成高质量内容`

#### Generated Content Display (when content exists)

- Rendered Markdown with syntax highlighting
- Word count display
- Action buttons:
  - `📋 复制` — copy to clipboard
  - `📥 导出` — export as DOCX/MD/TXT
  - `✏ 编辑` — edit generated content
  - `💾 保存` — save to article list
  - `🔄 重新生成` — regenerate with same params

## Functional Logic

### Content Generation Flow

```
1. Configure params → 2. Click "开始生成" → 3. AI generates → 4. Stream display → 5. Save/Export
```

#### Step 1: Parameter Collection

```
WritingRequest {
  title?: string                    // optional, AI can suggest
  templateId?: string               // optional template
  requirements: string              // main prompt/instructions
  style: 'professional' | 'casual' | 'tutorial' | 'news' | 'marketing'
  language?: string                 // default: CN
  length?: 'short' | 'medium' | 'long' | number  // word count
  keywords?: string[]               // SEO keywords to include
  knowledgeBaseIds?: string[]       // linked knowledge entries
}
```

#### Step 2: AI Generation

```
POST /api/writing/generate
Body: WritingRequest
Response: { taskId: string, status: 'generating' }

// Real-time streaming
GET /api/writing/stream/:taskId
Response: SSE stream of generated text chunks
```

#### Step 3: Prompt Construction

Backend constructs the final prompt:

```
System: You are an expert SEO content writer...
User: {requirements}
Template: {template.prompt with variables filled}
Style instructions: {style-specific guidelines}
Knowledge context: {knowledge base entries}
SEO rules: include keywords {keywords}, density 2-3%, ...
```

#### Step 4: Streaming Display

- Content streams in real-time via SSE/WebSocket
- Right panel updates character by character
- Show loading indicator during generation
- Display word count as it increases

#### Step 5: Post-Generation Actions

| Action     | Behavior                                    |
|------------|---------------------------------------------|
| 复制       | Copy full text to system clipboard          |
| 导出       | Download as .docx / .md / .txt              |
| 编辑       | Switch to edit mode with rich text editor   |
| 保存       | Save to article list with status 'draft'    |
| 重新生成   | Re-run with same parameters (different output) |

### AI Title Recommendation

Click `✨ AI推荐标题`:

```
POST /api/writing/suggest-title
Body: { requirements: string, keywords?: string[] }
Response: { titles: string[] }  // 3-5 suggestions
```

User picks from suggestions or keeps own title.

### History Mode (历史记录)

Switch to history tab shows past generations:

```
GET /api/writing/history?page=1&pageSize=20
Response: {
  articles: Array<{
    id: string
    title: string
    requirements: string
    wordCount: number
    createdAt: datetime
    status: 'draft' | 'published'
  }>
  total: number
}
```

Click any history item to view/edit/regenerate.

### Template Integration

When a template is selected:
1. Template prompt loaded
2. Variable fields displayed (if template has variables)
3. User fills in variable values
4. Requirements field may auto-populate from template

### Writing Style Impact

Each style affects the AI system prompt:

| Style        | System Prompt Modifier                                    |
|--------------|-----------------------------------------------------------|
| 专业严谨     | Use formal language, cite data, structured paragraphs     |
| 轻松活泼     | Conversational tone, emoji allowed, short sentences       |
| 教学指导     | Step-by-step format, numbered lists, clear instructions   |
| 新闻报道     | Inverted pyramid structure, factual, attribution          |
| 营销推广     | Persuasive language, CTAs, benefit-focused                |

## API Endpoints

```
POST   /api/writing/generate           - Start content generation
GET    /api/writing/stream/:taskId     - SSE stream of generation
POST   /api/writing/suggest-title      - AI title suggestion
GET    /api/writing/history            - List past generations
GET    /api/writing/:id                - Get generated article
PUT    /api/writing/:id                - Update article content
DELETE /api/writing/:id                - Delete article
POST   /api/writing/:id/save           - Save to article list
POST   /api/writing/:id/export         - Export as file
GET    /api/writing/styles             - List available styles
GET    /api/writing/templates          - List available templates
```

## Data Model

```
WritingTask {
  id: string
  title?: string
  requirements: string
  style: string
  language: string
  templateId?: string
  keywords: string[]
  knowledgeBaseIds: string[]
  status: 'idle' | 'generating' | 'completed' | 'failed'
  result?: string (generated content in markdown)
  wordCount?: number
  model: string (e.g., 'gpt-4', 'gpt-5')
  tokensUsed?: number
  createdAt: datetime
  completedAt?: datetime
  userId: string
}
```
