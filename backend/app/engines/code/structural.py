import difflib
from typing import List, Dict, Optional
import tree_sitter
# Note: Requires `pip install tree-sitter tree-sitter-python`
import tree_sitter_python

def get_parser(language: str = "python") -> Optional[tree_sitter.Parser]:
    """
    Initializes and returns a Tree-sitter parser for the specified language.
    Currently configured for Python. Additional languages require their respective 
    pip packages (e.g., tree-sitter-javascript, tree-sitter-c).
    """
    parser = tree_sitter.Parser()
    
    if language == "python":
        # Tree-sitter >= 0.22.0 API format
        lang = tree_sitter.Language(tree_sitter_python.language())
        parser.set_language(lang)
        return parser
        
    # Extensible for Java, C++, JS, etc.
    return None

def extract_ast_structure(node, structure_sequence: List[str]) -> None:
    """
    Recursively traverses the Abstract Syntax Tree (AST).
    Records only the structural node types (e.g., 'function_definition', 'for_statement', 'binary_operator').
    Ignores identifiers, variables, strings, and comments to normalize against renaming and obfuscation.
    """
    # Exclude leaf nodes that represent literals or specific names, and comments
    if node.is_named and node.type not in ['comment', 'string', 'identifier']:
        structure_sequence.append(node.type)
        
    for child in node.children:
        extract_ast_structure(child, structure_sequence)

def generate_structural_fingerprint(code: str, language: str = "python") -> List[str]:
    """
    Parses source code into an AST and flattens it into a sequence of node types.
    This sequence represents the mathematical structure of the logic.
    """
    if not code.strip():
        return []

    parser = get_parser(language)
    if not parser:
        raise ValueError(f"Language '{language}' is not supported by the AST engine.")

    # Tree-sitter expects bytes
    tree = parser.parse(bytes(code, "utf8"))
    
    structure_sequence: List[str] = []
    extract_ast_structure(tree.root_node, structure_sequence)
    
    return structure_sequence

def calculate_sequence_similarity(seq_a: List[str], seq_b: List[str]) -> float:
    """
    Calculates the similarity between two AST structural sequences using 
    the Ratcliff/Obershelp algorithm (Longest Common Subsequence variation).
    """
    if not seq_a and not seq_b:
        return 1.0
    if not seq_a or not seq_b:
        return 0.0

    matcher = difflib.SequenceMatcher(None, seq_a, seq_b)
    # .ratio() returns a float between 0 and 1
    return matcher.ratio()

def analyze_code_structure(code_a: str, code_b: str, language: str = "python") -> Dict[str, float]:
    """
    Executes the full structural AST comparison between two source code files.
    Returns a dictionary of normalized metrics indicating structural reuse.
    """
    seq_a = generate_structural_fingerprint(code_a, language)
    seq_b = generate_structural_fingerprint(code_b, language)
    
    ast_similarity = calculate_sequence_similarity(seq_a, seq_b)
    
    return {
        "ast_similarity": round(ast_similarity * 100, 2),
        "nodes_a": len(seq_a),
        "nodes_b": len(seq_b)
    }