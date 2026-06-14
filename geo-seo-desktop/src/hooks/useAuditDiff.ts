import { useState, useCallback } from 'react'

export function useAuditDiff() {
  const [diff, setDiff] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const computeDiff = useCallback(async (articleId: string, beforeId: string, afterId: string) => {
    setLoading(true)
    try {
      const res = (await window.electronAPI.invoke('audit.diff', {
        article_id: articleId,
        before_audit_id: beforeId,
        after_audit_id: afterId,
      })) as any
      if (res.success) setDiff(res.data)
    } catch {}
    setLoading(false)
  }, [])

  return { diff, loading, computeDiff, setDiff }
}