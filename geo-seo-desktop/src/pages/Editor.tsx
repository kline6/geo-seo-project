import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { EditorView } from '@codemirror/view'
import { Save, Play, LayoutTemplate, Clock, Eye, Code } from 'lucide-react'
import { useArticleStore } from '../stores/articleStore'
import { useAutoSave } from '../hooks/useAutoSave'
import GeoCheckPanel from '../components/GeoCheckPanel'
import MetadataPanel from '../components/MetadataPanel'
import MarkdownPreview from '../components/MarkdownPreview'
import { geoTemplates } from '../data/templates'
import type { GeoCheckItem, Article } from '../types'

function runGeoChecks(md: string): GeoCheckItem[] {
  const checks: GeoCheckItem[] = []
  const hasDef = /^>\s*\*\*.+\*\*\s*是/m.test(md) || /^>\s*.+是指/m.test(md)
  checks.push({ label: '定义段', status: hasDef ? 'pass' : 'fail', detail: hasDef ? '已找到引言定义段' : '缺少以 > 引用的定义段落' })
  const hasTable = /\|.+\|/.test(md) && /\|[-:]+/.test(md)
  checks.push({ label: '数据表格', status: hasTable ? 'pass' : 'fail', detail: hasTable ? '已检测到表格' : '缺少数据表格' })
  const hasFaq = /FAQ|常见问题|Q\d+[:：]/i.test(md)
  checks.push({ label: 'FAQ 模块', status: hasFaq ? 'pass' : 'fail', detail: hasFaq ? '已检测到 FAQ 结构' : '缺少 FAQ 问答模块' })
  const h2Count = (md.match(/^## /gm) || []).length
  checks.push({ label: 'H2 标题结构', status: h2Count >= 2 && h2Count <= 8 ? 'pass' : h2Count < 2 ? 'fail' : 'warn', detail: `检测到 ${h2Count} 个 H2 标题（建议 2-8 个）` })
  const paragraphs = md.split(/\n\n+/).filter(p => p.trim() && !p.startsWith('#') && !p.startsWith('|') && !p.startsWith('-') && !p.startsWith('>'))
  const longParas = paragraphs.filter(p => p.length > 200)
  checks.push({ label: '段落长度', status: longParas.length === 0 ? 'pass' : 'warn', detail: longParas.length === 0 ? '所有段落长度合适' : `${longParas.length} 个段落超过200字` })
  const hasList = /^[-*]\s/m.test(md) || /^\d+\.\s/m.test(md)
  checks.push({ label: '列表使用', status: hasList ? 'pass' : 'warn', detail: hasList ? '已使用列表结构' : '建议添加列表提高可读性' })
  const hasStandard = /ISO\s*\d+/i.test(md)
  checks.push({ label: '标准编号引用', status: hasStandard ? 'pass' : 'warn', detail: hasStandard ? '已引用标准编号' : '建议引用 ISO 标准编号增加权威性' })
  const numbers = md.match(/\d+[\d.,]*[%万元个条次]/g) || []
  checks.push({ label: '数据引用', status: numbers.length >= 3 ? 'pass' : numbers.length >= 1 ? 'warn' : 'fail', detail: `检测到 ${numbers.length} 个数据点（建议至少3个）` })
  return checks
}

export default function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentArticle, fetchArticle, createArticle, saveArticle, setCurrentArticle } = useArticleStore()
  const [content, setContent] = useState('')
  const [checks, setChecks] = useState<GeoCheckItem[]>([])
  const [saving, setSaving] = useState(false)
  const [lastSavedContent, setLastSavedContent] = useState('')

  const [showTemplates, setShowTemplates] = useState(false)
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split')
  const [wordCount, setWordCount] = useState(0)
  const [ogPreview, setOgPreview] = useState('')
  const isNew = !id

  useEffect(() => {
    if (id) fetchArticle(id)
    else setCurrentArticle({
      id: '', title: '', slug: '', file_path: '', content_md: '', language: 'zh-CN',
      author: 'ISO 专家', status: 'draft', current_score: null, tags: [],
      meta_title: '', meta_desc: '', meta_keywords: [],
      pub_datetime: '', mod_datetime: '', featured: 0, draft: 0,
      og_image_path: '', canonical_url: '', geo_weight: 2,
      created_at: '', updated_at: '',
    })
  }, [id])

  useEffect(() => {
    if (currentArticle) setContent(currentArticle.content_md || '')
  }, [currentArticle?.id])

  useEffect(() => {
    const timer = setTimeout(() => {
      setChecks(runGeoChecks(content))
      setWordCount(content.replace(/\s/g, '').length)
    }, 500)
    return () => clearTimeout(timer)
  }, [content])

  // Load OG preview when article loads
  useEffect(() => {
    if (currentArticle?.id) {
      window.electronAPI.invoke('og.preview', { article_id: currentArticle.id }).then((res: any) => {
        if (res.success && res.data.exists) setOgPreview(res.data.base64)
      })
    }
  }, [currentArticle?.id])

  const doSave = useCallback(async () => {
    if (!content.trim()) return
    setSaving(true)
    try {
      const titleMatch = content.match(/^#\s+(.+)/m)
      const autoTitle = titleMatch?.[1]?.trim() || content.split('\n').find(l => l.trim())?.slice(0, 50) || '未命名文章'

      if (isNew || !currentArticle?.id) {
        const article = await createArticle({ title: autoTitle, content_md: content })
        if (article) {
          setLastSavedContent(content)
          navigate(`/editor/${article.id}`, { replace: true })
        }
      } else {
        await saveArticle(currentArticle.id, { title: autoTitle, content_md: content })
        setLastSavedContent(content)
      }
    } finally {
      setSaving(false)
    }
  }, [currentArticle, content, isNew, createArticle, saveArticle, navigate])

  const { trigger: autoSaveTrigger } = useAutoSave(doSave, 3000)

  const handleContentChange = useCallback((val: string) => {
    setContent(val)
    autoSaveTrigger()
  }, [autoSaveTrigger])

  const handleMetaChange = useCallback((field: string, value: string | number) => {
    if (!currentArticle) return
    setCurrentArticle({ ...currentArticle, [field]: value } as Article)
    if (currentArticle.id) {
      window.electronAPI.invoke('article.update', { id: currentArticle.id, [field]: value })
    }
  }, [currentArticle])

  const handleGenerateOg = useCallback(async () => {
    if (!currentArticle?.id) { alert('请先保存文章'); return }
    const res = (await window.electronAPI.invoke('og.generate', { article_id: currentArticle.id })) as any
    if (res.success) {
      const preview = (await window.electronAPI.invoke('og.preview', { article_id: currentArticle.id })) as any
      if (preview.success && preview.data.exists) setOgPreview(preview.data.base64)
    }
  }, [currentArticle])

  const insertTemplate = (templateId: string) => {
    const tpl = geoTemplates.find(t => t.id === templateId)
    if (tpl) { setContent(tpl.content); setShowTemplates(false) }
  }

  const readingTime = Math.max(1, Math.ceil(wordCount / 500))

  return (
    <div className="flex h-[calc(100vh-3rem)] min-h-[480px] gap-4">
      <div className="flex flex-1 flex-col">
        {/* Toolbar */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{isNew ? '新建文章' : '编辑文章'}</h1>
            {saving && <span className="flex items-center gap-1 text-xs text-gray-400"><Clock className="h-3 w-3" /> 保存中...</span>}
          </div>
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
              {([['edit', Code], ['split', LayoutTemplate], ['preview', Eye]] as const).map(([mode, Icon]) => (
                <button key={mode} onClick={() => setViewMode(mode as any)}
                  className={`px-2.5 py-1.5 ${viewMode === mode ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <div className="relative">
              <button onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                <LayoutTemplate className="h-4 w-4" /> 插入模板
              </button>
              {showTemplates && (
                <div className="absolute right-0 top-full z-10 mt-1 w-72 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {geoTemplates.map(t => (
                    <button key={t.id} onClick={() => insertTemplate(t.id)}
                      className="flex w-full flex-col px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.name}</span>
                      <span className="text-xs text-gray-500">{t.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={doSave}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-700">
              <Save className="h-4 w-4" /> 保存
            </button>
            {currentArticle?.id && (
              <button onClick={() => navigate(`/audit/${currentArticle.id}`)}
                className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700">
                <Play className="h-4 w-4" /> 开始审计
              </button>
            )}
          </div>
        </div>

        {/* Editor + Preview */}
        <div className="flex min-h-0 flex-1 gap-2 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div className={viewMode === 'split' ? 'w-1/2' : 'flex-1'}>
              <CodeMirror
                value={content} onChange={handleContentChange}
                extensions={[markdown(), EditorView.lineWrapping]}
                theme="light" className="h-full text-base" style={{ height: '100%' }}
              />
            </div>
          )}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`${viewMode === 'split' ? 'w-1/2' : 'flex-1'} overflow-y-auto border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900`}>
              <MarkdownPreview content={content} />
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex gap-4"><span>字数: {wordCount}</span><span>阅读时长: ~{readingTime} 分钟</span></div>
          <span>Ctrl+S 保存 | 自动保存已开启</span>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-72 space-y-4 overflow-y-auto">
        {currentArticle && (
          <MetadataPanel article={currentArticle} onChange={handleMetaChange} onGenerateOg={handleGenerateOg} ogPreview={ogPreview} />
        )}
        <GeoCheckPanel checks={checks} />
      </div>
    </div>
  )
}