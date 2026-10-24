import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  User, 
  MapPin, 
  Landmark, 
  Clock, 
  Printer, 
  ShieldCheck,
  Send,
  Sparkles
} from 'lucide-react';
import { CandidateRecord, DocumentItem, DocumentReviewStatus, CompanyConfig } from '../../types';
import { DocumentViewer } from './DocumentViewer';
import { KycPdfModal } from './KycPdfModal';
import { triggerConfetti } from '../../utils/confetti';

interface CandidateDetailDrawerProps {
  candidate: CandidateRecord;
  company: CompanyConfig;
  onClose: () => void;
  onUpdateDocumentStatus: (candidateId: string, docId: string, status: DocumentReviewStatus, reason?: string) => Promise<CandidateRecord>;
  onApproveAllDocuments: (candidateId: string) => Promise<void>;
}

export const CandidateDetailDrawer: React.FC<CandidateDetailDrawerProps> = ({
  candidate,
  company,
  onClose,
  onUpdateDocumentStatus,
  onApproveAllDocuments
}) => {
  const [currentCandidate, setCurrentCandidate] = useState<CandidateRecord>(candidate);
  const [selectedDocId, setSelectedDocId] = useState<string>(
    candidate.documents[0]?.id || ''
  );
  const [profileTab, setProfileTab] = useState<'profile' | 'banking' | 'address'>('profile');
  const [showPdfModal, setShowPdfModal] = useState(false);

  const selectedDoc = currentCandidate.documents.find(d => d.id === selectedDocId) || currentCandidate.documents[0] || null;

  const handleApprove = async (docId: string) => {
    const updated = await onUpdateDocumentStatus(currentCandidate.id, docId, 'APPROVED');
    setCurrentCandidate(updated);
    if (updated.status === 'APPROVED') {
      triggerConfetti();
    }
  };

  const handleRequestCorrection = async (docId: string, reason: string) => {
    const updated = await onUpdateDocumentStatus(currentCandidate.id, docId, 'CORRECTION_REQUIRED', reason);
    setCurrentCandidate(updated);
  };

  const handleReject = async (docId: string, reason: string) => {
    const updated = await onUpdateDocumentStatus(currentCandidate.id, docId, 'REJECTED', reason);
    setCurrentCandidate(updated);
  };

  const handleApproveAll = async () => {
    await onApproveAllDocuments(currentCandidate.id);
    triggerConfetti();
    // Refresh local candidate
    setCurrentCandidate(prev => ({
      ...prev,
      status: 'APPROVED',
      approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      documents: prev.documents.map(d => ({ ...d, status: 'APPROVED' }))
    }));
  };

  const allApproved = currentCandidate.documents.length > 0 && currentCandidate.documents.every(d => d.status === 'APPROVED');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col h-[94vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md">
              {currentCandidate.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{currentCandidate.fullName}</h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-700 text-indigo-300 border border-slate-600">
                  {currentCandidate.applicationNumber}
                </span>
                {currentCandidate.isUserSubmission && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                    YOUR SUBMISSION
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {currentCandidate.role} • {currentCandidate.companyName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {allApproved && (
              <button
                type="button"
                onClick={() => setShowPdfModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Download Watermarked KYC Dossier</span>
              </button>
            )}

            {!allApproved && currentCandidate.documents.length > 0 && (
              <button
                type="button"
                onClick={handleApproveAll}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Quick Approve All</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Split Body: Candidate Details Left (40%), Document Viewer Right (60%) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Panel: Profile Dossier */}
          <div className="w-full lg:w-[42%] border-r border-slate-800 bg-slate-900/60 p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* Nav Tabs */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl text-xs font-semibold text-slate-400 border border-slate-700">
              <button
                type="button"
                onClick={() => setProfileTab('profile')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  profileTab === 'profile' ? 'bg-indigo-600 text-white' : 'hover:text-slate-200'
                }`}
              >
                Profile & ID
              </button>
              <button
                type="button"
                onClick={() => setProfileTab('banking')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  profileTab === 'banking' ? 'bg-indigo-600 text-white' : 'hover:text-slate-200'
                }`}
              >
                Bank & EPFO
              </button>
              <button
                type="button"
                onClick={() => setProfileTab('address')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  profileTab === 'address' ? 'bg-indigo-600 text-white' : 'hover:text-slate-200'
                }`}
              >
                Address
              </button>
            </div>

            {/* Profile Tab */}
            {profileTab === 'profile' && (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Personal Profile</span>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div>
                      <span className="text-slate-500 block text-[10px]">FULL NAME</span>
                      <span className="font-semibold text-white">{currentCandidate.fullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">FATHER'S NAME</span>
                      <span className="font-semibold text-white">{currentCandidate.fatherName || 'Ramesh Sharma'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">DATE OF BIRTH</span>
                      <span className="font-semibold text-white">{currentCandidate.dateOfBirth}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">GENDER</span>
                      <span className="font-semibold text-white">{currentCandidate.gender}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">BLOOD GROUP</span>
                      <span className="font-semibold text-white">{currentCandidate.bloodGroup || 'B+'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">PHONE</span>
                      <span className="font-mono text-white">+91 {currentCandidate.mobileNumber}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block text-[10px]">EMAIL</span>
                      <span className="font-medium text-slate-200">{currentCandidate.email}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Statutory Identifiers</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700">
                      <span className="text-[10px] text-slate-400 block">PAN</span>
                      <span className="font-mono font-bold text-white text-sm">{currentCandidate.panNumber}</span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">Format Verified</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700">
                      <span className="text-[10px] text-slate-400 block">AADHAAR (MASKED)</span>
                      <span className="font-mono font-bold text-white text-sm">{currentCandidate.aadhaarNumber}</span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">Masked Valid</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Banking Tab */}
            {profileTab === 'banking' && (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Direct Salary Credit Bank</span>
                  <div>
                    <span className="text-slate-500 block text-[10px]">BANK NAME</span>
                    <span className="font-bold text-white text-sm">{currentCandidate.bankName || 'HDFC Bank Ltd.'}</span>
                    <span className="text-slate-400 block text-[11px]">{currentCandidate.bankBranch || 'Commercial Branch'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">ACCOUNT NUMBER</span>
                    <span className="font-mono font-bold text-white text-sm">{currentCandidate.bankAccountNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">IFSC CODE</span>
                    <span className="font-mono font-bold text-indigo-400 text-sm">{currentCandidate.ifscCode}</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Statutory Registrations</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block text-[10px]">EPFO UAN</span>
                      <span className="font-mono font-bold text-white">{currentCandidate.uanNumber || '100000000001'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">ESIC NUMBER</span>
                      <span className="font-mono font-bold text-white">{currentCandidate.esicNumber || '11000000000000001'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Address Tab */}
            {profileTab === 'address' && (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Current Address</span>
                  <p className="text-slate-200 font-medium leading-relaxed">
                    {currentCandidate.currentAddressLine1} {currentCandidate.currentAddressLine2}<br />
                    {currentCandidate.currentCity}, {currentCandidate.currentState} - <span className="font-mono">{currentCandidate.currentPincode}</span>
                  </p>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Emergency Contact</span>
                  <p className="text-slate-200 font-medium">
                    {currentCandidate.emergencyContactName} ({currentCandidate.emergencyContactRelation})<br />
                    <span className="font-mono text-slate-400">+91 {currentCandidate.emergencyContactPhone}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Document Checklist Bar */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Attached Documents ({currentCandidate.documents.length})
              </span>
              <div className="space-y-1.5">
                {currentCandidate.documents.map(doc => {
                  const isSelected = doc.id === selectedDocId;

                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                        isSelected 
                          ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="font-semibold text-xs truncate">{doc.title}</span>
                      </div>

                      {doc.status === 'APPROVED' && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                          Approved
                        </span>
                      )}
                      {doc.status === 'CORRECTION_REQUIRED' && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                          Correction
                        </span>
                      )}
                      {doc.status === 'REJECTED' && (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded">
                          Rejected
                        </span>
                      )}
                      {doc.status === 'PENDING' && (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-700 px-2 py-0.5 rounded">
                          Pending
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Document Viewer */}
          <div className="w-full lg:w-[58%] h-full p-4 sm:p-6 bg-slate-950 flex flex-col justify-between">
            <DocumentViewer
              document={selectedDoc}
              onApprove={handleApprove}
              onRequestCorrection={handleRequestCorrection}
              onReject={handleReject}
            />
          </div>
        </div>
      </div>

      {/* PDF Export Modal */}
      {showPdfModal && (
        <KycPdfModal
          candidate={currentCandidate}
          company={company}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
};
