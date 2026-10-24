import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck2, 
  ShieldAlert, 
  PackageCheck, 
  Landmark, 
  FolderKanban, 
  Smartphone, 
  Settings,
  Shield,
  RotateCcw
} from 'lucide-react';
import { NavTab } from './BottomNav';
import { DemoRole } from '../../types';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentRole: DemoRole;
  onResetDemo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  onResetDemo
}) => {
  const mainNav: Array<{ id: NavTab; title: string; icon: React.ElementType; badge?: string }> = [
    { id: 'dashboard', title: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', title: 'Employees', icon: Users },
    { id: 'attendance', title: 'Attendance', icon: CalendarCheck2 },
    { id: 'compliance', title: 'Compliance Tracker', icon: ShieldAlert },
    { id: 'packs', title: 'Monthly Packs', icon: PackageCheck, badge: 'Main' },
    { id: 'payroll', title: 'Payroll & Wages', icon: Landmark },
    { id: 'documents', title: 'Document Centre', icon: FolderKanban },
    { id: 'kyc_onboarding', title: 'Digital KYC Demo', icon: Smartphone, badge: 'Flow' },
    { id: 'settings', title: 'Master Settings', icon: Settings }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300 select-none flex-shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-sm ring-1 ring-teal-400/40">
          <Shield className="w-4 h-4 fill-slate-950" />
        </div>
        <div>
          <span className="font-extrabold text-sm tracking-tight text-white block">SecureWave</span>
          <span className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider block">
            Labour Compliance
          </span>
        </div>
      </div>

      {/* Nav List */}
      <div className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Operations Modules
        </div>

        {mainNav.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{item.title}</span>
              </div>

              {item.badge && (
                <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info & Reset */}
      <div className="p-4 border-t border-slate-800 text-xs space-y-3 bg-slate-950/40">
        <div className="p-2.5 bg-slate-850 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 block">CURRENT VIEW</span>
          <span className="font-bold text-white text-xs">{currentRole.replace('_', ' ')}</span>
        </div>

        <button
          type="button"
          onClick={onResetDemo}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </aside>
  );
};
