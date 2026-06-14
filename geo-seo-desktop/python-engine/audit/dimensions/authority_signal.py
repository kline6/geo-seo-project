"""Authority Signal - checks for standard numbers, institution names, years, official links"""
import re


def score(text):
    issues = []
    score_val = 0

    # Standard numbers (ISO, GB, etc.)
    standards = re.findall(r'(?:ISO|IEC|GB[/T]*|IATF)\s*[\d:]+[\d\-]*', text, re.IGNORECASE)
    if standards:
        score_val += min(40, len(standards) * 15)

    # Institution names
    institutions = re.findall(
        r'(?:国际标准化组织|中国国家标准化管理委员会|认证机构|中国合格评定国家认可委员会|CNAS|IAF|认可委员会|质量监督局)',
        text
    )
    if institutions:
        score_val += min(30, len(institutions) * 10)

    # Years / dates
    years = re.findall(r'(?:19|20)\d{2}\s*(?:年|版|年版)', text)
    if years:
        score_val += min(15, len(years) * 5)

    # Official links
    links = re.findall(r'https?://(?:www\.)?(?:iso\.org|cnas\.org\.cn|iaf\.nu|sac\.gov\.cn)\S*', text, re.IGNORECASE)
    if links:
        score_val += min(15, len(links) * 5)

    score_val = min(100, score_val)

    if not standards:
        issues.append({
            "id": "GEO-AS01", "severity": "high",
            "title": "缺少标准编号引用",
            "evidence": "未检测到 ISO/GB/IEC 等标准编号",
            "fix": "引用相关标准编号，如 ISO 9001:2015、GB/T 19001-2016，增加内容权威性",
        })

    if not institutions:
        issues.append({
            "id": "GEO-AS02", "severity": "medium",
            "title": "缺少权威机构引用",
            "evidence": "未检测到认证机构或标准化组织名称",
            "fix": "提及国际标准化组织(ISO)、CNAS 等权威机构名称",
        })

    return score_val, issues