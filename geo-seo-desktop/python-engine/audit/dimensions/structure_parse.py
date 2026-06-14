"""Structure Parsability - checks heading hierarchy, lists, tables, paragraph length"""
import re


def score(text):
    issues = []
    score_val = 100

    # Count headings
    h2s = re.findall(r'^## .+', text, re.MULTILINE)
    h3s = re.findall(r'^### .+', text, re.MULTILINE)

    if len(h2s) == 0:
        score_val -= 25
        issues.append({
            "id": "GEO-SP01", "severity": "high",
            "title": "缺少二级标题",
            "evidence": "未检测到任何 H2 标题",
            "fix": "使用 ## 添加至少2个小节标题，将内容组织为清晰的章节结构",
        })
    elif len(h2s) > 8:
        score_val -= 15
        issues.append({
            "id": "GEO-SP02", "severity": "low",
            "title": "二级标题过多",
            "evidence": f"检测到 {len(h2s)} 个 H2 标题，建议不超过8个",
            "fix": "合并相关章节，减少 H2 标题数量",
        })

    # Check tables
    has_table = bool(re.search(r'\|.+\|\n\|[-:]+', text))
    if not has_table:
        score_val -= 15
        issues.append({
            "id": "GEO-SP03", "severity": "medium",
            "title": "缺少数据表格",
            "evidence": "未检测到 Markdown 表格",
            "fix": "添加数据对比表格，例如费用对比、周期对比等",
        })

    # Check lists
    has_list = bool(re.search(r'^[-*]\s.+', text, re.MULTILINE)) or bool(re.search(r'^\d+\.\s.+', text, re.MULTILINE))
    if not has_list:
        score_val -= 10
        issues.append({
            "id": "GEO-SP04", "severity": "medium",
            "title": "缺少列表结构",
            "evidence": "未检测到列表（有序或无序）",
            "fix": "使用列表格式呈现要点，AI 更容易解析和引用",
        })

    # Check paragraph length
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip() and not p.strip().startswith(("#", "|", "-", ">", "```"))]
    long_paras = [p for p in paragraphs if len(p) > 200]
    if long_paras:
        score_val -= min(20, len(long_paras) * 5)
        issues.append({
            "id": "GEO-SP05", "severity": "medium",
            "title": f"有 {len(long_paras)} 个段落过长",
            "evidence": f"最长段落 {max(len(p) for p in long_paras)} 字，建议不超过200字",
            "fix": "将长段落拆分为多个短段落，每段聚焦一个要点",
        })

    return max(0, min(100, score_val)), issues