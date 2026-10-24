import React, { useState } from 'react';
import { 
  PackageCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Upload, 
  Download, 
  Printer, 
  Send, 
  Shield, 
  Sparkles,
  Check,
  Building,
  Calendar,
  X
} from 'lucide-react';
import { MonthlyCompliancePack, PackChecklistItem, SystemConfig, PackSubmissionStatus } from '../../types';
import { triggerConfetti } from '../../utils/confetti';

interface CompliancePackCompilerProps {
  pack: MonthlyCompliancePack;
  config: SystemConfig;
  onSavePack: (pack: MonthlyCompliancePack) => void;
  onBackToList: () => void;
}

export const CompliancePackCompiler: React.FC<CompliancePackCompilerProps> = ({
  pack,
  config,
  onSavePack,
  onBackToList
}) => {
  const [currentStep, setCurrentStep] = useState<number>(3); // start on completeness or scope
  const [currentPack, setCurrentPack] = useState<MonthlyCompliancePack>(pack);
  const [activeItemModal, setActiveItemModal] = useState<PackChecklistItem | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Re-calculate readiness percentage dynamically
  const totalMandatory = currentPack.checklistItems.filter(i => i.mandatory).length;
  const completedMandatory = currentPack.checklistItems.filter(i => i.mandatory && i.status === 'COMPLETED').length;
  const calculatedReadiness = totalMandatory > 0 ? Math.round((completedMandatory / totalMandatory) * 100) : 100;

  const updatePackState = (updates: Partial<MonthlyCompliancePack>) => {
    const updated = {
      ...currentPack,
      ...updates,
      readinessPercentage: calculatedReadiness
    };
    setCurrentPack(updated);
    onSavePack(updated);
  };

  const handleResolveItem = (itemId: string, status: 'COMPLETED' | 'PENDING_REVIEW', fileName?: string) => {
    const updatedItems = currentPack.checklistItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status,
          isUploaded: true,
          fileName: fileName || `${item.title.substring(0, 15).replace(/\s+/g, '_')}_Signed.pdf`,
          rejectionReason: undefined
        };
      }
      return item;
    });

    const newCompleted = updatedItems.filter(i => i.mandatory && i.status === 'COMPLETED').length;
    const newPercent = totalMandatory > 0 ? Math.round((newCompleted / totalMandatory) * 100) : 100;

    const newPack = {
      ...currentPack,
      checklistItems: updatedItems,
      readinessPercentage: newPercent,
      status: newPercent === 100 ? ('READY_FOR_SUBMISSION' as PackSubmissionStatus) : currentPack.status
    };

    setCurrentPack(newPack);
    onSavePack(newPack);
    setActiveItemModal(null);
    triggerConfetti();
  };

  const handleApproveInternal = (roleType: 'hr' | 'accounts' | 'site') => {
    const updates: Partial<MonthlyCompliancePack> = {};
    if (roleType === 'hr') updates.hrApproved = true;
    if (roleType === 'accounts') updates.accountsApproved = true;
    if (roleType === 'site') updates.siteApproved = true;

    const willBeAllApproved = 
      (roleType === 'hr' || currentPack.hrApproved) &&
      (roleType === 'accounts' || currentPack.accountsApproved) &&
      (roleType === 'site' || currentPack.siteApproved);

    if (willBeAllApproved) {
      updates.status = 'INTERNALLY_APPROVED';
      triggerConfetti();
    }

    updatePackState(updates);
  };

  const handleRecordSubmission = (subDate: string, refNo: string, ackNotes: string) => {
    const updated: MonthlyCompliancePack = {
      ...currentPack,
      submissionDate: subDate,
      referenceNumber: refNo,
      acknowledgementNotes: ackNotes,
      status: 'ACKNOWLEDGED'
    };
    setCurrentPack(updated);
    onSavePack(updated);
    triggerConfetti();
  };

  // Download CSV Checklist
  const downloadChecklistCsv = () => {
    const headers = "Item Title,Category,Mandatory,Status,Attached File\n";
    const rows = currentPack.checklistItems.map(item => {
      return `"${item.title}",${item.category},${item.mandatory ? 'Yes' : 'No'},${item.status},${item.fileName || 'N/A'}`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentPack.packCode}_Compliance_Checklist.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const steps = [
    { num: 1, label: 'Scope' },
    { num: 2, label: 'Checklist' },
    { num: 3, label: 'Completeness' },
    { num: 4, label: 'Resolve' },
    { num: 5, label: 'Review' },
    { num: 6, label: 'Readiness' },
    { num: 7, label: 'Approve' },
    { num: 8, label: 'Export' },
    { num: 9, label: 'Submit' }
  ];

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Top Breadcrumb & Progress */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToList}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Compliance Packs</span>
          </button>

          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
            {currentPack.packCode}
          </span>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-black text-white">
            {currentPack.month} {currentPack.year} • Monthly Compliance Pack
          </h2>
          <p className="text-xs text-slate-400 truncate mt-0.5">
            {currentPack.site} • {currentPack.client}
          </p>
        </div>

        {/* 9-Step Interactive Stepper Bar (Horizontal scrollable on mobile) */}
        <div className="overflow-x-auto pb-1 pt-1">
          <div className="flex items-center gap-1.5 min-w-[500px]">
            {steps.map(s => {
              const isPast = s.num < currentStep;
              const isCurrent = s.num === currentStep;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setCurrentStep(s.num)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold text-center transition-all ${
                    isCurrent
                      ? 'bg-teal-500 text-slate-950 shadow-md font-black ring-2 ring-teal-400/30'
                      : isPast
                        ? 'bg-slate-800 text-teal-400 border border-teal-500/20'
                        : 'bg-slate-850 text-slate-500 border border-slate-800'
                  }`}
                >
                  <span className="block text-[9px] opacity-75">S{s.num}</span>
                  <span className="truncate block">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP 1: Select Scope */}
      {currentStep === 1 && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white">Step 1 — Define Monthly Compliance Scope</h3>
            <span className="text-xs text-teal-400 font-mono">1 of 9</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Company / Contractor Entity</label>
              <input
                type="text"
                disabled
                value={currentPack.company}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-300 font-bold"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Principal Employer / Client</label>
              <select
                value={currentPack.client}
                onChange={(e) => updatePackState({ client: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
              >
                {config.clients.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Project & Site</label>
              <select
                value={currentPack.site}
                onChange={(e) => updatePackState({ site: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
              >
                {config.sites.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Month</label>
                <select
                  value={currentPack.month}
                  onChange={(e) => updatePackState({ month: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                >
                  {['August', 'September', 'October', 'November'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Year</label>
                <input
                  type="number"
                  value={currentPack.year}
                  onChange={(e) => updatePackState({ year: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all active:scale-95"
            >
              <span>Generate Scope Checklist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Generate Checklist */}
      {currentStep === 2 && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white">Step 2 — Generated Statutory Checklist</h3>
            <span className="text-xs text-teal-400 font-mono">2 of 9</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Based on your scope ({currentPack.client} • {currentPack.site}), the system has compiled 8 mandatory statutory compliance checks.
          </p>

          <div className="space-y-2 text-xs">
            {currentPack.checklistItems.map((item, idx) => (
              <div key={item.id} className="p-3 bg-slate-850 rounded-xl border border-slate-750 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-teal-400 font-mono font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-white block">{item.title}</span>
                    <span className="text-[10px] text-slate-400">{item.category} • {item.mandatory ? 'Mandatory' : 'Optional'}</span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-teal-400" />
              </div>
            ))}
          </div>

          <div className="pt-3 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all active:scale-95"
            >
              <span>Proceed to Completeness Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 & 4: Review Completeness & Resolve Missing Items */}
      {(currentStep === 3 || currentStep === 4) && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-white">
                  {currentStep === 3 ? 'Step 3 — Completeness Audit' : 'Step 4 — Resolve Missing Evidence'}
                </h3>
                <span className="text-xs text-slate-400">
                  Tap any item below to view audit proof or upload replacement evidence
                </span>
              </div>
              <span className="text-xs text-teal-400 font-mono">{currentStep} of 9</span>
            </div>

            {/* Checklist Items Interactive Table */}
            <div className="space-y-2.5 text-xs">
              {currentPack.checklistItems.map(item => {
                const isComplete = item.status === 'COMPLETED';
                const isMissing = item.status === 'MISSING';

                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveItemModal(item)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all active:scale-[0.99] flex items-start justify-between gap-3 ${
                      isComplete
                        ? 'bg-slate-850/90 border-slate-750 hover:border-slate-700'
                        : isMissing
                          ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400'
                          : 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg mt-0.5 flex-shrink-0 ${
                        isComplete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-white text-xs">{item.title}</h4>
                          {item.mandatory && (
                            <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded">
                              Mandatory
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          {item.fileName ? `Proof: ${item.fileName}` : 'Missing evidence file'}
                        </p>
                        {item.rejectionReason && (
                          <p className="text-[10px] text-rose-400 mt-1 italic">
                            Flag: {item.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isComplete
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 flex justify-between border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all active:scale-95"
              >
                <span>Proceed to Internal 3-Point Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Internal 3-Point Review */}
      {currentStep === 5 && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white">Step 5 — 3-Point Internal Cross Review</h3>
            <span className="text-xs text-teal-400 font-mono">5 of 9</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Statutory packs require tripartite cross-verification from HR Operations, Accounts, and Site Leadership before client submission.
          </p>

          <div className="space-y-3 text-xs">
            {/* HR Review Card */}
            <div className="p-4 bg-slate-850 rounded-2xl border border-slate-750 flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-white text-sm block">1. HR Operations Sign-off</span>
                <p className="text-[11px] text-slate-400">EPFO, ESIC returns and wage registers verified</p>
              </div>
              {currentPack.hrApproved ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" /> Signed by HR
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApproveInternal('hr')}
                  className="px-3.5 py-1.5 bg-teal-500 text-slate-950 font-bold rounded-xl"
                >
                  Approve as HR
                </button>
              )}
            </div>

            {/* Accounts Review Card */}
            <div className="p-4 bg-slate-850 rounded-2xl border border-slate-750 flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-white text-sm block">2. Accounts & Finance Sign-off</span>
                <p className="text-[11px] text-slate-400">Direct salary NEFT disbursement matched with bank advice</p>
              </div>
              {currentPack.accountsApproved ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" /> Signed by Accounts
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApproveInternal('accounts')}
                  className="px-3.5 py-1.5 bg-teal-500 text-slate-950 font-bold rounded-xl"
                >
                  Approve as Accounts
                </button>
              )}
            </div>

            {/* Site Incharge Sign-off */}
            <div className="p-4 bg-slate-850 rounded-2xl border border-slate-750 flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-white text-sm block">3. Site Leadership Sign-off</span>
                <p className="text-[11px] text-slate-400">Attendance muster roll confirmed against gate logs</p>
              </div>
              {currentPack.siteApproved ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" /> Signed by Site
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApproveInternal('site')}
                  className="px-3.5 py-1.5 bg-teal-500 text-slate-950 font-bold rounded-xl"
                >
                  Approve as Site
                </button>
              )}
            </div>
          </div>

          <div className="pt-3 flex justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(6)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all active:scale-95"
            >
              <span>Calculate Final Readiness</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6 & 7: Calculate Readiness & Prepare Pack */}
      {(currentStep === 6 || currentStep === 7) && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white">Step 6 & 7 — Readiness Score & Dossier Authorization</h3>
            <span className="text-xs text-teal-400 font-mono">{currentStep} of 9</span>
          </div>

          {/* Big Readiness Percentage Display */}
          <div className="p-6 bg-slate-850 rounded-2xl border border-slate-750 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              AUDIT COMPLIANCE READINESS INDEX
            </span>
            <div className="text-5xl font-black text-white font-mono">
              {calculatedReadiness}%
            </div>
            <div className="w-full max-w-md mx-auto h-3 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${calculatedReadiness}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">
              {calculatedReadiness === 100 
                ? 'All mandatory statutory documents verified & ready for client submission!' 
                : `${totalMandatory - completedMandatory} mandatory checklist items still require attention.`}
            </p>
          </div>

          <div className="pt-3 flex justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(8)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all active:scale-95"
            >
              <span>Generate Export Documents</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: Export Summary & PDF/CSV */}
      {currentStep === 8 && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white">Step 8 — Generate & Export Compliance Dossier</h3>
            <span className="text-xs text-teal-400 font-mono">8 of 9</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Download your print-friendly statutory compliance summary report or export the complete checklist as an audit CSV file.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setShowPrintModal(true)}
              className="p-4 bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-teal-500/50 rounded-2xl text-left transition-all active:scale-[0.99]"
            >
              <Printer className="w-6 h-6 text-teal-400 mb-2" />
              <h4 className="font-bold text-sm text-white">Print-Friendly Summary (PDF)</h4>
              <p className="text-[11px] text-slate-400 mt-1">Formatted A4 compliance dossier for client auditors</p>
            </button>

            <button
              type="button"
              onClick={downloadChecklistCsv}
              className="p-4 bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-teal-500/50 rounded-2xl text-left transition-all active:scale-[0.99]"
            >
              <Download className="w-6 h-6 text-emerald-400 mb-2" />
              <h4 className="font-bold text-sm text-white">Download CSV Checklist</h4>
              <p className="text-[11px] text-slate-400 mt-1">Structured spreadsheet with all 8 item statuses</p>
            </button>
          </div>

          <div className="pt-3 flex justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(7)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(9)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all active:scale-95"
            >
              <span>Record Client Submission Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 9: Record Submission Status */}
      {currentStep === 9 && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white">Step 9 — Record Client Submission & Acknowledgement</h3>
            <span className="text-xs text-teal-400 font-mono">9 of 9</span>
          </div>

          {/* Mandatory Disclaimer Callout */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-300">
            <strong>Submission and acknowledgement statuses are demonstration records; no actual client or government submission is performed.</strong>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Submission Date</label>
              <input
                type="date"
                defaultValue={currentPack.submissionDate || '2026-10-24'}
                id="subDateInput"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Client Inward / Reference Number</label>
              <input
                type="text"
                defaultValue={currentPack.referenceNumber || 'LT-DEL-2026-9814'}
                id="refNoInput"
                placeholder="e.g. LT-DEL-2026-9814"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Client Acknowledgement Notes</label>
              <textarea
                rows={3}
                defaultValue={currentPack.acknowledgementNotes || 'Received without audit remarks. Full compliance confirmed by Principal Employer representative.'}
                id="ackNotesInput"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(8)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                const subDate = (document.getElementById('subDateInput') as HTMLInputElement)?.value || '2026-10-24';
                const refNo = (document.getElementById('refNoInput') as HTMLInputElement)?.value || 'LT-DEL-2026-9814';
                const ackNotes = (document.getElementById('ackNotesInput') as HTMLTextAreaElement)?.value || 'Dossier accepted';
                handleRecordSubmission(subDate, refNo, ackNotes);
                onBackToList();
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Package Acknowledged</span>
            </button>
          </div>
        </div>
      )}

      {/* Item Resolution Modal */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Resolve Checklist Item</h3>
              <button onClick={() => setActiveItemModal(null)} className="p-1 text-slate-400 hover:text-white">✕</button>
            </div>

            <div>
              <h4 className="font-bold text-xs text-teal-400">{activeItemModal.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1">{activeItemModal.category} • Required for Principal Employer Compliance</p>
            </div>

            <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 text-xs space-y-1">
              <span className="text-slate-400 block text-[10px]">CURRENT PROOF ATTACHMENT</span>
              <span className="font-mono text-white block">{activeItemModal.fileName || 'No file attached'}</span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => handleResolveItem(activeItemModal.id, 'COMPLETED')}
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Attach Clean Signed Challan Proof</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Friendly Summary Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm select-none overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto border border-slate-300 flex flex-col max-h-[92vh]">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <span className="font-bold text-xs">Printable Compliance Summary Report</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-teal-500 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Print Report
                </button>
                <button onClick={() => setShowPrintModal(false)} className="p-1 text-slate-400 hover:text-white">✕</button>
              </div>
            </div>

            <div className="p-8 space-y-4 text-xs overflow-y-auto">
              <div className="border-b-2 border-slate-900 pb-3">
                <h1 className="text-xl font-black text-slate-900">SecureWave Projects Pvt. Ltd.</h1>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  MONTHLY LABOUR COMPLIANCE DOSSIER • {currentPack.month.toUpperCase()} {currentPack.year}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div><span>Client: </span><strong>{currentPack.client}</strong></div>
                <div><span>Site: </span><strong>{currentPack.site}</strong></div>
                <div><span>Dossier Code: </span><span className="font-mono">{currentPack.packCode}</span></div>
                <div><span>Readiness Score: </span><strong className="text-emerald-700">{calculatedReadiness}%</strong></div>
              </div>

              <div>
                <h3 className="font-bold text-xs uppercase border-b border-slate-300 pb-1 mb-2">Checklist Audit Summary</h3>
                <table className="w-full text-left text-[11px] border border-slate-300">
                  <thead className="bg-slate-100 font-bold">
                    <tr>
                      <th className="p-1.5">Item</th>
                      <th className="p-1.5">Category</th>
                      <th className="p-1.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentPack.checklistItems.map(item => (
                      <tr key={item.id}>
                        <td className="p-1.5 font-medium">{item.title}</td>
                        <td className="p-1.5">{item.category}</td>
                        <td className="p-1.5 font-bold text-emerald-700">✓ {item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t border-slate-300 flex justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">HR & LABOUR OFFICER</span>
                  <span className="font-bold">Authorized Signatory</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">CLIENT COMPLIANCE DESK</span>
                  <span className="font-bold">Principal Employer Stamp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
