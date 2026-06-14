# GEO Platform - Image 12: SEO Keyword Tracking (SEO & GEO - 关键词)

> Source: `51dc1dac4c4921eb69abc23d5c9492c0.png`

## Page Overview

**SEO关键词追踪** - Track target keyword rankings in Google search and AI engines.

## Top Bar Breadcrumb

`首页 > 关键词 >`

## Page Header

- Green checkmark icon (in green circle)
- Title: `SEO关键词追踪` (bold)
- Subtitle: `追踪目标关键词在谷歌搜索和AI引擎中的排名变化`

## Sidebar (SEO & GEO submenu expanded)

| # | Submenu Item | Description                    |
|---|--------------|--------------------------------|
| 1 | **关键词**   | Keyword tracking (active)      |
| 2 | Audit        | SEO audit                      |
| 3 | 反向链接     | Backlinks                      |
| 4 | Report       | SEO reports                    |

## Section 1: 添加关键词追踪 (Add Keyword Tracking)

Title: `| 添加关键词追踪` (yellow left border)

### Form Fields (inline)

| Field    | Type         | Placeholder              |
|----------|--------------|--------------------------|
| 关键词   | Text input   | 输入关键词               |
| 目标URL  | Text input   | https://example.com/page |

- Button: `添加追踪` (yellow filled)

## Section 2: Summary Cards (4 cards)

| Card             | Value | Icon Style         |
|------------------|-------|--------------------|
| 追踪关键词       | 0     | Yellow key         |
| 前10排名         | 0     | Yellow trophy      |
| 平均排名         | #0    | Yellow monitor     |
| 平均GEO可见度    | 0%    | Yellow chart       |

## Section 3: 关键词列表 (Keyword List Table)

Title: `| 关键词列表` (yellow left border)

### Table Columns

| # | Column     | Description                          |
|---|------------|--------------------------------------|
| 1 | 关键词     | Tracked keyword                      |
| 2 | 目标URL    | Target page URL                      |
| 3 | 谷歌排名   | Google search ranking                |
| 4 | GEO可见度  | AI engine visibility score           |
| 5 | 搜索量     | Monthly search volume                |
| 6 | 竞争度     | Competition level                    |
| 7 | CPC        | Cost per click (advertising value)   |
| 8 | 最后检测   | Last checked timestamp               |
| 9 | 操作       | Action buttons (edit/delete/refresh) |

### Empty State

- Center text: `暂无数据`

## Functional Logic

### Keyword Tracking Flow

1. User adds keyword + target URL
2. System periodically checks:
   - Google ranking for that keyword
   - AI engine mentions/visibility
   - Search volume changes
   - Competition shifts
3. Results displayed in table
4. Summary stats auto-calculated

### Tracking Metrics

| Metric           | Source              | Update Frequency |
|------------------|---------------------|------------------|
| 谷歌排名         | Google Search API   | Daily            |
| GEO可见度        | AI engine analysis  | Weekly           |
| 搜索量           | Keyword tools       | Monthly          |
| 竞争度           | SEO analysis        | Weekly           |
| CPC              | Google Ads API      | Monthly          |

### Summary Calculations

- **追踪关键词**: Count of all tracked keywords
- **前10排名**: Count of keywords ranking in Google top 10
- **平均排名**: Average Google ranking position across all keywords
- **平均GEO可见度**: Average AI visibility score across all keywords

### Data Model

```
KeywordTracking {
  id: string
  keyword: string
  targetUrl: string
  googleRanking: number | null
  geoVisibility: number (0-100)
  searchVolume: number
  competition: 'low' | 'medium' | 'high'
  cpc: number
  lastChecked: datetime
  createdAt: datetime
  userId: string
}

TrackingSummary {
  totalTracked: number
  top10Count: number
  averageRanking: number
  averageGeoVisibility: number
}
```

### API Integration Points

1. **Google Search Console API** - Ranking data
2. **Google Ads API** - CPC and search volume
3. **AI Engine APIs** - GEO visibility analysis
4. **SEO Tool APIs** - Competition analysis

### Periodic Jobs

- Daily: Check Google rankings for all tracked keywords
- Weekly: Update GEO visibility scores
- Monthly: Refresh search volume and CPC data
- On-demand: Manual refresh via action button
