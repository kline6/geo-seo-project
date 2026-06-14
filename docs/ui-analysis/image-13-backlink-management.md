# GEO Platform - Image 13: Backlink Management (SEO & GEO - 反向链接)

> Source: `97b1afe8d528af8d532accfc55b3ec17.png`

## Page Overview

**外链管理** - Manage high-quality backlinks from authoritative media and social media platforms. Track link status, DA scores, and types.

## Top Bar Breadcrumb

`首页 > 外链管理 >`

## Sidebar (SEO & GEO submenu expanded)

- 关键词
- Audit
- **反向链接** (active, yellow dot)
- Report

## Page Header

- Orange link icon (chain link)
- Title: `外链管理` (bold)
- Subtitle: `管理来自权威媒体和社交媒体的高质量外链`

## Section 1: 添加外链 (Add Backlink)

Title: `| 添加外链` (yellow left border)

### Form Fields (inline, horizontal)

| # | Field    | Type              | Placeholder                      | Required |
|---|----------|-------------------|----------------------------------|----------|
| 1 | 来源URL  | Text input        | `https://news.example.com/article` | Yes    |
| 2 | 目标URL  | Text input        | `https://yoursite.com/page`       | Yes    |
| 3 | 锚文本   | Text input        | `品牌名`                          | Yes    |
| 4 | 类型     | Dropdown          | `Dofollow` (selected)             | Yes    |

- Button: `添加外链` (yellow filled)

### Link Types

| Type       | Description                                    |
|------------|------------------------------------------------|
| Dofollow   | Passes link equity, helps SEO ranking          |
| Nofollow   | Does not pass link equity, still valuable      |
| Sponsored  | Paid link, marked as sponsored                 |
| UGC        | User-generated content link                    |

## Section 2: Summary Cards (4 cards)

| Card         | Value | Icon Style      | Description                    |
|--------------|-------|-----------------|--------------------------------|
| 总外链       | 0     | Yellow link     | Total backlinks tracked        |
| 有效外链     | 0     | Green check     | Active, live links             |
| Dofollow     | 0     | Orange link     | Dofollow type count            |
| 高DA(70+)    | 0     | Yellow trophy   | Links from DA 70+ sites        |

## Section 3: 外链列表 (Backlink List Table)

Title: `| 外链列表` (yellow left border)

### Table Columns

| # | Column     | Description                          |
|---|------------|--------------------------------------|
| 1 | 来源域名   | Source domain (extracted from URL)   |
| 2 | 来源URL    | Full source URL                      |
| 3 | 锚文本     | Anchor text used                     |
| 4 | DA         | Domain Authority score               |
| 5 | 类型       | Dofollow / Nofollow / Sponsored / UGC|
| 6 | 状态       | Active / Broken / Pending            |
| 7 | 发现时间   | When the backlink was first detected |
| 8 | 操作       | Edit / Delete / Verify               |

### Empty State

- Center text: `暂无数据`

## Functional Logic

### Backlink CRUD

#### Add Backlink

```
POST /api/backlinks
Body: {
  sourceUrl: string       // the page containing the link
  targetUrl: string       // your page being linked to
  anchorText: string      // clickable text
  type: 'dofollow' | 'nofollow' | 'sponsored' | 'ugc'
}
Response: { backlink: Backlink }
```

On creation, system automatically:
1. Resolves source domain
2. Checks if source URL is accessible (HTTP status)
3. Queries DA score for source domain
4. Verifies the link actually exists on source page
5. Sets initial status: `active` / `broken` / `pending`

#### Verify Backlink

```
POST /api/backlinks/:id/verify
Response: {
  exists: boolean
  statusCode: number
  da: number
  status: 'active' | 'broken'
}
```

System crawls the source URL and checks if the backlink is still present.

#### Delete Backlink

```
DELETE /api/backlinks/:id
Response: { success: boolean }
```

### DA Score Lookup

When a backlink is added or verified:

```
GET /api/backlinks/da-check?url={sourceDomain}
Response: {
  domain: string
  da: number           // Domain Authority (0-100)
  pa: number           // Page Authority (0-100)
  spamScore: number    // Spam likelihood (0-100)
}
```

Data sources: Moz API, Ahrefs, or similar

### Backlink Monitoring (Periodic Job)

Scheduled job runs daily:

1. **Check all backlinks** for liveness (HTTP 200?)
2. **Verify link still exists** on source page (parse HTML)
3. **Update DA scores** (monthly refresh)
4. **Detect new backlinks** via Google Search Console API
5. **Alert on broken links** (notification system)

```
GET /api/backlinks/monitor
Response: {
  total: number
  active: number
  broken: number
  newToday: number
  brokenAlerts: Backlink[]
}
```

### Summary Card Calculations

| Metric         | Calculation                                      |
|----------------|--------------------------------------------------|
| 总外链          | `COUNT(backlinks WHERE userId = current)`        |
| 有效外链        | `COUNT(backlinks WHERE status = 'active')`       |
| Dofollow        | `COUNT(backlinks WHERE type = 'dofollow')`       |
| 高DA(70+)       | `COUNT(backlinks WHERE da >= 70)`                |

### Integration with 发布 Module

When a press release is published via 媒体发稿:
1. System creates backlink entry automatically
2. Source URL = published article URL
3. Target URL = user's website
4. DA = outlet's domain authority
5. Status = pending (until verified)

### Backlink Quality Scoring

```
qualityScore = (da * 0.3) + (isDofollow * 20) + (isActive * 20) + (100 - spamScore) * 0.3
```

### Filtering & Search

```
GET /api/backlinks?status=active&type=dofollow&minDa=50&search=example.com&page=1&pageSize=20
```

## API Endpoints

```
GET    /api/backlinks                    - List backlinks (filter, paginate)
POST   /api/backlinks                    - Add backlink
GET    /api/backlinks/:id                - Get backlink detail
PUT    /api/backlinks/:id                - Update backlink
DELETE /api/backlinks/:id                - Delete backlink
POST   /api/backlinks/:id/verify         - Verify backlink liveness
POST   /api/backlinks/batch/verify       - Batch verify all
GET    /api/backlinks/da-check           - Check domain authority
GET    /api/backlinks/summary            - Get summary stats
GET    /api/backlinks/monitor            - Run monitoring check
POST   /api/backlinks/import             - Import from CSV/file
GET    /api/backlinks/export             - Export backlinks
```

## Data Model

```
Backlink {
  id: string
  sourceUrl: string
  sourceDomain: string
  targetUrl: string
  anchorText: string
  type: 'dofollow' | 'nofollow' | 'sponsored' | 'ugc'
  da: number               // Domain Authority
  pa?: number              // Page Authority
  spamScore?: number
  status: 'active' | 'broken' | 'pending'
  qualityScore: number
  discoveredAt: datetime
  lastVerifiedAt?: datetime
  createdAt: datetime
  userId: string
}
```
