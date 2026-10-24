import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, HelpCircle } from 'lucide-react';

interface GuidedTourProps {
  onClose: () => void;
  onNavigateRole: (role: 'employee' | 'hr') => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    title: 'Welcome: One Link, Two Sides',
    role: 'employee',
    description: 'This interactive demo allows prospective customers to experience the complete employee onboarding and KYC journey from both perspectives in under 5 minutes.'
  },
  {
    step: 2,
    title: 'Simulated WhatsApp Dispatch',
    role: 'employee',
    description: 'New hires receive an official WhatsApp welcome bubble with a secure 48-hour onboarding link. Zero app downloads required.'
  },
  {
    step: 3,
    title: 'Consent & Mobile OTP Authentication',
    role: 'employee',
    description: 'Statutory privacy notice followed by sample OTP verification (fixed code 4291) with one-tap autofill for rapid demonstration.'
  },
  {
    step: 4,
    title: 'Real-time Inline Validation & Bank Lookup',
    role: 'employee',
    description: 'Validation runs for real on PAN, Aadhaar, Age, and IFSC codes. Entering an IFSC instantly resolves the exact bank branch and headquarters!'
  },
  {
    step: 5,
    title: 'In-Memory Document Uploads & Signature Pad',
    role: 'employee',
    description: 'Attach official-looking sample documents (masked Aadhaar, cancelled cheque) with one tap, draw a digital signature on canvas, and submit.'
  },
  {
    step: 6,
    title: 'HR Verification Command Center',
    role: 'hr',
    description: 'Switch to the HR side to view real-time metrics, status breakdowns, and see your exact candidate submission waiting at the top marked NEW.'
  },
  {
    step: 7,
    title: 'Interactive Document Viewer & Correction Loop',
    role: 'hr',
    description: 'Inspect uploaded proofs with zoom, rotate, and pan. Requesting a correction dispatches a simulated WhatsApp alert to the candidate.'
  },
  {
    step: 8,
    title: 'Watermarked KYC Dossier & Live Audit Trail',
    role: 'hr',
    description: 'Once approved, download the statutory KYC dossier PDF with a prominent DEMO watermark. Every review action is logged to the live audit log.'
  }
];

export const GuidedTour: React.FC<GuidedTourProps> = ({
  onClose,
  onNavigateRole
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentStep = TOUR_STEPS[currentIdx];

  const handleNext = () => {
    if (currentIdx < TOUR_STEPS.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      onNavigateRole(TOUR_STEPS[nextIdx].role as any);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      onNavigateRole(TOUR_STEPS[prevIdx].role as any);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92vw] bg-slate-900 border-2 border-indigo-500 rounded-2xl p-5 shadow-2xl text-slate-100 select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            60-Second Guided Tour • Step {currentStep.step} of 8
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors text-xs font-semibold"
        >
          Skip Tour
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex gap-1.5 my-3">
        {TOUR_STEPS.map((s, idx) => (
          <div
            key={s.step}
            className={`h-1.5 rounded-full flex-1 transition-all ${
              idx === currentIdx ? 'bg-indigo-500' : idx < currentIdx ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Step Info */}
      <div className="space-y-1.5 my-2">
        <h4 className="text-sm font-bold text-white">{currentStep.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">{currentStep.description}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800 mt-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Previous
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
        >
          <span>{currentIdx === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
