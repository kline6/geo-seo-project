import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import {
  ArrowLeft, TrendingUp, AlertCircle, CheckCircle, ChevronDown, ChevronUp,
  Lightbulb, FileText, Clock, BarChart3, RefreshCw,
} from 'lucide-react';
import AuditDiffCard from '../components/AuditDiffCard';
import { useAuditDiff } from '../hooks/useAuditDiff';
import { issueToKnowledge } from '../data/knowledge-links';
import type { Article, AuditResult, AuditIssue } from '../types';
import { useArticleStore } from '../stores/articleStore';
import { useAuditStore } from '../stores/auditStore';

const DIM_LABELS: Record<string, string> = {
  citation_density: '\u5f15\u7528\u5bc6\u5ea6',
  claim_clarity: '\u547d\u9898\u6e05\u6670\u5ea6',
  structure_parse: '\u7ed3\u6784\u53ef\u89e3\u6790\u6027',
  authority_signal: '\u6743\u5a01\u4fe1\u53f7',
  fact_verifiability: '\u4e8b\u5b9e\u53ef\u6838\u9a8c\u6027',
  platform_fit: '\u5e73\u53f0\u9002\u914d\u5ea6',
};

const DIM_COLORS: Record<string, string> = {
  citation_density: '#6366f1',
  claim_clarity: '#8b5cf6',
  structure_parse: '#a78bfa',
  authority_signal: '#c084fc',
  fact_verifiability: '#e879f9',
  platform_fit: '#f472b6',
};

const AuditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getArticle, articles } = useArticleStore();
  const { getAuditHistory, runAudit, isAuditing } = useAuditStore();

  const [article, setArticle] = useState<Article | null>(null);
  const [auditHistory, setAuditHistory] = useState<AuditResult[]>([]);
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const latestAudit = auditHistory.length > 0 ? auditHistory[0] : null;
  const previousAudit = auditHistory.length > 1 ? auditHistory[1] : null;

  const { diff } = useAuditDiff(latestAudit, previousAudit);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const art = await getArticle(id);
        setArticle(art);
        if (art) {
          const history = await getAuditHistory(id);
          setAuditHistory(history);
        }
      } catch (e) {
        setError('\u52a0\u8f7d\u5ba1\u6838\u6570\u636e\u5931\u8d25');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, articles]);

  const radarData = useMemo(() => {
    if (!latestAudit?.dimensions) return [];
    return Object.entries(latestAudit.dimensions).map(([key, value]) => ({
      dimension: DIM_LABELS[key] || key,
      score: value,
      fullMark: 100,
    }));
  }, [latestAudit]);

  const barData = useMemo(() => {
    if (!latestAudit?.dimensions) return [];
    return Object.entries(latestAudit.dimensions).map(([key, value]) => ({
      name: DIM_LABELS[key] || key,
      score: value,
      fill: DIM_COLORS[key] || '#6366f1',
    }));
  }, [latestAudit]);

  const toggleIssue = (idx: number) => {
    setExpandedIssues(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleReAudit = async () => {
    if (!id) return;
    try {
      await runAudit(id);
      const history = await getAuditHistory(id);
      setAuditHistory(history);
    } catch (e) {
      setError('\u91cd\u65b0\u5ba1\u6838\u5931\u8d25');
    }
  };

  const handleIssueClick = (issue: AuditIssue) => {
    const mapping = issueToKnowledge[issue.id];
    if (mapping) {
      navigate('/knowledge?category=' + mapping.category + '&q=' + encodeURIComponent(mapping.keywords[0]));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400 text-lg">\u52a0\u8f7d\u4e2d...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-gray-700 dark:text-gray-300 text-lg">{error || '\u6587\u7ae0\u672a\u627e\u5230'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          \u8fd4\u56de
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {article.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">GEO \u5ba1\u6838\u62a5\u544a</p>
          </div>
          <button
            onClick={handleReAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            {isAuditing ? '\u5ba1\u6838\u4e2d...' : '\u91cd\u65b0\u5ba1\u6838'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Score Card */}
        {latestAudit && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">\u603b\u4f53\u8bc4\u5206</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                {new Date(latestAudit.createdAt).toLocaleString('zh-CN')}
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div
                  className="text-5xl font-bold"
                  style={{
                    color:
                      latestAudit.score >= 80
                        ? '#22c55e'
                        : latestAudit.score >= 60
                        ? '#eab308'
                        : '#ef4444',
                  }}
                >
                  {latestAudit.score}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">GEO \u5206\u6570</div>
              </div>
              {diff && (
                <div className="flex items-center gap-2">
                  <TrendingUp
                    className="w-5 h-5"
                  />
                  <span
                    className="ext-lg font-medium"
                  >
                    {diff.scoreDelta >= 0 ? '+' : ''}
                    {diff.scoreDelta}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">\u8f83\u4e0a\u6b21</span>
                </div>
              )}
            </div>
            {latestAudit.summary && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {latestAudit.summary}
              </p>
            )}
          </div>
        )}

        {/* Radar + Bar Charts */}
        {latestAudit && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
                \u7ef4\u5ea6\u96f7\u8fbe\u56fe
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-600" />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="\u5f97\u5206"
                    dataKey="score"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                \u7ef4\u5ea6\u5f97\u5206
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={20}>
                    {barData.map((entry, index) => (
                      <rect key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {latestAudit?.suggestions && latestAudit.suggestions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              \u4f18\u5316\u5efa\u8bae
            </h3>
            <ul className="space-y-3">
              {latestAudit.suggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {suggestion}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Issues */}
        {latestAudit?.issues && latestAudit.issues.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              \u5ba1\u6838\u95ee\u9898
              <span className="ml-2 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
                {latestAudit.issues.length} \u9879
              </span>
            </h3>
            <div className="space-y-3">
              {latestAudit.issues.map((issue, idx) => {
                const isExpanded = expandedIssues.has(idx);
                const hasKnowledge = issueToKnowledge[issue.type] || issueToKnowledge[issue.code];
                return (
                  <div
                    key={idx}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleIssue(idx)}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                      />
                      <span
                        className="lex-1 text-sm font-medium"
                        onClick={e => {
                          if (hasKnowledge) {
                            e.stopPropagation();
                            handleIssueClick(issue);
                          }
                        }}
                      >
                        {issue.title}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {DIM_LABELS[issue.dimension] || issue.dimension}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
                          {issue.description}
                        </p>
                        {issue.suggestion && (
                          <div className="mt-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                            <div className="flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-1">
                              <Lightbulb className="w-4 h-4" />
                              \u5efa\u8bae
                            </div>
                            <p className="text-sm text-indigo-600 dark:text-indigo-400">
                              {issue.suggestion}
                            </p>
                          </div>
                        )}
                        {hasKnowledge && (
                          <button
                            onClick={() => handleIssueClick(issue)}
                            className="mt-3 flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            <FileText className="w-4 h-4" />
                            \u67e5\u770b\u76f8\u5173\u77e5\u8bc6
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Diff Comparison */}
        {diff && latestAudit && previousAudit && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-indigo-500" />
              \u5ba1\u6838\u5bf9\u6bd4
            </h3>
            <AuditDiffCard diff={diff} current={latestAudit} previous={previousAudit} />
          </div>
        )}

        {/* Audit History */}
        {auditHistory.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              \u5386\u53f2\u8bb0\u5f55
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 font-medium">\u65f6\u95f4</th>
                    <th className="pb-3 font-medium">\u5206\u6570</th>
                    {Object.keys(DIM_LABELS).map(dim => (
                      <th key={dim} className="pb-3 font-medium text-center whitespace-nowrap">
                        {DIM_LABELS[dim]}
                      </th>
                    ))}
                    <th className="pb-3 font-medium">\u95ee\u9898\u6570</th>
                  </tr>
                </thead>
                <tbody>
                  {auditHistory.map((audit, idx) => (
                    <tr
                      key={audit.id || idx}
                      className="border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                    >
                      <td className="py-3 text-gray-600 dark:text-gray-400">
                        {new Date(audit.createdAt).toLocaleString('zh-CN')}
                      </td>
                      <td className="py-3">
                        <span
                          className="font-semibold"
                          style={{
                            color:
                              audit.score >= 80
                                ? '#22c55e'
                                : audit.score >= 60
                                ? '#eab308'
                                : '#ef4444',
                          }}
                        >
                          {audit.score}
                        </span>
                      </td>
                      {Object.keys(DIM_LABELS).map(dim => (
                        <td key={dim} className="py-3 text-center text-gray-600 dark:text-gray-400">
                          {audit.dimensions?.[dim] ?? '-'}
                        </td>
                      ))}
                      <td className="py-3 text-gray-600 dark:text-gray-400">
                        {audit.issues?.length ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!latestAudit && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              \u6682\u65e0\u5ba1\u6838\u6570\u636e
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              \u70b9\u51fb\u4e0b\u65b9\u6309\u94ae\u5f00\u59cb GEO \u5ba1\u6838
            </p>
            <button
              onClick={handleReAudit}
              disabled={isAuditing}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isAuditing ? '\u5ba1\u6838\u4e2d...' : '\u5f00\u59cb\u5ba1\u6838'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditPage;