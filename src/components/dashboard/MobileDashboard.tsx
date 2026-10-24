import React from 'react';
import { 
  Users, 
  Building2, 
  CalendarCheck2, 
  Landmark, 
  ShieldAlert, 
  FileWarning, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { 
  DemoRole, 
  Employee, 
  AttendanceRecord, 
  PayrollRecord, 
  StatutoryComplianceItem, 
  DocumentItem, 
  MonthlyCompliancePack 
} from '../../types';
import { NavTab } from '../layout/BottomNav';

interface MobileDashboardProps {
  currentRole: DemoRole;
  employees: Employee[];
  attendance: AttendanceRecord[];
  payroll: PayrollRecord[];
  complianceItems: StatutoryComplianceItem[];
  documents: DocumentItem[];
  packs: MonthlyCompliancePack[];
  onNavigate: (tab: NavTab) => void;
  onOpenAddEmployee: () => void;
  onOpenCreatePack: () => void;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  currentRole,
  employees,
  attendance,
  payroll,
  complianceItems,
  documents,
  packs,
  onNavigate,
  onOpenAddEmployee,
  onOpenCreatePack
}) => {
  // Dynamic KPIs derived directly from live state
  const totalEmployees = employees.length;
  const activeSites = Array.from(new Set(employees.map(e => e.site))).length;
  const pendingAttendance = attendance.filter(a => !a.approved).length;
  const pendingPayroll = payroll.filter(p => p.status === 'PENDING_REVIEW').length;
  const outstandingCompliance = complianceItems.filter(c => c.reviewStatus !== 'APPROVED').length;
  const expiringDocs = documents.filter(d => d.status === 'EXPIRING_SOON' || d.status === 'EXPIRED').length;

  const latestPack = packs[0];

  return (
    <div className="space-y-5 pb-20 select-none">
      {/* Role Banner / Context Pill */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-850 p-4 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
            PERSPECTIVE: {currentRole.replace('_', ' ')}
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
            Operational Overview
          </h2>
        </div>
        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      {/* Two-Column Responsive KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {/* KPI 1: Total Employees */}
        <div 
          onClick={() => onNavigate('employees')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-3.5 rounded-2xl cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="text-[11px] font-medium truncate">Total Staff</span>
            <Users className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{totalEmployees}</div>
          <span className="text-[10px] text-teal-400/80 font-semibold block mt-0.5">100% Onboarded</span>
        </div>

        {/* KPI 2: Active Sites */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-3.5 rounded-2xl cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="text-[11px] font-medium truncate">Active Sites</span>
            <Building2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{activeSites}</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">All Sites Live</span>
        </div>

        {/* KPI 3: Attendance Pending Approval */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-3.5 rounded-2xl cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="text-[11px] font-medium truncate">Attd. Pending</span>
            <CalendarCheck2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-300">{pendingAttendance}</div>
          <span className="text-[10px] text-amber-400/80 font-semibold block mt-0.5">Needs Approval</span>
        </div>

        {/* KPI 4: Payroll Pending Review */}
        <div 
          onClick={() => onNavigate('payroll')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-3.5 rounded-2xl cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="text-[11px] font-medium truncate">Payroll Review</span>
            <Landmark className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-300">{pendingPayroll}</div>
          <span className="text-[10px] text-emerald-400/80 font-semibold block mt-0.5">Oct Wage Cycle</span>
        </div>

        {/* KPI 5: Outstanding Compliance */}
        <div 
          onClick={() => onNavigate('compliance')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-3.5 rounded-2xl cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="text-[11px] font-medium truncate">Compliance Flags</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-400">{outstandingCompliance}</div>
          <span className="text-[10px] text-rose-400/80 font-semibold block mt-0.5">Statutory Items</span>
        </div>

        {/* KPI 6: Expiring Documents */}
        <div 
          onClick={() => onNavigate('documents')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-3.5 rounded-2xl cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="text-[11px] font-medium truncate">Docs Expiring</span>
            <FileWarning className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-orange-300">{expiringDocs}</div>
          <span className="text-[10px] text-orange-400/80 font-semibold block mt-0.5">&lt; 30 Days</span>
        </div>
      </div>

      {/* Quick Action Buttons Strip */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide block px-1">
          Quick Actions
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={onOpenAddEmployee}
            className="flex items-center justify-center gap-2 p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-white transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Add Staff</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('attendance')}
            className="flex items-center justify-center gap-2 p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-white transition-all active:scale-95 shadow-sm"
          >
            <CalendarCheck2 className="w-4 h-4 text-amber-400" />
            <span>Mark Attendance</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('payroll')}
            className="flex items-center justify-center gap-2 p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-white transition-all active:scale-95 shadow-sm"
          >
            <Landmark className="w-4 h-4 text-emerald-400" />
            <span>Review Payroll</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreatePack}
            className="flex items-center justify-center gap-2 p-3 bg-teal-600 hover:bg-teal-500 text-slate-950 font-black rounded-xl text-xs transition-all active:scale-95 shadow-md shadow-teal-500/20"
          >
            <PackageCheck className="w-4 h-4 text-slate-950" />
            <span>Create Pack</span>
          </button>
        </div>
      </div>

      {/* Hero Monthly Compliance Pack Progress Card */}
      {latestPack && (
        <div 
          onClick={() => onNavigate('packs')}
          className="bg-slate-900 border-2 border-teal-500/40 hover:border-teal-400 rounded-2xl p-4 sm:p-5 cursor-pointer transition-all shadow-lg shadow-teal-500/5 group"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
                <PackageCheck className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                  Monthly Compliance Pack • {latestPack.month} {latestPack.year}
                </h3>
                <span className="text-[11px] text-slate-400 truncate block max-w-xs">
                  {latestPack.site}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {latestPack.status.replace('_', ' ')}
            </span>
          </div>

          <div className="pt-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Audit Dossier Readiness</span>
              <span className="font-mono font-bold text-teal-300">{latestPack.readinessPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${latestPack.readinessPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>{latestPack.checklistItems.filter(i => i.status === 'COMPLETED').length} of {latestPack.checklistItems.length} items verified</span>
              <span className="text-teal-400 font-semibold flex items-center gap-0.5">
                Complete Dossier <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Pending Action Items List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Priority Attention Items ({pendingAttendance + pendingPayroll + outstandingCompliance})</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
        </div>

        <div className="space-y-2 text-xs">
          {pendingAttendance > 0 && (
            <div 
              onClick={() => onNavigate('attendance')}
              className="p-3 bg-slate-850 hover:bg-slate-800 rounded-xl border border-slate-750 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-white block">Attendance muster requires Site Approval</span>
                  <span className="text-[11px] text-slate-400">Cyber City Metro & Highway Extension</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          )}

          {pendingPayroll > 0 && (
            <div 
              onClick={() => onNavigate('payroll')}
              className="p-3 bg-slate-850 hover:bg-slate-800 rounded-xl border border-slate-750 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-white block">{pendingPayroll} Payroll records pending review</span>
                  <span className="text-[11px] text-slate-400">Ready for Accounts Lead sign-off</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          )}

          {outstandingCompliance > 0 && (
            <div 
              onClick={() => onNavigate('compliance')}
              className="p-3 bg-slate-850 hover:bg-slate-800 rounded-xl border border-slate-750 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-white block">Statutory return filing due</span>
                  <span className="text-[11px] text-slate-400">CLRA Half-Yearly Return & Scaffolding safety logs</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
