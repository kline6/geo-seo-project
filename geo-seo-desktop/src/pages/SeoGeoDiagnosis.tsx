import React, { useEffect, useMemo, useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
} from 'recharts';
import { Globe, Search, ListChecks, RefreshCw, Sparkles, BookOpen } from 'lucide-react';
import type { SeoGeoDiagnosisResult } from '../types';

const SAMPLE_URL = 'https://example.com';

const sampleResult: SeoGeoDiagnosisResult = {
  url: SAMPLE_URL,
  fetched_at: new Date().toISOString(),
  seo: {
    health_score: 74,
    issues: [
      { severity: 'high', title: '缺少 description', detail: '页面未设置有效 meta description，影响点击率和摘要生成。' },
      { severity: 'medium', title: '标题偏长', detail: 'title 超过 60 字符，搜索结果容易被截断。' },
      { severity: 'low', title: '缺少 canonical', detail: '未声明 canonical URL，可能造成重复收录风险。' },
    ],
    key_findings: [
      '页面可访问，返回 200',
      '存在 H1，但 H2 结构偏少',
      '图片缺少 alt 文本',
      '正文内容量偏低，影响主题覆盖',
    ],
    impact_points: [
      '标题与描述决定搜索点击率',
      '结构化层次影响摘要抽取',
      '可访问与索引设置影响曝光基础',
      '外链与引用信号影响排名可信度',
    ],
    recommendations: [
      '补齐 description，控制在 120-160 字',
      '增加 2-4 个 H2 小节，强化主题结构',
      '为关键图片补充简洁 alt',
      '补充数据引用和权威来源链接',
    ],
    metrics: {
      title_length: 68,
      description_length: 0,
      h1_count: 1,
      h2_count: 2,
      image_missing_alt: 4,
      internal_links: 3,
      external_links: 1,
    },
  },
  geo: {
    readiness_score: 66,
    citability_score: 61,
    structure_score: 70,
    authority_score: 58,
    checklist: [
      { id: 'geo_define', status: 'warn', title: '定义段不足', action: '在前 200 字内给出一句话定义，帮助 AI 直接引用。' },
      { id: 'geo_faq', status: 'fail', title: '缺少 FAQ', action: '补充 3-5 个常见问题，提高问答召回概率。' },
      { id: 'geo_table', status: 'warn', title: '缺少数据表', action: '把关键对比信息改成表格，提高结构化可抽取性。' },
      { id: 'geo_cite', status: 'fail', title: '引用密度偏低', action: '补充权威来源、年份、数据点，提升可信引用率。' },
      { id: 'geo_summary', status: 'pass', title: '有总结段', action: '保留结论段，便于 AI 提炼最终建议。' },
    ],
    rewrite_suggestions: [
      '把“我们认为”改成“根据 [来源] 研究，该方案可提升...”',
      '把长段拆分为“结论 -> 数据 -> 方法 -> 结果”结构',
      '每小节开头先写一句结论，再展开解释',
      '为关键术语添加简短定义，方便 AI 生成摘要',
    ],
    visibility_notes: [
      'AI 搜索更容易引用“有来源、有数字、有结论”的内容',
      'FAQ 和表格能显著提高问答场景中的抽取率',
      '清晰标题层次可提升主题切分和段落引用精度',
      '作者/机构/时间信息越明确，权威信号越强',
    ],
  },
  source_attribution: {
    provider: 'local-heuristic + open-source visibility pattern',
    source_url: 'https://github.com/generative-intelligence-lab/GEO-Index',
    model_hint: '用于 AI 可见性评分参考模式',
  },
};

function scoreColor(value: number) {
  if (value >= 80) return '#22c55e';
  if (value >= 60) return '#f59e0b';
  return '#ef4444';
}

