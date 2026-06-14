"""Suggester - generates actionable suggestions from audit issues"""
import re


def generate_suggestions(issues):
    """Generate high-level rewrite hints from issues"""
    suggestions = []
    high_issues = [i for i in issues if i.get("severity") == "high"]
    medium_issues = [i for i in issues if i.get("severity") == "medium"]

    if any(i["id"].startswith("GEO-CC") for i in high_issues):
        suggestions.append("建议在首段添加实体定义句以提高 AI 引用概率")

    if any(i["id"].startswith("GEO-CD") for i in high_issues):
        suggestions.append("增加数据来源标注和标准编号引用，提升内容权威性")

    if any(i["id"].startswith("GEO-SP") for i in high_issues):
        suggestions.append("优化文章结构：添加标题层级、表格和列表")

    if any(i["id"].startswith("GEO-PF") for i in high_issues):
        suggestions.append("添加 FAQ 模块，AI 搜索引擎偏好引用结构化问答内容")

    if any(i["id"].startswith("GEO-FV") for i in high_issues):
        suggestions.append("补充具体数据（费用、周期、百分比）增强可信度")

    if any(i["id"].startswith("GEO-AS") for i in issues):
        suggestions.append("引用 ISO 标准编号和权威机构名称增加专业性")

    if not suggestions:
        if medium_issues:
            suggestions.append("内容基础良好，优化上述中等问题可进一步提升 GEO 评分")
        else:
            suggestions.append("内容 GEO 表现优秀，保持当前写作标准")

    return suggestions


def generate_meta(title, content_md):
    """Generate SEO meta recommendations"""
    # Extract first paragraph as description base
    clean = content_md
    if clean.startswith("---"):
        parts = clean.split("---", 2)
        if len(parts) >= 3:
            clean = parts[2].strip()

    paragraphs = [p.strip() for p in clean.split("\n\n") if p.strip()
                   and not p.strip().startswith(("#", "|", "-", ">", "```", "*"))]

    # Build description from first meaningful paragraph
    desc_source = paragraphs[0] if paragraphs else title
    desc = re.sub(r'[\*\#\`\[\]]', '', desc_source)
    if len(desc) > 150:
        desc = desc[:147] + "..."
    elif len(desc) < 50:
        desc = title + " - " + desc

    # Extract keywords from headings and repeated terms
    headings = re.findall(r'^#+\s*(.+)', content_md, re.MULTILINE)
    keywords = [title.split("：")[0].split(":")[0].strip()]
    for h in headings[:5]:
        clean_h = re.sub(r'[\*\#\`]', '', h).strip()
        if clean_h and clean_h not in keywords and len(clean_h) < 20:
            keywords.append(clean_h)

    # Enhanced title
    enhanced_title = title
    if not re.search(r'\d{4}', title):
        enhanced_title = f"{title}：2026 年最新指南"
    if len(enhanced_title) > 60:
        enhanced_title = title

    return {
        "title": enhanced_title,
        "description": desc[:160],
        "keywords": keywords[:5],
    }