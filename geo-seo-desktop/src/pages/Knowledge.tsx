import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, BookOpen, ChevronRight } from 'lucide-react';

interface KnowledgeItem {
  id: string;
  title: string;
  summary: string;
  body: string;
}

interface KnowledgeCategory {
  key: string;
  label: string;
  icon: string;
  items: KnowledgeItem[];
}

const KNOWLEDGE_BASE: KnowledgeCategory[] = [
  {
    key: 'geo_basics',
    label: 'GEO基础',
    icon: '📖',
    items: [
      {
        id: 'what-is-geo',
        title: '什么是 GEO (生成引擎优化)?',
        summary: '了解 GEO 的核心概念及其与传统 SEO 的区别。',
        body: `GEO（Generative Engine Optimization，生成引擎优化）是一种针对 AI 驱动的搜索引擎和生成式 AI 工具的内容优化策略。

与传统 SEO 关注关键词排名和链接权重不同，GEO 的核心目标是让您的内容更容易被 AI 模型理解、引用和推荐。

GEO 的关键原则：
• 清晰的命题结构：每段内容应有明确的论点和支持论据
• 可核验的事实陈述：数据和引用必须准确可追溯
• 结构化的内容组织：使用标题、列表和分段提高可解析性
• 权威信号建设：通过引用权威来源增强内容可信度

AI 引擎如何评估内容：
1. 命题清晰度 — 观点是否明确、逻辑是否连贯
2. 引用密度 — 是否引用了可信来源
3. 事实可核验性 — 陈述是否有据可查
4. 结构可解析性 — 内容层次是否清晰
5. 权威信号 — 作者和来源的可信度
6. 平台适配度 — 内容是否针对目标平台优化`,
      },
      {
        id: 'geo-vs-seo',
        title: 'GEO 与传统 SEO 的区别',
        summary: '深入对比 GEO 和 SEO 的策略差异及适用场景。',
        body: `GEO 并非替代 SEO，而是在 AI 时代的内容优化新维度。

核心差异对比：

传统 SEO 关注点：
• 关键词密度和分布
• 反向链接数量和质量
• 页面加载速度和用户体验
• 搜索引擎爬虫可访问性

GEO 关注点：
• 内容的语义清晰度和逻辑结构
• 事实的可验证性和来源权威性
• AI 模型的理解友好度
• 被引用和推荐的可能性

协同策略：
最佳实践是将 GEO 与 SEO 结合。SEO 确保内容能被传统搜索引擎发现，而 GEO 确保内容在 AI 驱动的搜索场景中也能脱颖而出。

关键指标变化：
• SEO：关注排名、点击率、流量
• GEO：关注引用率、AI 推荐频率、知识图谱收录`,
      },
      {
        id: 'ai-search-engines',
        title: '主流 AI 搜索引擎概览',
        summary: '了解 ChatGPT、Perplexity、Bing Chat 等平台的工作方式。',
        body: `当前主流的 AI 搜索引擎和生成式搜索工具：

1. ChatGPT (OpenAI)
   - 使用 GPT-4 系列模型
   - 通过 Bing 搜索获取实时信息
   - 重视来源的权威性和引用准确性

2. Perplexity AI
   - 以引用为核心的 AI 搜索引擎
   - 实时抓取并展示来源链接
   - 特别重视内容的结构化和可引用性

3. Google SGE / AI Overview
   - Google 的 AI 搜索体验
   - 整合传统搜索结果与 AI 生成摘要
   - 优先展示经过 Schema 标记的结构化内容

4. Bing Chat (Microsoft Copilot)
   - 基于 GPT-4 的搜索增强对话
   - 深度整合 Bing 搜索索引
   - 重视内容的新鲜度和权威性

各平台优化差异：
- ChatGPT：注重深度和完整性
- Perplexity：注重引用密度和事实准确性
- Google SGE：注重结构化数据和 Schema 标记
- Bing Chat：注重内容新鲜度和多媒体整合`,
      },
    ],
  },
  {
    key: 'platform_strategy',
    label: '平台策略',
    icon: '🎯',
    items: [
      {
        id: 'perplexity-optimization',
        title: 'Perplexity AI 优化策略',
        summary: '针对 Perplexity 平台的内容优化技巧。',
        body: `Perplexity AI 是以引用为核心的搜索引擎，优化策略包括：

内容结构优化：
• 使用清晰的 H2/H3 标题层次
• 每段开头包含核心观点
• 使用编号列表呈现步骤和要点
• 段落控制在 3-5 句以内

引用策略：
• 在正文中引用具体数据和研究
• 提供可追溯的来源链接
• 使用"根据 XX 研究/报告"等引用句式
• 确保引用来源的权威性和时效性

技术优化：
• 确保页面可被 Perplexity 爬虫访问
• 使用 robots.txt 允许相关爬虫
• 优化页面加载速度
• 实施 Schema.org 结构化数据标记`,
      },
      {
        id: 'chatgpt-citation',
        title: '被 ChatGPT 引用的优化方法',
        summary: '如何提高内容被 ChatGPT 引用和推荐的概率。',
        body: `ChatGPT 的引用偏好和优化方法：

内容特征：
• 完整的知识覆盖：内容应全面覆盖主题
• 清晰的定义和解释：概念需要简明扼要
• 结构化数据：使用表格、列表等结构化格式
• 最新信息：定期更新内容保持时效性

权威性建设：
• 作者专业背景展示
• 引用学术研究和行业报告
• 获得行业权威网站的引用
• 保持一致的高质量内容输出

技术要求：
• 内容可被 Bing 爬虫索引
• 实施 Schema 标记（Article、FAQ、HowTo）
• 移动端适配良好
• 页面加载速度优化`,
      },
      {
        id: 'google-sge',
        title: 'Google SGE / AI Overview 适配',
        summary: '适配 Google AI 搜索体验的关键策略。',
        body: `Google SGE（Search Generative Experience）/ AI Overview 优化：

结构化数据优先：
• 实施 Schema.org 标记（Article、FAQPage、HowTo、BreadcrumbList）
• 使用 JSON-LD 格式，确保数据准确
• 标记作者信息和组织信息

内容质量信号：
• E-E-A-T（经验、专业性、权威性、可信度）
• 展示作者专业背景和经验
• 引用权威来源和第一手资料
• 内容原创性和深度

技术优化：
• Core Web Vitals 达标
• 移动端优先设计
• HTTPS 安全连接
• 清晰的网站结构和内部链接

FAQ 和问答优化：
• 直接回答用户常见问题
• 使用问答格式组织内容
• 简洁明确的回答（40-60 字摘要）
• 后续提供详细解释`,
      },
    ],
  },
  {
    key: 'tips',
    label: '增强技巧',
    icon: '💡',
    items: [
      {
        id: 'citation-techniques',
        title: '引用密度提升技巧',
        summary: '如何合理增加引用密度来提升内容可信度。',
        body: `引用密度是 GEO 评分的重要维度之一。以下是提升技巧：

引用来源选择：
• 学术论文和研究报告（优先级最高）
• 行业权威机构发布的报告
• 知名媒体和新闻机构的报道
• 官方统计数据和政府报告
• 行业专家的公开演讲和访谈

引用方式：
1. 直接引用：使用引号并标注来源
   示例："根据 Gartner 2024 年报告，AI 搜索将占 30% 的搜索份额"
2. 数据引用：提供具体数字和年份
   示例：McKinsey 研究显示，采用 AI 优化的企业效率提升 40%（2024）
3. 交叉引用：在不同段落引用多个来源
4. 更新引用：确保引用内容在 2 年以内

避免过度引用：
• 自然段落每 2-3 段引用一次
• 引用应服务于论证，而非堆砌
• 确保引用来源的多样性`,
      },
      {
        id: 'structure-optimization',
        title: '内容结构可解析性优化',
        summary: '通过优化内容结构提高 AI 理解能力。',
        body: `AI 模型对内容结构的解析直接影响内容被理解和引用的效果：

标题层次：
• H1：页面唯一主标题
• H2：主要章节（3-5 个）
• H3：子章节和具体主题
• 避免跳级使用标题

段落结构：
• 首句点明主题（主题句）
• 2-4 句展开论述
• 结尾句总结或过渡
• 每段聚焦一个观点

列表和表格：
• 步骤用有序列表
• 并列要点用无序列表
• 对比数据用表格呈现
• 确保列表项平行结构

知识框和摘要：
• 在文章开头添加要点摘要
• 关键定义使用引用框
• 重要结论用粗体标记
• 使用"关键要点"小结

Markdown 和 HTML 结构：
• 使用语义化 HTML 标签
• 正确使用 <article>、<section>、<aside>
• 确保列表、表格标签正确嵌套`,
      },
      {
        id: 'authority-building',
        title: '权威信号建设指南',
        summary: '如何建立和强化内容的权威性信号。',
        body: `权威信号是 AI 模型评估内容可信度的重要依据：

作者权威性：
• 展示作者专业背景和资质
• 链接到作者的 LinkedIn、学术主页
• 展示作者的出版物和引用记录
• 保持作者信息的一致性

来源权威性：
• 引用原始研究而非二次报道
• 优先引用同行评议的学术论文
• 引用行业领先机构的报告
• 标注引用来源的完整信息

网站权威性：
• 获取行业权威网站的反向链接
• 保持域名的一致性和专业性
• 实施 HTTPS 安全协议
• 维护良好的技术 SEO 基础

内容权威性：
• 提供原创研究和数据分析
• 展示行业经验和案例研究
• 定期更新内容保持时效性
• 获得行业认可和奖项

信任信号：
• 明确的隐私政策和使用条款
• 联系方式和公司信息
• 用户评价和推荐
• 安全认证标志`,
      },
    ],
  },
  {
    key: 'checklist',
    label: '检查清单',
    icon: '✅',
    items: [
      {
        id: 'audit-checklist',
        title: 'GEO 审核清单',
        summary: '发布内容前的 GEO 优化完整检查清单。',
        body: `发布内容前请逐项检查：

【命题清晰度】
□ 每段开头有明确的主题句
□ 核心观点在前 100 字内表达
□ 论点之间逻辑连贯
□ 避免模糊表述和歧义

【引用密度】
□ 至少引用 3 个权威来源
□ 引用来源在 2 年以内
□ 包含具体数据和统计
□ 引用格式统一规范

【结构可解析性】
□ 使用正确的标题层次 (H1→H2→H3)
□ 包含目录或导航
□ 关键信息使用列表呈现
□ 段落长度控制在 3-5 句

【权威信号】
□ 展示作者专业背景
□ 引用原始研究和报告
□ 包含组织或机构认证信息
□ 链接到权威外部来源

【事实可核验性】
□ 数据标注来源和日期
□ 避免未经证实的声明
□ 提供原始数据链接
□ 关键事实交叉验证

【平台适配度】
□ 实施 Schema.org 标记
□ 移动端显示正常
□ 页面加载速度 < 3 秒
□ 包含 FAQ 或问答结构`,
      },
      {
        id: 'content-creation-checklist',
        title: '内容创作流程清单',
        summary: '从选题到发布的完整 GEO 内容创作流程。',
        body: `GEO 内容创作的标准流程：

第一步：选题调研
□ 分析目标关键词的 AI 搜索场景
□ 研究竞品内容的 GEO 表现
□ 确定内容角度和差异化策略
□ 收集权威参考资料

第二步：内容规划
□ 制定内容大纲和标题层次
□ 确定引用来源清单
□ 规划结构化数据（表格、列表）
□ 设定目标 GEO 评分

第三步：内容撰写
□ 撰写清晰的命题和主题句
□ 自然融入引用和数据
□ 使用结构化格式组织内容
□ 添加知识框和摘要

第四步：GEO 审核
□ 运行 GEO 审核工具
□ 检查各维度得分
□ 修复低分项
□ 优化引用密度和结构

第五步：发布优化
□ 实施 Schema 标记
□ 验证页面可访问性
□ 提交索引请求
□ 监控 AI 搜索引用情况`,
      },
    ],
  },
  {
    key: 'templates',
    label: '案例模板',
    icon: '📋',
    items: [
      {
        id: 'blog-template',
        title: 'GEO 优化博客文章模板',
        summary: '适用于技术博客和知识分享文章的模板。',
        body: `以下是 GEO 优化的博客文章模板结构：

---
标题：[关键词] 完整指南：[年份] 最新策略

摘要（80-120 字）：
简明概括文章核心内容和读者收获。

正文结构：

## 什么是 [关键词]？
[清晰定义，2-3 句]

### 核心概念
[列表形式呈现 3-5 个关键概念]

## 为什么 [关键词] 很重要？
[数据支撑的背景说明，引用 1-2 个来源]

## [关键词] 最佳实践
### 实践 1：[标题]
[具体方法 + 数据 + 引用]

### 实践 2：[标题]
[具体方法 + 数据 + 引用]

## 常见问题 (FAQ)
### Q1: [问题]?
[简洁回答，40-60 字]

### Q2: [问题]?
[简洁回答，40-60 字]

## 总结
[3-5 个要点总结]

参考来源：
[列出所有引用来源]
---

使用此模板时注意：
• 根据实际内容调整章节
• 确保每个实践都有数据支撑
• FAQ 应覆盖用户最常搜索的问题`,
      },
      {
        id: 'product-comparison-template',
        title: '产品对比评测模板',
        summary: '适用于产品评测和对比分析的内容模板。',
        body: `产品对比评测的 GEO 优化模板：

---
标题：[产品A] vs [产品B]：[年份] 深度对比评测

快速结论（知识框）：
🏆 最佳选择：[产品X] — 适合 [场景]
💰 性价比之选：[产品Y] — 适合 [场景]

## 评测维度概览
| 维度 | 产品A | 产品B |
|------|-------|-------|
| 功能 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 价格 | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 易用性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

## 详细对比

### 功能对比
[逐项对比，引用官方数据]

### 价格对比
[价格表 + 性价比分析]

### 用户体验
[引用真实用户评价和评分]

## 谁适合选择 [产品A]？
[3-4 个适用场景]

## 谁适合选择 [产品B]？
[3-4 个适用场景]

## FAQ
### [产品A] 和 [产品B] 哪个更适合小企业？
[简洁回答]

### 切换成本是多少？
[简洁回答]

## 我们的建议
[综合建议 + 数据支撑]
---

模板使用注意：
• 对比数据必须准确可追溯
• 评分需说明评测标准
• 引用第三方评测机构数据
• 定期更新保持时效性`,
      },
      {
        id: 'how-to-template',
        title: '操作指南 (HowTo) 模板',
        summary: '适用于教程和操作指南类内容的模板。',
        body: `HowTo 操作指南的 GEO 优化模板：

---
标题：如何 [目标动作]：[数字] 步完整指南

预计时间：[X] 分钟
难度：[初级/中级/高级]
适用人群：[目标用户]

## 你需要准备什么？
□ [前提条件 1]
□ [前提条件 2]
□ [前提条件 3]

## 步骤详解

### 步骤 1：[动作]
具体操作说明。

💡 提示：[实用建议]

⚠️ 注意：[常见错误]

### 步骤 2：[动作]
具体操作说明。

[重复以上格式]

## 常见问题排查

### 问题：[常见问题描述]
解决方案：[具体解决步骤]

### 问题：[常见问题描述]
解决方案：[具体解决步骤]

## 进阶技巧
1. [进阶技巧 1]
2. [进阶技巧 2]
3. [进阶技巧 3]

## 总结
[回顾关键步骤和注意事项]

参考资源：
[相关链接和参考资料]
---

模板使用注意：
• 步骤必须按实际操作顺序排列
• 每个步骤包含具体的操作动作
• 添加提示和注意事项提高完成率
• 包含常见问题排查部分`,
      },
    ],
  },
];

