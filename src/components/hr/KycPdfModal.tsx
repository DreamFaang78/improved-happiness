import React from 'react';
import { X, Download, Printer, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { CandidateRecord, CompanyConfig } from '../../types';

interface KycPdfModalProps {
  candidate: CandidateRecord;
  company: CompanyConfig;
  onClose: () => void;
}

export const KycPdfModal: React.FC<KycPdfModalProps> = ({
  candidate,
  company,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[95vh]">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">KYC Verification Dossier</h3>
              <p className="text-xs text-slate-400">
                Application: <span className="font-mono text-indigo-300">{candidate.applicationNumber}</span> • {candidate.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable A4 Dossier Document */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-slate-100 flex-1 flex justify-center">
          <div 
            id="kyc-printable-dossier"
            className="relative bg-white w-full max-w-[800px] p-8 sm:p-12 shadow-md border border-slate-300 rounded-sm text-slate-800 overflow-hidden"
            style={{ minHeight: '1050px' }}
          >
            {/* Bold Diagonal Watermark */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none z-10 overflow-hidden opacity-10">
              <div className="text-red-600 font-extrabold text-5xl sm:text-7xl font-sans tracking-widest transform -rotate-45 whitespace-nowrap border-8 border-red-600 py-6 px-16">
                DEMO ONLY • NOT FOR OFFICIAL USE
              </div>
            </div>

            {/* Document Header */}
            <div className="border-b-2 border-slate-800 pb-6 mb-6 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  STATUTORY EMPLOYEE ONBOARDING KYC RECORD
                </span>
                <h1 className="text-2xl font-bold text-slate-900 mt-2">{company.name}</h1>
                <p className="text-xs text-slate-500">{company.tagline}</p>
                <p className="text-xs text-slate-500 mt-1">CIN / Registration: U45200DL2021PTC384912 • ISO 27001 Certified</p>
              </div>

              {/* Photo & Status */}
              <div className="text-right flex flex-col items-end">
                <div className="w-24 h-28 border border-slate-400 bg-slate-50 rounded overflow-hidden flex items-center justify-center shadow-sm">
                  {candidate.documents.find(d => d.type === 'photograph')?.fileDataUrl ? (
                    <img
                      src={candidate.documents.find(d => d.type === 'photograph')?.fileDataUrl}
                      alt="Candidate"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium text-center p-2">Applicant Photo</span>
                  )}
                </div>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> KYC VERIFIED
                </span>
              </div>
            </div>

            {/* Meta Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs mb-6 font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">APPLICATION NO.</span>
                <span className="font-bold text-slate-900">{candidate.applicationNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">DESIGNATION / ROLE</span>
                <span className="font-bold text-slate-900">{candidate.role || 'Staff Engineer'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">SUBMISSION DATE</span>
                <span className="font-bold text-slate-900">{candidate.submittedAt || candidate.createdAt}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">VERIFICATION STAMP</span>
                <span className="font-bold text-emerald-600">PASS (100% MATCH)</span>
              </div>
            </div>

            {/* Section 1: Personal & Identity Information */}
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-200 px-3 py-1.5 rounded mb-3">
                1. Personal & Contact Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Full Name (as per PAN/Aadhaar):</span>
                  <span className="font-semibold text-slate-800">{candidate.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Father's / Guardian's Name:</span>
                  <span className="font-semibold text-slate-800">{candidate.fatherName || 'Ramesh Sharma'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date of Birth / Age:</span>
                  <span className="font-semibold text-slate-800">{candidate.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Gender:</span>
                  <span className="font-semibold text-slate-800">{candidate.gender || 'Male'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Blood Group:</span>
                  <span className="font-semibold text-slate-800">{candidate.bloodGroup || 'B+'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Mobile Number:</span>
                  <span className="font-semibold text-slate-800 font-mono">+91 {candidate.mobileNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Email Address:</span>
                  <span className="font-semibold text-slate-800">{candidate.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Emergency Contact:</span>
                  <span className="font-semibold text-slate-800">
                    {candidate.emergencyContactName} ({candidate.emergencyContactRelation}) - {candidate.emergencyContactPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Address Information */}
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-200 px-3 py-1.5 rounded mb-3">
                2. Residential Address Record
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 border border-slate-200 rounded-lg bg-white">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Current Residential Address</span>
                  <p className="font-medium text-slate-800 leading-relaxed">
                    {candidate.currentAddressLine1} {candidate.currentAddressLine2}<br />
                    {candidate.currentCity}, {candidate.currentState} - <span className="font-mono">{candidate.currentPincode}</span>
                  </p>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg bg-white">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Permanent Residential Address</span>
                  <p className="font-medium text-slate-800 leading-relaxed">
                    {candidate.permanentSameAsCurrent ? (
                      <span className="text-slate-500 italic">Same as current address</span>
                    ) : (
                      <>
                        {candidate.permanentAddressLine1} {candidate.permanentAddressLine2}<br />
                        {candidate.permanentCity}, {candidate.permanentState} - <span className="font-mono">{candidate.permanentPincode}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Statutory & Banking Identifiers */}
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-200 px-3 py-1.5 rounded mb-3">
                3. Statutory & Direct Benefit Transfer (Banking) Identifiers
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] text-slate-500 block">PAN NUMBER</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{candidate.panNumber}</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">✓ Verified Active</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] text-slate-500 block">AADHAAR (MASKED)</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{candidate.aadhaarNumber}</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">✓ UIDAI Format Match</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] text-slate-500 block">EPFO UAN</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{candidate.uanNumber || '100000000001'}</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">✓ Statutory Compliant</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] text-slate-500 block">ESIC NUMBER</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{candidate.esicNumber || '11000000000000001'}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Primary Member</span>
                </div>
              </div>

              <div className="mt-3 p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-500 block text-[10px]">BANK NAME & BRANCH</span>
                  <span className="font-bold text-slate-900">{candidate.bankName}</span>
                  <span className="text-[11px] text-slate-600 block">{candidate.bankBranch || 'Commercial Branch'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ACCOUNT NUMBER</span>
                  <span className="font-mono font-bold text-slate-900">{candidate.bankAccountNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">RTGS / NEFT IFSC CODE</span>
                  <span className="font-mono font-bold text-indigo-700">{candidate.ifscCode}</span>
                </div>
              </div>
            </div>

            {/* Section 4: Document Verification Log */}
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-200 px-3 py-1.5 rounded mb-3">
                4. Document Verification & Audit Checklist
              </h2>
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="p-2 border-b border-slate-200">Document Type</th>
                    <th className="p-2 border-b border-slate-200">File Reference</th>
                    <th className="p-2 border-b border-slate-200">Verification Status</th>
                    <th className="p-2 border-b border-slate-200">Audit Date & Verifier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {candidate.documents.map(doc => (
                    <tr key={doc.id}>
                      <td className="p-2 font-medium text-slate-900">{doc.title}</td>
                      <td className="p-2 font-mono text-slate-500">{doc.fileName}</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          ✓ {doc.status}
                        </span>
                      </td>
                      <td className="p-2 text-slate-600">
                        {doc.reviewedAt || candidate.submittedAt || '2026-10-24 14:10:00'} (HR Ops)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Statutory Declaration & Signatures */}
            <div className="mt-8 pt-4 border-t-2 border-slate-300">
              <p className="text-[10px] text-slate-500 leading-normal mb-6">
                <strong>Statutory Declaration:</strong> I hereby declare that all particulars furnished by me in this onboarding KYC dossier are true, correct and complete to the best of my knowledge and belief. I authorise {company.name} to conduct background and digital authentication of submitted credentials.
              </p>

              <div className="flex items-end justify-between pt-2">
                <div className="text-left">
                  <div className="w-48 h-16 border-b border-slate-400 flex items-center justify-center">
                    {candidate.signatureDataUrl ? (
                      <img
                        src={candidate.signatureDataUrl}
                        alt="Signature"
                        className="max-h-14 max-w-full object-contain"
                      />
                    ) : (
                      <span className="font-serif italic text-lg text-slate-800">{candidate.fullName}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 block mt-1">Digital Signature of Candidate</span>
                  <span className="text-[10px] text-slate-500 block font-mono">Date: {candidate.submittedAt || '2026-10-24'}</span>
                </div>

                <div className="text-right">
                  <div className="w-48 h-16 border-b border-slate-400 flex items-center justify-end">
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-emerald-600 flex items-center justify-center text-center p-1">
                      <span className="text-[8px] font-bold text-emerald-700 leading-tight">HR STAMP VERIFIED</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 block mt-1">Authorized HR Signatory</span>
                  <span className="text-[10px] text-slate-500 block font-mono">{company.name}</span>
                </div>
              </div>
            </div>

            {/* Bottom Safe Badge */}
            <div className="mt-8 p-2 bg-slate-100 rounded text-center text-[10px] text-slate-500 font-mono">
              GENERATED CLIENT-SIDE VIA DEMO ENGINE • ZERO DATA TRANSMITTED OUTSIDE LOCAL BROWSER
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
