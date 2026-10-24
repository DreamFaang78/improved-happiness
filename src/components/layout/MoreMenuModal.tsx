import React from 'react';
import { 
  X, 
  PackageCheck, 
  Landmark, 
  FolderKanban, 
  Smartphone, 
  Settings, 
  RotateCcw, 
  ChevronRight,
  Shield,
  FileSpreadsheet
} from 'lucide-react';
import { NavTab } from './BottomNav';

interface MoreMenuModalProps {
  onSelectTab: (tab: NavTab) => void;
  onClose: () => void;
  onResetDemo: () => void;
}

export const MoreMenuModal: React.FC<MoreMenuModalProps> = ({
  onSelectTab,
  onClose,
  onResetDemo
}) => {
  const menuItems: Array<{
    id: NavTab;
    title: string;
    description: string;
    badge?: string;
    icon: React.ElementType;
    color: string;
  }> = [
    {
      id: 'packs',
      title: 'Monthly Compliance Packs',
      description: '9-step guided contractor & client compliance dossier compiler',
      badge: 'Main Feature',
      icon: PackageCheck,
      color: 'text-teal-400 bg-teal-500/20 border-teal-500/30'
    },
    {
      id: 'payroll',
      title: 'Payroll & Wage Review',
      description: 'Monthly salary registers, gross wages, PF/ESI deductions & payslips',
      icon: Landmark,
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
    },
    {
      id: 'documents',
      title: 'Document Centre',
      description: 'Centralized repository of labour licenses, ECR challans and permits',
      icon: FolderKanban,
      color: 'text-blue-400 bg-blue-500/20 border-blue-500/30'
    },
    {
      id: 'kyc_onboarding',
      title: 'New Hire KYC Onboarding',
      description: 'Launch mobile-first candidate WhatsApp invite & digital verification loop',
      badge: 'Interactive',
      icon: Smartphone,
      color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30'
    },
    {
      id: 'settings',
      title: 'Settings & Master Data',
      description: 'Configure sample sites, projects, contractors and designations',
      icon: Settings,
      color: 'text-slate-400 bg-slate-800 border-slate-700'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm select-none">
      <div className="bg-slate-900 border-t sm:border border-slate-800 text-slate-100 rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-base text-white">More Modules & Tools</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Modules */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1 text-xs">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className="p-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-750 hover:border-slate-700 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border flex-shrink-0 ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                        {item.title}
                      </h4>
                      {item.badge && (
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors flex-shrink-0" />
              </div>
            );
          })}
        </div>

        {/* Footer Quick Reset Action */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              onResetDemo();
              onClose();
            }}
            className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo to Seed State</span>
          </button>

          <span className="text-[10px] text-slate-500 font-mono">v2.0 Mobile Enterprise</span>
        </div>
      </div>
    </div>
  );
};
