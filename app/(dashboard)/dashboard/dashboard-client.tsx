// app/(dashboard)/dashboard/dashboard-client.tsx
'use client';

import { useState, useEffect } from 'react';
import { ScoutTour } from '@/components/tour/scout-tour';
import { ScoutChat } from '@/components/scout/scout-chat';  // ADD THIS
import { RotateCcw } from 'lucide-react';

export default function DashboardClient({ children }: { children: React.ReactNode }) {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenScoutTour');
    if (!hasSeenTour) {
      setTimeout(() => setShowTour(true), 500);
    }
  }, []);

  const handleTourComplete = () => {
    localStorage.setItem('hasSeenScoutTour', 'true');
    setShowTour(false);
  };

  const handleRestartTour = () => {
    localStorage.removeItem('hasSeenScoutTour');
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      {showTour && <ScoutTour onComplete={handleTourComplete} />}

      {/* Persistent Scout Chat - ALWAYS VISIBLE */}
      <ScoutChat />

      {/* Restart Tour Button (remove this later) */}
      <button
        onClick={handleRestartTour}
        className="fixed bottom-4 left-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 z-50 flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Restart Tour
      </button>

      {children}
    </div>
  );
}