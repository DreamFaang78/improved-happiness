import React from 'react';
import { X, BookOpen, Lightbulb, MessageSquare, Shield, CheckCircle2 } from 'lucide-react';

interface PresenterNotesProps {
  currentRole: 'employee' | 'hr';
  onClose: () => void;
}

export const PresenterNotes: React.FC<PresenterNotesProps> = ({
  currentRole,
  onClose
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full bg-slate-900/95 border-2 border-indigo-500/50 rounded-2xl shadow-2xl backdrop-blur-md text-slate-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="px-4 py-2.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Presenter Pitch Notes
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 max-h-80 overflow-y-auto text-xs">
        {currentRole === 'employee' ? (
          <>
            <div className="flex items-start gap-2 bg-indigo-950/40 border border-indigo-500/30 p-2.5 rounded-xl">
              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-indigo-300 block mb-0.5">Mobile-First WhatsApp Flow:</strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  "Notice how candidates don't need to download any mobile app. They tap the WhatsApp link, verify via OTP, and complete the 4 steps on their phone in 3 minutes."
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-slate-800/60 border border-slate-700 p-2.5 rounded-xl">
              <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block mb-0.5">Real-time Statutory Validation:</strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  "Point out the live PAN, IFSC, and Age checking. It auto-resolves the bank branch instantly and prevents invalid account numbers before submission."
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-slate-800/60 border border-slate-700 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block mb-0.5">In-Memory Zero-Leak Security:</strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  "Reassure the client that all demo files stay in the browser RAM with zero external server storage, making it safe to demo anywhere."
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start gap-2 bg-indigo-950/40 border border-indigo-500/30 p-2.5 rounded-xl">
              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-indigo-300 block mb-0.5">The 'Two-Sided' Loop Moment:</strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  "Show them their own candidate submission appearing instantly at the top of the queue marked 'YOUR SUBMISSION' without refreshing the page."
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-slate-800/60 border border-slate-700 p-2.5 rounded-xl">
              <MessageSquare className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block mb-0.5">Instant Correction Loop:</strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  "Show how requesting a document correction automatically triggers a simulated WhatsApp ping to the candidate with a 1-tap re-upload link."
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-slate-800/60 border border-slate-700 p-2.5 rounded-xl">
              <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block mb-0.5">Audit-Ready Dossier:</strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  "Demonstrate the watermarked PDF export and real-time audit log that tracks every review action and timestamp for compliance auditors."
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
