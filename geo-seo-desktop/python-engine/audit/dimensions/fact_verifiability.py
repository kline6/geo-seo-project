"""Fact Verifiability - checks for numbers, percentages, dates, cost figures"""
import re


def score(text):
    issues = []
    data_points = []

    # Numbers with units
    data_points.extend(re.findall(r'\d+[\d.,]*\s*(?:万元|元|万|千|%|百分点|天|个月|周|小时|分钟|人|家|个|项|条|次|份)', text))
    # Percentages
    data_points.extend(re.findall(r'\d+\.?\d*\s*%', text))
    # Date ranges
    data_points.extend(re.findall(r'\d{4}[-/年]\d{1,2}[-/月]\d{0,2}日?', text))
    # Cost ranges
    data_points.extend(re.findall(r'\d+[\-~至到]\d+\s*(?:万|元|天|个月)', text))
    # Version numbers
    data_points.extend(re.findall(r'(?:v|V|版本)\s*\d+\.?\d*', text))

    count = len(data_points)

    if count >= 5:
        dim_score = 100
    elif count >= 3:
        dim_score = 80
    elif count >= 1:
        dim_score = 50
        issues.append({
            "id": "GEO-FV01", "severity": "medium",
            "title": "数据引用不足",
            "evidence": f"仅检测到 {count} 个可验证数据点",
            "fix": "添加更多具体数据，如费用范围、时间周期、成功率百分比等",
        })
    else:
        dim_score = 20
        issues.append({
            "id": "GEO-FV02", "severity": "high",
            "title": "缺少可验证数据",
            "evidence": "全文未检测到具体数字、百分比或数据范围",
            "fix": "添加具体数据支撑观点，例如：'认证费用通常在3-8万元'、'周期约3-6个月'、'通过率约85%'",
        })

    return dim_score, issues