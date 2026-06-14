# 04 - API 契约（IPC 接口）

## 通信方式
Electron IPC：渲染进程通过 `window.electronAPI.invoke(channel, data)` 调用

---

## 文章相关

### article.create
创建新文章
```
请求: { title: string, content_md?: string, language?: string }
响应: { success: boolean, data: Article }
```

### article.list
获取文章列表
```
请求: { status?: string, limit?: number, offset?: number, sort?: 'date'|'score' }
响应: { success: boolean, data: Article[], total: number }
```

### article.get
获取单篇文章
```
请求: { id: string }
响应: { success: boolean, data: Article }
```

### article.update
更新文章
```
请求: { id: string, title?: string, content_md?: string, status?: string, meta_title?: string, meta_desc?: string, meta_keywords?: string[] }
响应: { success: boolean, data: Article }
```

### article.delete
删除文章
```
请求: { id: string }
响应: { success: boolean }
```

---

## 审计相关

### audit.run
执行 GEO 审计
```
请求: { article_id: string, platforms?: string[], strict_mode?: boolean }
响应: { success: boolean, data: AuditResult }

AuditResult = {
  audit_id: string,
  score: number,
  dimension_scores: Record<string, number>,
  issues: Array<{ id: string, severity: 'high'|'medium'|'low', title: string, evidence: string, fix: string }>,
  suggestions: string[],
  suggested_meta: { title: string, description: string, keywords: string[] }
}
```

### audit.history
获取某篇文章的审计历史
```
请求: { article_id: string, limit?: number }
响应: { success: boolean, data: AuditRecord[] }
```

### audit.diff
获取优化前后对比
```
请求: { article_id: string, before_audit_id: string, after_audit_id: string }
响应: { success: boolean, data: AuditDiff }
```

---

## 报告相关

### report.export
导出审计报告
```
请求: { audit_id: string, format: 'json'|'md'|'pdf' }
响应: { success: boolean, data: { file_path: string } }
```

### report.list
获取所有报告（审计记录列表）
```
请求: { limit?: number, offset?: number }
响应: { success: boolean, data: AuditRecord[], total: number }
```

---

## 知识库相关

### knowledge.search
搜索知识库
```
请求: { query: string, category?: string, limit?: number }
响应: { success: boolean, data: KnowledgeItem[] }
```

### knowledge.get
获取知识条目详情
```
请求: { id: string }
响应: { success: boolean, data: KnowledgeItem }
```

### knowledge.listByCategory
按分类获取条目
```
请求: { category: string }
响应: { success: boolean, data: KnowledgeItem[] }
```

---

## 设置相关

### settings.get
获取设置
```
请求: {}
响应: { success: boolean, data: Settings }

Settings = {
  python_path: string,
  default_language: string,
  default_author: string,
  export_path: string,
  theme: 'light'|'dark'|'system',
  audit_strict_mode: boolean
}
```

### settings.update
更新设置
```
请求: Partial<Settings>
响应: { success: boolean, data: Settings }
```

---

## 错误响应格式
所有接口错误统一格式：
```
{
  success: false,
  error: {
    code: "ARTICLE_NOT_FOUND" | "AUDIT_FAILED" | "PYTHON_NOT_FOUND" | ...,
    message: "人类可读的错误描述",
    details?: {}
  }
}
```