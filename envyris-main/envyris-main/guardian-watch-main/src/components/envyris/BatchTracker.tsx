import { Package, Clock, AlertTriangle, CheckCircle, PauseCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Batch } from '@/types/envyris';

interface BatchTrackerProps {
  batches: Batch[];
}

const statusConfig = {
  'in-progress': {
    icon: Clock,
    color: 'text-info',
    bg: 'bg-info/10',
    border: 'border-info/30',
    label: 'In Progress',
  },
  hold: {
    icon: PauseCircle,
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    label: 'On Hold',
  },
  released: {
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/30',
    label: 'Released',
  },
  quarantine: {
    icon: XCircle,
    color: 'text-danger',
    bg: 'bg-danger/10',
    border: 'border-danger/30',
    label: 'Quarantine',
  },
};

const riskColors = {
  low: 'bg-success/20 text-success',
  medium: 'bg-warning/20 text-warning',
  high: 'bg-danger/20 text-danger',
};

export const BatchTracker = ({ batches }: BatchTrackerProps) => {
  const formatExposure = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Batch Exposure Tracking</h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {batches.length} batch{batches.length !== 1 ? 'es' : ''} monitored
        </span>
      </div>

      <div className="space-y-3">
        {batches.map(batch => {
          const config = statusConfig[batch.status];
          const StatusIcon = config.icon;

          return (
            <div
              key={batch.id}
              className={cn(
                'p-4 rounded-lg border transition-all',
                config.bg,
                config.border,
                !batch.gmpCompliant && 'ring-1 ring-danger/50'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {batch.id}
                    </span>
                    {!batch.gmpCompliant && (
                      <div className="flex items-center gap-1 text-xs text-danger">
                        <AlertTriangle className="w-3 h-3" />
                        GMP Non-Compliant
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{batch.productName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{batch.lotNumber}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
                    config.bg,
                    config.color
                  )}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {config.label}
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium uppercase',
                    riskColors[batch.riskLevel]
                  )}>
                    {batch.riskLevel} risk
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Exposure: </span>
                  <span className="font-mono font-medium text-foreground">
                    {formatExposure(batch.exposureMinutes)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  Room: {batch.cleanroomId}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
