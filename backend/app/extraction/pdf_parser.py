import fitz  # PyMuPDF
from typing import Dict, Any, List

def parse_pdf(file_path: str) -> Dict[str, Any]:
    """
    Extracts text and metadata from a PDF file.
    Returns a dictionary containing the full text, pages, and statistics.
    """
    document = fitz.open(file_path)
    
    pages_data: List[Dict[str, Any]] = []
    full_text = ""
    word_count = 0
    
    for page_num in range(len(document)):
        page = document.load_page(page_num)
        text = page.get_text("text")
        
        # Basic word count for the page
        words = len(text.split())
        word_count += words
        
        pages_data.append({
            "page_number": page_num + 1,
            "text": text,
            "word_count": words
        })
        
        full_text += text + "\n\n"
        
    document.close()
    
    return {
        "full_text": full_text.strip(),
        "pages": pages_data,
        "statistics": {
            "page_count": len(pages_data),
            "word_count": word_count
        }
    }