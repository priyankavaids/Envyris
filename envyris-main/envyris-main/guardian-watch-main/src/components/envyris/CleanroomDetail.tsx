import { X, Thermometer, Droplets, Gauge, Wind, Bug, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Cleanroom } from '@/types/envyris';
import { Button } from '@/components/ui/button';
import { ConfidenceMeter } from './ConfidenceMeter';
import { SafeTimeDisplay } from './SafeTimeDisplay';
import { TripleSourceIndicator } from './TripleSourceIndicator';

interface CleanroomDetailProps {
  room: Cleanroom;
  onClose: () => void;
}

const parameterIcons = {
  temperature: Thermometer,
  humidity: Droplets,
  pressure: Gauge,
  particles: Wind,
  microbiology: Bug,
};

const gradeColors = {
  A: 'bg-primary/20 text-primary border-primary/30',
  B: 'bg-info/20 text-info border-info/30',
  C: 'bg-warning/20 text-warning border-warning/30',
  D: 'bg-muted text-muted-foreground border-border',
};

export const CleanroomDetail = ({ room, onClose }: CleanroomDetailProps) => {
  const getTrend = (param: typeof room.parameters[0]) => {
    const sensor = param.tripleSource.sensor?.value ?? 0;
    const mid = (param.limits.max + param.limits.min) / 2;
    const diff = sensor - mid;
    const range = param.limits.max - param.limits.min;
    const percentFromMid = (diff / range) * 100;

    if (Math.abs(percentFromMid) < 5) return { icon: Minus, color: 'text-muted-foreground', label: 'Stable' };
    if (percentFromMid > 0) return { icon: TrendingUp, color: 'text-warning', label: 'Trending High' };
    return { icon: TrendingDown, color: 'text-info', label: 'Trending Low' };
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            'px-3 py-1.5 rounded-lg text-lg font-bold border',
            gradeColors[room.grade]
          )}>
            Grade {room.grade}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{room.name}</h2>
            <p className="text-sm text-muted-foreground font-mono">{room.id}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/30 rounded-xl p-4">
          <ConfidenceMeter score={room.confidenceScore} size="lg" />
        </div>
        <SafeTimeDisplay safeTime={room.safeTime} />
      </div>

      {/* Parameters Detail */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Environmental Parameters
        </h3>
        
        <div className="grid gap-3">
          {room.parameters.map(param => {
            const Icon = parameterIcons[param.type];
            const trend = getTrend(param);
            const TrendIcon = trend.icon;
            const sensorValue = param.tripleSource.sensor?.value ?? 0;
            const isInRange = sensorValue >= param.limits.min && sensorValue <= param.limits.max;

            return (
              <div key={param.id} className="bg-secondary/20 rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{param.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Limits: {param.limits.min}–{param.limits.max} {param.limits.unit}</span>
                        <span className={cn('flex items-center gap-1', trend.color)}>
                          <TrendIcon className="w-3 h-3" />
                          {trend.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    'px-3 py-1 rounded-full text-sm font-semibold',
                    isInRange
                      ? 'bg-success/20 text-success'
                      : 'bg-danger/20 text-danger'
                  )}>
                    {isInRange ? 'IN SPEC' : 'OUT OF SPEC'}
                  </div>
                </div>

                <TripleSourceIndicator
                  data={param.tripleSource}
                  parameter={param.name}
                  unit={param.limits.unit}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Trail */}
      <div className="bg-secondary/20 rounded-xl p-4 border border-border">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
          Blockchain Audit Reference
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last verified hash:</span>
          <code className="text-xs font-mono bg-background px-3 py-1 rounded border border-border">
            {room.lastAuditHash}
          </code>
        </div>
      </div>
    </div>
  );
};
