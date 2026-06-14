"""Claim Clarity - checks if first paragraph has a clear definition"""
import re


def score(text):
    issues = []

    # Get first non-empty, non-frontmatter paragraph
    clean = text
    if clean.startswith("---"):
        parts = clean.split("---", 2)
        if len(parts) >= 3:
            clean = parts[2].strip()

    paragraphs = [p.strip() for p in clean.split("\n\n") if p.strip() and not p.strip().startswith("#")]
    first_para = paragraphs[0] if paragraphs else ""

    # Check for definition patterns
    has_definition = False
    definition_patterns = [
        r'是.{2,}(?:标准|体系|方法|概念|过程|要求|规范|工具|技术)',
        r'是指.{2,}',
        r'(?:定义|含义)是',
        r'>\s*\*\*.+\*\*\s*是',
    ]
    for pattern in definition_patterns:
        if re.search(pattern, first_para):
            has_definition = True
            break

    # Check for blockquote (common definition format)
    has_blockquote = bool(re.search(r'^>\s*.+', first_para, re.MULTILINE))

    if has_definition:
        dim_score = 90 if has_blockquote else 80
    elif has_blockquote:
        dim_score = 60
        issues.append({
            "id": "GEO-CC01", "severity": "medium",
            "title": "定义段缺少明确句式",
            "evidence": f"首段有引用格式但未检测到定义句式：'{first_para[:80]}...'",
            "fix": "建议首段使用'**[主题]** 是 [类别] 的 [定义]'格式，例如：'**ISO 9001** 是国际标准化组织发布的质量管理体系标准。'",
        })
    else:
        dim_score = 30
        issues.append({
            "id": "GEO-CC02", "severity": "high",
            "title": "缺少明确定义段",
            "evidence": f"首段未检测到定义句式或引用格式：'{first_para[:80]}...'" if first_para else "未找到任何段落",
            "fix": "在文章开头添加定义段，格式：'> **[主题]** 是 [类别] 的 [标准/规范]，由 [机构] 发布，用于 [用途]。'",
        })

    # Check for conclusion
    last_paras = paragraphs[-3:] if len(paragraphs) >= 3 else paragraphs
    has_conclusion = any(re.search(r'(?:总之|综上|总结|因此|所以|建议)', p) for p in last_paras)
    if not has_conclusion:
        dim_score = max(0, dim_score - 15)
        issues.append({
            "id": "GEO-CC03", "severity": "low",
            "title": "缺少总结段",
            "evidence": "文章末尾未检测到总结性语句",
            "fix": "建议在文章末尾添加总结段，概括核心观点",
        })

    return min(100, dim_score), issues