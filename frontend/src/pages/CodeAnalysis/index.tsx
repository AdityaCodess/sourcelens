import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Code2, GitCompare, FileCode, Activity, 
  AlertTriangle, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- Professional Mock Data ---
const MOCK_FILE_A = {
  filename: "crypto_utils.py",
  author: "target_source",
  content: `def generate_hash_chain(seed_value, iterations):
    current_hash = seed_value
    chain = [current_hash]
    
    for i in range(iterations):
        # Apply salt and re-hash
        salted = current_hash + str(i)
        current_hash = complex_hash_algo(salted)
        chain.append(current_hash)
        
    return chain

def complex_hash_algo(data):
    return hash(data) * 256`
};

const MOCK_FILE_B = {
  filename: "utils.py",
  author: "candidate_match",
  content: `def make_chain(start_val, count):
    h = start_val
    res = [h]
    
    for j in range(count):
        s = h + str(j)
        h = calc_hash(s)
        res.append(h)
        
    return res

def calc_hash(d):
    return hash(d) * 256`
};

const MOCK_METRICS = {
  tokenSimilarity: 61,
  astSimilarity: 91,
  normalizedStructure: 94,
  status: "REVIEW REQUIRED",
  classification: "STRUCTURAL REUSE (VARIABLE RENAMING)"
};

