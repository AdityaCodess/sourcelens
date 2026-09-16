import { useState } from 'react';
import { 
  Network, SlidersHorizontal, ZoomIn, ZoomOut, 
  Maximize, FileText, Link2, Activity
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- Professional Mock Data ---
const MOCK_NODE = {
  id: "research_paper.pdf",
  fingerprint: "DOC-9A2B",
  words: 4210,
  connections: 3,
  maxSimilarity: 91.4,
  status: "REVIEW"
};

const MOCK_EDGES = [
  { target: "literature_review.docx", similarity: 91.4, type: "Semantic + Structural" },
  { target: "analysis_v1.pdf", similarity: 42.1, type: "Lexical" },
  { target: "system_design_v2.pdf", similarity: 18.5, type: "Fuzzy" }
];

export function SimilarityMap() {
  const [threshold, setThreshold] = useState(20);
  const [selectedNode, setSelectedNode] = useState(true); // Default to true to show the panel

  return (
    <div className="flex flex-col h-full w-full bg-background">
      
      {/* Toolbar */}
      <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Network size={16} className="text-secondary" />
          <h1 className="text-sm font-semibold text-primary tracking-wide">Corpus Relationship Map</h1>
          <div className="w-px h-4 bg-border mx-2"></div>
          <div className="text-xs font-mono text-muted uppercase tracking-widest">
            Nodes: 142 <span className="mx-2">•</span> Edges: 89
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Similarity Threshold Slider */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <SlidersHorizontal size={12} />
              Threshold
            </span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-32 h-1 bg-border rounded-none appearance-none cursor-pointer accent-[#56D4D0]"
            />
            <span className="text-xs font-mono text-primary w-8 text-right">&gt;{threshold}%</span>
          </div>

          <div className="w-px h-4 bg-border"></div>

          {/* Canvas Controls */}
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-secondary hover:text-primary transition-colors border border-transparent hover:border-border hover:bg-surface-raised rounded-sm"><ZoomOut size={14} /></button>
            <button className="p-1.5 text-secondary hover:text-primary transition-colors border border-transparent hover:border-border hover:bg-surface-raised rounded-sm"><ZoomIn size={14} /></button>
            <button className="p-1.5 text-secondary hover:text-primary transition-colors border border-transparent hover:border-border hover:bg-surface-raised rounded-sm"><Maximize size={14} /></button>
          </div>
        </div>
      </header>

      {/* Main Workspace Split */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        
        {/* LEFT: Network Canvas */}
        <div className="flex-1 relative bg-background overflow-hidden flex items-center justify-center">
          {/* Grid Background to emphasize technical tooling */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#E8EAF0 1px, transparent 1px), linear-gradient(90deg, #E8EAF0 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
          </div>

          {/* SVG Network Graph Mock */}
          <svg className="w-full h-full max-w-4xl max-h-[600px] overflow-visible select-none">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#555B66" />
              </marker>
            </defs>

            {/* Edges */}
            <g stroke="#24272D" strokeWidth="1.5" fill="none">
              <line x1="50%" y1="50%" x2="75%" y2="25%" markerEnd="url(#arrow)" />
              <line x1="50%" y1="50%" x2="25%" y2="30%" markerEnd="url(#arrow)" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="50%" y2="80%" markerEnd="url(#arrow)" stroke="#ef4444" strokeWidth="2" opacity="0.6" />
              <line x1="25%" y1="30%" x2="20%" y2="60%" />
            </g>

            {/* Edge Labels */}
            <g className="text-[10px] font-mono fill-secondary uppercase tracking-widest text-center" textAnchor="middle">
              <rect x="61%" y="36%" width="32" height="14" fill="#0B0C0E" rx="2" />
              <text x="62.5%" y="38.5%" fill="#8B919D">42%</text>

              <rect x="36%" y="38%" width="32" height="14" fill="#0B0C0E" rx="2" />
              <text x="37.5%" y="40.5%" fill="#8B919D">18%</text>

              <rect x="48%" y="64%" width="32" height="14" fill="#0B0C0E" rx="2" stroke="#ef4444" strokeWidth="0.5" />
              <text x="50%" y="66.5%" fill="#ef4444" fontWeight="bold">91%</text>
            </g>

            {/* Nodes */}
            {/* Center Node (Selected) */}
            <g className="cursor-pointer">
              <circle cx="50%" cy="50%" r="8" fill="#E8EAF0" stroke="#56D4D0" strokeWidth="2" />
              <circle cx="50%" cy="50%" r="14" fill="none" stroke="#56D4D0" strokeWidth="1" strokeDasharray="2 2" />
              <rect x="44%" y="53%" width="120" height="20" fill="#111318" stroke="#24272D" rx="2" />
              <text x="50%" y="56.5%" fill="#E8EAF0" className="text-xs font-mono font-medium" textAnchor="middle">research_paper.pdf</text>
            </g>

            {/* Perimeter Nodes */}
            <g className="cursor-pointer">
              <circle cx="75%" cy="25%" r="6" fill="#8B919D" />
              <text x="75%" y="29%" fill="#8B919D" className="text-[10px] font-mono" textAnchor="middle">analysis_v1.pdf</text>
            </g>
            
            <g className="cursor-pointer">
              <circle cx="25%" cy="30%" r="6" fill="#8B919D" />
              <text x="25%" y="34%" fill="#8B919D" className="text-[10px] font-mono" textAnchor="middle">system_design_v2.pdf</text>
            </g>

            <g className="cursor-pointer">
              <circle cx="50%" cy="80%" r="6" fill="#ef4444" />
              <text x="50%" y="84%" fill="#8B919D" className="text-[10px] font-mono" textAnchor="middle">literature_review.docx</text>
            </g>

            <g className="cursor-pointer">
              <circle cx="20%" cy="60%" r="4" fill="#555B66" />
              <text x="20%" y="64%" fill="#555B66" className="text-[10px] font-mono" textAnchor="middle">draft_01.txt</text>
            </g>
          </svg>
        </div>

        {/* RIGHT: Node Inspector Panel */}
        {selectedNode && (
          <div className="w-[360px] border-l border-border bg-surface flex flex-col shrink-0">
            <div className="h-12 border-b border-border flex items-center px-4 shrink-0 bg-surface-raised">
              <span className="text-[10px] font-mono text-secondary uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} />
                Node Inspector
              </span>
            </div>

            <div className="flex-1 overflow-auto p-5">
              {/* Document Overview */}
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-2">
                  <FileText size={16} className="text-muted mt-0.5" />
                  <div>
                    <h2 className="text-sm font-semibold text-primary">{MOCK_NODE.id}</h2>
                    <div className="text-[10px] text-muted font-mono mt-1 tracking-widest uppercase">
                      {MOCK_NODE.fingerprint} <span className="mx-1">•</span> {MOCK_NODE.words} WORDS
                    </div>
                  </div>
                </div>
              </div>

              {/* Node Stats */}
              <div className="grid grid-cols-2 gap-px bg-border mb-6 border border-border">
                <div className="bg-background p-3">
                  <div className="text-[10px] font-mono text-secondary uppercase tracking-widest mb-1">Connections</div>
                  <div className="text-lg font-mono font-bold text-primary">{MOCK_NODE.connections}</div>
                </div>
                <div className="bg-background p-3">
                  <div className="text-[10px] font-mono text-secondary uppercase tracking-widest mb-1">Max Overlap</div>
                  <div className="text-lg font-mono font-bold text-red-500">{MOCK_NODE.maxSimilarity}%</div>
                </div>
              </div>

              {/* Outbound Edges */}
              <div>
                <div className="text-[10px] font-mono text-secondary uppercase tracking-widest mb-3 border-b border-border pb-2">
                  Significant Relationships
                </div>
                
                <div className="space-y-2">
                  {MOCK_EDGES.map((edge, i) => (
                    <div key={i} className="p-3 border border-border bg-background rounded-sm flex flex-col gap-2 group cursor-pointer hover:border-muted transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-xs font-medium text-primary group-hover:underline">
                          <Link2 size={12} className="text-muted" />
                          {edge.target}
                        </div>
                        <span className={cn(
                          "text-xs font-mono font-bold",
                          edge.similarity > 80 ? "text-red-500" : edge.similarity > 40 ? "text-amber-500" : "text-muted"
                        )}>
                          {edge.similarity}%
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-muted uppercase tracking-widest">
                        {edge.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-8">
                <button className="w-full bg-primary text-background hover:bg-white text-xs font-bold tracking-widest py-2.5 rounded-sm transition-colors uppercase">
                  Open Document Viewer
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}