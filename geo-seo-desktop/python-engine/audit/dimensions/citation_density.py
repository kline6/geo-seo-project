"""Citation Density - checks for data source citations, reference marks, standard numbers"""
import re


def score(text):
    issues = []
    text_len = len(text)
    if text_len == 0:
        return 0, [{"id": "GEO-CD01", "severity": "high", "title": "内容为空", "evidence": "未检测到任何内容", "fix": "请添加文章内容"}]

    # Count citation indicators
    citations = []
    # ISO standard references
    citations.extend(re.findall(r'ISO\s*\d+[:\-\d]*', text, re.IGNORECASE))
    # GB standard references
    citations.extend(re.findall(r'GB[/T]*\s*\d+[:\-\d]*', text, re.IGNORECASE))
    # Reference marks like [1], [2]
    citations.extend(re.findall(r'\[\d+\]', text))
    # Source/attribution phrases
    citations.extend(re.findall(r'(?:根据|依据|参考|来源|引用|出处|据.*统计)', text))
    # Links
    citations.extend(re.findall(r'https?://\S+', text))

    citation_count = len(citations)
    expected = max(1, text_len // 500)
    ratio = min(1.0, citation_count / expected) if expected > 0 else 0

    dim_score = round(min(100, ratio * 100))

    if citation_count == 0:
        issues.append({
            "id": "GEO-CD01", "severity": "high",
            "title": "缺少引用来源",
            "evidence": "全文未找到任何数据来源标注、标准编号或参考链接",
            "fix": "在关键数据后添加来源标注，例如：'据 ISO 官方数据（2024）...' 或引用具体标准编号如 ISO 9001:2015",
        })
    elif ratio < 0.5:
        issues.append({
            "id": "GEO-CD02", "severity": "medium",
            "title": "引用密度不足",
            "evidence": f"检测到 {citation_count} 处引用，建议至少 {expected} 处",
            "fix": f"建议每500字至少添加1处数据来源标注，当前文章约{text_len}字，建议增加{expected - citation_count}处引用",
        })

    return dim_score, issues