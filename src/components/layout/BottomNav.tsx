import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  ShieldCheck, 
  Menu
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'employees'
  | 'attendance'
  | 'compliance'
  | 'packs'
  | 'payroll'
  | 'documents'
  | 'settings'
  | 'kyc_onboarding'
  | 'kyc_portal'
  | 'more';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMore?: () => void;
  pendingApprovalsCount?: number;
  pendingBadges?: {
    attendance?: number;
    compliance?: number;
    payroll?: number;
  };
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenMore,
  pendingApprovalsCount = 0,
  pendingBadges = {}
}) => {
  const isMoreActive = [
    'packs',
    'payroll',
    'documents',
    'settings',
    'kyc_onboarding',
    'kyc_portal',
    'more'
  ].includes(activeTab);

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-40 px-2 py-1 safe-area-pb"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Dashboard */}
        <button
          id="nav-btn-dashboard"
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
            activeTab === 'dashboard'
              ? 'text-teal-400 font-semibold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
          </div>
          <span className="text-[11px] tracking-tight">Dashboard</span>
        </button>

        {/* 2. Employees */}
        <button
          id="nav-btn-employees"
          type="button"
          onClick={() => onSelectTab('employees')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
            activeTab === 'employees'
              ? 'text-teal-400 font-semibold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Users className="w-5 h-5 mb-0.5" />
          </div>
          <span className="text-[11px] tracking-tight">Employees</span>
        </button>

        {/* 3. Attendance */}
        <button
          id="nav-btn-attendance"
          type="button"
          onClick={() => onSelectTab('attendance')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
            activeTab === 'attendance'
              ? 'text-teal-400 font-semibold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <CalendarCheck className="w-5 h-5 mb-0.5" />
            {!!pendingBadges.attendance && pendingBadges.attendance > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {pendingBadges.attendance}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">Attendance</span>
        </button>

        {/* 4. Compliance */}
        <button
          id="nav-btn-compliance"
          type="button"
          onClick={() => onSelectTab('compliance')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
            activeTab === 'compliance'
              ? 'text-teal-400 font-semibold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <ShieldCheck className="w-5 h-5 mb-0.5" />
            {!!pendingBadges.compliance && pendingBadges.compliance > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {pendingBadges.compliance}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">Compliance</span>
        </button>

        {/* 5. More */}
        <button
          id="nav-btn-more"
          type="button"
          onClick={() => (onOpenMore ? onOpenMore() : onSelectTab('more'))}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
            isMoreActive
              ? 'text-teal-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Menu className="w-5 h-5 mb-0.5" />
            {!!pendingBadges.payroll && pendingBadges.payroll > 0 && (
              <span className="absolute -top-1 -right-1 bg-teal-500 text-slate-950 font-bold text-[8px] w-3 h-3 rounded-full flex items-center justify-center" />
            )}
          </div>
          <span className="text-[11px] tracking-tight">More</span>
        </button>
      </div>
    </nav>
  );
};
