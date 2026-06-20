import { Clock, AlertTriangle, CheckCircle, PauseCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SafeTimeCountdown } from '@/types/envyris';

interface SafeTimeDisplayProps {
  safeTime: SafeTimeCountdown;
  compact?: boolean;
}

export const SafeTimeDisplay = ({ safeTime, compact = false }: SafeTimeDisplayProps) => {
  const hours = Math.floor(safeTime.remainingMinutes / 60);
  const minutes = safeTime.remainingMinutes % 60;
  const percentage = (safeTime.remainingMinutes / safeTime.totalMinutes) * 100;

  const getStatus = () => {
    if (safeTime.remainingMinutes > 180) return 'safe';
    if (safeTime.remainingMinutes > 60) return 'caution';
    if (safeTime.remainingMinutes > 30) return 'warning';
    return 'critical';
  };

  const status = getStatus();

  const statusConfig = {
    safe: {
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/20',
      border: 'border-success/30',
      barColor: 'bg-success',
    },
    caution: {
      icon: Clock,
      color: 'text-info',
      bg: 'bg-info/20',
      border: 'border-info/30',
      barColor: 'bg-info',
    },
    warning: {
      icon: PauseCircle,
      color: 'text-warning',
      bg: 'bg-warning/20',
      border: 'border-warning/30',
      barColor: 'bg-warning',
    },
    critical: {
      icon: XCircle,
      color: 'text-danger',
      bg: 'bg-danger/20',
      border: 'border-danger/30',
      barColor: 'bg-danger',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const recommendationLabels = {
    continue: 'CONTINUE',
    restrict: 'RESTRICT',
    stop: 'STOP',
  };

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg', config.bg, config.border, 'border')}>
        <Icon className={cn('w-4 h-4', config.color)} />
        <span className={cn('font-mono font-semibold tabular-nums', config.color)}>
          {hours}h {minutes.toString().padStart(2, '0')}m
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      'p-4 rounded-xl border',
      config.bg,
      config.border,
      status === 'critical' && 'countdown-urgent'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={cn('w-5 h-5', config.color)} />
          <span className="data-label">Safe-Time Remaining</span>
        </div>
        <div className={cn(
          'px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider',
          safeTime.recommendation === 'continue' && 'bg-success/20 text-success',
          safeTime.recommendation === 'restrict' && 'bg-warning/20 text-warning',
          safeTime.recommendation === 'stop' && 'bg-danger/20 text-danger'
        )}>
          {recommendationLabels[safeTime.recommendation]}
        </div>
      </div>

      <div className={cn('text-4xl font-mono font-bold tabular-nums mb-3', config.color)}>
        {hours}:{minutes.toString().padStart(2, '0')}
        <span className="text-lg text-muted-foreground ml-1">hrs</span>
      </div>

      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-3">
        <div
          className={cn('h-full rounded-full transition-all duration-500', config.barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>AI Confidence: {safeTime.confidenceLevel}%</span>
        <span>Base: {Math.floor(safeTime.totalMinutes / 60)}h shift</span>
      </div>

      {safeTime.riskFactors.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <AlertTriangle className="w-3 h-3" />
            Risk Factors:
          </div>
          <ul className="text-xs text-muted-foreground space-y-0.5">
            {safeTime.riskFactors.map((factor, idx) => (
              <li key={idx} className="pl-3">• {factor}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
