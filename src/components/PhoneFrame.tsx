import React from 'react';
import { Wifi, Battery, Signal, Maximize2, Minimize2 } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  isFrameEnabled: boolean;
  onToggleFrame: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  isFrameEnabled,
  onToggleFrame
}) => {
  // If frame is disabled on desktop, render clean wide container
  if (!isFrameEnabled) {
    return (
      <div className="w-full max-w-2xl mx-auto h-[calc(100vh-3.5rem)] bg-slate-900 border-x border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex items-center justify-center p-0 md:p-6 lg:p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-[calc(100vh-3.5rem)] overflow-y-auto">
      {/* Smartphone Chassis Container */}
      <div className="relative w-full max-w-[400px] h-[100dvh] md:h-[840px] md:max-h-[92vh] bg-slate-950 md:rounded-[48px] shadow-none md:shadow-phone border-0 md:border-[10px] md:border-slate-800 flex flex-col overflow-hidden ring-1 md:ring-1 ring-slate-700/50">
        {/* Realistic Mobile Notch / Dynamic Island on desktop */}
        <div className="hidden md:flex absolute top-0 left-0 right-0 h-6 bg-slate-950 z-30 items-center justify-between px-7 pt-1 text-[11px] font-semibold text-slate-300 select-none">
          <span>10:45</span>
          {/* Dynamic pill island */}
          <div className="w-24 h-4 bg-black rounded-full mx-auto -mt-1 flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-900" />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-950/80" />
          </div>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-slate-300" />
            <Wifi className="w-3 h-3 text-slate-300" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">98%</span>
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Inner Phone Screen Content */}
        <div className="flex-1 flex flex-col md:pt-6 overflow-hidden bg-slate-900 relative">
          {children}

          {/* Bottom Home Indicator Line for iOS/Android frame */}
          <div className="hidden md:flex h-5 bg-slate-900 items-center justify-center select-none pointer-events-none pb-1">
            <div className="w-32 h-1 bg-slate-600/70 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
