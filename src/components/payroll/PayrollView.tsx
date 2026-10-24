import React, { useState } from 'react';
import { 
  Landmark, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  FileText,
  DollarSign,
  X
} from 'lucide-react';
import { PayrollRecord, Employee, PayrollStatus } from '../../types';
import { triggerConfetti } from '../../utils/confetti';

interface PayrollViewProps {
  payrollRecords: PayrollRecord[];
  employees: Employee[];
  onUpdateStatus: (id: string, status: PayrollStatus, reviewer?: string, remarks?: string) => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  payrollRecords,
  employees,
  onUpdateStatus
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedPayslip, setSelectedPayslip] = useState<{ record: PayrollRecord; employee: Employee } | null>(null);
  const [returnModalId, setReturnModalId] = useState<string | null>(null);
  const [returnRemarks, setReturnRemarks] = useState('');

  // Total summary calculation
  const totalGross = payrollRecords.reduce((sum, p) => sum + p.grossEarnings, 0);
  const totalNet = payrollRecords.reduce((sum, p) => sum + p.netPayable, 0);
  const totalPf = payrollRecords.reduce((sum, p) => sum + p.pfDeduction, 0);
  const totalEsi = payrollRecords.reduce((sum, p) => sum + p.esiDeduction, 0);

  const getEmployee = (empId: string): Employee | undefined => {
    return employees.find(e => e.id === empId);
  };

  const handleApprove = (id: string) => {
    onUpdateStatus(id, 'APPROVED', 'Accounts Lead (Sunil K.)');
    triggerConfetti();
  };

  const handleReturn = () => {
    if (!returnModalId) return;
    onUpdateStatus(returnModalId, 'RETURNED', 'Accounts Lead (Sunil K.)', returnRemarks);
    setReturnModalId(null);
    setReturnRemarks('');
  };

  // CSV Export
  const downloadCsv = () => {
    const headers = "Employee ID,Name,Month,Present Days,Basic Pay,Allowances,Overtime Pay,Gross Earnings,PF Deduction,ESI Deduction,Total Deductions,Net Payable,Status\n";
    const rows = payrollRecords.map(p => {
      const emp = getEmployee(p.employeeId);
      return `${emp?.empId || ''},"${emp?.name || ''}",${p.month},${p.presentDays},${p.basicPay},${p.hraAndAllowances},${p.overtimePay},${p.grossEarnings},${p.pfDeduction},${p.esiDeduction},${p.totalDeductions},${p.netPayable},${p.status}`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Monthly_Payroll_Register_October2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStatusBadge = (status: PayrollStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
      case 'RETURNED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3" /> Returned
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Top Banner and Summary */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Monthly Payroll & Wage Review
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Wage disbursement register with statutory PF & ESI calculation breakdown
            </p>
          </div>

          <button
            type="button"
            onClick={downloadCsv}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 flex-shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export Bank CSV</span>
          </button>
        </div>

        {/* Aggregated Totals Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Net Payable</span>
            <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">
              ₹{totalNet.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Gross Wages</span>
            <span className="text-lg font-black text-white font-mono mt-0.5 block">
              ₹{totalGross.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total PF Contribution</span>
            <span className="text-lg font-black text-teal-400 font-mono mt-0.5 block">
              ₹{totalPf.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total ESIC Premium</span>
            <span className="text-lg font-black text-blue-400 font-mono mt-0.5 block">
              ₹{totalEsi.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Statutory Disclaimer Banner */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 font-medium">
        <strong>DEMO ONLY — NOT VALIDATED FOR ACTUAL SALARY PAYMENTS OR STATUTORY FILING.</strong> Calculations are illustrative representations designed for process validation.
      </div>

      {/* Employee Payroll List */}
      <div className="space-y-3">
        {payrollRecords.map(record => {
          const emp = getEmployee(record.employeeId);
          const isExpanded = expandedId === record.id;

          return (
            <div
              key={record.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              {/* Header / Summary Card */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : record.id)}
                className="p-4 cursor-pointer hover:bg-slate-850/50 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">{emp?.name || 'Staff Member'}</h3>
                      <span className="font-mono text-[10px] text-teal-400 bg-teal-500/10 px-1.5 py-0.2 rounded border border-teal-500/20">
                        {emp?.empId}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{emp?.designation} • {record.month}</span>
                  </div>

                  <div className="text-right">
                    {renderStatusBadge(record.status)}
                  </div>
                </div>

                {/* Net Payable Hero Pill */}
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                      Net Salary Disbursement
                    </span>
                    <span className="text-xl font-black text-emerald-300 font-mono">
                      ₹{record.netPayable.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">
                      {record.presentDays} Days • {record.overtimeHours}h OT
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Breakdown Drawer */}
              {isExpanded && (
                <div className="p-4 bg-slate-950/60 border-t border-slate-850 space-y-3 text-xs animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Column 1: Gross Earnings */}
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block pb-1 border-b border-slate-800">
                        Gross Earnings (₹{record.grossEarnings.toLocaleString('en-IN')})
                      </span>
                      <div className="flex justify-between text-slate-300">
                        <span>Basic Pay:</span>
                        <span className="font-mono">₹{record.basicPay.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>HRA & Allowances:</span>
                        <span className="font-mono">₹{record.hraAndAllowances.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Overtime Pay:</span>
                        <span className="font-mono">₹{record.overtimePay.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Column 2: Statutory Deductions */}
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block pb-1 border-b border-slate-800">
                        Deductions (₹{record.totalDeductions.toLocaleString('en-IN')})
                      </span>
                      <div className="flex justify-between text-slate-300">
                        <span>PF Employee (12%):</span>
                        <span className="font-mono text-rose-400">-₹{record.pfDeduction.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>ESIC Premium (0.75%):</span>
                        <span className="font-mono text-rose-400">-₹{record.esiDeduction.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Other Deductions/PT:</span>
                        <span className="font-mono text-rose-400">-₹{record.otherDeductions}</span>
                      </div>
                    </div>
                  </div>

                  {record.remarks && (
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                      <strong>Remarks: </strong> {record.remarks}
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-850">
                    <button
                      type="button"
                      onClick={() => emp && setSelectedPayslip({ record, employee: emp })}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold"
                    >
                      <Printer className="w-3.5 h-3.5 text-teal-400" />
                      <span>Print Demo Payslip</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setReturnModalId(record.id)}
                        className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition-all"
                      >
                        Return for Changes
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApprove(record.id)}
                        className="flex items-center gap-1 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Salary</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Return for Changes Modal */}
      {returnModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-white">Return Payroll for Correction</h3>
            <p className="text-xs text-slate-400">Specify reason for timekeeper to reconcile attendance or wage calculation.</p>
            <textarea
              rows={3}
              value={returnRemarks}
              onChange={(e) => setReturnRemarks(e.target.value)}
              placeholder="e.g. Overtime hours mismatch with site gate log..."
              className="w-full text-xs p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReturnModalId(null)}
                className="px-3 py-1.5 text-xs text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReturn}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl"
              >
                Return Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Payslip Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm select-none overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-auto border border-slate-300 flex flex-col max-h-[92vh]">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-sm">Demo Employee Payslip</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 text-xs font-bold bg-teal-500 text-slate-950 rounded-lg"
                >
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPayslip(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Body */}
            <div className="p-6 space-y-4 text-xs overflow-y-auto">
              <div className="border-b border-slate-300 pb-3 text-center">
                <h2 className="text-lg font-black text-slate-900">SecureWave Projects Pvt. Ltd.</h2>
                <p className="text-[11px] text-slate-500">PAYSLIP FOR THE MONTH OF {selectedPayslip.record.month.toUpperCase()}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">EMPLOYEE NAME</span>
                  <span className="font-bold text-slate-800">{selectedPayslip.employee.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">EMPLOYEE ID</span>
                  <span className="font-mono font-bold text-slate-800">{selectedPayslip.employee.empId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">DESIGNATION</span>
                  <span className="text-slate-700">{selectedPayslip.employee.designation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">DAYS WORKED</span>
                  <span className="font-mono font-bold">{selectedPayslip.record.presentDays} Days</span>
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold border-b border-slate-300 text-[10px] uppercase">
                    <tr>
                      <th className="p-2">Earnings</th>
                      <th className="p-2 text-right">Amount (₹)</th>
                      <th className="p-2">Deductions</th>
                      <th className="p-2 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    <tr>
                      <td className="p-2">Basic Wage</td>
                      <td className="p-2 text-right">{selectedPayslip.record.basicPay.toLocaleString('en-IN')}</td>
                      <td className="p-2">EPF (12%)</td>
                      <td className="p-2 text-right">{selectedPayslip.record.pfDeduction.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="p-2">Allowances</td>
                      <td className="p-2 text-right">{selectedPayslip.record.hraAndAllowances.toLocaleString('en-IN')}</td>
                      <td className="p-2">ESIC (0.75%)</td>
                      <td className="p-2 text-right">{selectedPayslip.record.esiDeduction.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="p-2">Overtime</td>
                      <td className="p-2 text-right">{selectedPayslip.record.overtimePay.toLocaleString('en-IN')}</td>
                      <td className="p-2">Other/LWF</td>
                      <td className="p-2 text-right">{selectedPayslip.record.otherDeductions}</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold text-xs text-slate-900 border-t border-slate-300">
                      <td className="p-2">Gross Earnings</td>
                      <td className="p-2 text-right">₹{selectedPayslip.record.grossEarnings.toLocaleString('en-IN')}</td>
                      <td className="p-2">Total Deductions</td>
                      <td className="p-2 text-right text-rose-600">₹{selectedPayslip.record.totalDeductions.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between font-mono">
                <span className="font-bold text-emerald-900 text-xs">NET TAKE-HOME SALARY</span>
                <span className="text-base font-black text-emerald-700">₹{selectedPayslip.record.netPayable.toLocaleString('en-IN')}</span>
              </div>

              <div className="p-2 bg-slate-100 rounded text-center text-[9px] text-slate-500 font-mono">
                DEMO ONLY — NOT VALIDATED FOR ACTUAL SALARY DISBURSEMENTS OR STATUTORY COMPLIANCE FILINGS
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
