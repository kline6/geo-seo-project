# GEO Platform - Image 9: Media Publishing (发布 - 媒体发稿)

> Source: `357153817a524177348723c09de050bb.png`

## Page Overview

**权威媒体新闻发布** - Authoritative media press release distribution platform.
Claims to integrate **55+ global authoritative media resources** with one-click publishing.

## Top Bar Breadcrumb

`首页 > 媒体发布 >`

## Page Header

- Orange document icon
- Title: `权威媒体新闻发布` (bold)
- Subtitle: `整合全球55+权威媒体资源，一键发布新闻稿`
- Button: `📋 发布记录` (top right, outlined)

## Sidebar (发布 submenu expanded)

| # | Submenu Item  | Description                    |
|---|---------------|--------------------------------|
| 1 | 网媒发布      | Online media publishing        |
| 2 | 自媒体发布    | Self-media publishing          |
| 3 | 个人平台      | Personal platform distribution |
| 4 | SEO 建站      | SEO website building           |
| 5 | Facebook      | Facebook distribution          |
| 6 | Twitter(X)    | Twitter/X distribution         |
| 7 | TikTok        | TikTok distribution            |
| 8 | **媒体发稿**  | Media press release (active)   |

## Region Filter Tabs

| Tab       | Active |
|-----------|--------|
| 全部地区  | Yes    |
| 北美      | No     |
| 欧洲      | No     |
| 亚太      | No     |
| 中国      | No     |
| 全球      | No     |
| 中东      | No     |

## Left Panel: 选择权威媒体 (Select Authoritative Media)

Header: `| 选择权威媒体` + `已选 0 个媒体` counter

### Media Cards Grid (2 columns, 6 visible)

| Media Name              | Domain Authority | Monthly Traffic | Type       | Est. Time | Recommended |
|-------------------------|-----------------|-----------------|------------|-----------|-------------|
| TechCrunch             | DA: 95          | 50M/月          | 权威媒体   | 24h       | ✅ 推荐      |
| Bloomberg              | DA: 97          | 80M/月          | 权威媒体   | 48h       | ✅ 推荐      |
| The Wall Street Journal| DA: 96          | 120M/月         | 权威媒体   | 48h       | ✅ 推荐      |
| Forbes                 | DA: 95          | 150M/月         | 权威媒体   | 36h       | ✅ 推荐      |
| The New York Times     | DA: 96          | 300M/月         | 权威媒体   | 48h       | ✅ 推荐      |
| The Washington Post    | DA: 95          | 200M/月         | 权威媒体   | 48h       | ✅ 推荐      |

### Card Structure

- Checkbox (top-left) for selection
- `推荐` badge (yellow, top-right) for recommended outlets
- Media name (bold, white)
- Domain name (grey, smaller)
- Stats row: `DA: XX  XXXM/月`
- Type label: `权威媒体`
- Estimated publish time: `XXh`

## Right Panel: 新闻稿内容 (Press Release Content)

Title: `| 新闻稿内容` (yellow left border)

### Form Fields

| # | Field          | Type              | Placeholder               | Required |
|---|----------------|-------------------|---------------------------|----------|
| 1 | 品牌名称       | Text input        | 输入品牌名称              | Yes      |
| 2 | 语言           | Dropdown          | 中文                      | Yes      |
| 3 | 关联文章(可选) | Dropdown/Select   | 选择已有文章              | No       |
| 4 | 新闻稿标题     | Text input        | 输入新闻稿标题            | Yes      |
| 5 | 新闻稿内容     | Textarea (large)  | 输入新闻稿内容...         | Yes      |

- Content textarea counter: `0 / 10000`

### AI Assistance Button

- Bottom of right panel: `✨ AI辅助生成新闻稿` (yellow outlined button)
- Function: AI generates press release content based on brand name and keywords

## Functional Logic

### Publishing Flow

1. Select target region (filter media by geography)
2. Choose media outlets (checkbox, multi-select)
3. Fill in press release details (brand, title, content)
4. Optionally link existing article from library
5. Use AI to generate/assist writing press release
6. Submit for distribution
7. Track via `发布记录`

### Media Selection Logic

- Each media has DA score, traffic, and estimated publish time
- `推荐` tag highlights best-fit outlets
- Multi-select supported (counter shows "已选 X 个媒体")
- Region filter narrows available media

### AI Press Release Generation

- Input: brand name + optional article link
- Output: structured press release content
- Can be edited before submission

### Data Model

```
PressRelease {
  id: string
  brandName: string
  language: string (enum: 中文/English/...)
  linkedArticleId?: string
  title: string
  content: string (max 10000 chars)
  targetMedia: MediaOutlet[]
  status: 'draft' | 'pending' | 'published' | 'failed'
  createdAt: datetime
  publishedAt?: datetime
}

MediaOutlet {
  id: string
  name: string
  domain: string
  domainAuthority: number
  monthlyTraffic: string
  type: string
  region: string[]
  estimatedHours: number
  recommended: boolean
}
```
