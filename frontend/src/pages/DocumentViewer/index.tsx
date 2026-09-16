import { useState } from 'react';
import { 
  FileText, Link2, AlertTriangle, Activity, 
  ChevronLeft, ChevronRight, Search, LayoutTemplate 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- Generic, Professional Mock Data ---
const MOCK_DOCUMENT = {
  title: "research_paper.pdf",
  fingerprint: "DOC-8F3A-91CD",
  words: 4210,
  pages: 14,
};

const MOCK_MATCHES = [
  {
    id: "MATCH-001",
    classification: "PARAPHRASE",
    confidence: "HIGH",
    text: "The proposed architecture distributes computational tasks across multiple isolated nodes to mitigate latency.",
    metrics: { composite: 91.4, lexical: 42, semantic: 94, structural: 83 },
    evidence: "High semantic and structural similarity despite moderate word-level overlap. The underlying syntax tree matches the candidate source.",
    source: { name: "literature_review.docx", type: "LOCAL_CORPUS", matchType: "Semantic + Structural" },
    color: "text-amber-500",
    bgHover: "hover:bg-amber-500/10",
    bgActive: "bg-amber-500/20 border-amber-500/50"
  },
  {
    id: "MATCH-002",
    classification: "DIRECT MATCH",
    confidence: "HIGH",
    text: "Data redundancy is maintained through synchronous replication across distinct availability zones.",
    metrics: { composite: 98.0, lexical: 96, semantic: 99, structural: 100 },
    evidence: "Near-exact string match. 12/13 tokens overlap identically in the same sequence.",
    source: { name: "system_design_v2.pdf", type: "EXTERNAL", matchType: "Lexical Overlap" },
    color: "text-red-500",
    bgHover: "hover:bg-red-500/10",
    bgActive: "bg-red-500/20 border-red-500/50"
  }
];

export function DocumentViewer() {
  const [activeMatch, setActiveMatch] = useState<typeof MOCK_MATCHES[0] | null>(MOCK_MATCHES[0]);

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      
      {/* LEFT PANEL: Document Workspace */}
      <div className="flex-1 flex flex-col border-r border-border min-w-0">
        
        {/* Document Toolbar */}
        <div className="h-12 border-b border-border bg-surface flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary font-medium text-sm">
              <FileText size={16} className="text-muted" />
              {MOCK_DOCUMENT.title}
            </div>
            <div className="w-px h-4 bg-border"></div>
            <div className="text-xs font-mono text-muted tracking-wider">
              {MOCK_DOCUMENT.fingerprint}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-secondary font-mono">
            <div className="flex items-center gap-2">
              <button className="p-1 hover:text-primary transition-colors"><ChevronLeft size={14} /></button>
              <span>PAGE 3 / {MOCK_DOCUMENT.pages}</span>
              <button className="p-1 hover:text-primary transition-colors"><ChevronRight size={14} /></button>
            </div>
            <div className="w-px h-4 bg-border"></div>
            <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Search size={12} /> FIND
            </button>
          </div>
        </div>

        {/* Document Text Area */}
        <div className="flex-1 overflow-auto p-12 bg-[#0B0C0E]">
          <div className="max-w-3xl mx-auto text-[#E8EAF0] leading-loose text-[15px] font-sans tracking-wide space-y-6">
            <p>
              Modern distributed systems require robust mechanisms for fault tolerance and high availability. 
              Traditional monolithic databases struggle to scale horizontally, leading to the adoption of microservice-based data grids.
            </p>
            <p>
              In addressing these performance bottlenecks, the system must balance consistency with partition tolerance. 
              <span 
                onClick={() => setActiveMatch(MOCK_MATCHES[0])}
                className={cn(
                  "cursor-pointer rounded-sm px-1 py-0.5 mx-0.5 transition-all border-b",
                  activeMatch?.id === MOCK_MATCHES[0].id 
                    ? MOCK_MATCHES[0].bgActive 
                    : `border-amber-500/30 border-dashed ${MOCK_MATCHES[0].bgHover}`
                )}
              >
                {MOCK_MATCHES[0].text}
              </span> 
              This ensures that localized failures do not cascade into global outages.
            </p>
            <p>
              Furthermore, disaster recovery protocols must be integrated at the infrastructural layer. 
              <span 
                onClick={() => setActiveMatch(MOCK_MATCHES[1])}
                className={cn(
                  "cursor-pointer rounded-sm px-1 py-0.5 mx-0.5 transition-all border-b",
                  activeMatch?.id === MOCK_MATCHES[1].id 
                    ? MOCK_MATCHES[1].bgActive 
                    : `border-red-500/30 border-dashed ${MOCK_MATCHES[1].bgHover}`
                )}
              >
                {MOCK_MATCHES[1].text}
              </span> 
              Without these guarantees, data integrity during a network partition cannot be mathematically proven.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Evidence & Analysis */}
      <div className="w-[420px] bg-surface flex flex-col shrink-0">
        
        {/* Panel Header */}
        <div className="h-12 border-b border-border flex items-center px-5 shrink-0 bg-surface-raised">
          <span className="text-xs font-mono text-secondary uppercase tracking-widest flex items-center gap-2">
            <LayoutTemplate size={14} />
            Match Analysis
          </span>
        </div>

        {activeMatch ? (
          <div className="flex-1 overflow-auto p-5 space-y-6">
            
            {/* Match Identifier & Status */}
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[10px] text-muted font-mono mb-1 tracking-widest uppercase">Match Identifier</div>
                <div className="text-lg font-mono font-bold text-primary">{activeMatch.id}</div>
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <span className={cn(
                  "px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded-sm font-mono border",
                  activeMatch.confidence === "HIGH" 
                    ? "bg-red-500/10 text-red-500 border-red-500/20" 
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                )}>
                  {activeMatch.confidence} CONFIDENCE
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded-sm font-mono border bg-background text-secondary border-border">
                  {activeMatch.classification}
                </span>
              </div>
            </div>

            {/* Metrics Visualization */}
            <div className="pt-4 border-t border-border">
              <div className="text-[10px] text-muted font-mono mb-4 tracking-widest uppercase">Similarity Breakdown</div>
              <div className="space-y-4">
                <MetricBar label="Composite Score" value={activeMatch.metrics.composite} isPrimary />
                <MetricBar label="Lexical (Overlap)" value={activeMatch.metrics.lexical} />
                <MetricBar label="Semantic (Meaning)" value={activeMatch.metrics.semantic} />
                <MetricBar label="Structural (Syntax)" value={activeMatch.metrics.structural} />
              </div>
            </div>

            {/* Explanatory Evidence */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted mb-3 tracking-widest uppercase">
                <Activity size={12} />
                Analysis Evidence
              </div>
              <div className="bg-background border border-border p-3 rounded-sm">
                <p className="text-xs text-primary leading-relaxed font-sans">
                  {activeMatch.evidence}
                </p>
              </div>
            </div>

            {/* Candidate Source */}
            <div className="pt-4 border-t border-border">
              <div className="text-[10px] text-muted font-mono mb-3 tracking-widest uppercase">Candidate Source</div>
              <div className="border border-border rounded-sm p-3 bg-background group cursor-pointer hover:border-muted transition-colors">
                <div className="flex items-start gap-3">
                  <Link2 size={14} className="text-secondary mt-0.5 group-hover:text-primary transition-colors" />
                  <div>
                    <div className="text-sm font-medium text-primary group-hover:underline">
                      {activeMatch.source.name}
                    </div>
                    <div className="text-[10px] text-muted mt-1.5 flex items-center gap-2 font-mono uppercase tracking-wide">
                      <span className="px-1.5 py-0.5 bg-surface rounded-sm border border-border">
                        {activeMatch.source.type}
                      </span>
                      <span>•</span>
                      <span>{activeMatch.source.matchType}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 flex gap-3">
              <button className="flex-1 bg-primary text-background hover:bg-white text-xs font-bold tracking-wide py-2.5 rounded-sm transition-colors uppercase">
                Compare Passages
              </button>
              <button className="flex-1 border border-border text-primary hover:bg-surface-raised text-xs font-bold tracking-wide py-2.5 rounded-sm transition-colors uppercase">
                View Source
              </button>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted">
            <AlertTriangle size={24} className="mb-4 opacity-50" />
            <p className="text-xs font-mono uppercase tracking-widest">Select a highlighted passage<br/>to view analysis</p>
          </div>
        )}
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
            isPrimary ? "bg-[#56D4D0]" : "bg-muted" // Accent color for primary, muted for others
          )} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}