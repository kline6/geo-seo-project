INSERT INTO keywords (keyword, volume, visibility, position, prev_position, status) VALUES
('内容营销策略', 25000, 65, 3, 5, 'active'),
('搜索引擎排名优化', 18000, 60, 5, 7, 'active'),
('AI搜索引擎优化', 12000, 72, 2, 4, 'active'),
('GEO优化工具', 9500, 48, 8, 6, 'monitoring'),
('AI可见度分析', 7200, 70, 4, 8, 'active');

INSERT INTO articles (title, content, platform, status, publish_date, views) VALUES
('GEO优化入门指南', 'AI搜索引擎优化的基础知识...', '微信公众号', 'published', '2024-12-01', 1250),
('AI搜索引擎排名策略', '深度解析AI搜索排名因素...', '知乎专栏', 'published', '2024-12-03', 890),
('结构化数据实战教程', 'Schema标记的最佳实践...', 'CSDN', 'draft', '2024-12-05', 0),
('内容营销与AI结合', '如何利用AI提升内容营销效果...', '微信公众号', 'reviewing', '2024-12-06', 0);

INSERT INTO diagnoses (name, diagnosis_type, date, status, score) VALUES
('内容营销策略分析', 'website', '2024-12-01', 'completed', 72),
('品牌关键词可见度', 'keyword', '2024-12-03', 'completed', 65),
('竞争对手分析', 'competitor', '2024-12-05', 'in_progress', NULL);

INSERT INTO materials (name, type, size, category, upload_date) VALUES
('品牌Logo.png', 'image', '245KB', '图片素材', '2024-12-01'),
('产品介绍.docx', 'document', '1.2MB', '文档模板', '2024-12-02'),
('宣传视频.mp4', 'video', '15.8MB', '视频素材', '2024-12-03'),
('SEO关键词表.xlsx', 'spreadsheet', '56KB', '数据文件', '2024-12-04'),
('播客录音.mp3', 'audio', '8.2MB', '音频素材', '2024-12-05');

INSERT INTO hot_copies (title, source, heat, keywords, url) VALUES
('2024年GEO优化完全指南：如何让AI搜索引擎推荐你的内容', 'SearchEngineJournal', 95, 'GEO,AI搜索,内容优化', 'https://example.com/1'),
('AI搜索引擎排名因素深度分析', 'Moz Blog', 88, 'AI排名,搜索引擎,SEO', 'https://example.com/2'),
('结构化数据对AI可见度的影响研究', 'Ahrefs', 82, '结构化数据,Schema,AI可见度', 'https://example.com/3'),
('如何利用LLM优化你的内容策略', 'HubSpot', 79, 'LLM,内容策略,AI写作', 'https://example.com/4'),
('Google SGE对SEO行业的影响与应对策略', 'SearchEngineLand', 76, 'SGE,Google,SEO策略', 'https://example.com/5');

INSERT INTO publishes (title, platform, status, publish_date, views) VALUES
('GEO优化入门指南', '微信公众号', 'published', '2024-12-01', 1250),
('AI搜索引擎排名策略', '知乎专栏', 'published', '2024-12-03', 890),
('结构化数据实战教程', 'CSDN', 'draft', '2024-12-05', 0),
('内容营销与AI结合', '微信公众号', 'reviewing', '2024-12-06', 0);

INSERT INTO analysis_data (day_name, visibility, traffic, period_type) VALUES
('周一', 65, 1200, 'weekly'),
('周二', 68, 1350, 'weekly'),
('周三', 72, 1500, 'weekly'),
('周四', 70, 1420, 'weekly'),
('周五', 75, 1680, 'weekly'),
('周六', 71, 1300, 'weekly'),
('周日', 74, 1450, 'weekly');

INSERT INTO platform_analysis (platform_name, visibility, trend, is_up) VALUES
('ChatGPT', 78, '+5%', true),
('Google SGE', 65, '+2%', true),
('Perplexity', 72, '-3%', false),
('Bing Copilot', 60, '+8%', true),
('Claude', 55, '+1%', true);

INSERT INTO ai_tools (name, description, category, icon, color, popularity, uses, last_used) VALUES
('Schema 生成器', '自动生成结构化数据标记，提升搜索引擎理解能力', 'SEO工具', 'Code', '#3b82f6', 85, 128, '30分钟前'),
('Meta 标签优化', '智能优化 Title 和 Description 标签，提高点击率', 'SEO工具', 'FileText', '#6366f1', 92, 256, '1小时前'),
('图片 Alt 生成', 'AI 自动生成图片替代文本，提升图片搜索排名', '内容工具', 'Image', '#ec4899', 78, 89, '2小时前'),
('网站速度检测', '全面检测页面加载速度和 Core Web Vitals 性能指标', '性能工具', 'Zap', '#f59e0b', 71, 64, '5小时前'),
('反向链接分析', '深度分析外部链接质量和数量，发现优质外链机会', 'SEO工具', 'Link', '#14b8a6', 88, 198, '昨天'),
('内容抄袭检测', 'AI 驱动的原创度检测，保护内容版权', '内容工具', 'Shield', '#22c55e', 65, 42, '2天前'),
('竞品关键词分析', '分析竞争对手的关键词策略和排名变化趋势', '分析工具', 'Search', '#06b6d4', 90, 231, '3小时前'),
('AI Prompt 优化', '优化 AI 提示词模板，获得更精准的搜索优化建议', 'AI工具', 'Sparkles', '#f5a623', 82, 156, '1天前'),
('内容质量评分', '从可读性、SEO、AI友好度多维度评估内容质量', '分析工具', 'BarChart3', '#8b5cf6', 76, 95, '6小时前'),
('AI 写作助手', '根据关键词和主题自动生成SEO友好的文章内容', 'AI工具', 'PenTool', '#f97316', 94, 312, '刚刚'),
('页面结构优化', '分析并优化页面 H1-H6 标签层次和内容结构', 'SEO工具', 'Globe', '#0ea5e9', 73, 78, '1天前'),
('Sitemap 生成器', '自动生成 XML Sitemap，确保搜索引擎全面爬取', 'SEO工具', 'Wrench', '#a855f7', 68, 53, '3天前');

