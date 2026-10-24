import React from 'react';
import { 
  PackageCheck, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronRight, 
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { MonthlyCompliancePack, SystemConfig } from '../../types';

interface CompliancePackListProps {
  packs: MonthlyCompliancePack[];
  config: SystemConfig;
  onSelectPack: (pack: MonthlyCompliancePack) => void;
  onCreateNewPack: () => void;
}

export const CompliancePackList: React.FC<CompliancePackListProps> = ({
  packs,
  config,
  onSelectPack,
  onCreateNewPack
}) => {
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'ACKNOWLEDGED':
      case 'INTERNALLY_APPROVED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> {status.replace('_', ' ')}
          </span>
        );
      case 'READY_FOR_SUBMISSION':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 animate-pulse">
            <Sparkles className="w-3 h-3" /> Ready
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            {status.replace('_', ' ')}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-teal-400" />
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Monthly Compliance Packs
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Client & site statutory audit dossiers compiled through the 9-step guided workflow
            </p>
          </div>

          <button
            type="button"
            onClick={onCreateNewPack}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 flex-shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create New Pack</span>
          </button>
        </div>
      </div>

      {/* Packs List */}
      <div className="space-y-3">
        {packs.map(pack => (
          <div
            key={pack.id}
            onClick={() => onSelectPack(pack)}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 sm:p-5 rounded-2xl space-y-3 shadow-sm cursor-pointer transition-all active:scale-[0.99] group"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                    {pack.packCode}
                  </span>
                  <h3 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                    {pack.month} {pack.year} Compliance Dossier
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {pack.client} • {pack.site}
                </p>
              </div>

              <div>{renderStatusBadge(pack.status)}</div>
            </div>

            {/* Readiness Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Dossier Readiness</span>
                <span className="font-mono font-bold text-teal-300">{pack.readinessPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400"
                  style={{ width: `${pack.readinessPercentage}%` }}
                />
              </div>
            </div>

            {/* Footer Row */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-850 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>3-Point Sign-off:</span>
                <span className={`text-[10px] font-bold ${pack.hrApproved ? 'text-emerald-400' : 'text-slate-500'}`}>HR {pack.hrApproved ? '✓' : '—'}</span>
                <span className={`text-[10px] font-bold ${pack.accountsApproved ? 'text-emerald-400' : 'text-slate-500'}`}>Accounts {pack.accountsApproved ? '✓' : '—'}</span>
                <span className={`text-[10px] font-bold ${pack.siteApproved ? 'text-emerald-400' : 'text-slate-500'}`}>Site {pack.siteApproved ? '✓' : '—'}</span>
              </div>

              <span className="text-teal-400 font-bold flex items-center gap-0.5">
                <span>Open Pack</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
