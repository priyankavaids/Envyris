import { Cpu, Monitor, User, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TripleSourceData } from '@/types/envyris';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TripleSourceIndicatorProps {
  data: TripleSourceData;
  parameter: string;
  unit: string;
  compact?: boolean;
}

export const TripleSourceIndicator = ({ data, parameter, unit, compact = false }: TripleSourceIndicatorProps) => {
  const getAlignmentStatus = () => {
    if (data.alignmentScore >= 90) return 'aligned';
    if (data.alignmentScore >= 70) return 'minor-deviation';
    return 'mismatch';
  };

  const status = getAlignmentStatus();

  const statusConfig = {
    aligned: {
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
      label: 'Sources Aligned',
    },
    'minor-deviation': {
      icon: AlertTriangle,
      color: 'text-warning',
      bg: 'bg-warning/10',
      label: 'Minor Deviation',
    },
    mismatch: {
      icon: XCircle,
      color: 'text-danger',
      bg: 'bg-danger/10',
      label: 'Source Mismatch',
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const sources = [
    { key: 'sensor', icon: Cpu, label: 'Sensor', data: data.sensor },
    { key: 'ddu', icon: Monitor, label: 'DDU', data: data.ddu },
    { key: 'manual', icon: User, label: 'Manual', data: data.manual },
  ];

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded', config.bg)}>
            <StatusIcon className={cn('w-3.5 h-3.5', config.color)} />
            <span className={cn('text-xs font-medium', config.color)}>
              {data.alignmentScore}%
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-popover border-border">
          <div className="text-xs">
            <p className="font-semibold mb-1">{parameter} - Triple Source</p>
            {sources.map(s => s.data && (
              <div key={s.key} className="flex justify-between gap-4">
                <span className="text-muted-foreground">{s.label}:</span>
                <span className="font-mono">{s.data.value} {unit}</span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className={cn('p-3 rounded-lg border', config.bg, 'border-border')}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-foreground">{parameter}</span>
        <div className="flex items-center gap-1.5">
          <StatusIcon className={cn('w-4 h-4', config.color)} />
          <span className={cn('text-xs font-medium', config.color)}>
            {config.label} ({data.alignmentScore}%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {sources.map(({ key, icon: Icon, label, data: sourceData }) => (
          <div
            key={key}
            className={cn(
              'flex flex-col items-center p-2 rounded-lg bg-secondary/50',
              sourceData?.isValid === false && 'opacity-50'
            )}
          >
            <Icon className="w-4 h-4 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="font-mono text-sm font-semibold text-foreground">
              {sourceData ? `${sourceData.value}` : '—'}
            </span>
            <span className="text-xs text-muted-foreground">{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
