"""Platform Fit - checks FAQ structure, list density, paragraph length, heading format"""
import re


def score(text):
    issues = []
    score_val = 0

    # FAQ structure (ChatGPT, Perplexity love this)
    faq_patterns = [
        r'(?:FAQ|常见问题|Q\d+[:：]|问[:：])',
        r'\*\*Q\d*[:：]?.+\*\*\s*\n\s*A[:：]',
    ]
    has_faq = any(re.search(p, text, re.IGNORECASE) for p in faq_patterns)
    if has_faq:
        score_val += 30
    else:
        issues.append({
            "id": "GEO-PF01", "severity": "high",
            "title": "缺少 FAQ 结构",
            "evidence": "未检测到 FAQ 或问答格式",
            "fix": "在文章末尾添加 3-5 个常见问题及简短回答，AI 搜索引擎偏好引用 FAQ 内容",
        })

    # List density
    list_items = re.findall(r'^[-*]\s.+|^\d+\.\s.+', text, re.MULTILINE)
    list_ratio = len(list_items) / max(1, len(text.split("\n")))
    if list_ratio > 0.1:
        score_val += 20
    elif list_items:
        score_val += 10
        issues.append({
            "id": "GEO-PF02", "severity": "low",
            "title": "列表密度偏低",
            "evidence": f"检测到 {len(list_items)} 个列表项",
            "fix": "将要点内容转换为列表格式，提高 AI 解析效率",
        })
    else:
        issues.append({
            "id": "GEO-PF03", "severity": "medium",
            "title": "缺少列表结构",
            "evidence": "未检测到任何列表",
            "fix": "使用列表格式呈现关键要点",
        })

    # Short paragraphs (good for AI)
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip() and not p.strip().startswith(("#", "|", "-", ">", "```"))]
    if paragraphs:
        avg_len = sum(len(p) for p in paragraphs) / len(paragraphs)
        if avg_len < 150:
            score_val += 25
        elif avg_len < 250:
            score_val += 15
        else:
            score_val += 5
            issues.append({
                "id": "GEO-PF04", "severity": "medium",
                "title": "段落平均长度过长",
                "evidence": f"段落平均长度 {int(avg_len)} 字，建议不超过150字",
                "fix": "将长段落拆分为短段落，每段一个核心观点",
            })

    # Table presence
    has_table = bool(re.search(r'\|.+\|\n\|[-:]+', text))
    if has_table:
        score_val += 25

    return min(100, score_val), issues