const Knowledge: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'geo_basics');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    if (category) setActiveCategory(category);
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return KNOWLEDGE_BASE;
    const q = searchQuery.toLowerCase();
    return KNOWLEDGE_BASE.map(cat => ({
      ...cat,
      items: cat.items.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.body.toLowerCase().includes(q)
      ),
    })).filter(cat => cat.items.length > 0);
  }, [searchQuery]);

  const activeItems = useMemo(() => {
    if (searchQuery.trim()) {
      return filteredCategories.flatMap(cat => cat.items);
    }
    const cat = KNOWLEDGE_BASE.find(c => c.key === activeCategory);
    return cat?.items || [];
  }, [activeCategory, searchQuery, filteredCategories]);

  const toggleItem = (id: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('q');
      return next;
    });
    setSearchQuery('');
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    setSearchQuery('');
    setExpandedItems(new Set());
    setSearchParams({ category: key });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({ category: activeCategory });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              GEO 知识库
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            掌握生成引擎优化（GEO）的核心概念和实用技巧，提升内容在 AI 搜索引擎中的表现。
          </p>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="搜索知识库..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        {!searchQuery.trim() && (
          <aside className="w-56 flex-shrink-0 hidden lg:block">
            <nav className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sticky top-6">
              <ul className="space-y-1">
                {KNOWLEDGE_BASE.map(cat => (
                  <li key={cat.key}>
                    <button
                      onClick={() => handleCategoryChange(cat.key)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeCategory === cat.key
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="flex-1 text-left">{cat.label}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {cat.items.length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {searchQuery.trim() && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                搜索 "<span className="font-medium text-gray-900 dark:text-gray-100">{searchQuery}</span>"
                共找到 <span className="font-medium text-indigo-600 dark:text-indigo-400">{activeItems.length}</span> 条结果
              </p>
            </div>
          )}

          <div className="space-y-3">
            {activeItems.map(item => {
              const isExpanded = expandedItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700">
                      <div className="mt-4 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {item.body}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {activeItems.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  未找到相关内容
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  尝试使用其他关键词搜索，或浏览左侧分类
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Knowledge;