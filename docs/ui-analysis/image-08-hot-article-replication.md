# GEO Platform - Image 8: Hot Article Replication (热文复制 - 单篇复制)

> Source: `347b62ec442cd81c7387c905c2bd464c.png`

## Page Overview

**全网爆文复刻** - AI-powered article rewriting tool. Input original content (paste or URL), and the system generates a high-quality original article while preserving the core message and structure.

## Top Bar Breadcrumb

`首页 > 单篇复制 >`

## Sidebar (热文复制 submenu expanded)

- **单篇复制** (active, yellow dot)
- 批量复制

## Page Header

- Title: `全网爆文复刻` (bold)
- Subtitle: `输入原文内容，AI自动改写为高质量原创文章`
- Button: `↻ 重置` (outlined, top right)

## Mode Tabs

| Tab         | Icon | Active | Description |
|-------------|------|--------|-------------|
| 新建复刻    | 📋   | Yes    | Create new replication |
| 复刻记录    | 📁   | No     | Replication history |

## Two-Panel Layout

### Left Panel: 复刻配置 (Replication Config)

Title: `| 复刻配置` (yellow left border)

#### Input Mode Toggle

| Mode                | Active | Description                    |
|---------------------|--------|--------------------------------|
| 粘贴原文内容        | Yes    | Paste original text directly   |
| 输入URL采集         | No     | Enter URL to scrape content    |

#### Mode A: 粘贴原文内容 (Paste Content)

**Field 1: 原文标题**

- Label: `原文标题`
- Input: text
- Placeholder: `输入原文标题`
- Counter: `0 / 200`
- Validation: max 200 chars

**Field 2: 原文内容**

- Label: `原文内容`
- Input: textarea (large, resizable)
- Placeholder: `粘贴原文内容，AI将自动改写为原创文章...`
- Counter: `0 / 10000`
- Validation: max 10000 chars

**Field 3: 改写模型**

- Label: `改写模型`
- Model selection cards (horizontal):

| Model     | Description                    | Active |
|-----------|--------------------------------|--------|
| GPT-5     | Latest OpenAI flagship model   | No     |
| GPT-4.1   | Excellent all-round            | Yes    |

(Likely more models below: Claude, Gemini, etc.)

#### Mode B: 输入URL采集 (URL Fetch)

When switching to URL mode:

**Field 1: 原文URL**

- Label: `原文URL`
- Input: text
- Placeholder: `https://example.com/article`
- Validation: valid URL format

**Action: 采集内容**

- Button: `🔍 采集` (yellow)
- Fetches page content via backend scraper
- Extracts: title, body text, images, metadata
- Auto-fills title and content fields
- Shows loading indicator during fetch

**Content Preview**

After URL fetch, show preview:
- Title (editable)
- Content preview (editable)
- Word count
- Source attribution

### Right Panel: 复刻结果 (Replication Result)

Title: `| 复刻结果` (yellow left border)

Empty state:
- Large grey document icon
- Text: `输入原文内容后，点击"开始复刻"`
- Subtext: `AI 将自动改写为高质量原创内容`

#### Generated Result Display (when content exists)

- Original vs Replicated comparison (optional toggle)
- Generated article in rich text / Markdown
- Word count + originality score
- Action buttons:
  - `📋 复制` — copy to clipboard
  - `📥 导出` — download as file
  - `✏ 编辑` — edit result
  - `💾 保存` — save to article list
  - `🔄 重新改写` — regenerate

## Functional Logic

### Replication Flow

```
1. Input source → 2. Select model → 3. Click "开始复刻" → 4. AI rewrites → 5. Review → 6. Save/Export
```

#### Step 1: Content Acquisition

**Paste Mode:**
- User pastes title + content directly
- Word count calculated immediately

**URL Mode:**
```
POST /api/replication/fetch-url
Body: { url: string }
Response: {
  title: string
  content: string
  wordCount: number
  images: string[]
  metadata: { author, publishDate, site }
}
```

Backend scraping uses:
- Headless browser (Puppeteer/Playwright) for JS-rendered pages
- Readability algorithm for content extraction
- Image and metadata extraction

#### Step 2: AI Rewriting

