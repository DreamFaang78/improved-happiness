import React, { useState } from 'react';
import { 
  Shield, 
  RotateCcw, 
  Bell, 
  ChevronDown, 
  Sparkles, 
  Building,
  Menu,
  Check
} from 'lucide-react';
import { DemoRole } from '../../types';

interface TopHeaderProps {
  currentRole: DemoRole;
  onOpenRoleSelector: () => void;
  onResetDemo: () => void;
  onOpenNotifications: () => void;
  onToggleSidebar?: () => void;
  companyName: string;
}

const ROLE_DISPLAY_NAMES: Record<DemoRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  HR: 'HR Operations',
  ACCOUNTS: 'Accounts Lead',
  PROJECT_COORDINATOR: 'Project Coord.',
  SITE_INCHARGE: 'Site Incharge',
  EMPLOYEE: 'Employee View',
  CLIENT_VIEWER: 'Client Auditor'
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentRole,
  onOpenRoleSelector,
  onResetDemo,
  onOpenNotifications,
  onToggleSidebar,
  companyName
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const confirmReset = () => {
    onResetDemo();
    setShowResetConfirm(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-slate-100 select-none shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-2.5">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="hidden md:flex lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-sm ring-1 ring-teal-400/40">
                <Shield className="w-4 h-4 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-extrabold text-sm tracking-tight text-white">SecureWave</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    COMPLIANCE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-[130px] sm:max-w-xs mt-0.5">
                  {companyName}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Role Switcher & Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Role Switcher Pill */}
            <button
              type="button"
              onClick={onOpenRoleSelector}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-teal-500/50 rounded-xl transition-all shadow-sm active:scale-95"
              title="Change Demo Perspective / Role"
            >
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-slate-400 hidden xs:inline">Role:</span>
              <strong className="text-white font-bold">{ROLE_DISPLAY_NAMES[currentRole]}</strong>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Notifications Button */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Simulated Alerts & Messages"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400" />
            </button>

            {/* Reset Demo State Button */}
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
              title="Reset Demo Records"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
          <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <RotateCcw className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">Reset Demo Dataset?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will reset all employees, attendance muster, payroll reviews, and monthly compliance packs to the original seed state.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReset}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md transition-all"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
