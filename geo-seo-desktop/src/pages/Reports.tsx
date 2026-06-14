import { useEffect, useState } from 'react'
import { FileDown, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface AuditRow {
  id: string; article_id: string; score: number; created_at: string
  dimension_scores: string; issues: string; suggestions: string
}

export default function Reports() {
  const [audits, setAudits] = useState<AuditRow[]>([])
  const [articles, setArticles] = useState<Record<string, any>>({})
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const auditRes = (await window.electronAPI.invoke('audit.list', { limit: 50 })) as any
    if (auditRes.success) {
      setAudits(auditRes.data)
      setTotal(auditRes.total)

      // Load article titles
      const articleIds = [...new Set(auditRes.data.map((a: AuditRow) => a.article_id))]
      const articleMap: Record<string, any> = {}
      for (const aid of articleIds) {
        const artRes = (await window.electronAPI.invoke('article.get', { id: aid })) as any
        if (artRes.success) articleMap[aid] = artRes.data
      }
      setArticles(articleMap)
    }
  }

  const exportJson = (audit: AuditRow) => {
    const data = {
      audit_id: audit.id,
      article: articles[audit.article_id]?.title || 'Unknown',
      score: audit.score,
      dimension_scores: JSON.parse(audit.dimension_scores || '{}'),
      issues: JSON.parse(audit.issues || '[]'),
      suggestions: JSON.parse(audit.suggestions || '[]'),
      created_at: audit.created_at,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-report-${audit.id.slice(0, 8)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportMd = (audit: AuditRow) => {
    const issues = JSON.parse(audit.issues || '[]') as any[]
    const suggestions = JSON.parse(audit.suggestions || '[]') as string[]
    const dims = JSON.parse(audit.dimension_scores || '{}') as Record<string, number>
    const title = articles[audit.article_id]?.title || 'Unknown'

    const dimLabels: Record<string, string> = {
      citation_density: '引用密度', claim_clarity: '命题清晰度',
      structure_parse: '结构可解析性', authority_signal: '权威信号',
      fact_verifiability: '事实可核验性', platform_fit: '平台适配度',
    }

    let md = `# GEO 审计报告\n\n`
    md += `**文章**: ${title}\n`
    md += `**总分**: ${audit.score}/100\n`
    md += `**日期**: ${audit.created_at}\n\n`
    md += `## 维度评分\n\n| 维度 | 分数 |\n|------|------|\n`
    for (const [k, v] of Object.entries(dims)) {
      md += `| ${dimLabels[k] || k} | ${v} |\n`
    }
    md += `\n## 问题清单 (${issues.length} 项)\n\n`
    issues.forEach((issue: any, i: number) => {
      md += `### ${i + 1}. [${issue.severity}] ${issue.title}\n`
      md += `- **证据**: ${issue.evidence}\n`
      md += `- **修复**: ${issue.fix}\n\n`
    })
    md += `## 优化建议\n\n`
    suggestions.forEach((s: string) => { md += `- ${s}\n` })

    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-report-${audit.id.slice(0, 8)}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">报告与历史</h1>
        <p className="mt-1 text-sm text-gray-500">共 {total} 条审计记录</p>
      </div>

      {audits.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-gray-400">
          <FileDown className="h-12 w-12 mb-4" />
          <p>暂无审计记录</p>
          <p className="text-sm">完成首次审计后将在此显示</p>
        </div>
      ) : (
        <div className="space-y-3">
          {audits.map((audit) => {
            const dims = JSON.parse(audit.dimension_scores || '{}')
            return (
              <div key={audit.id} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl font-extrabold ${audit.score >= 80 ? 'text-green-600' : audit.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {audit.score}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{articles[audit.article_id]?.title || '加载中...'}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {audit.created_at}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => exportJson(audit)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                      <FileDown className="mr-1 inline h-3 w-3" />JSON
                    </button>
                    <button onClick={() => exportMd(audit)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                      <FileDown className="mr-1 inline h-3 w-3" />Markdown
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}