INSERT INTO seo_keywords (keyword, volume, visibility, position, prev_position, status, platform) VALUES
('内容营销策略', 25000, 65, 3, 5, 'active', 'all'),
('搜索引擎排名优化', 18000, 60, 5, 7, 'active', 'all'),
('AI搜索引擎优化', 12000, 72, 2, 4, 'active', 'all'),
('GEO优化工具', 9500, 48, 8, 6, 'monitoring', 'all'),
('AI可见度分析', 7200, 70, 4, 8, 'active', 'all');

INSERT INTO trust_factors (factor_name, score, weight, description) VALUES
('内容质量', 85, '30%', '内容的原创性、深度和结构化程度'),
('Schema 标记', 70, '20%', '结构化数据的完整性和正确性'),
('权威性', 65, '15%', '外部引用和行业认可度'),
('用户体验', 80, '15%', '页面速度、移动端适配、可访问性'),
('引用频率', 55, '10%', '被 AI 引用和推荐的频率'),
('新鲜度', 75, '10%', '内容更新频率和时效性');

INSERT INTO trust_suggestions (suggestion_text, priority, impact) VALUES
('添加 FAQ Schema 标记，可提升 AI 可见度约 15%', 'high', '+15%'),
('优化页面标题，使其包含核心关键词', 'high', '+10%'),
('增加权威性引用和外部链接', 'medium', '+8%'),
('添加 Last-Modified 头部信息', 'medium', '+5%'),
('优化图片 Alt 文本，使用描述性语言', 'low', '+3%');

INSERT INTO plans (title, description, status, priority, start_date, end_date, progress) VALUES
('Q2 GEO优化计划', '提升品牌在AI搜索引擎中的可见度和引用率', 'active', 'high', '2024-04-01', '2024-06-30', 65),
('SEO内容营销计划', '通过SEO优化提升网站有机流量', 'active', 'medium', '2024-03-15', '2024-05-15', 40),
('品牌信任度提升方案', '通过多渠道策略提升品牌在AI和传统搜索中的信任评分', 'completed', 'low', '2024-01-01', '2024-03-31', 100),
('竞品分析与策略调整', '深度分析主要竞品的GEO和SEO策略', 'paused', 'medium', '2024-04-10', '2024-05-10', 25);

INSERT INTO plan_tasks (plan_id, title, done) VALUES
(1, '完成关键词研究与筛选', true),
(1, '创建10篇高质量GEO内容', true),
(1, '优化现有内容的AI可读性', false),
(1, '建立权威引用来源库', false),
(1, '执行AI平台可见度监测', false),
(2, 'SEO审计与技术修复', true),
(2, '发布优化后的着陆页', true),
(2, '建立外链获取策略', false),
(2, '创建月度SEO报告', false),
(3, '建立品牌知识图谱', true),
(3, '发布行业白皮书', true),
(3, '媒体关系建设', true),
(4, '识别主要竞品', true),
(4, '分析竞品AI可见度', false),
(4, '制定差异化策略', false);

INSERT INTO goals (title, description, category, progress, deadline, status) VALUES
('AI可见度达到85%', '提升品牌在主要AI搜索引擎中的可见度评分', '品牌建设', 72, '2024-06-30', 'active'),
('关键词排名Top10数量达20个', '通过SEO优化提升核心关键词的搜索排名', 'SEO优化', 55, '2024-08-15', 'active'),
('品牌信任度提升至80分', '通过多渠道策略提升品牌在AI和传统搜索中的信任评分', '信任度', 100, '2024-03-31', 'completed'),
('月均有机流量突破5万', '通过综合SEO和GEO策略提升网站有机流量', '流量增长', 38, '2024-09-30', 'active'),
('建立行业权威内容库', '创建50篇高质量行业内容，提升品牌专业形象', '内容建设', 20, '2024-12-31', 'paused');

INSERT INTO goal_milestones (goal_id, title, done) VALUES
(1, '完成AI平台基线评估', true),
(1, '优化核心页面AI可读性', true),
(1, '建立高质量外部引用', true),
(1, '监测并调整策略', false),
(1, '达到目标评分', false),
(2, '关键词研究与优先级排序', true),
(2, '内容优化与创建', true),
(2, '技术SEO修复', false),
(2, '外链建设', false),
(3, '建立品牌知识图谱', true),
(3, '发布行业权威内容', true),
(3, '媒体关系建设', true),
(4, '流量现状分析', true),
(4, '内容策略制定', false),
(4, '执行优化方案', false),
(4, '效果监测与调整', false),
(5, '制定内容日历', true),
(5, '完成前10篇内容', false),
(5, '建立内容审核流程', false),
(5, '达到50篇目标', false);

INSERT INTO platforms (name, icon, connected) VALUES
('微信公众号', '📱', true),
('知乎专栏', '💡', true),
('CSDN', '💻', true),
('掘金', '⛏️', false),
('小红书', '📕', false),
('微博', '🌐', false);