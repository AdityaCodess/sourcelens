from typing import Dict, Any, Optional

def calculate_composite_score(
    lexical: float, 
    semantic: float, 
    structural: Optional[float] = None,
    is_code: bool = False
) -> float:
    """
    Computes a weighted composite similarity score.
    Code analysis heavily weights AST structure. Text analysis balances semantic meaning and lexical overlap.
    """
    if is_code and structural is not None:
        # Code: 60% Structure, 30% Lexical (Tokens), 10% Semantic (Comments/Strings)
        return (structural * 0.60) + (lexical * 0.30) + (semantic * 0.10)
    
    # Text: 60% Semantic (Meaning/Paraphrasing), 40% Lexical (Exact words)
    return (semantic * 0.60) + (lexical * 0.40)

def classify_match(
    lexical_metrics: Dict[str, float],
    semantic_metrics: Dict[str, float],
    structural_metrics: Optional[Dict[str, float]] = None,
    is_code: bool = False
) -> Dict[str, Any]:
    """
    Evaluates raw engine metrics against heuristic thresholds to determine the 
    nature of the overlap and the system's confidence in the flag.
    """
    lexical_score = lexical_metrics.get("composite_lexical", 0.0)
    ngram_score = lexical_metrics.get("ngram_overlap", 0.0)
    semantic_score = semantic_metrics.get("semantic_cosine", 0.0)
    ast_score = structural_metrics.get("ast_similarity", 0.0) if structural_metrics else 0.0

    composite_score = calculate_composite_score(
        lexical=lexical_score,
        semantic=semantic_score,
        structural=ast_score,
        is_code=is_code
    )

    classification = "UNKNOWN"
    confidence = "LOW"
    evidence = ""

    # --- CODE CLASSIFICATION HEURISTICS ---
    if is_code:
        if ast_score >= 95 and lexical_score >= 90:
            classification = "DIRECT COPY"
            confidence = "HIGH"
            evidence = "Near-identical AST structure and lexical tokens. Code is virtually unmodified."
        elif ast_score >= 85 and lexical_score < 60:
            classification = "STRUCTURAL REUSE (OBFUSCATED)"
            confidence = "HIGH"
            evidence = "High structural isomorphism despite significant token differences. Strongly indicates variable renaming and comment stripping."
        elif ast_score >= 70:
            classification = "PARTIAL STRUCTURAL OVERLAP"
            confidence = "MEDIUM"
            evidence = "Moderate structural similarity. May indicate shared boilerplate or template usage."
        else:
            classification = "COINCIDENTAL MATCH"
            confidence = "LOW"
            evidence = "Low structural and lexical overlap. Likely independent implementations."

    # --- TEXT CLASSIFICATION HEURISTICS ---
    else:
        if ngram_score >= 80 or lexical_score >= 90:
            classification = "DIRECT MATCH"
            confidence = "HIGH"
            evidence = "Extensive verbatim n-gram and token overlap. Indicates direct copy-pasting."
        elif semantic_score >= 85 and lexical_score < 50:
            classification = "PARAPHRASE"
            confidence = "HIGH"
            evidence = "High semantic similarity but low exact-word overlap. The underlying meaning is identical but the text was rewritten."
        elif semantic_score >= 75 and lexical_score >= 60:
            classification = "HEAVY EDITING"
            confidence = "MEDIUM"
            evidence = "Strong semantic alignment with moderate lexical overlap. Source material was likely referenced and modified."
        elif semantic_score >= 65:
            classification = "THEMATIC OVERLAP"
            confidence = "LOW"
            evidence = "Passages discuss highly similar concepts but lack definitive structural or lexical evidence of direct reuse."
        else:
            classification = "CLEARED"
            confidence = "LOW"
            evidence = "Metrics fall below standard flagging thresholds."

    return {
        "classification": classification,
        "confidence": confidence,
        "evidence": evidence,
        "metrics": {
            "composite": round(composite_score, 2),
            "lexical": round(lexical_score, 2),
            "semantic": round(semantic_score, 2),
            "structural": round(ast_score, 2) if is_code else 0.0
        }
    }