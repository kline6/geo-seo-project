import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import type { GeoCheckItem } from '../types'

interface Props {
  checks: GeoCheckItem[]
}

export default function GeoCheckPanel({ checks }: Props) {
  if (checks.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-400">开始编辑后将自动检测 GEO 结构</p>
      </div>
    )
  }

  const passCount = checks.filter(c => c.status === 'pass').length
  const failCount = checks.filter(c => c.status === 'fail').length

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">GEO 实时检查</h3>
        <span className="text-xs text-gray-500">{passCount}/{checks.length} 通过</span>
      </div>
      <div className="space-y-2">
        {checks.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            {item.status === 'pass' && <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />}
            {item.status === 'fail' && <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />}
            {item.status === 'warn' && <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />}
            <div>
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
              <p className="text-xs text-gray-500">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
      {failCount > 0 && (
        <p className="mt-3 rounded bg-red-50 px-2 py-1 text-xs text-red-600">
          {failCount} 项未通过，建议修复后再审计
        </p>
      )}
    </div>
  )
}