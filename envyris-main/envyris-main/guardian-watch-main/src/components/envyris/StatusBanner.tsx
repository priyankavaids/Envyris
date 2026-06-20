import { AlertTriangle, Shield, Activity, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CrisisState } from '@/types/envyris';

interface StatusBannerProps {
  crisisState: CrisisState;
  systemTime: Date;
}

export const StatusBanner = ({ crisisState, systemTime }: StatusBannerProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div
      className={cn(
        'w-full px-6 py-3 flex items-center justify-between transition-all duration-500',
        crisisState.isActive
          ? 'bg-crisis/20 border-b-2 border-crisis'
          : 'bg-card/50 border-b border-border'
      )}
    >
      {/* Left: System Status */}
      <div className="flex items-center gap-4">
        <div className={cn(
          'flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider',
          crisisState.isActive
            ? 'bg-crisis/30 text-danger pulse-crisis'
            : 'bg-success/20 text-success'
        )}>
          {crisisState.isActive ? (
            <>
              <AlertTriangle className="w-4 h-4" />
              EMS FAILURE MODE
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              NORMAL OPERATION
            </>
          )}
        </div>

        {crisisState.isActive && crisisState.activatedAt && (
          <div className="text-sm text-muted-foreground font-mono">
            <span className="text-danger">Since: </span>
            {formatTime(crisisState.activatedAt)}
          </div>
        )}
      </div>

      {/* Center: System Title */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary pulse-live" />
        <h1 className="text-lg font-semibold tracking-wide">
          <span className="text-gradient-primary">ENVYRIS</span>
          <span className="text-muted-foreground ml-2 text-sm font-normal">GMP Crisis Management</span>
        </h1>
      </div>

      {/* Right: Time & Activity */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Activity className="w-4 h-4 text-success" />
          <span className="text-xs uppercase tracking-wide">Live Monitoring</span>
        </div>
        
        <div className="flex flex-col items-end font-mono">
          <div className="flex items-center gap-2 text-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-lg font-semibold tabular-nums">
              {formatTime(systemTime)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDate(systemTime)}
          </span>
        </div>
      </div>
    </div>
  );
};
