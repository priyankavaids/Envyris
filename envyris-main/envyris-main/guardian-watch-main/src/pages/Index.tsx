import { useState, useEffect, useRef } from 'react';
import { StatusBanner } from '@/components/envyris/StatusBanner';
import { Sidebar } from '@/components/envyris/Sidebar';
import { CrisisToggle } from '@/components/envyris/CrisisToggle';
import { CleanroomCard } from '@/components/envyris/CleanroomCard';
import { sendResendEmail } from '@/lib/resend';
import { toast } from '@/hooks/use-toast';
import { CleanroomDetail } from '@/components/envyris/CleanroomDetail';
import { BatchTracker } from '@/components/envyris/BatchTracker';
import { AuditTrail } from '@/components/envyris/AuditTrail';
import { CriticalParameterMatrix } from '@/components/envyris/CriticalParameterMatrix';
import { TripleSourceRealityCheck } from '@/components/envyris/TripleSourceRealityCheck';
import { mockCleanrooms, mockBatches, mockAuditEvents } from '@/data/mockData';
import { CrisisState, Cleanroom } from '@/types/envyris';
import { cn } from '@/lib/utils';

type TabId = 'dashboard' | 'rooms' | 'batches' | 'audit' | 'matrix' | 'tsr' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [systemTime, setSystemTime] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState<Cleanroom | null>(null);
  const [crisisState, setCrisisState] = useState<CrisisState>({
    isActive: false,
    activatedAt: null,
    activatedBy: null,
    reason: null,
    affectedRooms: [],
    batchesOnHold: [],
  });
  const alertEmailSentRef = useRef(false);

  // Update system time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (crisisState.isActive && !alertEmailSentRef.current) {
      alertEmailSentRef.current = true;

      const subject = 'Envyris Alert: Crisis Mode Activated';
      const body = [
        `Crisis mode was activated at ${crisisState.activatedAt?.toISOString() ?? 'unknown time'}.`,
        `Activated by: ${crisisState.activatedBy ?? 'system'}.`,
        `Reason: ${crisisState.reason ?? 'Not specified'}.`,
        `Affected rooms: ${crisisState.affectedRooms.join(', ') || 'none'}.`,
        `Batches on hold: ${crisisState.batchesOnHold.join(', ') || 'none'}.`,
      ].join('\n');

      const statusToast = toast({
        title: 'Sending alert email',
        description: 'Dispatching Envyris crisis alert to your notification recipients.',
      });

      sendEmail({
        to: import.meta.env.VITE_ALERT_RECIPIENT_EMAIL ?? 'alerts@envyris.app',
        subject,
        text: body,
      })
        .then(() => {
          statusToast.update({
            title: 'Alert email sent',
            description: 'The Envyris crisis notification was delivered successfully.',
          });
        })
        .catch(error => {
          statusToast.update({
            title: 'Alert email failed',
            description: `Failed to send alert: ${error.message}`,
          });
          console.error('Failed to send Envyris alert email:', error);
        });
    }

    if (!crisisState.isActive) {
      alertEmailSentRef.current = false;
    }
  }, [crisisState.isActive, crisisState.activatedAt, crisisState.activatedBy, crisisState.reason, crisisState.affectedRooms, crisisState.batchesOnHold]);

  const handleCrisisToggle = (active: boolean) => {
    setCrisisState({
      isActive: active,
      activatedAt: active ? new Date() : null,
      activatedBy: active ? 'QA-MGR-Williams' : null,
      reason: active ? 'Manual activation - EMS integrity concern' : null,
      affectedRooms: active ? mockCleanrooms.map(r => r.id) : [],
      batchesOnHold: active ? mockBatches.filter(b => b.status === 'in-progress').map(b => b.id) : [],
    });
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Crisis Toggle */}
      <CrisisToggle isActive={crisisState.isActive} onToggle={handleCrisisToggle} />

      {/* Cleanroom Grid */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Cleanroom Status</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockCleanrooms.map(room => (
            <CleanroomCard
              key={room.id}
              room={room}
              onClick={() => setSelectedRoom(room)}
              expanded={selectedRoom?.id === room.id}
            />
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <BatchTracker batches={mockBatches} />
        <AuditTrail events={mockAuditEvents} />
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">All Cleanrooms</h2>
        <div className="space-y-4">
          {mockCleanrooms.map(room => (
            <CleanroomCard
              key={room.id}
              room={room}
              onClick={() => setSelectedRoom(room)}
              expanded={selectedRoom?.id === room.id}
            />
          ))}
        </div>
      </div>
      {selectedRoom && (
        <CleanroomDetail room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </div>
  );

  const renderBatches = () => (
    <div className="space-y-6">
      <BatchTracker batches={mockBatches} />
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-6">
      <AuditTrail events={mockAuditEvents} />
    </div>
  );

  const renderMatrix = () => (
    <div className="space-y-6">
      <CriticalParameterMatrix />
    </div>
  );

  const renderTSR = () => (
    <div className="space-y-6">
      <TripleSourceRealityCheck />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'rooms':
        return renderRooms();
      case 'batches':
        return renderBatches();
      case 'audit':
        return renderAudit();
      case 'matrix':
        return renderMatrix();
      case 'tsr':
        return renderTSR();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className={cn(
      'min-h-screen bg-background flex flex-col',
      crisisState.isActive && 'crisis-active'
    )}>
      {/* Top Banner */}
      <StatusBanner crisisState={crisisState} systemTime={systemTime} />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          crisisMode={crisisState.isActive}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 grid-pattern">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
