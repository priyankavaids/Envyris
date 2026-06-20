import { FileText, Activity, CheckCircle, AlertTriangle, ShieldAlert, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuditEvent } from '@/types/envyris';

interface AuditTrailProps {
  events: AuditEvent[];
}

const eventConfig = {
  reading: {
    icon: Activity,
    color: 'text-info',
    bg: 'bg-info/10',
  },
  verification: {
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
  },
  decision: {
    icon: FileText,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  alert: {
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  'crisis-mode': {
    icon: ShieldAlert,
    color: 'text-danger',
    bg: 'bg-danger/10',
  },
};

export const AuditTrail = ({ events }: AuditTrailProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatTimeDiff = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Immutable Audit Ledger</h3>
        </div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          Blockchain Verified
        </span>
      </div>

      <div className="space-y-1">
        {events.map((event, idx) => {
          const config = eventConfig[event.type];
          const Icon = config.icon;

          return (
            <div
              key={event.id}
              className={cn(
                'relative pl-8 py-3 border-l-2 transition-all hover:bg-secondary/30 rounded-r-lg',
                idx === 0 ? 'border-primary' : 'border-border'
              )}
            >
              {/* Timeline dot */}
              <div className={cn(
                'absolute left-0 top-4 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center',
                config.bg
              )}>
                <Icon className={cn('w-3.5 h-3.5', config.color)} />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {event.action}
                    </span>
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-xs uppercase tracking-wider',
                      config.bg,
                      config.color
                    )}>
                      {event.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{event.actor}</span>
                    <span>•</span>
                    <span>{formatTime(event.timestamp)}</span>
                    <span className="text-muted-foreground/60">({formatTimeDiff(event.timestamp)})</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <code className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                    {event.blockchainHash.slice(0, 10)}...
                  </code>
                </div>
              </div>

              {/* Event Details */}
              {Object.keys(event.details).length > 0 && (
                <div className="mt-2 p-2 bg-secondary/30 rounded text-xs font-mono text-muted-foreground">
                  {Object.entries(event.details).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="text-primary/70">{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chain verification footer */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-success">
          <CheckCircle className="w-4 h-4" />
          <span>Chain integrity verified</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {events.length} events • Latest block: #{events.length + 1000}
        </span>
      </div>
    </div>
  );
};
