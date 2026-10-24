import React, { useState } from 'react';
import { 
  Smartphone, 
  LayoutDashboard, 
  RotateCcw, 
  Sparkles, 
  ShieldAlert, 
  Building2, 
  HelpCircle, 
  BookOpen, 
  Bell, 
  MessageSquare,
  Check,
  ChevronDown,
  Monitor
} from 'lucide-react';
import { CompanyConfig, SimulatedNotification } from '../types';

interface DemoBarProps {
  currentRole: 'employee' | 'hr';
  onRoleChange: (role: 'employee' | 'hr') => void;
  onResetDemo: () => void;
  onAutofill: () => void;
  activeCompany: CompanyConfig;
  allCompanies: CompanyConfig[];
  onSelectCompany: (company: CompanyConfig) => void;
  onOpenCompanyModal: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  showPresenterNotes: boolean;
  onTogglePresenterNotes: () => void;
  onStartTour: () => void;
  notifications: SimulatedNotification[];
  onOpenNotifications: () => void;
  onOpenClosingRecap: () => void;
}

export const DemoBar: React.FC<DemoBarProps> = ({
  currentRole,
  onRoleChange,
  onResetDemo,
  onAutofill,
  activeCompany,
  allCompanies,
  onSelectCompany,
  onOpenCompanyModal,
  isPhoneFrame,
  onTogglePhoneFrame,
  showPresenterNotes,
  onTogglePresenterNotes,
  onStartTour,
  notifications,
  onOpenNotifications,
  onOpenClosingRecap
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  const confirmReset = () => {
    onResetDemo();
    setShowResetConfirm(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-200 select-none shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
          {/* Left: Brand & Company Selector */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
                SW
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white">PORTAL</span>
                  <span className="px-1.5 py-0.2 text-[10px] font-bold bg-indigo-500/20 text-indigo-400 rounded border border-indigo-500/30">
                    DEMO
                  </span>
                </div>
              </div>
            </div>

            <div className="h-5 w-px bg-slate-800 hidden sm:block" />

            {/* Company Personalization Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 border border-slate-700 transition-colors"
                title="Change Company Name & Branding"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="max-w-[120px] sm:max-w-[180px] truncate">{activeCompany.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showCompanyDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    Select Demonstration Company
                  </div>
                  {allCompanies.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onSelectCompany(c);
                        setShowCompanyDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-700 flex items-center justify-between transition-colors"
                    >
                      <div className="truncate pr-2">
                        <div className="font-semibold text-slate-200 truncate">{c.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{c.tagline}</div>
                      </div>
                      {c.id === activeCompany.id && (
                        <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                  <div className="p-2 border-t border-slate-700">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCompanyDropdown(false);
                        onOpenCompanyModal();
                      }}
                      className="w-full py-1.5 text-center text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                    >
                      + Customize Your Company
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center: Primary Role Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => onRoleChange('employee')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentRole === 'employee'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Employee Flow</span>
            </button>

            <button
              type="button"
              onClick={() => onRoleChange('hr')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentRole === 'hr'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>HR Dashboard</span>
            </button>
          </div>

          {/* Right: Quick Actions & Tools */}
          <div className="flex items-center gap-1.5">
            {/* Autofill sample button */}
            <button
              type="button"
              onClick={onAutofill}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg transition-colors"
              title="Populate current form with fictional valid details"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Autofill Form</span>
            </button>

            {/* Desktop Device Frame Toggle (if employee role) */}
            {currentRole === 'employee' && (
              <button
                type="button"
                onClick={onTogglePhoneFrame}
                className="hidden md:flex p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title={isPhoneFrame ? "Expand to Full Browser Width" : "Switch to Mobile Phone Bezel"}
              >
                {isPhoneFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              </button>
            )}

            {/* Notification Bell */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Simulated WhatsApp & SMS Dispatches"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            {/* Presenter Talking Points toggle */}
            <button
              type="button"
              onClick={onTogglePresenterNotes}
              className={`p-2 rounded-lg transition-colors ${
                showPresenterNotes
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Toggle Presenter Notes & Talking Points"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* 60s Tour */}
            <button
              type="button"
              onClick={onStartTour}
              className="hidden sm:flex items-center gap-1 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs font-medium"
              title="Take a 60-second guided tour"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span className="hidden xl:inline">Tour</span>
            </button>

            {/* Safety badge button */}
            <button
              type="button"
              onClick={() => setShowSafetyModal(true)}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sample Data Only</span>
            </button>

            {/* Reset Demo button */}
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset Demo to Original Seeds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Recap / Summary */}
            <button
              type="button"
              onClick={onOpenClosingRecap}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm ml-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Recap</span>
            </button>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 mb-2">
              <RotateCcw className="w-5 h-5" />
              <h3 className="font-bold text-base">Reset Demo Data?</h3>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              This will restore the 12 default fictional candidates, reset candidate submissions, and clear local browser state in one tap.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReset}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-colors shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safe by Design Informational Modal */}
      {showSafetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white text-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">Safe by Design Architecture</h3>
            </div>
            <div className="text-xs text-slate-600 space-y-2 mb-5 leading-relaxed">
              <p>
                <strong>1. 100% Client-Side Isolation:</strong> No typed names, bank details, or uploaded documents are ever transmitted over the network or saved to an external database.
              </p>
              <p>
                <strong>2. In-Memory File Handling:</strong> All attached images and PDFs stay strictly in your browser's RAM and disappear upon page reload.
              </p>
              <p>
                <strong>3. Fictional Identities Only:</strong> All pre-seeded Aadhaar, PAN, and phone records are mathematically valid format simulations with clearly marked sample tags.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowSafetyModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
