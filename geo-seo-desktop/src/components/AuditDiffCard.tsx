import { TrendingUp, TrendingDown, Minus, CheckCircle, AlertCircle } from 'lucide-react'

interface Props {
  deltaScore: number
  resolvedIssues: string[]
  newIssues: string[]
  beforeScore: number
  afterScore: number
  beforeDate: string
  afterDate: string
}

export default function AuditDiffCard({ deltaScore, resolvedIssues, newIssues, beforeScore, afterScore, beforeDate, afterDate }: Props) {
  const isPositive = deltaScore > 0

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">优化前后对比</h3>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-xs text-gray-500">优化前</p>
          <p className={`text-2xl font-bold ${beforeScore >= 80 ? 'text-green-600' : beforeScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{beforeScore}</p>
          <p className="text-xs text-gray-400">{beforeDate}</p>
        </div>

        <div className="flex flex-col items-center px-6">
          {isPositive ? (
            <TrendingUp className="h-8 w-8 text-green-500" />
          ) : deltaScore < 0 ? (
            <TrendingDown className="h-8 w-8 text-red-500" />
          ) : (
            <Minus className="h-8 w-8 text-gray-400" />
          )}
          <span className={`mt-1 text-lg font-bold ${isPositive ? 'text-green-600' : deltaScore < 0 ? 'text-red-600' : 'text-gray-500'}`}>
            {isPositive ? '+' : ''}{deltaScore} 分
          </span>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">优化后</p>
          <p className={`text-2xl font-bold ${afterScore >= 80 ? 'text-green-600' : afterScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{afterScore}</p>
          <p className="text-xs text-gray-400">{afterDate}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {resolvedIssues.length > 0 && (
          <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
            <div className="flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-400">
              <CheckCircle className="h-4 w-4" /> 已解决 ({resolvedIssues.length})
            </div>
            <ul className="mt-1 space-y-0.5">
              {resolvedIssues.map(id => <li key={id} className="text-xs text-green-600 dark:text-green-500">{id}</li>)}
            </ul>
          </div>
        )}
        {newIssues.length > 0 && (
          <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
            <div className="flex items-center gap-1.5 text-sm font-medium text-amber-700 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" /> 新增 ({newIssues.length})
            </div>
            <ul className="mt-1 space-y-0.5">
              {newIssues.map(id => <li key={id} className="text-xs text-amber-600 dark:text-amber-500">{id}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}