export function CodeAnalysis() {
  const [activePane, setActivePane] = useState<'A' | 'B' | 'BOTH'>('BOTH');

  const editorOptions = {
    readOnly: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 12,
    fontFamily: "'JetBrains Mono', monospace",
    renderLineHighlight: "all" as const,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    matchBrackets: "never",
    contextmenu: false,
  };

  return (
    <div className="flex flex-col h-full w-full bg-background">
      
      {/* Toolbar */}
      <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Code2 size={16} className="text-secondary" />
          <h1 className="text-sm font-semibold text-primary tracking-wide">Structural Code Analysis</h1>
          <div className="w-px h-4 bg-border mx-2"></div>
          <div className="text-xs font-mono text-muted uppercase tracking-widest flex items-center gap-2">
            AST Engine <span className="w-1.5 h-1.5 rounded-full bg-[#56D4D0]"></span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-background border border-border p-1 rounded-sm">
          <button 
            onClick={() => setActivePane('A')}
            className={cn("px-3 py-1 text-[10px] font-mono uppercase tracking-widest rounded-sm transition-colors", activePane === 'A' ? "bg-surface-raised text-primary" : "text-secondary hover:text-primary")}
          >
            Source A
          </button>
          <button 
            onClick={() => setActivePane('BOTH')}
            className={cn("px-3 py-1 text-[10px] font-mono uppercase tracking-widest rounded-sm transition-colors", activePane === 'BOTH' ? "bg-surface-raised text-primary" : "text-secondary hover:text-primary")}
          >
            Split View
          </button>
          <button 
            onClick={() => setActivePane('B')}
            className={cn("px-3 py-1 text-[10px] font-mono uppercase tracking-widest rounded-sm transition-colors", activePane === 'B' ? "bg-surface-raised text-primary" : "text-secondary hover:text-primary")}
          >
            Source B
          </button>
        </div>
      </header>

      {/* Main Workspace Split */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        
        {/* Code Editors Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Source A */}
          {(activePane === 'A' || activePane === 'BOTH') && (
            <div className="flex-1 flex flex-col border-r border-border min-w-0">
              <div className="h-10 border-b border-border bg-surface-raised flex items-center px-4 shrink-0">
                <FileCode size={14} className="text-muted mr-2" />
                <span className="text-xs font-mono text-primary">{MOCK_FILE_A.filename}</span>
              </div>
              <div className="flex-1 bg-[#1e1e1e]"> 
                {/* #1e1e1e is the default vs-dark Monaco background */}
                <Editor
                  height="100%"
                  language="python"
                  theme="vs-dark"
                  value={MOCK_FILE_A.content}
                  options={editorOptions}
                />
              </div>
            </div>
          )}

          {/* Diff/Compare Divider (Only in BOTH mode) */}
          {activePane === 'BOTH' && (
            <div className="w-8 bg-surface border-r border-border flex flex-col items-center py-4 gap-4 shrink-0 z-10">
              <GitCompare size={14} className="text-muted" />
              <div className="w-px flex-1 bg-border/50"></div>
            </div>
          )}

          {/* Source B */}
          {(activePane === 'B' || activePane === 'BOTH') && (
            <div className="flex-1 flex flex-col border-r border-border min-w-0">
              <div className="h-10 border-b border-border bg-surface-raised flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center">
                  <FileCode size={14} className="text-muted mr-2" />
                  <span className="text-xs font-mono text-primary">{MOCK_FILE_B.filename}</span>
                </div>
                <span className="text-[10px] font-mono text-amber-500 border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 rounded-sm uppercase tracking-widest">
                  Candidate Match
                </span>
              </div>
              <div className="flex-1 bg-[#1e1e1e]">
                <Editor
                  height="100%"
                  language="python"
                  theme="vs-dark"
                  value={MOCK_FILE_B.content}
                  options={editorOptions}
                />
              </div>
            </div>
          )}

        </div>

        {/* RIGHT: AST Inspector Panel */}
        <div className="w-[360px] bg-surface flex flex-col shrink-0 z-20 shadow-[-4px_0_15px_rgba(0,0,0,0.5)] border-l border-border">
          <div className="h-10 border-b border-border flex items-center px-5 shrink-0 bg-surface-raised">
            <span className="text-[10px] font-mono text-secondary uppercase tracking-widest flex items-center gap-2">
              <Activity size={12} />
              AST Structural Analysis
            </span>
          </div>

          <div className="flex-1 overflow-auto p-5 space-y-6">
            
            {/* Status & Classification */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest mb-1.5">
                <AlertTriangle size={14} />
                {MOCK_METRICS.status}
              </div>
              <div className="text-sm font-semibold text-primary leading-snug">
                {MOCK_METRICS.classification}
              </div>
            </div>

            <hr className="border-border" />

            {/* Metrics Breakdown */}
            <div>
              <div className="text-[10px] text-muted font-mono mb-4 tracking-widest uppercase">Similarity Metrics</div>
              <div className="space-y-4">
                <MetricBar label="AST Similarity" value={MOCK_METRICS.astSimilarity} isPrimary />
                <MetricBar label="Normalized Structure" value={MOCK_METRICS.normalizedStructure} isPrimary />
                <MetricBar label="Lexical Token Match" value={MOCK_METRICS.tokenSimilarity} />
              </div>
            </div>

            {/* Evidence Explanation */}
            <div className="pt-4 border-t border-border">
              <div className="text-[10px] font-mono text-muted mb-3 tracking-widest uppercase">
                Heuristic Evidence
              </div>
              <div className="bg-background border border-border p-3 rounded-sm space-y-2">
                <p className="text-xs text-primary leading-relaxed font-sans">
                  The Abstract Syntax Trees (AST) for these two files are highly isomorphic.
                </p>
                <ul className="text-xs text-secondary space-y-1.5 font-sans list-disc pl-4">
                  <li>Variable identifiers have been systematically renamed.</li>
                  <li>Comments were stripped from the candidate file.</li>
                  <li>Control flow and loop conditions remain structurally identical.</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col gap-2">
              <button className="w-full border border-border text-primary hover:bg-surface-raised text-xs font-bold tracking-widest py-2.5 rounded-sm transition-colors uppercase flex justify-between items-center px-4">
                View AST Diff <ChevronRight size={14} className="text-muted" />
              </button>
              <button className="w-full bg-primary text-background hover:bg-white text-xs font-bold tracking-widest py-2.5 rounded-sm transition-colors uppercase">
                Flag for Review
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// --- Utility Component for Metric Bars ---
function MetricBar({ label, value, isPrimary = false }: { label: string; value: number, isPrimary?: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className={cn("font-mono", isPrimary ? "text-primary font-semibold" : "text-secondary")}>
          {label}
        </span>
        <span className={cn("font-mono", isPrimary ? "text-primary font-bold" : "text-muted")}>
          {value}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-background overflow-hidden border border-border">
        <div 
          className={cn(
            "h-full transition-all duration-500",
            isPrimary ? "bg-amber-500" : "bg-muted" // Use amber to highlight the structural match severity
          )} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}