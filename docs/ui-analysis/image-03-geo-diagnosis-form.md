# GEO Platform - Image 3: GEO Diagnosis Form (AI 诊断 - 新建诊断)

> Source: `ca4c626d2acebb6af7feda157436a2e5.png`

## Page Overview

**GEO 诊断** - Create a new brand diagnosis to analyze brand visibility, sentiment, and competitive landscape across major AI platforms (ChatGPT, Perplexity, Gemini, etc.).

## Top Bar Breadcrumb

`首页 > AI诊断创建 >`

## Back Link

`< 返回列表` → navigates to diagnosis report list

## Sidebar (AI 诊断 submenu expanded)

- **新建诊断** (active, yellow dot)
- 报告 (grey dot) → diagnosis report history

## Page Header

- Title: `GEO 诊断` (large, bold)
- Subtitle: `分析品牌在各大AI平台的可见度、情感倾向和竞争态势`

## Form Fields

### 1. 品牌名称 (Brand Name) — Required *

- Label: `* 品牌名称` (red asterisk)
- Input: text
- Placeholder: `输入品牌名称，如：小米科技`
- Validation: required, min 1 char

### 2. 品牌域名 (Brand Domain) — Optional

- Label: `品牌域名`
- Input: text
- Placeholder: `example.com (可选)`
- Validation: URL format if provided

### 3. 关联关键词 (Related Keywords)

- Label: `关联关键词`
- Input: dropdown/multi-select
- Placeholder: `选择关键词`
- Data source: user's saved keywords from 素材库
- Allows selecting multiple keywords

### 4. 竞品品牌 (Competitor Brands)

- Label: `竞品品牌`
- Action: `+ 添加竞品` (yellow text button)
- Dynamic: supports adding multiple competitor brands
- Each competitor: text input with remove button

### 5. 诊断语言 (Diagnosis Language)

- Label: `诊断语言`
- Input: dropdown/select
- Current value: `CN 中文`
- Helper: `选择AI模型回答的语言，影响诊断查询和结果`
- Options: 中文, English, 日本語, 한국어, etc.

## Functional Logic

### Diagnosis Execution Flow

```
1. User fills form → 2. Submit → 3. System queries AI platforms → 4. Aggregate results → 5. Generate report
```

#### Step 1: Form Submission

```
POST /api/diagnosis/create
Body: {
  brandName: string (required)
  domain?: string
  keywordIds: string[]        // linked keywords
  competitors: string[]       // competitor brand names
  language: 'CN' | 'EN' | 'JP' | 'KR' | ...
}
Response: { diagnosisId: string, status: 'pending' }
```

#### Step 2: AI Platform Querying

System queries multiple AI platforms with standardized prompts:

| AI Platform    | Query Examples                                      | Data Collected           |
|----------------|-----------------------------------------------------|--------------------------|
| ChatGPT        | "What do you know about {brand}?"                   | Mentions, sentiment, ranking |
| Perplexity     | "Tell me about {brand} in {category}"               | Citations, sources       |
| Gemini         | "Compare {brand} with {competitors}"                | Comparison data          |
| Claude         | "Analyze {brand}'s market position"                 | Analysis quality         |
| 文心一言       | "{brand} 怎么样？"                                  | Chinese market data      |
| 通义千问       | "介绍一下{brand}"                                   | Chinese market data      |

#### Step 3: Data Processing

For each AI platform response:
- **Visibility score**: Is brand mentioned? (0 or 1, aggregated to %)
- **Sentiment analysis**: Positive / Neutral / Negative
- **Ranking position**: Where brand appears in response
- **Citation quality**: Are authoritative sources cited?
- **Competitive mention**: How often are competitors mentioned vs brand?

#### Step 4: Report Generation

```
GET /api/diagnosis/:id/report
Response: {
  diagnosisId: string
  brandName: string
  overallScore: number (0-100)
  visibility: {
    overall: number
    byPlatform: Array<{
      platform: string
      score: number
      mentioned: boolean
      sentiment: 'positive' | 'neutral' | 'negative'
      ranking: number
    }>
  }
  sentiment: {
    positive: number (%)
    neutral: number (%)
    negative: number (%)
  }
  competitors: Array<{
    name: string
    visibility: number
    sentiment: string
    comparison: string
  }>
  recommendations: string[]
  generatedAt: datetime
}
```

### Diagnosis Lifecycle

```
pending → querying → processing → completed | failed
```

| Status      | Description                              |
|-------------|------------------------------------------|
| pending     | Form submitted, waiting to process       |
| querying    | Actively querying AI platforms            |
| processing  | Aggregating and analyzing results        |
| completed   | Report ready for viewing                 |
| failed      | Error during processing (retry option)   |

### Competitor Management

- Click `+ 添加竞品` → adds a new text input field
- Each competitor field has a ✕ remove button
- Maximum competitors: 5 (suggested)
- Competitors used for comparative analysis in AI responses

### Keyword Association

- Dropdown populated from user's saved keywords
- Selected keywords help AI platforms understand brand context
- Keywords used as additional query parameters
- If no keywords saved, show hint: `请先在素材库中添加关键词`

## API Endpoints

```
POST   /api/diagnosis/create           - Create new diagnosis
GET    /api/diagnosis/:id              - Get diagnosis status
GET    /api/diagnosis/:id/report       - Get diagnosis report
DELETE /api/diagnosis/:id              - Delete diagnosis
POST   /api/diagnosis/:id/retry        - Retry failed diagnosis
GET    /api/diagnosis/list             - List all diagnoses (paginated)
```

## Data Model

```
Diagnosis {
  id: string
  brandName: string
  domain?: string
  keywordIds: string[]
  competitors: string[]
  language: string
  status: 'pending' | 'querying' | 'processing' | 'completed' | 'failed'
  overallScore?: number
  report?: DiagnosisReport
  createdAt: datetime
  completedAt?: datetime
  userId: string
}
```

## UI States

### Loading State (during diagnosis)

- Show progress indicator
- Display which platform is being queried
- Estimated time remaining

### Error State

- Show error message
- Offer retry button
- Log error for debugging

### Empty State (no diagnoses yet)

- Illustration + text: `暂无诊断报告`
- CTA: `创建第一个诊断`
