import React, { useState } from 'react';
import { 
  Smartphone, 
  LayoutDashboard, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Lock,
  Layers
} from 'lucide-react';
import { CompanyConfig } from '../types';

interface LandingHeroProps {
  onStartEmployee: () => void;
  onStartHr: () => void;
  onStartTour: () => void;
  activeCompany: CompanyConfig;
  onUpdateCompany: (company: CompanyConfig) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartEmployee,
  onStartHr,
  onStartTour,
  activeCompany,
  onUpdateCompany
}) => {
  const [customName, setCustomName] = useState(activeCompany.name);

  const handleApplyCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onUpdateCompany({
      ...activeCompany,
      name: customName.trim(),
      isCustom: true
    });
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6 select-none">
      <div className="max-w-4xl mx-auto w-full space-y-10">
        {/* Top Tag & Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Sales & Validation Experience</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Digital Joining & Instant KYC Verification Portal
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            One link, two sides. Experience how a candidate finishes onboarding on their phone in 3 minutes, then switch to the HR dashboard to inspect documents and approve the KYC file.
          </p>

          {/* Quick Custom Branding Form */}
          <div className="pt-2">
            <form 
              onSubmit={handleApplyCompany}
              className="inline-flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-xl max-w-md w-full mx-auto"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 w-full">
                <Building2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Enter your company name..."
                  className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-sm flex-shrink-0"
              >
                Apply
              </button>
            </form>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Currently demonstrating for: <strong className="text-slate-300">{activeCompany.name}</strong>
            </p>
          </div>
        </div>

        {/* 2-Sided Starting Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Option A: Employee Flow */}
          <div 
            onClick={onStartEmployee}
            className="group relative bg-slate-900/80 hover:bg-slate-850 border-2 border-indigo-500/30 hover:border-indigo-500 rounded-3xl p-6 cursor-pointer shadow-xl transition-all hover:scale-[1.01] flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-md">
                  <Smartphone className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Recommended First Step
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Experience as New Employee
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Start inside a mobile phone view. Experience the WhatsApp invite bubble, OTP login, live PAN/IFSC validation, document upload, and digital signature.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Simulated WhatsApp invite link & 4291 OTP</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Real format checks: PAN, Aadhaar & IFSC lookup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Interactive canvas digital signature pad</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                className="w-full py-3 px-4 bg-indigo-600 group-hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
              >
                <span>Start Employee Journey</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Option B: HR Flow */}
          <div 
            onClick={onStartHr}
            className="group relative bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 cursor-pointer shadow-xl transition-all hover:scale-[1.01] flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700 group-hover:bg-slate-700 group-hover:text-white transition-all shadow-md">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 text-[11px] font-semibold text-slate-400 bg-slate-800 rounded-full border border-slate-700">
                  Operations Portal
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Experience as HR Operations
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Jump directly to the HR dashboard with 12 seeded candidate records across all statuses. Test document zoom/rotate, approve files, or request corrections.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Interactive document viewer with zoom & rotate</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Bidirectional document correction loop with reasons</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Download watermarked statutory KYC dossier PDF</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                className="w-full py-3 px-4 bg-slate-800 group-hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all"
              >
                <span>Open HR Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Guided Tour Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-2xl gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">First Time Presenting to a Prospect?</h4>
              <p className="text-[11px] text-slate-400">
                Run our guided tour with 8 coach marks explaining key sales talking points.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onStartTour}
            className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Start 60-Second Tour</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Footer Trust Bar */}
      <div className="max-w-4xl mx-auto w-full pt-8 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500 border-t border-slate-800/80 font-mono">
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Client-Side Safe • Zero Real Data Stored</span>
        </div>
        <div>
          <span>Load time: &lt; 1.2s • Mobile Responsive (360px+) & Projector Ready</span>
        </div>
      </div>
    </div>
  );
};
