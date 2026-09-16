import { useState } from 'react';
import { 
  Search, Filter, ArrowUpDown, FileText, 
  MoreHorizontal, AlertTriangle, CheckCircle2 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- Professional Mock Data ---
const MOCK_MATCHES = [
  {
    id: "MAT-0892",
    document: "research_paper.pdf",
    type: "SEMANTIC",
    similarity: 91.4,
    source: "literature_review.docx",
    confidence: "HIGH",
    status: "REVIEW"
  },
  {
    id: "MAT-0891",
    document: "research_paper.pdf",
    type: "STRUCTURAL",
    similarity: 83.0,
    source: "literature_review.docx",
    confidence: "MEDIUM",
    status: "PENDING"
  },
  {
    id: "MAT-0885",
    document: "assignment_04.pdf",
    type: "DIRECT",
    similarity: 98.5,
    source: "system_design_v2.pdf",
    confidence: "HIGH",
    status: "REVIEW"
  },
  {
    id: "MAT-0884",
    document: "analysis_report.pdf",
    type: "FUZZY",
    similarity: 45.2,
    source: "external_wiki_dump.txt",
    confidence: "LOW",
    status: "CLEARED"
  },
  {
    id: "MAT-0879",
    document: "algorithm_test.py",
    type: "CODE AST",
    similarity: 94.1,
    source: "github_repo_snippet.py",
    confidence: "HIGH",
    status: "REVIEW"
  }
];

export function Matches() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-8 h-full flex flex-col gap-6 max-w-[1600px] mx-auto">
      
      {/* Page Header & Controls */}
      <header className="flex items-end justify-between border-b border-border pb-6 shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-primary tracking-wide">Matches</h1>
          <p className="text-sm text-secondary mt-1">System-wide registry of all flagged similarities and overlaps.</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Filters */}
          <div className="flex items-center gap-2 border-r border-border pr-4">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-border bg-surface text-xs font-mono text-secondary uppercase tracking-widest rounded-sm hover:text-primary hover:border-muted transition-colors">
              <Filter size={12} />
              Filter
            </button>
            <div className="flex bg-surface border border-border rounded-sm overflow-hidden text-xs font-mono uppercase tracking-widest">
              <button className="px-3 py-1.5 bg-surface-raised text-primary border-r border-border">ALL</button>
              <button className="px-3 py-1.5 text-secondary hover:text-primary transition-colors border-r border-border">REVIEW</button>
              <button className="px-3 py-1.5 text-secondary hover:text-primary transition-colors">CLEARED</button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Search matches by ID, document, or source..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface border border-border rounded-sm pl-9 pr-3 py-1.5 text-xs text-primary placeholder:text-muted focus:outline-none focus:border-accent w-80 font-mono transition-colors"
            />
          </div>
        </div>
      </header>

      {/* Data Table */}
      <div className="flex-1 min-h-0 border border-border bg-surface rounded-sm flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-surface-raised z-10 shadow-sm border-b border-border">
              <tr>
                <th className="px-5 py-3 text-[10px] font-mono text-secondary uppercase tracking-widest font-semibold w-24">
                  Match ID
                </th>
                <th className="px-5 py-3 text-[10px] font-mono text-secondary uppercase tracking-widest font-semibold cursor-pointer hover:text-primary">
                  <div className="flex items-center gap-1.5">Document <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-5 py-3 text-[10px] font-mono text-secondary uppercase tracking-widest font-semibold w-32">
                  Match Type
                </th>
                <th className="px-5 py-3 text-[10px] font-mono text-secondary uppercase tracking-widest font-semibold cursor-pointer hover:text-primary w-40">
                  <div className="flex items-center gap-1.5">Similarity <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-5 py-3 text-[10px] font-mono text-secondary uppercase tracking-widest font-semibold">
                  Candidate Source
                </th>
                <th className="px-5 py-3 text-[10px] font-mono text-secondary uppercase tracking-widest font-semibold w-28">
                  Confidence
                </th>
                <th className="px-5 py-3 text-[10px] font-mono text-secondary uppercase tracking-widest font-semibold w-28">
                  Status
                </th>
                <th className="px-5 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {MOCK_MATCHES.map((match) => (
                <tr key={match.id} className="hover:bg-surface-raised/50 transition-colors group cursor-pointer">
                  
                  <td className="px-5 py-3">
                    <span className="text-xs font-mono text-primary">{match.id}</span>
                  </td>
                  
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <FileText size={14} className="text-muted" />
                      {match.document}
                    </div>
                  </td>
                  
                  <td className="px-5 py-3">
                    <span className="px-1.5 py-0.5 text-[10px] font-mono border border-border bg-background text-secondary rounded-sm uppercase tracking-wide">
                      {match.type}
                    </span>
                  </td>
                  
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-primary w-10 text-right">{match.similarity}%</span>
                      <div className="h-1 w-16 bg-background border border-border rounded-none overflow-hidden">
                        <div 
                          className={cn(
                            "h-full",
                            match.similarity > 90 ? "bg-red-500" : match.similarity > 70 ? "bg-amber-500" : "bg-muted"
                          )}
                          style={{ width: `${match.similarity}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-5 py-3 text-sm text-secondary group-hover:text-primary transition-colors">
                    {match.source}
                  </td>
                  
                  <td className="px-5 py-3">
                    <span className={cn(
                      "text-[10px] font-mono font-bold uppercase tracking-widest",
                      match.confidence === "HIGH" ? "text-red-500" : match.confidence === "MEDIUM" ? "text-amber-500" : "text-secondary"
                    )}>
                      {match.confidence}
                    </span>
                  </td>
                  
                  <td className="px-5 py-3">
                    {match.status === "REVIEW" ? (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-review uppercase tracking-widest">
                        <AlertTriangle size={12} /> {match.status}
                      </div>
                    ) : match.status === "CLEARED" ? (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-clean uppercase tracking-widest">
                        <CheckCircle2 size={12} /> {match.status}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-secondary uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> {match.status}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-5 py-3 text-right">
                    <button className="text-muted hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer / Pagination */}
        <div className="h-10 border-t border-border bg-surface-raised flex items-center justify-between px-5 shrink-0 text-[10px] font-mono text-muted uppercase tracking-widest">
          <span>Showing 1-5 of 1,240 matches</span>
          <div className="flex items-center gap-4">
            <button className="hover:text-primary transition-colors disabled:opacity-50">Prev</button>
            <span>Page 1 of 248</span>
            <button className="hover:text-primary transition-colors">Next</button>
          </div>
        </div>
      </div>
      
    </div>
  );
}