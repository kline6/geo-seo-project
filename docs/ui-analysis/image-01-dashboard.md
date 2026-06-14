# GEO Platform - Image 1: Dashboard (工作台)

> Source: `2f1a1242f8a404b1ae739bdf61df3c02.png`

## Page Overview

**工作台** - Main dashboard providing a high-level overview of all GEO/SEO activities, quick access to key functions, and real-time metrics.

## Top Bar Breadcrumb

`首页 > 工作台 >`

## Left Sidebar Menu

| # | Menu Item       | Icon              | Submenu | Description |
|---|-----------------|-------------------|---------|-------------|
| 1 | ⊙ 工作台        | ⊙                 | No      | Dashboard   |
| 2 | 💬 AI 智能助手   | chat icon         | No      | AI assistant |
| 3 | 🖥 AI 诊断       | monitor icon      | Yes ▼   | Brand diagnosis |
| 4 | 📁 素材库        | folder icon       | Yes ▼   | Asset library |
| 5 | ✏ AI 写作       | pen icon          | Yes ▼   | AI writing |
| 6 | 📋 热文复制      | copy icon         | Yes ▼   | Hot article replication |
| 7 | ✈ 发布          | send icon         | Yes ▼   | Publishing |
| 8 | 📊 数据分析      | chart icon        | Yes ▼   | Analytics |
| 9 | 🧩 AI 工具       | puzzle icon       | Yes ▼   | AI tools |
| 10| 🔍 SEO & GEO    | search icon       | Yes ▼   | SEO & GEO |
| 11| ✓ 信任度评分     | check icon        | Yes ▼   | Trust score |

### Sidebar bottom (user info)

- Avatar: `G` (yellow circle)
- Username: `GEO用户`
- Plan: `永久至尊国际版` (gold text)
- Author WeChat: `H6220073`

## Welcome Section

- Large yellow circle avatar with `G`
- Title: `欢迎回来，GEO用户`
- Subtitle: `GEO 优化工作台|` (blinking cursor - typewriter effect)

## Summary Stats Row (inline, horizontal)

| Stat       | Value | Indicator |
|------------|-------|-----------|
| 关键词     | 5     | Yellow dot |
| 文章       | 2     | Yellow dot |
| 诊断       | 0     | Yellow dot |
| 可见度     | 71%   | Yellow dot |

## Dashboard Cards (4 cards, horizontal row)

| Card Title       | Value | Icon Style        | Background |
|------------------|-------|-------------------|------------|
| 关键词总数       | 5     | Yellow lock       | Dark card  |
| 文章总数         | 2     | Yellow document   | Dark card  |
| 诊断报告         | 0     | Yellow monitor    | Dark card  |
| 平均可见度       | 71%   | Yellow chart      | Dark card  |

## Quick Actions Section (快捷操作)

Title: `| 快捷操作` (yellow left border accent)

Grid 2×2 layout:

| Action          | Description     | Icon           | Target Route        |
|-----------------|-----------------|----------------|---------------------|
| 新建诊断        | 分析AI可见度    | Yellow monitor | `/diagnosis/create` |
| AI 写作         | 生成内容        | Yellow pen     | `/writing/tasks`    |
| 关键词          | 管理关键词      | Yellow lock    | `/keywords`         |
| 数据分析        | 查看详细分析    | Yellow chart   | `/analytics/reports`|

## Hot Keywords Section (热门关键词)

Title: `| 热门关键词` (yellow left border accent)
Action: `查看全部 >` button (yellow, right-aligned)

Ranked list (top 3):

| Rank | Keyword              | Volume   | Visibility | Trend   |
|------|----------------------|----------|------------|---------|
| 1    | 内容营销策略         | 25,000   | 65%        | —       |
| 2    | 搜索引擎排名优化     | 18,000   | 60%        | —       |
| 3    | AI搜索引擎优化       | 12,000   | 72%        | —       |

Each row: numbered yellow circle + keyword name + volume + visibility percentage.

## Functional Logic

### Dashboard Data Loading

On page load, fetch aggregated data from multiple sources:

```
GET /api/dashboard/summary
Response: {
  keywords: { total: 5, byCategory: {...} }
  articles: { total: 2, published: 0, draft: 2 }
  diagnoses: { total: 0, completed: 0 }
  visibility: { average: 71, trend: 'up' }
}
```

### Hot Keywords Loading

```
GET /api/keywords/hot?limit=3&sort=volume
Response: Array<{
  keyword: string
  volume: number
  visibility: number
  rank: number
}>
```

### Quick Action Navigation

Each card is a router link to the corresponding module:
- 新建诊断 → `/diagnosis/create`
- AI 写作 → `/writing/tasks`
- 关键词 → `/keywords`
- 数据分析 → `/analytics/reports`

### Visibility Calculation

Average visibility is computed from all tracked keywords:
- Each keyword has an AI visibility score (0-100%)
- Average = sum of all visibility scores / total keywords
- Updates: real-time when keywords are diagnosed

### Stats Auto-refresh

Dashboard stats should auto-refresh:
- On initial load
- On page focus (window focus event)
- Periodically every 60 seconds (polling)

## Data Model

```
DashboardSummary {
  totalKeywords: number
  totalArticles: number
  totalDiagnoses: number
  averageVisibility: number (0-100)
  hotKeywords: Array<{
    keyword: string
    volume: number
    visibility: number
  }>
  quickActions: Array<{
    label: string
    description: string
    icon: string
    route: string
  }>
}
```

## Theme / Design Tokens

- Background: `#0a0a0a` (near black)
- Sidebar background: `#111111`
- Card background: `#1a1a1a`
- Primary accent: `#f5a623` (golden yellow)
- Text primary: `#ffffff`
- Text secondary: `#999999`
- Stat numbers: `#f5a623` (yellow)
- Border radius: ~8px for cards, ~4px for buttons
- Font: system sans-serif
