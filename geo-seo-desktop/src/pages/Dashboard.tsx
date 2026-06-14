import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FileText, TrendingUp, AlertTriangle, Clock, Plus, ArrowRight } from 'lucide-react'
import type { TrendPoint } from '../types'

interface Stats {
  totalArticles: number; avgScore: number; needsOptimization: number; recentAudits: number
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats>({ totalArticles: 0, avgScore: 0, needsOptimization: 0, recentAudits: 0 })
  const [recentArticles, setRecentArticles] = useState<any[]>([])
  const [lowScoreArticles, setLowScoreArticles] = useState<any[]>([])
  const [trendData, setTrendData] = useState<TrendPoint[]>([])

  useEffect(() => { loadDashboard() }, [])

  const loadDashboard = async () => {
    const artRes = (await window.electronAPI.invoke('article.list', { limit: 50, sort: 'date' })) as any
    if (!artRes.success) return
    const articles = artRes.data
    setRecentArticles(articles.slice(0, 5))
    const scored = articles.filter((a: any) => a.current_score != null)
    const avgScore = scored.length > 0 ? Math.round(scored.reduce((s: number, a: any) => s + a.current_score, 0) / scored.length) : 0
    const needsOpt = articles.filter((a: any) => a.current_score != null && a.current_score < 70)
    setLowScoreArticles(needsOpt.slice(0, 5))
    const auditRes = (await window.electronAPI.invoke('audit.list', { limit: 100 })) as any

    // Load trend data
    const trendRes = (await window.electronAPI.invoke('audit.trend', { days: 30 })) as any
    if (trendRes.success) setTrendData(trendRes.data.map((d: any) => ({ ...d, avg_score: Math.round(d.avg_score) })))

    setStats({
      totalArticles: artRes.total, avgScore,
      needsOptimization: needsOpt.length,
      recentAudits: auditRes.success ? auditRes.total : 0,
    })
  }

  const statCards = [
    { label: '文章总数', value: stats.totalArticles, icon: FileText, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' },
    { label: '平均 GEO 分', value: stats.avgScore || '-', icon: TrendingUp, color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
    { label: '待优化', value: stats.needsOptimization, icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
    { label: '审计次数', value: stats.recentAudits, icon: Clock, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">工作台</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">GEO-SEO 内容优化概览</p>
        </div>
        <button onClick={() => navigate('/editor')}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> 新建文章
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
              <div className={`rounded-lg p-2 ${card.color}`}><card.icon className="h-5 w-5" /></div>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Trend Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">GEO 评分趋势（近 30 天）</h2>
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Line type="monotone" dataKey="avg_score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} name="平均分" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-sm text-gray-400">
            暂无趋势数据，完成首次审计后将在此显示
          </div>
        )}
      </div>

      {/* Recent articles */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">最近文章</h2>
          <button onClick={() => navigate('/editor')} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            查看全部 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        {recentArticles.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">还没有文章，点击上方按钮创建第一篇</p>
        ) : (
          <div className="space-y-2">
            {recentArticles.map((article) => (
              <div key={article.id} onClick={() => navigate(`/editor/${article.id}`)}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{article.title || '未命名文章'}</p>
                  <p className="text-xs text-gray-500">{article.updated_at}</p>
                </div>
                <div className="flex items-center gap-3">
                  {article.current_score != null && (
                    <span className={`text-sm font-bold ${article.current_score >= 80 ? 'text-green-600' : article.current_score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {article.current_score}
                    </span>
                  )}
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    article.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    article.status === 'review' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {article.status === 'published' ? '已发布' : article.status === 'review' ? '审核中' : '草稿'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Low score articles */}
      {lowScoreArticles.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
          <h2 className="mb-4 text-lg font-semibold text-amber-800 dark:text-amber-300">待优化文章</h2>
          <div className="space-y-2">
            {lowScoreArticles.map((article) => (
              <div key={article.id} onClick={() => navigate(`/audit/${article.id}`)}
                className="flex cursor-pointer items-center justify-between rounded-lg bg-white px-3 py-2.5 hover:shadow-sm dark:bg-gray-800">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{article.title}</span>
                <span className="text-sm font-bold text-red-600">{article.current_score} 分</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}