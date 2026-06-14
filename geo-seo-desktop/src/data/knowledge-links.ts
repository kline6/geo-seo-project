// Maps GEO issue IDs to knowledge base categories and keywords
export const issueToKnowledge: Record<string, { category: string; keywords: string[] }> = {
  'GEO-CD01': { category: 'tips', keywords: ['引用密度', '引用来源'] },
  'GEO-CD02': { category: 'tips', keywords: ['引用密度', '数据来源'] },
  'GEO-CC01': { category: 'tips', keywords: ['定义段', '引言'] },
  'GEO-CC02': { category: 'tips', keywords: ['定义段', '引言'] },
  'GEO-CC03': { category: 'tips', keywords: ['总结段', '结论'] },
  'GEO-SP01': { category: 'tips', keywords: ['标题结构', 'H2'] },
  'GEO-SP02': { category: 'tips', keywords: ['标题结构'] },
  'GEO-SP03': { category: 'tips', keywords: ['表格', '数据表格'] },
  'GEO-SP04': { category: 'tips', keywords: ['列表', '可读性'] },
  'GEO-SP05': { category: 'tips', keywords: ['段落长度'] },
  'GEO-AS01': { category: 'geo_basics', keywords: ['标准编号', 'ISO', '权威性'] },
  'GEO-AS02': { category: 'geo_basics', keywords: ['权威机构', '认证机构'] },
  'GEO-FV01': { category: 'tips', keywords: ['数据引用', '事实'] },
  'GEO-FV02': { category: 'tips', keywords: ['数据引用', '事实'] },
  'GEO-PF01': { category: 'tips', keywords: ['FAQ', '问答'] },
  'GEO-PF02': { category: 'tips', keywords: ['列表'] },
  'GEO-PF03': { category: 'tips', keywords: ['列表'] },
  'GEO-PF04': { category: 'tips', keywords: ['段落长度'] },
}

// Maps dimension names to knowledge categories
export const dimensionToKnowledge: Record<string, string> = {
  citation_density: 'tips',
  claim_clarity: 'tips',
  structure_parse: 'tips',
  authority_signal: 'geo_basics',
  fact_verifiability: 'tips',
  platform_fit: 'platform_strategy',
}