```
POST /api/replication/execute
Body: {
  originalTitle: string
  originalContent: string
  model: 'gpt-5' | 'gpt-4.1' | 'claude-4' | ...
  options?: {
    preserveStructure: boolean    // keep original paragraph structure
    maintainKeywords: boolean    // keep SEO keywords
    changePerspective: boolean   // alter writing viewpoint
    targetLength?: 'shorter' | 'same' | 'longer'
  }
}
Response: { taskId: string }
```

#### Step 3: Prompt Engineering

The rewriting prompt is carefully designed:

```
System: You are an expert content rewriter. Rewrite the following article 
to create a 100% original version while:
1. Preserving the core message and key information
2. Using completely different sentence structures
3. Replacing synonyms and rephrasing expressions
4. Maintaining factual accuracy
5. Ensuring the result passes plagiarism detection
6. Optimizing for SEO (if keywords provided)

Original title: {originalTitle}
Original content: {originalContent}
Rewriting model: {model}
Additional instructions: {options}
```

#### Step 4: Streaming Display

- Real-time streaming via SSE/WebSocket
- Progressive display of rewritten content
- Progress indicator during generation

#### Step 5: Quality Checks

Post-generation checks:
- **Originality score**: Compare with original (target > 80% unique)
- **Readability score**: Ensure natural language flow
- **SEO preservation**: Check if key terms maintained
- **Length validation**: Compare word count with original

### Content Comparison Feature

Toggle between views:

| View Mode     | Description                                    |
|---------------|------------------------------------------------|
| 仅结果        | Show only replicated content                   |
| 对比模式      | Side-by-side original vs replicated            |
| 差异高亮      | Highlight changes in replicated version        |

### Batch Replication (批量复制)

Not shown in image, but sidebar indicates:

```
POST /api/replication/batch
Body: {
  sources: Array<{
    type: 'paste' | 'url'
    title?: string
    content?: string
    url?: string
  }>
  model: string
  options?: ReplicationOptions
}
Response: { batchId: string, tasks: string[] }
```

- Process multiple articles in parallel
- Queue management for batch jobs
- Individual status tracking per article

### History Mode (复刻记录)

```
GET /api/replication/history?page=1&pageSize=20
Response: {
  records: Array<{
    id: string
    originalTitle: string
    replicatedTitle: string
    model: string
    originalWordCount: number
    replicatedWordCount: number
    originalityScore: number
    status: 'completed' | 'failed'
    createdAt: datetime
  }>
  total: number
}
```

### Anti-Plagiarism Measures

The replication system applies multiple techniques:

1. **Sentence restructuring**: Active ↔ passive voice, clause reordering
2. **Synonym replacement**: Context-aware word substitution
3. **Paragraph reorganization**: Maintain logical flow, change order
4. **Voice/perspective shift**: Third person ↔ first person
5. **Data presentation**: Different ways to present same facts
6. **Transition variation**: Different connective phrases

### Model Selection Impact

| Model    | Quality | Speed   | Cost  | Best For              |
|----------|---------|---------|-------|-----------------------|
| GPT-5    | Highest | Slower  | $$$   | Important content     |
| GPT-4.1  | High    | Fast    | $$    | General use (default) |
| Claude 4 | High    | Medium  | $$    | Long-form content     |

## API Endpoints

```
POST   /api/replication/fetch-url      - Fetch content from URL
POST   /api/replication/execute        - Start replication
GET    /api/replication/stream/:taskId - SSE stream of result
GET    /api/replication/history        - List replication history
GET    /api/replication/:id            - Get replication detail
POST   /api/replication/:id/save       - Save to article list
POST   /api/replication/:id/export     - Export as file
POST   /api/replication/batch          - Batch replication
GET    /api/replication/models         - List available models
```

## Data Model

```
ReplicationTask {
  id: string
  sourceType: 'paste' | 'url'
  sourceUrl?: string
  originalTitle: string
  originalContent: string
  originalWordCount: number
  model: string
  replicatedTitle?: string
  replicatedContent?: string
  replicatedWordCount?: number
  originalityScore?: number (0-100)
  status: 'pending' | 'processing' | 'completed' | 'failed'
  options?: {
    preserveStructure: boolean
    maintainKeywords: boolean
    changePerspective: boolean
    targetLength?: string
  }
  createdAt: datetime
  completedAt?: datetime
  userId: string
}
```

## Batch Replication Submenu

**批量复制** (not shown in image):

- Upload multiple URLs or paste multiple articles
- Process all through AI rewriting simultaneously
- Download results as batch (ZIP or individual files)
- Progress tracking for entire batch
