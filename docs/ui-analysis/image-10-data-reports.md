# GEO Platform - Image 10: Data Reports (数据分析 - 报告)

> Source: `da8e73f3b83bd3c04c1f5023e050c1be.png`

## Page Overview

**数据报表** - Data dashboard for analytics, trend analysis, and report management.

## Top Bar Breadcrumb

`首页 > 数据报告 >`

## Page Header

- Title: `数据报表` (bold)
- Subtitle: `查看数据概览、趋势分析和报表管理`
- Button: `+ 生成报表` (yellow outlined, top right)

## Sidebar (数据分析 submenu expanded)

| # | Submenu Item | Description                    |
|---|--------------|--------------------------------|
| 1 | 概览         | Overview dashboard             |
| 2 | **报告**     | Reports (active)               |
| 3 | 查询         | Query/search                   |
| 4 | Records      | Records history                |

## Summary Cards (4 cards, top row)

| Card           | Value | Subtitle    | Icon Style      |
|----------------|-------|-------------|-----------------|
| 关键词总数     | 5     | 已收录      | Yellow key      |
| 文章总数       | 2     | 已创建      | Yellow document |
| 已发布         | 0     | 发布成功    | Green checkmark |
| 诊断次数       | 0     | 已完成      | Green atom      |

## Charts Section (2 charts side by side)

### Chart 1: 可见度趋势 (Visibility Trend)

- Type: Area chart (line with fill)
- X-axis: Date range (06-07 to 06-13)
- Y-axis: Visibility score (0-80)
- Data points visible: ~55-75 range
- Trend: Generally stable with slight increase
- Color: Yellow line with dark yellow fill

### Chart 2: 关键词分类 (Keyword Categories)

- Type: Donut chart
- Categories visible:
  - SEO优化 (blue segment, largest)
  - GEO优化 (green segment)
  - 品牌建设 (pink/red segment)
  - 内... (content marketing, yellow segment)
- Center: Empty (donut style)

## Functional Logic

### Report Generation

- `+ 生成报表` triggers report creation
- Report likely includes:
  - Keyword performance summary
  - Article publication stats
  - Visibility trend analysis
  - Category distribution breakdown

### Data Aggregation

- Keywords: total count + categorized by type
- Articles: creation count + publication status
- Diagnostics: completion count
- Visibility: daily tracking with trend

### Analytics Features

1. **Visibility Tracking**: Daily visibility scores plotted over time
2. **Category Distribution**: Donut chart showing keyword type breakdown
3. **Summary Metrics**: Key KPIs at a glance
4. **Report Export**: Generate downloadable reports

### Data Model

```
DataReport {
  id: string
  generatedAt: datetime
  dateRange: { start: date, end: date }
  summary: {
    totalKeywords: number
    totalArticles: number
    publishedArticles: number
    completedDiagnoses: number
  }
  visibilityTrend: Array<{
    date: string
    score: number
  }>
  categoryDistribution: Array<{
    category: string
    count: number
    percentage: number
  }>
}
```

## Chart Library Recommendations

- Area chart: Chart.js or ECharts
- Donut chart: Chart.js or ECharts
- Both support dark theme customization
- Interactive tooltips on hover
- Responsive layout
