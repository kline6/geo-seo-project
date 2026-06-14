import { create } from 'zustand'
import type { Article } from '../types'

interface ArticleStore {
  articles: Article[]
  currentArticle: Article | null
  loading: boolean
  total: number

  fetchArticles: (opts?: { status?: string; sort?: string }) => Promise<void>
  fetchArticle: (id: string) => Promise<void>
  createArticle: (data?: { title?: string; content_md?: string }) => Promise<Article | null>
  saveArticle: (id: string, data: Partial<Article>) => Promise<void>
  deleteArticle: (id: string) => Promise<void>
  setCurrentArticle: (article: Article | null) => void
}

const api = window.electronAPI

export const useArticleStore = create<ArticleStore>((set, get) => ({
  articles: [],
  currentArticle: null,
  loading: false,
  total: 0,

  fetchArticles: async (opts) => {
    set({ loading: true })
    const res = (await api.invoke('article.list', opts)) as any
    if (res.success) {
      set({
        articles: res.data.map((a: any) => ({
          ...a,
          tags: safeJson(a.tags, []),
          meta_keywords: safeJson(a.meta_keywords, []),
        })),
        total: res.total,
      })
    }
    set({ loading: false })
  },

  fetchArticle: async (id) => {
    const res = (await api.invoke('article.get', { id })) as any
    if (res.success) {
      const a = res.data
      set({
        currentArticle: {
          ...a,
          tags: safeJson(a.tags, []),
          meta_keywords: safeJson(a.meta_keywords, []),
        },
      })
    }
  },

  createArticle: async (data) => {
    const res = (await api.invoke('article.create', data || {})) as any
    if (res.success) {
      const a = res.data
      const article: Article = {
        ...a,
        tags: safeJson(a.tags, []),
        meta_keywords: safeJson(a.meta_keywords, []),
      }
      set({ currentArticle: article })
      get().fetchArticles()
      return article
    }
    return null
  },

  saveArticle: async (id, data) => {
    await api.invoke('article.update', { id, ...data })
    get().fetchArticle(id)
  },

  deleteArticle: async (id) => {
    await api.invoke('article.delete', { id })
    if (get().currentArticle?.id === id) set({ currentArticle: null })
    get().fetchArticles()
  },

  setCurrentArticle: (article) => set({ currentArticle: article }),
}))

function safeJson(val: string | any[], fallback: any[]) {
  if (Array.isArray(val)) return val
  try { return JSON.parse(val) } catch { return fallback }
}