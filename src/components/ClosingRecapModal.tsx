import React from 'react';
import { 
  X, 
  CheckCircle2, 
  RotateCcw, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';
import { CompanyConfig } from '../types';

interface ClosingRecapModalProps {
  company: CompanyConfig;
  onClose: () => void;
  onResetDemo: () => void;
}

export const ClosingRecapModal: React.FC<ClosingRecapModalProps> = ({
  company,
  onClose,
  onResetDemo
}) => {
  const whatsappNumber = "919000000001";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi! I just experienced the digital KYC & Employee Onboarding Demo for ${company.name}. I'd love to discuss implementing this for our organization.`
  )}`;

  const matrix = [
    {
      feature: 'OTP Authentication',
      demo: 'Fixed sample code (4291) with 1-tap autofill',
      production: 'Real mobile SMS OTP with fraud detection & rate limits'
    },
    {
      feature: 'WhatsApp & SMS Dispatches',
      demo: 'Simulated in-app notification & chat bubbles',
      production: 'Direct Meta WhatsApp Business API & SMS Gateway'
    },
    {
      feature: 'Document Storage',
      demo: '100% in browser memory; zero upload to cloud',
      production: 'Private encrypted cloud storage (S3/GCS) with signed URLs'
    },
    {
      feature: 'Admin Authentication',
      demo: 'Instant role switch bar for presentations',
      production: 'SSO, 2FA, enterprise role-based access control (RBAC)'
    },
    {
      feature: 'Candidate Database',
      demo: 'Client-side storage with 1-click reset',
      production: 'High-availability multi-tenant SQL with Row-Level Security'
    },
    {
      feature: 'Statutory KYC PDF Dossier',
      demo: 'Client-side generated with DEMO watermark',
      production: 'Server-side signed PDF with official audit hash & timestamp'
    },
    {
      feature: 'Compliance Audit Trail',
      demo: 'Session audit log fed immediately by user actions',
      production: 'Immutable, tamper-evident statutory audit log'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-800 to-indigo-950 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-2xl shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
                EXECUTIVE SUMMARY & SALES RECAP
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                5-Minute Interactive KYC Portal Demo
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Key Achievements Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl">
              <span className="text-slate-400 text-[10px] block font-semibold">AVERAGE JOURNEY TIME</span>
              <span className="text-xl font-extrabold text-white mt-1 block">&lt; 4 Minutes</span>
              <p className="text-[11px] text-slate-400 mt-1">From WhatsApp invite link to approved KYC dossier</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl">
              <span className="text-slate-400 text-[10px] block font-semibold">VALIDATION FIDELITY</span>
              <span className="text-xl font-extrabold text-emerald-400 mt-1 block">100% Real-time</span>
              <p className="text-[11px] text-slate-400 mt-1">PAN, Aadhaar, bank IFSC auto-lookup & age checks</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl">
              <span className="text-slate-400 text-[10px] block font-semibold">SAFETY & ISOLATION</span>
              <span className="text-xl font-extrabold text-indigo-400 mt-1 block">Safe By Design</span>
              <p className="text-[11px] text-slate-400 mt-1">Zero network transmissions of personal records</p>
            </div>
          </div>

          {/* Demo vs Production Matrix */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">What You Experienced: Demo vs. Production System</h3>
            </div>

            <div className="border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-850 text-slate-400 border-b border-slate-800 text-[10px] uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">System Area</th>
                    <th className="py-2.5 px-3 bg-indigo-950/20 text-indigo-300">In This Demo</th>
                    <th className="py-2.5 px-3 text-emerald-400">Production Enterprise PRD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {matrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/40">
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{row.feature}</td>
                      <td className="py-2.5 px-3 text-slate-300 bg-indigo-950/10 font-mono text-[11px]">
                        {row.demo}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">
                        {row.production}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="p-5 bg-slate-850 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onResetDemo();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo for Next Meeting</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/25 active:scale-95 group"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Talk to Us on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};
