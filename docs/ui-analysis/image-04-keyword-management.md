# GEO Platform - Image 4: Keyword Management (素材库 - 关键词)

> Source: `5f55fb36966ca1143d6aeec64aa6ffc9.png`

## Page Overview

**关键词管理** - Central hub for managing and monitoring all tracked keywords with AI visibility metrics, search volume, and action controls.

## Top Bar Breadcrumb

`首页 > 关键词 >`

## Sidebar (素材库 submenu expanded)

- **关键词** (active, yellow dot)
- 标题 (grey dot)
- 图片 (grey dot)
- 知识库 (grey dot)

## Page Header

- Title: `关键词管理` (bold)
- Subtitle: `管理和监控您的关键词表现`
- Action buttons (top right):
  - `✨ AI拓词` (yellow outlined) → Opens AI keyword expansion tool
  - `+ 添加关键词` (yellow filled) → Opens add keyword modal

## Search & Filter Bar

- Search input: `🔍 搜索关键词...`
- Filter dropdown: `状态筛选` (status filter: 全部/已激活/已暂停)

## Keyword Cards Grid (5 cards)

### Card Structure (consistent)

```
┌─────────────────────────────┐
│ [keyword name]     [•••]   │
│ [status] [category]        │
│ ┌──────┬──────┬──────┐     │
│ │搜索量│AI可见│AI提及│     │
│ │XXXX  │XX%   │XX    │     │
│ └──────┴──────┴──────┘     │
│ [诊断]           [删除]    │
└─────────────────────────────┘
```

### Card Data

| # | Keyword              | Status | Category    | Search Vol | AI Vis | AI Mentions |
|---|----------------------|--------|-------------|------------|--------|-------------|
| 1 | AI搜索引擎优化       | 已暂停 | SEO优化     | 12,000     | 0%     | 0           |
| 2 | GEO生成式引擎优化     | 已暂停 | GEO优化     | 8,500      | 0%     | 0           |
| 3 | 内容营销策略         | 已暂停 | 内容营销    | 25,000     | 0%     | 0           |
| 4 | 品牌AI可见度提升     | 已暂停 | 品牌建设    | 6,200      | 0%     | 0           |
| 5 | 搜索引擎排名优化     | 已暂停 | SEO优化     | 18,000     | 0%     | 0           |

### Metrics Color Coding

- **搜索量**: `#f5a623` (yellow) — search volume from external APIs
- **AI可见度**: `#e74c3c` (red when 0%) — AI platform mention rate
- **AI提及**: `#2ecc71` (green) — number of AI platforms mentioning keyword

### Card Actions

| Action   | Style       | Behavior                                    |
|----------|-------------|---------------------------------------------|
| 诊断     | Monitor icon, outlined | Trigger AI diagnosis for this keyword |
| 删除     | Trash icon, outlined   | Delete with confirmation dialog       |
| •••      | Overflow menu          | Edit, Pause/Resume, Export, View history |

## Functional Logic

### Keyword CRUD Operations

#### Add Keyword

```
POST /api/keywords
Body: {
  name: string
  category: string (enum: SEO优化/GEO优化/内容营销/品牌建设/...)
  searchVolume?: number
}
Response: { keyword: Keyword }
```

#### Edit Keyword

```
PUT /api/keywords/:id
Body: {
  name?: string
  category?: string
  status?: 'active' | 'paused'
}
Response: { keyword: Keyword }
```

#### Delete Keyword

```
DELETE /api/keywords/:id
Response: { success: boolean }
```

#### Toggle Status

```
PATCH /api/keywords/:id/status
Body: { status: 'active' | 'paused' }
```

### AI Keyword Expansion (AI拓词)

Click `✨ AI拓词` opens expansion tool:

```
POST /api/keywords/ai-expand
Body: {
  seedKeywords: string[]
  industry?: string
  language?: string
  count?: number (suggested: 10-20)
}
Response: {
  suggestions: Array<{
    keyword: string
    estimatedVolume: number
    difficulty: number
    relevance: number
    category: string
  }>
}
```

User can select from suggestions to add to keyword list.

### Keyword Diagnosis

Click `诊断` on a card triggers:

```
POST /api/keywords/:id/diagnosis
Body: {
  platforms: ['chatgpt', 'perplexity', 'gemini', ...]
  language: string
}
Response: { diagnosisId: string, status: 'pending' }
```

This runs the same diagnosis flow as AI 诊断 but for a single keyword:
1. Query AI platforms with the keyword
2. Measure visibility (mentioned or not)
3. Count mentions across platforms
4. Calculate AI visibility score (0-100%)
5. Update keyword metrics

### Search Volume Data

Fetched from external APIs:

| Source              | Region     | Update Frequency |
|---------------------|------------|------------------|
| Google Keyword Planner | Global | Monthly          |
| Baidu Index            | China   | Weekly           |
| Ahrefs/Semrush         | Global  | Weekly           |

### Auto-refresh Metrics

- AI可见度: Refresh after each diagnosis
- 搜索量: Refresh monthly via scheduled job
- AI提及: Refresh after each diagnosis

### Status Filter Logic

| Filter    | Query Parameter | Behavior                    |
|-----------|-----------------|-----------------------------|
| 全部      | —               | Show all keywords           |
| 已激活    | `status=active` | Only active keywords        |
| 已暂停    | `status=paused` | Only paused keywords        |

### Grid Layout

- Responsive: 3 columns on wide screens, 2 on medium, 1 on narrow
- Cards have equal height within row
- Hover: subtle border highlight effect

## API Endpoints

```
GET    /api/keywords                  - List keywords (with search/filter/pagination)
POST   /api/keywords                  - Create keyword
PUT    /api/keywords/:id              - Update keyword
DELETE /api/keywords/:id              - Delete keyword
PATCH  /api/keywords/:id/status       - Toggle active/paused
POST   /api/keywords/:id/diagnosis    - Run diagnosis
POST   /api/keywords/ai-expand        - AI keyword expansion
GET    /api/keywords/hot              - Get hot keywords (for dashboard)
GET    /api/keywords/:id/history      - Get keyword metric history
```

## Data Model

```
Keyword {
  id: string
  name: string
  category: string
  status: 'active' | 'paused'
  searchVolume: number
  aiVisibility: number (0-100)
  aiMentions: number
  lastDiagnosedAt?: datetime
  createdAt: datetime
  updatedAt: datetime
  userId: string
}
```
