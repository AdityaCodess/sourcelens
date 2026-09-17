import re
from typing import List, Set, Dict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def tokenize(text: str) -> List[str]:
    """
    Normalizes and tokenizes text into a list of lowercase alphanumeric words.
    """
    if not text:
        return []
    # Convert to lowercase and extract word characters
    return re.findall(r'\b\w+\b', text.lower())

def get_ngrams(tokens: List[str], n: int = 3) -> Set[str]:
    """
    Generates a set of n-grams from a list of tokens for structural overlap detection.
    """
    if len(tokens) < n:
        return set([" ".join(tokens)]) if tokens else set()
    return set(" ".join(tokens[i:i+n]) for i in range(len(tokens) - n + 1))

def calculate_jaccard(tokens_a: List[str], tokens_b: List[str]) -> float:
    """
    Calculates Jaccard similarity (Intersection over Union) for absolute token overlap.
    """
    set_a = set(tokens_a)
    set_b = set(tokens_b)
    
    if not set_a and not set_b:
        return 1.0
    if not set_a or not set_b:
        return 0.0
        
    intersection = len(set_a.intersection(set_b))
    union = len(set_a.union(set_b))
    
    return intersection / union

def calculate_ngram_overlap(tokens_a: List[str], tokens_b: List[str], n: int = 3) -> float:
    """
    Calculates the overlap coefficient of n-grams.
    Highly effective for detecting copied and pasted phrases.
    """
    ngrams_a = get_ngrams(tokens_a, n)
    ngrams_b = get_ngrams(tokens_b, n)
    
    if not ngrams_a or not ngrams_b:
        return 0.0
        
    intersection = len(ngrams_a.intersection(ngrams_b))
    # Overlap coefficient divides by the smaller set size to detect containment
    smaller_set_size = min(len(ngrams_a), len(ngrams_b))
    
    return intersection / smaller_set_size

def calculate_tfidf_cosine(text_a: str, text_b: str) -> float:
    """
    Calculates Cosine Similarity using TF-IDF vectors.
    This gives less weight to common words (like 'the', 'is') and more weight to unique terms.
    """
    if not text_a.strip() or not text_b.strip():
        return 0.0
        
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([text_a, text_b])
        # Get the similarity between document 0 and document 1
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(similarity)
    except ValueError:
        # Happens if texts only contain stop words or are entirely filtered out
        return 0.0

def analyze_lexical_similarity(text_a: str, text_b: str) -> Dict[str, float]:
    """
    Executes the full lexical analysis suite comparing two text passages.
    Returns a dictionary of normalized metrics (0.0 to 100.0).
    """
    tokens_a = tokenize(text_a)
    tokens_b = tokenize(text_b)
    
    jaccard_score = calculate_jaccard(tokens_a, tokens_b)
    ngram_score = calculate_ngram_overlap(tokens_a, tokens_b, n=3)
    tfidf_score = calculate_tfidf_cosine(text_a, text_b)
    
    # Create a weighted composite lexical score
    # We heavily weight TF-IDF and N-gram overlap for forensic integrity
    composite = (tfidf_score * 0.5) + (ngram_score * 0.3) + (jaccard_score * 0.2)
    
    return {
        "jaccard_similarity": round(jaccard_score * 100, 2),
        "ngram_overlap": round(ngram_score * 100, 2),
        "tfidf_cosine": round(tfidf_score * 100, 2),
        "composite_lexical": round(composite * 100, 2)
    }