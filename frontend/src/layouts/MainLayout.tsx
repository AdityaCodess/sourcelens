import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, ScanSearch, Link2, 
  Library, Network, Code2, FileBarChart, Settings, Search 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  
  // Simple route name mapping for the top bar
  const getRouteName = (path: string) => {
    switch (path) {
      case '/': return 'Overview';
      case '/documents': return 'Documents';
      case '/matches': return 'Matches';
      case '/sources': return 'Sources';
      case '/corpus': return 'Corpus';
      case '/map': return 'Similarity Map';
      case '/code': return 'Code Analysis';
      case '/reports': return 'Reports';
      case '/settings': return 'Settings';
      default: return 'Analysis Workstation';
    }
  };

  return (
    <div className="flex h-screen w-full bg-background text-primary selection:bg-accent/20 selection:text-accent font-sans">
      
      {/* Sidebar - Professional App Navigation */}
      <aside className="w-64 border-r border-border bg-surface flex flex-col shrink-0">
        
        {/* Brand Header */}
        <div className="h-14 flex items-center px-6 border-b border-border shrink-0">
          <h1 className="text-sm font-bold tracking-widest text-primary font-mono uppercase">
            SOURCE LENS
          </h1>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto space-y-6">
          <NavGroup title="Analysis">
            <NavItem to="/" icon={LayoutDashboard} label="Overview" />
            <NavItem to="/documents" icon={FileText} label="Documents" />
            <NavItem to="/matches" icon={ScanSearch} label="Matches" />
            <NavItem to="/sources" icon={Link2} label="Sources" />
          </NavGroup>

          <NavGroup title="Corpus">
            <NavItem to="/corpus" icon={Library} label="Corpus" />
            <NavItem to="/map" icon={Network} label="Similarity Map" />
          </NavGroup>

          <NavGroup title="Tools">
            <NavItem to="/code" icon={Code2} label="Code Analysis" />
            <NavItem to="/reports" icon={FileBarChart} label="Reports" />
          </NavGroup>
        </nav>

        <div className="p-4 border-t border-border shrink-0">
          <NavItem to="/settings" icon={Settings} label="Settings" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Minimal Top Bar */}
        <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-6 shrink-0">
          <div className="text-sm font-medium text-primary tracking-wide">
            {getRouteName(location.pathname)}
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Global corpus search..." 
              className="bg-background border border-border rounded pl-9 pr-3 py-1.5 text-xs text-primary placeholder:text-muted focus:outline-none focus:border-accent w-72 font-mono transition-colors"
            />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-auto bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}

// --- Helper Components for Sidebar ---

function NavGroup({ title, children }: { title: string, children: ReactNode }) {
  return (
    <div className="px-3">
      <div className="text-[10px] font-mono text-muted uppercase tracking-wider mb-2 px-3">
        {title}
      </div>
      <div className="flex flex-col gap-0.5">
        {children}
      </div>
    </div>
  );
}

function NavItem({ to, icon: Icon, label }: { to: string, icon: any, label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors",
        isActive 
          ? "bg-surface-raised text-primary border border-border shadow-sm" 
          : "text-secondary hover:text-primary hover:bg-surface-raised/50 border border-transparent"
      )}
    >
      <Icon size={16} strokeWidth={2} />
      {label}
    </NavLink>
  );
}