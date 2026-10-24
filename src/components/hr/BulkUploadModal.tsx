import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Download, CheckCircle2, Sparkles } from 'lucide-react';
import { CandidateRecord, CompanyConfig } from '../../types';

interface BulkUploadModalProps {
  company: CompanyConfig;
  onClose: () => void;
  onAddCandidates: (candidates: CandidateRecord[]) => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  company,
  onClose,
  onAddCandidates
}) => {
  const [simulatedRows, setSimulatedRows] = useState<any[]>([
    { name: 'Karan Malhotra', phone: '90000 00013', role: 'Site Surveyor', department: 'Civil Infrastructure' },
    { name: 'Megha Singhal', phone: '90000 00014', role: 'Safety Executive', department: 'EHS Operations' },
    { name: 'Tushar Deshmukh', phone: '90000 00015', role: 'Billing Engineer', department: 'Commercial' },
    { name: 'Priya Sen', phone: '90000 00016', role: 'HR Assistant', department: 'People Operations' }
  ]);
  const [isUploaded, setIsUploaded] = useState(false);

  const downloadSampleCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8,Full Name,Mobile Number,Role,Department,PAN,Aadhaar\nKaran Malhotra,9000000013,Site Surveyor,Civil,ABCDE1234F,XXXX XXXX 1234\nMegha Singhal,9000000014,Safety Executive,EHS,FGHIJ5678K,XXXX XXXX 5678";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bulk_onboarding_sample_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateUpload = () => {
    setIsUploaded(true);
  };

  const handleImport = () => {
    const newRecords: CandidateRecord[] = simulatedRows.map((row, idx) => ({
      id: `emp-bulk-${Date.now()}-${idx}`,
      applicationNumber: `APP-2026-${Math.floor(2000 + Math.random() * 8000)}`,
      companyName: company.name,
      fullName: row.name,
      fatherName: 'Guardian Name',
      dateOfBirth: '1995-05-15',
      gender: 'Male',
      bloodGroup: 'O+',
      mobileNumber: row.phone.replace(/\D/g, ''),
      email: `${row.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      emergencyContactName: 'Guardian',
      emergencyContactRelation: 'Parent',
      emergencyContactPhone: row.phone.replace(/\D/g, ''),
      currentAddressLine1: 'Civil Camp Site 4',
      currentCity: 'Gurugram',
      currentState: 'Haryana',
      currentPincode: '122001',
      permanentSameAsCurrent: true,
      panNumber: 'ABCDE9876F',
      aadhaarNumber: 'XXXX XXXX 9876',
      bankAccountNumber: '102938475610',
      bankName: 'State Bank of India',
      ifscCode: 'SBIN0001234',
      role: row.role,
      department: row.department,
      joiningDate: '2026-11-15',
      status: 'INVITED',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      documents: []
    }));

    onAddCandidates(newRecords);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm sm:text-base">Bulk CSV Candidate Onboarding Simulation</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600">
              Upload a bulk CSV spreadsheet to dispatch digital joining invites to multiple hires simultaneously.
            </p>
            <button
              type="button"
              onClick={downloadSampleCsv}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors flex-shrink-0"
            >
              <Download className="w-3.5 h-3.5" /> Sample CSV
            </button>
          </div>

          {/* Drag & drop simulation */}
          {!isUploaded ? (
            <div 
              onClick={handleSimulateUpload}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-xs border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-500 group-hover:text-indigo-600 group-hover:scale-105 transition-all">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Click to load simulated 4-candidate batch CSV
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Supports .csv, .xlsx • Automatic duplicate checks
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">batch_onboarding_site_engineers.csv parsed successfully</span>
                </div>
                <span className="font-mono text-emerald-700 font-semibold">4 records ready</span>
              </div>

              {/* Parsed Rows Preview */}
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                {simulatedRows.map((row, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between bg-white hover:bg-slate-50">
                    <div>
                      <span className="font-bold text-slate-800">{row.name}</span>
                      <span className="text-[11px] text-slate-500 block">{row.role} • {row.department}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-600">{row.phone}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!isUploaded}
            className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-sm transition-all"
          >
            Import & Dispatch Invites
          </button>
        </div>
      </div>
    </div>
  );
};
