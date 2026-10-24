import React, { useState } from 'react';
import { X, User, Shield, Landmark, MapPin, Check, Save } from 'lucide-react';
import { Employee, EmploymentStatus, DocumentVerificationStatus, SystemConfig } from '../../types';
import { validatePan, validateAadhaar, validateIfsc } from '../../utils/validation';

interface EmployeeModalProps {
  employee?: Employee | null;
  config: SystemConfig;
  onSave: (employee: Employee) => void;
  onClose: () => void;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  employee,
  config,
  onSave,
  onClose
}) => {
  const isEditing = Boolean(employee);

  const [name, setName] = useState(employee?.name || '');
  const [empId, setEmpId] = useState(employee?.empId || `SW-${Math.floor(1000 + Math.random() * 9000)}`);
  const [designation, setDesignation] = useState(employee?.designation || config.designations[0]);
  const [department, setDepartment] = useState(employee?.department || 'Civil Infrastructure');
  const [site, setSite] = useState(employee?.site || config.sites[0]);
  const [project, setProject] = useState(employee?.project || config.projects[0]);
  const [contractor, setContractor] = useState(employee?.contractor || config.contractors[0]);
  const [joiningDate, setJoiningDate] = useState(employee?.joiningDate || '2026-10-01');
  const [status, setStatus] = useState<EmploymentStatus>(employee?.status || 'ACTIVE');
  const [documentStatus, setDocumentStatus] = useState<DocumentVerificationStatus>(employee?.documentStatus || 'VERIFIED');
  
  const [mobile, setMobile] = useState(employee?.mobile || '90000 00001');
  const [email, setEmail] = useState(employee?.email || 'staff.demo@securewaves.in');
  const [pan, setPan] = useState(employee?.pan || 'ABCDE1234F');
  const [aadhaar, setAadhaar] = useState(employee?.aadhaar || 'XXXX XXXX 1234');
  const [uan, setUan] = useState(employee?.uan || '100000000001');
  const [esiNo, setEsiNo] = useState(employee?.esiNo || '11000000000000001');

  const [wageType, setWageType] = useState<'DAILY' | 'MONTHLY'>(employee?.wageType || 'MONTHLY');
  const [monthlyGross, setMonthlyGross] = useState<number>(employee?.monthlyGross || 32000);
  const [dailyWage, setDailyWage] = useState<number>(employee?.dailyWage || 950);

  const [bankAccount, setBankAccount] = useState(employee?.bankAccount || '50100234891288');
  const [bankIfsc, setBankIfsc] = useState(employee?.bankIfsc || 'HDFC0001234');
  const [bankName, setBankName] = useState(employee?.bankName || 'HDFC Bank Ltd.');

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Employee name is required');
      return;
    }

    const panCheck = validatePan(pan);
    if (!panCheck.isValid) {
      setError(panCheck.message || 'Invalid PAN format');
      return;
    }

    const ifscCheck = validateIfsc(bankIfsc);
    if (!ifscCheck.isValid) {
      setError(ifscCheck.message || 'Invalid IFSC code');
      return;
    }

    const newEmp: Employee = {
      id: employee?.id || `emp-${Date.now()}`,
      empId,
      name: name.trim(),
      designation,
      department,
      site,
      project,
      contractor,
      joiningDate,
      status,
      documentStatus,
      mobile: mobile.replace(/\D/g, ''),
      email,
      pan: pan.toUpperCase().trim(),
      aadhaar,
      uan,
      esiNo,
      wageType,
      monthlyGross: wageType === 'MONTHLY' ? Number(monthlyGross) : undefined,
      dailyWage: wageType === 'DAILY' ? Number(dailyWage) : undefined,
      bankAccount,
      bankIfsc: bankIfsc.toUpperCase().trim(),
      bankName: ifscCheck.bankName || bankName
    };

    onSave(newEmp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm select-none">
      <div className="bg-slate-900 border-t sm:border border-slate-800 text-slate-100 rounded-t-3xl sm:rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-base text-white">
              {isEditing ? `Edit Staff Record (${empId})` : 'Register New Employee'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {error && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 font-semibold text-center">
              {error}
            </div>
          )}

          {/* Section 1: Basic Profile */}
          <div className="bg-slate-850/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
              1. Identity & Role
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Employee ID *</label>
                <input
                  type="text"
                  required
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Designation</label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {config.designations.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Deployment Site *</label>
                <select
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {config.sites.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Employment Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EmploymentStatus)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="ON_LEAVE">ON LEAVE</option>
                  <option value="PROBATION">PROBATION</option>
                  <option value="TERMINATED">TERMINATED</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Document Status</label>
                <select
                  value={documentStatus}
                  onChange={(e) => setDocumentStatus(e.target.value as DocumentVerificationStatus)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="EXPIRED">EXPIRED</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Statutory Identifiers */}
          <div className="bg-slate-850/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
              2. Statutory & PF/ESI
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">PAN Number *</label>
                <input
                  type="text"
                  maxLength={10}
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Aadhaar (Masked) *</label>
                <input
                  type="text"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  placeholder="XXXX XXXX 1234"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">EPFO UAN (12 digits)</label>
                <input
                  type="text"
                  maxLength={12}
                  value={uan}
                  onChange={(e) => setUan(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">ESIC Insurance IP No.</label>
                <input
                  type="text"
                  value={esiNo}
                  onChange={(e) => setEsiNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Wages & Banking */}
          <div className="bg-slate-850/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
              3. Wages & Salary Disbursement
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Wage Model</label>
                <select
                  value={wageType}
                  onChange={(e) => setWageType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="MONTHLY">Monthly Fixed Gross</option>
                  <option value="DAILY">Daily Rate Worker</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {wageType === 'MONTHLY' ? 'Monthly Gross (₹)' : 'Daily Wage Rate (₹)'}
                </label>
                <input
                  type="number"
                  value={wageType === 'MONTHLY' ? monthlyGross : dailyWage}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (wageType === 'MONTHLY') setMonthlyGross(val);
                    else setDailyWage(val);
                  }}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Bank Account Number *</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Bank IFSC *</label>
                <input
                  type="text"
                  maxLength={11}
                  value={bankIfsc}
                  onChange={(e) => {
                    const clean = e.target.value.toUpperCase();
                    setBankIfsc(clean);
                    const res = validateIfsc(clean);
                    if (res.isValid && res.bankName) setBankName(res.bankName);
                  }}
                  placeholder="e.g. HDFC0001234"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Staff Record' : 'Register Employee'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