function ScoreCircle({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full border-[6px]"
        style={{ borderColor: scoreColor(value) }}
      >
        <span className="text-xl font-bold" style={{ color: scoreColor(value) }}>{value}</span>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

function severityBadge(severity: 'high' | 'medium' | 'low') {
  if (severity === 'high') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  if (severity === 'medium') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
  return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
}

export default function SeoGeoDiagnosis() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeoGeoDiagnosisResult | null>(null);

  useEffect(() => {
    if (!result) setResult(sampleResult);
  }, []);

  const handleDiagnose = async () => {
    const target = url.trim() || SAMPLE_URL;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      setResult({
        ...sampleResult,
        url: target,
        fetched_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const radarData = useMemo(() => {
    if (!result) return [];
    return [
      { dimension: 'AI引用能力', score: result.geo.citability_score },
      { dimension: '结构化能力', score: result.geo.structure_score },
      { dimension: '权威信号', score: result.geo.authority_score },
      { dimension: 'SEO健康度', score: result.seo.health_score },
    ];
  }, [result]);

  const issuePie = useMemo(() => {
    if (!result) return [];
    const counts = { high: 0, medium: 0, low: 0 } as Record<string, number>;
    result.seo.issues.forEach(i => counts[i.severity]++);
    return [
      { name: '高风险', value: counts.high, fill: '#ef4444' },
      { name: '中风险', value: counts.medium, fill: '#f59e0b' },
      { name: '低风险', value: counts.low, fill: '#94a3b8' },
    ].filter(d => d.value > 0);
  }, [result]);

  if (!result) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">SEO 诊断与 GEO 优化</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">输入网址，分析传统 SEO 表现，并给出 AI 搜索曝光优化建议。</p>
        </div>
        <button
          onClick={handleDiagnose}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? '诊断中...' : '开始诊断'}
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-indigo-500" />
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="输入要诊断的网址，例如 https://example.com"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
          <button
            onClick={handleDiagnose}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
          >
            <Search className="h-4 w-4" />
            诊断
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400">当前示例结果用于演示结构，后续可接真实抓取和评分接口。</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                <Search className="h-5 w-5 text-indigo-500" />
                页面 SEO 健康诊断
              </div>
              <span className="text-xs text-gray-400">URL: {result.url}</span>
            </div>

            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-5">
              <ScoreCircle value={result.seo.health_score} label="SEO 健康度" />
              <ScoreCircle value={result.geo.readiness_score} label="GEO 综合准备度" />
              <ScoreCircle value={result.geo.citability_score} label="AI引用能力" />
              <ScoreCircle value={result.geo.structure_score} label="结构化能力" />
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">关键问题分布</p>
                <div className="mt-3 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={issuePie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {issuePie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">综合可见性雷达</p>
                <div className="mt-3 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
                      <PolarGrid />
                      <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name="得分" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
              <ListChecks className="h-5 w-5 text-indigo-500" />
              曝光影响点与建议
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-500">关键问题</p>
                <ul className="mt-2 space-y-2">
                  {result.seo.issues.map((item, idx) => (
                    <li key={idx} className="rounded-lg border border-gray-100 p-3 text-sm dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800 dark:text-gray-100">{item.title}</span>
                        <span className={`rounded px-2 py-0.5 text-xs ${severityBadge(item.severity)}`}>{item.severity}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">执行建议</p>
                <ul className="mt-2 space-y-2">
                  {result.seo.recommendations.map((rec, idx) => (
                    <li key={idx} className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              GEO 优化指导区
            </div>
            <p className="mt-2 text-xs text-gray-500">目标：让内容更容易被 AI 搜索引擎引用、总结和推荐。</p>
            <div className="mt-4 space-y-3">
              {result.geo.checklist.map(row => (
                <div key={row.id} className="rounded-lg border border-gray-100 p-3 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{row.title}</span>
                    <span className={`rounded px-2 py-0.5 text-xs ${row.status === 'pass' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : row.status === 'warn' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {row.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{row.action}</p>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <p className="text-xs font-medium text-gray-500">可执行改写建议</p>
              <ul className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {result.geo.rewrite_suggestions.map((s, idx) => (
                  <li key={idx} className="rounded-lg bg-indigo-50 p-3 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300">{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              AI 可见性参考能力
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              已集成一个可落地的开源思路：<b>AI 可见性评分 + 结构化抽取检查 + 引用改写建议</b>，帮助页面从“可读”升级到“可被 AI 引用”。
            </p>
            <div className="mt-3 rounded-lg bg-gray-50 p-4 text-xs text-gray-600 dark:bg-gray-900/40 dark:text-gray-300">
              <p><b>能力来源参考</b></p>
              <p className="mt-1">{result.source_attribution?.provider}</p>
              <p className="mt-1">参考链接：{result.source_attribution?.source_url}</p>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {result.geo.visibility_notes.map((n, idx) => (
                <li key={idx} className="rounded-lg border border-gray-100 p-3 dark:border-gray-700">{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}