# GEO Platform - Image 6: Writing Templates (AI 写作 - 写作模板)

> Source: `3743b5b2e3b8f81c380e92a201d2b60f.png`

## Page Overview

**写作指令模板** - Manage and use AI writing prompt templates. Templates define structured prompts that guide AI content generation for specific use cases.

## Top Bar Breadcrumb

`首页 > 写作指令 >`

## Sidebar (AI 写作 submenu expanded)

- **写作模板** (active, yellow dot)
- 文章分类
- 写作任务
- 文章列表

## Page Header

- Orange document icon (square with lines)
- Title: `写作指令模板` (bold)
- Subtitle: `管理和使用AI写作提示词模板`
- Action buttons (top right):
  - `🔍 搜索模板...` search input
  - `+ 新建模板` (yellow filled)

## Template Cards (2 visible)

### Card 1: SEO优化博客文章

| Field        | Value                                    |
|--------------|------------------------------------------|
| Icon         | Yellow document icon                     |
| Badge        | `公开` (green)                           |
| Title        | SEO优化博客文章                           |
| Description  | 生成SEO优化的专业博客文章                 |
| Usage count  | 使用 0 次                                |

### Card 2: 产品描述文案

| Field        | Value                                    |
|--------------|------------------------------------------|
| Icon         | Yellow document icon                     |
| Badge        | `公开` (green)                           |
| Title        | 产品描述文案                              |
| Description  | 撰写引人注目的产品描述                    |
| Usage count  | 使用 0 次                                |

## Functional Logic

### Template CRUD Operations

#### Create Template

```
POST /api/writing/templates
Body: {
  name: string (required)
  description?: string
  prompt: string (required, the actual prompt template)
  visibility: 'public' | 'private'
  variables?: Array<{
    name: string
    label: string
    type: 'text' | 'textarea' | 'select' | 'number'
    placeholder?: string
    required?: boolean
    options?: string[]  // for select type
  }>
  category?: string
}
Response: { template: WritingTemplate }
```

#### Template Prompt System

Templates use variable placeholders for dynamic content:

```
示例模板 prompt:
"你是一位专业的SEO内容专家。请为以下主题撰写一篇高质量的博客文章。

主题：{{topic}}
目标关键词：{{keywords}}
文章长度：{{length}}字
写作风格：{{style}}
目标读者：{{audience}}

要求：
1. 标题包含主关键词
2. 首段100字内出现关键词
3. 使用H2/H3小标题
4. 关键词密度2-3%
5. 包含内部链接建议
```

Variables (`{{variable}}`) are replaced at generation time.

#### Update Template

```
PUT /api/writing/templates/:id
Body: { name?, description?, prompt?, visibility?, variables? }
Response: { template: WritingTemplate }
```

#### Delete Template

```
DELETE /api/writing/templates/:id
```

#### Clone Template

```
POST /api/writing/templates/:id/clone
Response: { template: WritingTemplate }  // new copy
```

### Template Visibility

| Visibility | Description                                    |
|------------|------------------------------------------------|
| 公开 (Public)  | Available to all users in the organization |
| 私有 (Private) | Only visible to creator                     |

### Template Usage Tracking

When a template is used in AI writing:
1. Increment `usageCount`
2. Record usage timestamp
3. Link to generated article

```
POST /api/writing/templates/:id/use
Body: { articleId: string }
```

### Template Categories (inferred)

| Category       | Description                          |
|----------------|--------------------------------------|
| SEO内容        | SEO-optimized articles               |
| 产品文案       | Product descriptions                 |
| 品牌故事       | Brand storytelling                   |
| 社交媒体       | Social media posts                   |
| 邮件营销       | Email marketing content              |
| 技术文档       | Technical documentation              |

### Search Functionality

- Search by template name
- Search by description content
- Filter by category
- Filter by visibility (public/private)

### Template Marketplace (future)

- Public templates shared across platform
- Rate and review templates
- Import/export templates

## API Endpoints

```
GET    /api/writing/templates              - List templates (search, filter)
POST   /api/writing/templates              - Create template
GET    /api/writing/templates/:id          - Get template detail
PUT    /api/writing/templates/:id          - Update template
DELETE /api/writing/templates/:id          - Delete template
POST   /api/writing/templates/:id/clone    - Clone template
POST   /api/writing/templates/:id/use      - Record usage
GET    /api/writing/templates/categories   - List categories
POST   /api/writing/templates/import       - Import template
GET    /api/writing/templates/:id/export   - Export template
```

## Data Model

```
WritingTemplate {
  id: string
  name: string
  description?: string
  prompt: string                    // template with {{variables}}
  visibility: 'public' | 'private'
  variables: Array<{
    name: string
    label: string
    type: 'text' | 'textarea' | 'select' | 'number'
    placeholder?: string
    required: boolean
    options?: string[]
    defaultValue?: string
  }>
  category?: string
  usageCount: number
  createdAt: datetime
  updatedAt: datetime
  userId: string
}
```

## UI Design Notes

- Cards arranged in responsive grid (2-3 columns)
- Card click opens template detail / edit
- Hover state: subtle border highlight
- Search bar with debounced input (300ms)
- `+ 新建模板` opens full-screen editor modal
