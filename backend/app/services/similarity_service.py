from typing import Dict, Any, List, Optional
from app.engines.lexical.similarity import analyze_lexical_similarity
from app.engines.semantic.similarity import analyze_semantic_similarity, generate_embeddings_batch
from app.engines.code.structural import analyze_code_structure
from app.engines.classifier import classify_match

class SimilarityService:
    """
    Orchestrates the multi-engine comparison pipeline.
    Routes text or code passages through the appropriate NLP and structural models,
    aggregates the metrics, and passes them to the classifier for a final verdict.
    """
    
    @staticmethod
    def compare_passages(
        passage_a: str, 
        passage_b: str, 
        is_code: bool = False,
        language: str = "python"
    ) -> Dict[str, Any]:
        """
        Performs a deep 1:1 forensic comparison between two distinct passages.
        Returns a classified match object ready for the frontend workstation.
        """
        # 1. Lexical Analysis (Exact token overlap, n-grams, TF-IDF)
        lexical_metrics = analyze_lexical_similarity(passage_a, passage_b)
        
        # 2. Semantic Analysis (Meaning, Paraphrasing)
        semantic_metrics = analyze_semantic_similarity(passage_a, passage_b)
        
        # 3. Structural Analysis (AST routing for code only)
        structural_metrics = None
        if is_code:
            structural_metrics = analyze_code_structure(passage_a, passage_b, language)
            
        # 4. Classification & Confidence Scoring
        classification_result = classify_match(
            lexical_metrics=lexical_metrics,
            semantic_metrics=semantic_metrics,
            structural_metrics=structural_metrics,
            is_code=is_code
        )
        
        return classification_result

    @staticmethod
    def batch_generate_vectors(passages: List[str]) -> List[List[float]]:
        """
        Utility to batch-process document segments into embeddings for database insertion.
        Used during the initial file upload/ingestion phase.
        """
        return generate_embeddings_batch(passages)

    @staticmethod
    def scan_passage_against_corpus(
        query_passage: str, 
        query_embedding: List[float], 
        corpus_candidates: List[Dict[str, Any]],
        threshold: float = 65.0
    ) -> List[Dict[str, Any]]:
        """
        Evaluates a single segmented passage against a pre-filtered list of corpus candidates.
        In a production flow, corpus_candidates is returned by a fast vector search (e.g., MongoDB Atlas).
        """
        matches = []
        
        for candidate in corpus_candidates:
            # We already know they are semantically close due to the DB vector search,
            # now we run the full rigorous engine suite to generate evidence.
            result = SimilarityService.compare_passages(
                passage_a=query_passage,
                passage_b=candidate["text"],
                is_code=False
            )
            
            # Only flag matches that meet the strict composite threshold
            if result["metrics"]["composite"] >= threshold:
                matches.append({
                    "target_document_id": candidate["document_id"],
                    "target_passage_index": candidate["passage_index"],
                    "target_text": candidate["text"],
                    "classification": result["classification"],
                    "confidence": result["confidence"],
                    "evidence": result["evidence"],
                    "metrics": result["metrics"]
                })
                
        # Sort matches by severity (composite score) descending
        return sorted(matches, key=lambda x: x["metrics"]["composite"], reverse=True)