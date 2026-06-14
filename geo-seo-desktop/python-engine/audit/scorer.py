"""Main scorer orchestrator"""
import uuid
from audit.dimensions.citation_density import score as score_citation
from audit.dimensions.claim_clarity import score as score_claim
from audit.dimensions.structure_parse import score as score_structure
from audit.dimensions.authority_signal import score as score_authority
from audit.dimensions.fact_verifiability import score as score_fact
from audit.dimensions.platform_fit import score as score_platform
from audit.suggester import generate_suggestions, generate_meta


WEIGHTS = {
    "citation_density": 0.20,
    "claim_clarity": 0.15,
    "structure_parse": 0.20,
    "authority_signal": 0.15,
    "fact_verifiability": 0.15,
    "platform_fit": 0.15,
}


def score_content(title, content_md, language="zh-CN", platforms=None, options=None):
    if platforms is None:
        platforms = ["chatgpt"]
    if options is None:
        options = {}

    all_issues = []
    dimension_scores = {}

    # Run each dimension
    scorers = {
        "citation_density": score_citation,
        "claim_clarity": score_claim,
        "structure_parse": score_structure,
        "authority_signal": score_authority,
        "fact_verifiability": score_fact,
        "platform_fit": score_platform,
    }

    for dim_name, scorer_fn in scorers.items():
        dim_score, dim_issues = scorer_fn(content_md)
        dimension_scores[dim_name] = dim_score
        all_issues.extend(dim_issues)

    # Calculate weighted total
    total_score = sum(
        dimension_scores[dim] * WEIGHTS[dim] for dim in WEIGHTS
    )
    total_score = round(max(0, min(100, total_score)))

    # Generate suggestions
    suggestions = generate_suggestions(all_issues)
    suggested_meta = generate_meta(title, content_md)

    return {
        "audit_id": str(uuid.uuid4()),
        "score": total_score,
        "dimension_scores": dimension_scores,
        "issues": all_issues,
        "suggestions": suggestions,
        "suggested_meta": suggested_meta,
    }