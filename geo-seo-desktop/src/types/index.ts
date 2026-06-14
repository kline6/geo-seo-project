export interface Article {
  id: string
  title: string
  slug: string
  file_path: string
  content_md: string
  language: string
  author: string
  status: 'draft' | 'review' | 'published'
  current_score: number | null
  tags: string[]
  meta_title: string
  meta_desc: string
  meta_keywords: string[]
  pub_datetime: string
  mod_datetime: string
  featured: number
  draft: number
  og_image_path: string
  canonical_url: string
  geo_weight: number
  created_at: string
  updated_at: string
}

export interface AuditIssue {
  id: string
  severity: 'high' | 'medium' | 'low'
  title: string
  evidence: string
  fix: string
}

export interface AuditResult {
  audit_id: string
  score: number
  dimension_scores: Record<string, number>
  issues: AuditIssue[]
  suggestions: string[]
  suggested_meta: {
    title: string
    description: string
    keywords: string[]
  }
}

export interface AuditRecord {
  id: string
  article_id: string
  model_used: string
  score: number
  dimension_scores: Record<string, number>
  issues: AuditIssue[]
  suggestions: string[]
  suggested_meta: object
  content_snapshot: string
  created_at: string
}

export interface AuditDiff {
  id: string
  article_id: string
  before_audit_id: string
  after_audit_id: string
  delta_score: number
  resolved_issues: string[]
  new_issues: string[]
  created_at: string
}

export interface KnowledgeItem {
  id: string
  category: string
  title: string
  summary: string
  body_md: string
  tags: string[]
  source_url: string
  created_at: string
}

export interface GeoCheckItem {
  label: string
  status: 'pass' | 'fail' | 'warn'
  detail: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  default_author: string
  default_language: string
  export_path: string
  python_path: string
  openai_api_key: string
  gemini_api_key: string
  perplexity_api_key: string
}

export interface TrendPoint {
  date: string
  avg_score: number
  count: number
}
export interface SeoGeoDiagnosisResult {
  url: string
  fetched_at: string
  seo: {
    health_score: number
    issues: Array<{ severity: 'high' | 'medium' | 'low'; title: string; detail: string }>
    key_findings: string[]
    impact_points: string[]
    recommendations: string[]
    metrics: Record<string, number>
  }
  geo: {
    readiness_score: number
    citability_score: number
    structure_score: number
    authority_score: number
    checklist: Array<{ id: string; status: 'pass' | 'warn' | 'fail'; title: string; action: string }>
    rewrite_suggestions: string[]
    visibility_notes: string[]
  }
  source_attribution?: {
    provider: string
    source_url: string
    model_hint?: string
  }
}