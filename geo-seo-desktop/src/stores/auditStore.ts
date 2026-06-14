import { create } from 'zustand'
import type { AuditRecord } from '../types'

interface AuditStore {
  audits: AuditRecord[]
  currentAudit: AuditRecord | null
  loading: boolean

  fetchHistory: (articleId: string) => Promise<void>
  fetchAll: () => Promise<void>
}

const api = window.electronAPI

function parseAudit(row: any): AuditRecord {
  return {
    ...row,
    dimension_scores: safeJson(row.dimension_scores, {}),
    issues: safeJson(row.issues, []),
    suggestions: safeJson(row.suggestions, []),
    suggested_meta: safeJson(row.suggested_meta, {}),
  }
}

export const useAuditStore = create<AuditStore>((set) => ({
  audits: [],
  currentAudit: null,
  loading: false,

  fetchHistory: async (articleId) => {
    set({ loading: true })
    const res = (await api.invoke('audit.history', { article_id: articleId })) as any
    if (res.success) set({ audits: res.data.map(parseAudit) })
    set({ loading: false })
  },

  fetchAll: async () => {
    set({ loading: true })
    const res = (await api.invoke('audit.list')) as any
    if (res.success) set({ audits: res.data.map(parseAudit) })
    set({ loading: false })
  },
}))

function safeJson(val: string | object, fallback: any) {
  if (typeof val !== 'string') return val || fallback
  try { return JSON.parse(val) } catch { return fallback }
}