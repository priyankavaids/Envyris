import { Thermometer, Droplets, Gauge, Wind, Bug, ChevronRight, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Cleanroom } from '@/types/envyris';
import { ConfidenceMeter } from './ConfidenceMeter';
import { SafeTimeDisplay } from './SafeTimeDisplay';
import { TripleSourceIndicator } from './TripleSourceIndicator';

interface CleanroomCardProps {
  room: Cleanroom;
  onClick?: () => void;
  expanded?: boolean;
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

export const CleanroomCard = ({ room, onClick, expanded = false }: CleanroomCardProps) => {
  const statusColors = {
    normal: 'border-success/30',
    warning: 'border-warning/50',
    critical: 'border-danger/50 glow-danger',
    crisis: 'border-crisis pulse-crisis',
  };

  return (
    <div
      className={cn(
        'bg-card rounded-xl border p-5 transition-all duration-300 card-interactive cursor-pointer',
        statusColors[room.status],
        expanded && 'ring-2 ring-primary'
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'px-2.5 py-1 rounded-md text-sm font-bold border',
            gradeColors[room.grade]
          )}>
            {room.grade}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{room.name}</h3>
            <p className="text-xs text-muted-foreground font-mono">{room.id}</p>
          </div>
        </div>
        <ChevronRight className={cn(
          'w-5 h-5 text-muted-foreground transition-transform',
          expanded && 'rotate-90'
        )} />
      </div>

      {/* Confidence Score */}
      <div className="mb-4">
        <ConfidenceMeter score={room.confidenceScore} />
      </div>

      {/* Safe Time Compact */}
      <div className="mb-4">
        <SafeTimeDisplay safeTime={room.safeTime} compact />
      </div>

      {/* Parameters Quick View */}
      <div className="flex flex-wrap gap-2 mb-4">
        {room.parameters.map(param => {
          const Icon = parameterIcons[param.type];
          return (
            <TripleSourceIndicator
              key={param.id}
              data={param.tripleSource}
              parameter={param.name}
              unit={param.limits.unit}
              compact
            />
          );
        })}
      </div>

      {/* Active Batches */}
      {room.activeBatches.length > 0 && (
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <Package className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {room.activeBatches.length} active batch{room.activeBatches.length > 1 ? 'es' : ''}
          </span>
          <div className="flex gap-1 ml-auto">
            {room.activeBatches.slice(0, 2).map(batch => (
              <span key={batch} className="text-xs font-mono bg-secondary px-2 py-0.5 rounded">
                {batch}
              </span>
            ))}
            {room.activeBatches.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{room.activeBatches.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Blockchain Hash */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Last Audit Hash</span>
          <span className="hash-display">{room.lastAuditHash}</span>
        </div>
      </div>
    </div>
  );
};
