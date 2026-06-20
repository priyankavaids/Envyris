import { useState } from 'react';
import { AlertTriangle, Lock, Unlock, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CrisisToggleProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

export const CrisisToggle = ({ isActive, onToggle }: CrisisToggleProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingState, setPendingState] = useState(false);

  const handleToggleClick = () => {
    setPendingState(!isActive);
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    onToggle(pendingState);
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div className={cn(
        'flex flex-col gap-4 p-6 rounded-xl border transition-all duration-500',
        isActive
          ? 'bg-crisis/10 border-crisis glow-danger'
          : 'bg-card border-border hover:border-primary/50'
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-3 rounded-lg',
              isActive ? 'bg-crisis/20' : 'bg-primary/20'
            )}>
              <ShieldAlert className={cn(
                'w-6 h-6',
                isActive ? 'text-danger' : 'text-primary'
              )} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">EMS Failure Mode</h3>
              <p className="text-sm text-muted-foreground">
                {isActive 
                  ? 'Crisis protocols active • Batch releases locked'
                  : 'Normal operations • All systems monitored'}
              </p>
            </div>
          </div>

          <Button
            variant={isActive ? 'crisis' : 'control'}
            size="lg"
            onClick={handleToggleClick}
            className="min-w-[180px]"
          >
            {isActive ? (
              <>
                <Unlock className="w-5 h-5 mr-2" />
                DEACTIVATE
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                ACTIVATE
              </>
            )}
          </Button>
        </div>

        {isActive && (
          <div className="flex items-start gap-3 p-4 bg-crisis/10 rounded-lg border border-crisis/30 animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-danger mb-1">Active Crisis Protocols:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Automatic batch release lock engaged</li>
                <li>• QA, IT Security, and Production notified</li>
                <li>• Triple-source verification mandatory</li>
                <li>• All actions logged to blockchain audit trail</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className={cn(
                'w-5 h-5',
                pendingState ? 'text-danger' : 'text-success'
              )} />
              {pendingState ? 'Activate EMS Failure Mode?' : 'Deactivate EMS Failure Mode?'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {pendingState ? (
                <>
                  This action will:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Lock all batch releases pending QA review</li>
                    <li>Notify QA Manager, IT Security, and Production Lead</li>
                    <li>Enable mandatory triple-source verification</li>
                    <li>Create blockchain audit entry</li>
                  </ul>
                </>
              ) : (
                <>
                  Confirm that:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>EMS systems have been verified operational</li>
                    <li>All data integrity checks have passed</li>
                    <li>QA Manager has approved return to normal operations</li>
                  </ul>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={pendingState ? 'crisis' : 'success'}
              onClick={handleConfirm}
            >
              {pendingState ? 'Confirm Activation' : 'Confirm Deactivation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
