import { 
  FileText, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

const RECENT_ANALYSES = [
  { id: 'DOC-9A2B', name: 'assignment_01.pdf', words: 3420, matches: 12, status: 'REVIEW REQUIRED', date: '2026-09-16 14:00' },
  { id: 'DOC-8F3A', name: 'final_report.docx', words: 8901, matches: 3, status: 'CLEAN', date: '2026-09-15 09:32' },
  { id: 'DOC-7C1D', name: 'quantum_paper.pdf', words: 12450, matches: 45, status: 'REVIEW REQUIRED', date: '2026-09-14 16:45' },
];

function MetricPanel({ label, value, icon: Icon, unit }: any) {
  return (
    <div className="p-4 border border-[#2a2d35] bg-[#16181d] rounded-lg flex items-start justify-between">
      <div>
        <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">{label}</div>
        <div className="text-2xl font-semibold text-gray-100 flex items-baseline gap-1">
          {value}
          {unit && <span className="text-sm font-normal text-gray-500">{unit}</span>}
        </div>
      </div>
      <div className="p-2 bg-[#0f1115] rounded-md border border-[#2a2d35]">
        <Icon size={16} className="text-gray-400" />
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Overview</h2>
        <p className="text-sm text-gray-400 mt-1">Project metrics and recent analysis jobs.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricPanel label="Documents Analyzed" value="142" icon={FileText} />
        <MetricPanel label="Corpus Size" value="1.2" unit="M words" icon={Database} />
        <MetricPanel label="Review Required" value="14" icon={AlertTriangle} />
        <MetricPanel label="Avg. Process Time" value="4.2" unit="sec" icon={Clock} />
      </div>

      {/* Table Section */}
      <div className="border border-[#2a2d35] bg-[#16181d] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2a2d35] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recent Analyses</h3>
          <button className="text-xs font-mono text-blue-400 hover:text-blue-300">VIEW ALL →</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0f1115] border-b border-[#2a2d35] text-xs font-mono text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">FINGERPRINT</th>
                <th className="px-5 py-3 font-medium">FILENAME</th>
                <th className="px-5 py-3 font-medium">WORDS</th>
                <th className="px-5 py-3 font-medium">FLAGGED MATCHES</th>
                <th className="px-5 py-3 font-medium">STATUS</th>
                <th className="px-5 py-3 font-medium">DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2d35]">
              {RECENT_ANALYSES.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#1e2128]/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-gray-400">{doc.id}</td>
                  <td className="px-5 py-3 text-gray-200 font-medium">{doc.name}</td>
                  <td className="px-5 py-3 text-gray-400 font-mono">{doc.words}</td>
                  <td className="px-5 py-3">
                    <span className={doc.matches > 10 ? "text-red-400 font-mono" : "text-gray-400 font-mono"}>
                      {doc.matches}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {doc.status === 'CLEAN' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={12} /> Clean
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        <AlertTriangle size={12} /> Review Required
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-500 font-mono text-xs">{doc.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}