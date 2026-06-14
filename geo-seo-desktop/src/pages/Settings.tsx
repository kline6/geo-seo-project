import { useEffect, useState } from 'react'
import { useSettingsStore } from '../stores/settingsStore'
import { Save, Download, Upload, CheckCircle } from 'lucide-react'

export default function Settings() {
  const { settings, saveSettings, loadSettings } = useSettingsStore()
  const [form, setForm] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [importMsg, setImportMsg] = useState('')

  useEffect(() => { loadSettings() }, [])
  useEffect(() => { setForm(settings as Record<string, string>) }, [settings])

  const handleSave = async () => {
    await saveSettings(form as any)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExport = async () => {
    const res = (await window.electronAPI.invoke('settings.exportData')) as any
    if (res.success) alert(`数据已导出到: ${res.data.file_path}`)
    else alert(`导出失败: ${res.error?.message}`)
  }

  const handleImport = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const text = await file.text()
      const res = (await window.electronAPI.invoke('settings.importData', text)) as any
      if (res.success) { setImportMsg('导入成功！'); loadSettings() }
      else setImportMsg(`导入失败: ${res.error?.message}`)
      setTimeout(() => setImportMsg(''), 3000)
    }
    input.click()
  }

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">设置</h1>
        <button onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          {saved ? <><CheckCircle className="h-4 w-4" /> 已保存</> : <><Save className="h-4 w-4" /> 保存设置</>}
        </button>
      </div>

      {/* Basic settings */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">基础设置</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">默认作者</label>
            <input type="text" value={form.default_author || ''} onChange={e => update('default_author', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">默认语言</label>
            <select value={form.default_language || 'zh-CN'} onChange={e => update('default_language', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
              <option value="zh-CN">中文</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">Python 路径</label>
            <input type="text" value={form.python_path || ''} onChange={e => update('python_path', e.target.value)}
              placeholder="python" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
        </div>
      </section>

      {/* AI API Keys */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">AI 引擎配置</h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">配置 API Key 以启用多引擎查询验证（可选，不配置时仅使用本地规则审计）</p>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">OpenAI API Key（ChatGPT 查询）</label>
            <input type="password" value={form.openai_api_key || ''} onChange={e => update('openai_api_key', e.target.value)}
              placeholder="sk-..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">Gemini API Key（Google AI 查询）</label>
            <input type="password" value={form.gemini_api_key || ''} onChange={e => update('gemini_api_key', e.target.value)}
              placeholder="AIza..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">Perplexity API Key</label>
            <input type="password" value={form.perplexity_api_key || ''} onChange={e => update('perplexity_api_key', e.target.value)}
              placeholder="pplx-..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
        </div>
      </section>

      {/* Data management */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">数据管理</h2>
        <div className="flex gap-4">
          <button onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            <Download className="h-4 w-4" /> 导出全部数据
          </button>
          <button onClick={handleImport}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            <Upload className="h-4 w-4" /> 导入数据
          </button>
        </div>
        {importMsg && <p className="mt-3 text-sm text-green-600 dark:text-green-400">{importMsg}</p>}
      </section>
    </div>
  )
}