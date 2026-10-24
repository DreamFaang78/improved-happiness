import React, { useState, useMemo } from 'react';
import { 
  CalendarCheck2, 
  MapPin, 
  Calendar, 
  Save, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Upload, 
  AlertCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, Employee, SystemConfig } from '../../types';
import { triggerConfetti } from '../../utils/confetti';

interface AttendanceViewProps {
  attendanceRecords: AttendanceRecord[];
  employees: Employee[];
  config: SystemConfig;
  onSaveBatch: (records: AttendanceRecord[]) => void;
  onApproveSite: (siteId: string, date: string, approver: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendanceRecords,
  employees,
  config,
  onSaveBatch,
  onApproveSite
}) => {
  const [selectedSite, setSelectedSite] = useState<string>(config.sites[0]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-24');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);

  // Filter employees assigned to this site
  const siteEmployees = useMemo(() => {
    return employees.filter(e => e.site === selectedSite);
  }, [employees, selectedSite]);

  // Current draft attendance map: employeeId -> { status, overtimeHours, approved }
  const [draftAttendance, setDraftAttendance] = useState<Record<string, { status: AttendanceStatus; overtimeHours: number; approved: boolean }>>(() => {
    const map: Record<string, { status: AttendanceStatus; overtimeHours: number; approved: boolean }> = {};
    attendanceRecords.forEach(a => {
      if (a.siteId === selectedSite && a.date === selectedDate) {
        map[a.employeeId] = { status: a.status, overtimeHours: a.overtimeHours, approved: a.approved };
      }
    });
    return map;
  });

  // Re-sync draft when site or date changes
  const handleSiteOrDateChange = (newSite: string, newDate: string) => {
    setSelectedSite(newSite);
    setSelectedDate(newDate);
    setHasUnsavedChanges(false);

    const map: Record<string, { status: AttendanceStatus; overtimeHours: number; approved: boolean }> = {};
    attendanceRecords.forEach(a => {
      if (a.siteId === newSite && a.date === newDate) {
        map[a.employeeId] = { status: a.status, overtimeHours: a.overtimeHours, approved: a.approved };
      }
    });
    setDraftAttendance(map);
  };

  const handleStatusChange = (empId: string, status: AttendanceStatus) => {
    if (isLocked) return;
    setHasUnsavedChanges(true);
    setDraftAttendance(prev => ({
      ...prev,
      [empId]: {
        status,
        overtimeHours: prev[empId]?.overtimeHours || 0,
        approved: false
      }
    }));
  };

  const handleOtChange = (empId: string, otHours: number) => {
    if (isLocked) return;
    setHasUnsavedChanges(true);
    setDraftAttendance(prev => ({
      ...prev,
      [empId]: {
        status: prev[empId]?.status || 'P',
        overtimeHours: Math.max(0, otHours),
        approved: false
      }
    }));
  };

  const handleSave = () => {
    const recordsToSave: AttendanceRecord[] = siteEmployees.map(emp => {
      const draft = draftAttendance[emp.id] || { status: 'P', overtimeHours: 0, approved: false };
      return {
        id: `att-${selectedDate}-${emp.id}`,
        date: selectedDate,
        siteId: selectedSite,
        employeeId: emp.id,
        status: draft.status,
        overtimeHours: draft.overtimeHours,
        approved: draft.approved,
        locked: isLocked,
        submittedBy: 'Site Incharge (Harish R.)'
      };
    });

    onSaveBatch(recordsToSave);
    setHasUnsavedChanges(false);
  };

  const handleApprove = () => {
    handleSave();
    onApproveSite(selectedSite, selectedDate, 'Project Manager (Vikram M.)');
    triggerConfetti();
    setIsLocked(true);
  };

  const statusOptions: Array<{ code: AttendanceStatus; label: string; activeColor: string }> = [
    { code: 'P', label: 'Present', activeColor: 'bg-emerald-600 text-white' },
    { code: 'A', label: 'Absent', activeColor: 'bg-rose-600 text-white' },
    { code: 'L', label: 'Leave', activeColor: 'bg-amber-600 text-white' },
    { code: 'WO', label: 'Weekly Off', activeColor: 'bg-blue-600 text-white' },
    { code: 'H', label: 'Holiday', activeColor: 'bg-purple-600 text-white' }
  ];

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Header and Controls */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CalendarCheck2 className="w-5 h-5 text-amber-400" />
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Daily Site Attendance Muster
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Touch-friendly muster roll recording for site incharges & contractors
            </p>
          </div>

          {/* Quick Lock / Unlock Status Indicator */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLocked(!isLocked)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isLocked
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{isLocked ? 'Period Locked' : 'Unlocked (Editable)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCsvModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-750 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-teal-400" />
              <span>Import CSV</span>
            </button>
          </div>
        </div>

        {/* Site and Date Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Select Deployment Site
            </label>
            <select
              value={selectedSite}
              onChange={(e) => handleSiteOrDateChange(e.target.value, selectedDate)}
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {config.sites.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleSiteOrDateChange(selectedSite, e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl flex items-center justify-between text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>You have unsaved muster changes for this site.</span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[11px] transition-all"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Employee Attendance List */}
      <div className="space-y-3">
        {siteEmployees.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-500 text-xs">
            No employees registered for {selectedSite}.
          </div>
        ) : (
          siteEmployees.map(emp => {
            const entry = draftAttendance[emp.id] || { status: 'P', overtimeHours: 0, approved: false };

            return (
              <div
                key={emp.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm"
              >
                {/* Employee Row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">{emp.name}</h3>
                      <span className="font-mono text-[10px] text-teal-400 bg-teal-500/10 px-1.5 py-0.2 rounded border border-teal-500/20">
                        {emp.empId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{emp.designation}</p>
                  </div>

                  {entry.approved ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Approved
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      Pending Approval
                    </span>
                  )}
                </div>

                {/* Touch-Friendly Status Buttons */}
                <div className="grid grid-cols-5 gap-1.5">
                  {statusOptions.map(opt => {
                    const isSelected = entry.status === opt.code;
                    return (
                      <button
                        key={opt.code}
                        type="button"
                        disabled={isLocked}
                        onClick={() => handleStatusChange(emp.id, opt.code)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-black transition-all active:scale-95 min-h-[44px] flex flex-col items-center justify-center ${
                          isSelected
                            ? opt.activeColor + ' ring-2 ring-white/20 shadow-md'
                            : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80'
                        }`}
                      >
                        <span className="text-sm leading-none">{opt.code}</span>
                        <span className="text-[8px] font-medium opacity-80 block mt-0.5">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Overtime Selector */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Overtime Hours</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3, 4].map(hours => (
                      <button
                        key={hours}
                        type="button"
                        disabled={isLocked}
                        onClick={() => handleOtChange(emp.id, hours)}
                        className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-colors ${
                          entry.overtimeHours === hours
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {hours}h
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="sticky bottom-16 md:bottom-4 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-800 p-3 sm:p-4 rounded-2xl flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">Muster Batch Summary</span>
          <span className="text-xs font-bold text-white">
            {siteEmployees.length} Workers • {Object.values(draftAttendance).filter(v => v.status === 'P').length} Present
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isLocked}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-750 disabled:opacity-50 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all active:scale-95"
          >
            <Save className="w-4 h-4 text-teal-400" />
            <span>Save Muster</span>
          </button>

          <button
            type="button"
            onClick={handleApprove}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-teal-500/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Approve & Lock</span>
          </button>
        </div>
      </div>

      {/* CSV Import Simulation Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-white">Simulate Biometric CSV Import</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Upload biometric punch records from site turnstiles. Automatically parses time punches and converts to muster codes.
            </p>
            <div className="p-4 border-2 border-dashed border-slate-700 rounded-xl bg-slate-850 text-center">
              <span className="text-xs text-teal-400 font-bold block">biometric_punch_log_20261024.csv</span>
              <span className="text-[10px] text-slate-400 mt-1 block">Validates 10 punches • 0 errors detected</span>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCsvModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCsvModal(false);
                  triggerConfetti();
                }}
                className="px-4 py-1.5 text-xs font-bold bg-teal-500 text-slate-950 rounded-xl"
              >
                Import Punches
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
