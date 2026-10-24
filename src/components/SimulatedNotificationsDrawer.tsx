import React from 'react';
import { X, Bell, MessageSquare, ExternalLink, CheckCheck, Smartphone } from 'lucide-react';
import { SimulatedNotification } from '../types';

interface SimulatedNotificationsDrawerProps {
  notifications: SimulatedNotification[];
  onClose: () => void;
  onOpenEmployeeFlow: () => void;
}

export const SimulatedNotificationsDrawer: React.FC<SimulatedNotificationsDrawerProps> = ({
  notifications,
  onClose,
  onOpenEmployeeFlow
}) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm select-none">
      <div className="bg-slate-900 border-l border-slate-800 text-slate-100 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">Simulated Messaging Center</h3>
              <p className="text-[11px] text-slate-400">
                Automated WhatsApp & SMS dispatches across the candidate journey
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No messages dispatched yet.
            </div>
          ) : (
            notifications.map(item => (
              <div
                key={item.id}
                className="bg-slate-800/90 border border-slate-750 hover:border-slate-700 p-4 rounded-2xl space-y-2 shadow-sm transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {item.channel}
                    </span>
                    <span className="font-semibold text-slate-300">{item.recipientName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                </div>

                <h4 className="text-xs font-bold text-white pt-1">{item.title}</h4>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-750 font-sans">
                  {item.message}
                </p>

                {item.link && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenEmployeeFlow();
                      onClose();
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 pt-1 transition-colors"
                  >
                    <span>Open in Employee View</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 text-center text-[11px] text-slate-400 font-mono">
          Safe Mode • Zero real SMS/WhatsApp charges incurred
        </div>
      </div>
    </div>
  );
};
