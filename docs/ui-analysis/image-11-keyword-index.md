# GEO Platform - Image 11: Keyword Index Query (AI 工具 - 关键词指数)

> Source: `aac765d33586e8c9557036af808fff00.png`

## Page Overview

**关键词指数查询** - Query keyword search index, competition level, and AI visibility.

## Top Bar Breadcrumb

`首页 > 关键词指数 >`

## Page Header

- Title: `关键词指数查询` (bold)
- Subtitle: `查询关键词搜索指数、竞争程度和AI可见度`

## Sidebar (AI 工具 submenu expanded)

| # | Submenu Item   | Description                    |
|---|----------------|--------------------------------|
| 1 | **关键词指数** | Keyword index (active)         |
| 2 | AI 拓展        | AI keyword expansion           |
| 3 | 手动拓展       | Manual keyword expansion       |

Note: `系统管理` appears at bottom of sidebar (admin section).

## Section 1: 指数查询 (Index Query)

Title: `| 指数查询` (yellow left border)

### Search Bar

- Icon: 🔑 (key icon)
- Placeholder: `输入关键词查询搜索指数，如：GEO优化`
- Button: `查询指数` (yellow filled, right side)

## Section 2: 关键词指数对比 (Keyword Index Comparison)

Title: `| 关键词指数对比` (yellow left border)

### Bar Chart

- Type: Vertical bar chart
- X-axis: Keyword names (rotated 45°)
  - 搜索引擎优化
  - 生成式引擎优化
  - 内容营销策略
  - 品牌AI可见度
  - 搜索引擎排名
- Y-axis: Index value (0-8,000)
- Bar color: Yellow (solid)
- Values visible: ~4,000 - 7,000 range

## Section 3: 查询历史 (Query History)

Title: `| 查询历史` (partially visible at bottom)

- Table/list of past queries
- Likely includes: keyword, date, index value

## Functional Logic

### Keyword Index Query Flow

1. User enters keyword in search bar
2. System queries external APIs (Google Trends, Baidu Index, etc.)
3. Returns: search volume, competition level, AI visibility
4. Results added to comparison chart
5. Query saved to history

### Data Sources (Inferred)

- Search volume: Google Keyword Planner / Baidu Index
- Competition: SEO tool APIs (Ahrefs, SEMrush, etc.)
- AI visibility: Custom GEO analysis

### Comparison Feature

- Multiple keywords can be compared side-by-side
- Bar chart visualizes relative search volumes
- Historical data tracked for trend analysis

### Data Model

```
KeywordIndex {
  id: string
  keyword: string
  searchVolume: number
  competition: 'low' | 'medium' | 'high'
  aiVisibility: number (0-100)
  queriedAt: datetime
  source: string
}

QueryHistory {
  id: string
  keyword: string
  indexValue: number
  queriedAt: datetime
  userId: string
}
```

## API Integration Points

1. **Google Trends API** - Search volume trends
2. **Baidu Index API** - Chinese market search data
3. **SEO APIs** - Competition and difficulty scores
4. **GEO Analysis Engine** - AI visibility scoring
