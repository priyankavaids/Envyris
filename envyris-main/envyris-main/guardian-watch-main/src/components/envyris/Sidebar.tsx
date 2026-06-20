import { 
  LayoutDashboard, 
  Building2, 
  Package, 
  FileText, 
  Shield, 
  Settings,
  Activity,
  Database,
  Leaf,
  GitCompare
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TabId = 'dashboard' | 'rooms' | 'batches' | 'audit' | 'matrix' | 'tsr' | 'settings';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  crisisMode: boolean;
}

const navItems = [
  { id: 'dashboard' as TabId, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'rooms' as TabId, icon: Building2, label: 'Cleanrooms' },
  { id: 'batches' as TabId, icon: Package, label: 'Batches' },
  { id: 'audit' as TabId, icon: FileText, label: 'Audit Trail' },
  { id: 'matrix' as TabId, icon: Shield, label: 'Risk Matrix' },
  { id: 'tsr' as TabId, icon: GitCompare, label: 'TSR Engine' },
];

export const Sidebar = ({ activeTab, onTabChange, crisisMode }: SidebarProps) => {
  return (
    <div className={cn(
      'w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col',
      crisisMode && 'border-crisis/50'
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-bold text-gradient-primary">ENVYRIS</h1>
            <p className="text-xs text-muted-foreground">v2.4.1</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
              activeTab === item.id
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            )}
          >
            <item.icon className={cn(
              'w-5 h-5',
              activeTab === item.id ? 'text-primary' : 'text-muted-foreground'
            )} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer Stats */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="flex items-center gap-3 px-4 py-2 bg-sidebar-accent/50 rounded-lg">
          <Database className="w-4 h-4 text-primary" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Blockchain Sync</p>
            <p className="text-sm font-mono text-foreground">Block #1,247,892</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-success/10 rounded-lg">
          <Leaf className="w-4 h-4 text-success" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Carbon Offset</p>
            <p className="text-sm font-mono text-success">-12.4 kg CO₂ today</p>
          </div>
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent/50 transition-all">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </div>
  );
};
