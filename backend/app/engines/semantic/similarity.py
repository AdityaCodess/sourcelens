import numpy as np
from typing import List, Dict
from sentence_transformers import SentenceTransformer, util
import torch

# 'all-MiniLM-L6-v2' is chosen for its excellent balance of speed and semantic performance.
# It generates 384-dimensional vectors, which are highly efficient for MongoDB Atlas Vector Search.
MODEL_NAME = "all-MiniLM-L6-v2"
_model = None

def get_model() -> SentenceTransformer:
    """
    Lazy-loads the embedding model to ensure it is only initialized when needed,
    preventing massive memory overhead during basic API routing.
    """
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model

def generate_embedding(text: str) -> List[float]:
    """
    Generates a dense vector embedding for a single text passage.
    Outputs a standard Python list of floats for easy database storage.
    """
    if not text.strip():
        return []
        
    model = get_model()
    # encode() returns a numpy array by default
    embedding = model.encode(text, convert_to_numpy=True)
    return embedding.tolist()

def generate_embeddings_batch(texts: List[str]) -> List[List[float]]:
    """
    Generates embeddings for a batch of passages efficiently.
    Crucial for processing an entire uploaded document at once.
    """
    if not texts:
        return []
        
    model = get_model()
    embeddings = model.encode(texts, convert_to_numpy=True)
    return [emb.tolist() for emb in embeddings]

def calculate_semantic_similarity(text_a: str, text_b: str) -> float:
    """
    Calculates the cosine similarity between two text passages on the fly.
    Useful for ad-hoc comparisons in the split-screen UI.
    """
    if not text_a.strip() or not text_b.strip():
        return 0.0
        
    model = get_model()
    
    # convert_to_tensor=True optimizes the PyTorch cosine similarity calculation
    embeddings_a = model.encode(text_a, convert_to_tensor=True)
    embeddings_b = model.encode(text_b, convert_to_tensor=True)
    
    # util.cos_sim returns a 2D tensor matrix; extract the single float value
    cosine_score = util.cos_sim(embeddings_a, embeddings_b).item()
    
    # Ensure the score stays strictly within 0.0 to 1.0 (float precision handling)
    return max(0.0, min(1.0, cosine_score))

def analyze_semantic_similarity(text_a: str, text_b: str) -> Dict[str, float]:
    """
    Wraps the semantic similarity calculation into the standardized SourceLens metric dictionary.
    """
    similarity = calculate_semantic_similarity(text_a, text_b)
    
    return {
        "semantic_cosine": round(similarity * 100, 2)
    }