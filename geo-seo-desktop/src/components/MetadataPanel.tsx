import { useState } from 'react'
import type { Article } from '../types'
import { Eye, EyeOff, Star, StarOff, Image, Link } from 'lucide-react'

interface Props {
  article: Article
  onChange: (field: string, value: string | number) => void
  onGenerateOg?: () => void
  ogPreview?: string
}

export default function MetadataPanel({ article, onChange, onGenerateOg, ogPreview }: Props) {
  const [showOgPreview, setShowOgPreview] = useState(false)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">SEO 元数据</h3>

      {/* SEO Title */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">SEO Title</label>
        <input
          type="text" value={article.meta_title || ''}
          onChange={e => onChange('meta_title', e.target.value)}
          placeholder={article.title || '自动生成标题'}
          className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-400">{(article.meta_title || article.title || '').length}/60 字符</p>
      </div>

      {/* SEO Description */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">SEO Description</label>
        <textarea
          value={article.meta_desc || ''}
          onChange={e => onChange('meta_desc', e.target.value)}
          placeholder="自动生成摘要" rows={2}
          className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-400">{(article.meta_desc || '').length}/160 字符</p>
      </div>

      {/* Canonical URL */}
      <div>
        <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
          <Link className="h-3 w-3" /> Canonical URL
        </label>
        <input
          type="text" value={article.canonical_url || ''}
          onChange={e => onChange('canonical_url', e.target.value)}
          placeholder="https://example.com/article"
          className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:outline-none"
        />
      </div>

      {/* OG Image */}
      <div>
        <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
          <Image className="h-3 w-3" /> OG 图片
        </label>
        <div className="flex gap-2">
          <button
            onClick={onGenerateOg}
            className="flex-1 rounded border border-gray-300 px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            自动生成
          </button>
          {ogPreview && (
            <button
              onClick={() => setShowOgPreview(!showOgPreview)}
              className="rounded border border-gray-300 px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
            >
              {showOgPreview ? '隐藏' : '预览'}
            </button>
          )}
        </div>
        {showOgPreview && ogPreview && (
          <div className="mt-2 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
            <img src={ogPreview} alt="OG Preview" className="w-full" />
          </div>
        )}
      </div>

      {/* Featured + Draft toggles */}
      <div className="flex gap-3">
        <button
          onClick={() => onChange('featured', article.featured ? 0 : 1)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            article.featured
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          {article.featured ? <Star className="h-3.5 w-3.5" /> : <StarOff className="h-3.5 w-3.5" />}
          {article.featured ? '已置顶' : '置顶'}
        </button>
        <button
          onClick={() => onChange('draft', article.draft ? 0 : 1)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            article.draft
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          {article.draft ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {article.draft ? '草稿' : '正式'}
        </button>
      </div>

      {/* Status */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">状态</label>
        <select
          value={article.status}
          onChange={e => onChange('status', e.target.value)}
          className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:outline-none"
        >
          <option value="draft">草稿</option>
          <option value="review">审核中</option>
          <option value="published">已发布</option>
        </select>
      </div>

      {/* Author */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">作者</label>
        <input
          type="text" value={article.author}
          onChange={e => onChange('author', e.target.value)}
          className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:outline-none"
        />
      </div>

      {/* Geo Weight */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">GEO 优先级</label>
        <select
          value={article.geo_weight || 2}
          onChange={e => onChange('geo_weight', Number(e.target.value))}
          className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:outline-none"
        >
          <option value={1}>低</option>
          <option value={2}>中</option>
          <option value={3}>高（优先审计）</option>
        </select>
      </div>
    </div>
  )
}