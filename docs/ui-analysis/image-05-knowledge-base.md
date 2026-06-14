# GEO Platform - Image 5: Knowledge Base (素材库 - 知识库)

> Source: `fde3abc7383c181597344332db54301c.png`

## Page Overview

**企业知识库** - Enterprise knowledge base for storing, organizing, and retrieving company knowledge assets. Used as context source for AI writing and content generation.

## Top Bar Breadcrumb

`首页 > 知识库 >`

## Sidebar (素材库 submenu expanded)

- 关键词
- 标题
- 图片
- **知识库** (active, yellow dot)

## Page Header

- Title: `企业知识库` (bold)
- Action buttons (top right):
  - `筛选分类` dropdown (outlined) — filter by category
  - `+ 添加知识` (yellow filled) — create new entry

## Data Table

### Columns

| # | Column     | Width   | Type         | Sortable | Description                    |
|---|------------|---------|--------------|----------|--------------------------------|
| 1 | 标题       | 25%     | Text (link)  | Yes      | Knowledge entry title          |
| 2 | 分类       | 15%     | Tag/Enum     | Yes      | Category label                 |
| 3 | 来源       | 15%     | Text/URL     | Yes      | Source (manual, URL, import)   |
| 4 | 字数       | 10%     | Number       | Yes      | Word count (auto-calculated)   |
| 5 | 状态       | 10%     | Badge        | Yes      | draft / published / archived   |
| 6 | 创建时间   | 15%     | Datetime     | Yes      | Creation timestamp             |
| 7 | 操作       | 10%     | Actions      | No       | Edit / Delete / View           |

### Empty State

- Center text: `暂无数据`
- (Should also have illustration + CTA button)

### Pagination

- `共 0 条` (total count)
- `< 1 >` (page navigation)
- Page size: 10/20/50 (configurable)

## Functional Logic

### Knowledge Entry CRUD

#### Create Entry

```
POST /api/knowledge
Body: {
  title: string (required)
  category: string (required)
  content: string (rich text / markdown)
  source?: string
  tags?: string[]
}
Response: { entry: KnowledgeEntry }
```

#### Read Entry

```
GET /api/knowledge/:id
Response: {
  id: string
  title: string
  category: string
  content: string
  source: string
  wordCount: number
  status: 'draft' | 'published' | 'archived'
  createdAt: datetime
  updatedAt: datetime
}
```

#### Update Entry

```
PUT /api/knowledge/:id
Body: { title?, category?, content?, source?, status?, tags? }
Response: { entry: KnowledgeEntry }
```

#### Delete Entry

```
DELETE /api/knowledge/:id
Response: { success: boolean }
```

### Knowledge Entry Form (Create/Edit Modal)

| Field      | Type              | Required | Description                    |
|------------|-------------------|----------|--------------------------------|
| 标题       | Text input        | Yes      | Entry title                    |
| 分类       | Dropdown          | Yes      | Category selection             |
| 内容       | Rich text editor  | Yes      | Main content (Markdown support)|
| 来源       | Text / URL input  | No       | Source reference               |
| 标签       | Tag input         | No       | Custom tags for search         |
| 状态       | Radio / Dropdown  | Yes      | draft / published / archived   |

### Category Management

Categories are predefined + user-customizable:

| Default Categories   | Description                    |
|----------------------|--------------------------------|
| 产品介绍             | Product descriptions           |
| 技术文档             | Technical documentation        |
| 常见问题             | FAQ content                    |
| 品牌资料             | Brand materials                |
| 行业知识             | Industry knowledge             |
| 竞品分析             | Competitive analysis           |

```
GET    /api/knowledge/categories       - List categories
POST   /api/knowledge/categories       - Create category
PUT    /api/knowledge/categories/:id   - Update category
DELETE /api/knowledge/categories/:id   - Delete category
```

### Content Processing

When a knowledge entry is saved:

1. **Word count calculation**: Auto-count Chinese characters + English words
2. **Content indexing**: Full-text search indexing for retrieval
3. **Vector embedding**: Generate embeddings for semantic search (if AI features enabled)
4. **Status update**: Update entry status

### Integration with AI Writing

Knowledge base entries are used as context for AI writing:

```
POST /api/writing/generate
Body: {
  title: "...",
  requirements: "...",
  knowledgeContext: ["knowledge-id-1", "knowledge-id-2"]  // ← linked entries
}
```

The AI uses knowledge base content to:
- Reference accurate product information
- Include technical details
- Maintain brand voice consistency
- Cite internal documentation

### Search & Filter

#### Text Search

```
GET /api/knowledge?search=关键词
```

Full-text search across title + content + tags.

#### Category Filter

```
GET /api/knowledge?category=产品介绍
```

Filter by specific category.

#### Status Filter

```
GET /api/knowledge?status=published
```

#### Combined Filters

```
GET /api/knowledge?search=API&category=技术文档&status=published&page=1&pageSize=20
```

### Bulk Operations (inferred)

- Select multiple entries → bulk delete
- Select multiple entries → bulk status change
- Import from file (TXT, DOCX, PDF)
- Export all entries

## API Endpoints

```
GET    /api/knowledge                  - List entries (search, filter, paginate)
POST   /api/knowledge                  - Create entry
GET    /api/knowledge/:id              - Get entry detail
PUT    /api/knowledge/:id              - Update entry
DELETE /api/knowledge/:id              - Delete entry
PATCH  /api/knowledge/:id/status       - Change status
POST   /api/knowledge/import           - Bulk import
GET    /api/knowledge/export           - Export entries
GET    /api/knowledge/categories       - List categories
POST   /api/knowledge/search/semantic  - Semantic search (vector)
```

## Data Model

```
KnowledgeEntry {
  id: string
  title: string
  category: string
  content: string (rich text / markdown)
  source?: string
  wordCount: number
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  embedding?: number[] (vector for semantic search)
  createdAt: datetime
  updatedAt: datetime
  userId: string
}
```

## Pagination Logic

- Default page size: 10
- Total count displayed: `共 X 条`
- Page numbers with prev/next arrows
- Current page highlighted (yellow)
- Jump to page input (optional)
