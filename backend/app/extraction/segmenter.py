from typing import List, Dict, Any
import re

def segment_text(text: str, max_words: int = 100, overlap_words: int = 20) -> List[Dict[str, Any]]:
    """
    Splits a large text into smaller, overlapping passages based on word count.
    Maintains exact character start and end positions for UI highlighting.
    """
    # Find all words and their start/end character positions
    word_matches = list(re.finditer(r'\S+', text))
    
    passages: List[Dict[str, Any]] = []
    total_words = len(word_matches)
    
    if total_words == 0:
        return passages

    step = max_words - overlap_words
    if step <= 0:
        step = max_words

    passage_index = 0
    for i in range(0, total_words, step):
        chunk_matches = word_matches[i:i + max_words]
        
        if not chunk_matches:
            break
            
        start_char = chunk_matches[0].start()
        end_char = chunk_matches[-1].end()
        chunk_text = text[start_char:end_char]
        
        passages.append({
            "passage_index": passage_index,
            "text": chunk_text,
            "char_span": {
                "start": start_char,
                "end": end_char
            },
            "token_count": len(chunk_matches)
        })
        
        passage_index += 1

    return passages