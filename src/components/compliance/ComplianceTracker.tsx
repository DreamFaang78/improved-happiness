import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Upload, 
  Plus, 
  Filter, 
  ChevronRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import { StatutoryComplianceItem, SystemConfig, ComplianceReviewStatus } from '../../types';
import { triggerConfetti } from '../../utils/confetti';

interface ComplianceTrackerProps {
  items: StatutoryComplianceItem[];
  config: SystemConfig;
  onSaveItem: (item: StatutoryComplianceItem) => void;
}

export const ComplianceTracker: React.FC<ComplianceTrackerProps> = ({
  items,
  config,
  onSaveItem
}) => {
  const [selectedSite, setSelectedSite] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeItem, setActiveItem] = useState<StatutoryComplianceItem | null>(null);

  const filteredItems = items.filter(item => {
    const matchesSite = selectedSite === 'ALL' || item.site === selectedSite;
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSite && matchesCat;
  });

  const handleUpdateStatus = (item: StatutoryComplianceItem, status: ComplianceReviewStatus) => {
    const updated: StatutoryComplianceItem = {
      ...item,
      reviewStatus: status,
      evidenceStatus: status === 'APPROVED' ? 'VERIFIED' : 'UPLOADED',
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    onSaveItem(updated);
    if (status === 'APPROVED') triggerConfetti();
    setActiveItem(null);
  };

  const handleSimulateEvidence = (item: StatutoryComplianceItem) => {
    const updated: StatutoryComplianceItem = {
      ...item,
      evidenceStatus: 'UPLOADED',
      evidenceFileName: `${item.requirement.substring(0, 15).replace(/\s+/g, '_')}_Challan_Signed.pdf`,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    onSaveItem(updated);
    setActiveItem(updated);
    triggerConfetti();
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-teal-400" />
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Statutory & Labour Law Compliance Tracker
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Principal employer statutory obligations, returns filing & inspection evidence
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold text-xs rounded-xl">
              {items.filter(i => i.reviewStatus === 'APPROVED').length} / {items.length} Compliant
            </span>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Operational Sites</option>
            {config.sites.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Statutory Categories</option>
            <option value="STATUTORY_PF_ESI">EPFO & ESIC Returns</option>
            <option value="WAGE_PAYMENT">Form B & Wage Disbursements</option>
            <option value="LABOUR_REGISTERS">Form D Muster & Adult Worker Registers</option>
            <option value="CLRA_RETURNS">CLRA Half-Yearly Returns</option>
            <option value="SAFETY_PERMITS">Site Safety & Height Work Permits</option>
          </select>
        </div>
      </div>

      {/* Compliance Items List */}
      <div className="space-y-3">
        {filteredItems.map(item => {
          const isApproved = item.reviewStatus === 'APPROVED';
          const isCorrection = item.reviewStatus === 'NEEDS_CORRECTION';

          return (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl space-y-3 shadow-sm cursor-pointer transition-all active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl border flex-shrink-0 mt-0.5 ${
                    isApproved 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : isCorrection
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    {isApproved ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-white">{item.requirement}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.site} • Due: <strong className="text-slate-300 font-mono">{item.dueDate}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isApproved
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : isCorrection
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {item.reviewStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Evidence Strip */}
              <div className="flex items-center justify-between p-2.5 bg-slate-850 rounded-xl border border-slate-800 text-[11px]">
                <div className="flex items-center gap-1.5 truncate pr-2">
                  <FileText className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                  <span className="text-slate-300 truncate">
                    {item.evidenceFileName || 'Pending Proof Attachment'}
                  </span>
                </div>

                <span className="text-teal-400 font-semibold flex items-center gap-1 flex-shrink-0">
                  <span>Audit Detail</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Item Detail / Audit Review Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm select-none">
          <div className="bg-slate-900 border-t sm:border border-slate-800 text-slate-100 rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-teal-400 block">STATUTORY AUDIT FILE</span>
                <h3 className="font-bold text-sm text-white">{activeItem.requirement}</h3>
              </div>
              <button onClick={() => setActiveItem(null)} className="p-1 text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-2.5 p-3 bg-slate-850 rounded-xl border border-slate-850">
                <div>
                  <span className="text-slate-400 block text-[10px]">PRINCIPAL CLIENT</span>
                  <span className="font-bold text-slate-200">{activeItem.client}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CONTRACTOR</span>
                  <span className="font-bold text-slate-200">{activeItem.contractor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">SITE LOCATION</span>
                  <span className="text-slate-300">{activeItem.site}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">STATUTORY DUE DATE</span>
                  <span className="text-amber-400 font-mono font-bold">{activeItem.dueDate}</span>
                </div>
              </div>

              {/* Evidence Status Card */}
              <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 block text-[11px]">Audit Proof Attachment:</span>
                {activeItem.evidenceFileName ? (
                  <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-750">
                    <span className="font-mono text-teal-400">{activeItem.evidenceFileName}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Uploaded
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-400">No official challan copy uploaded yet.</p>
                    <button
                      type="button"
                      onClick={() => handleSimulateEvidence(activeItem)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-lg font-bold"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Attach Sample Official Challan Copy</span>
                    </button>
                  </div>
                )}
              </div>

              {activeItem.notes && (
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 text-slate-300">
                  <strong className="block text-[10px] text-slate-400 mb-0.5">COMPLIANCE OFFICER NOTES:</strong>
                  {activeItem.notes}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(activeItem, 'NEEDS_CORRECTION')}
                  className="px-3.5 py-2 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl"
                >
                  Flag Correction
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(activeItem, 'APPROVED')}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Approve Item</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
