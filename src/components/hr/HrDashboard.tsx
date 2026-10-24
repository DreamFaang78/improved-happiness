import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  UserPlus, 
  Upload, 
  FileSpreadsheet, 
  History, 
  Settings, 
  ExternalLink, 
  Eye, 
  Building2, 
  Sparkles,
  ChevronRight,
  Shield,
  FileText
} from 'lucide-react';
import { 
  CandidateRecord, 
  KycStatus, 
  CompanyConfig, 
  DocumentReviewStatus, 
  AuditLogEntry 
} from '../../types';
import { CandidateDetailDrawer } from './CandidateDetailDrawer';
import { InviteModal } from './InviteModal';
import { BulkUploadModal } from './BulkUploadModal';
import { SettingsModal } from './SettingsModal';
import { AuditLogModal } from './AuditLogModal';

interface HrDashboardProps {
  candidates: CandidateRecord[];
  activeCompany: CompanyConfig;
  allCompanies: CompanyConfig[];
  onSelectCompany: (company: CompanyConfig) => void;
  onUpdateDocumentStatus: (candidateId: string, docId: string, status: DocumentReviewStatus, reason?: string) => Promise<CandidateRecord>;
  onApproveAllDocuments: (candidateId: string) => Promise<void>;
  onAddCandidate: (candidate: CandidateRecord) => void;
  onAddCandidatesBatch: (candidates: CandidateRecord[]) => void;
  auditLogs: AuditLogEntry[];
  onOpenEmployeeFlow: () => void;
}

export const HrDashboard: React.FC<HrDashboardProps> = ({
  candidates,
  activeCompany,
  allCompanies,
  onSelectCompany,
  onUpdateDocumentStatus,
  onApproveAllDocuments,
  onAddCandidate,
  onAddCandidatesBatch,
  auditLogs,
  onOpenEmployeeFlow
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRecord | null>(null);
  
  // Modals
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  // Status Metrics
  const metrics = useMemo(() => {
    const total = candidates.length;
    const submitted = candidates.filter(c => c.status === 'SUBMITTED').length;
    const correction = candidates.filter(c => c.status === 'CORRECTION_REQUIRED').length;
    const approved = candidates.filter(c => c.status === 'APPROVED').length;
    const inProgress = candidates.filter(c => c.status === 'IN_PROGRESS').length;
    const invited = candidates.filter(c => c.status === 'INVITED').length;
    const expired = candidates.filter(c => c.status === 'EXPIRED').length;

    return { total, submitted, correction, approved, inProgress, invited, expired };
  }, [candidates]);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchesSearch = 
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.mobileNumber.includes(searchQuery) ||
        c.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.panNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [candidates, statusFilter, searchQuery]);

  // Status Badge Helper with explicit icons and colours
  const renderStatusBadge = (status: KycStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse-subtle">
            <Clock className="w-3.5 h-3.5" /> Submitted
          </span>
        );
      case 'CORRECTION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> Correction Required
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Clock className="w-3.5 h-3.5" /> In Progress
          </span>
        );
      case 'INVITED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            Invited
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-950/40 text-rose-400 border border-rose-900/40">
            Expired
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            Rejected
          </span>
        );
      default:
        return <span className="text-xs text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* Subheader / Action Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                HR Verification & Onboarding Command Center
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                PROD PREVIEW
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active Enterprise: <strong className="text-slate-200">{activeCompany.name}</strong> • Real-time statutory document verification
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Candidate</span>
            </button>

            <button
              type="button"
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Bulk CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAuditModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-all"
            >
              <History className="w-4 h-4 text-indigo-400" />
              <span>Audit Trail</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
              title="KYC Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex-1 w-full space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div 
            onClick={() => setStatusFilter('ALL')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'ALL' 
                ? 'bg-slate-850 border-indigo-500 ring-2 ring-indigo-500/20' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Hires</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-white">{metrics.total}</div>
          </div>

          <div 
            onClick={() => setStatusFilter('SUBMITTED')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'SUBMITTED' 
                ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-amber-400 text-xs mb-1">
              <span>Review Pending</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-amber-300">{metrics.submitted}</div>
          </div>

          <div 
            onClick={() => setStatusFilter('CORRECTION_REQUIRED')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'CORRECTION_REQUIRED' 
                ? 'bg-orange-950/40 border-orange-500 ring-2 ring-orange-500/20' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-orange-400 text-xs mb-1">
              <span>Correction Req.</span>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-orange-300">{metrics.correction}</div>
          </div>

          <div 
            onClick={() => setStatusFilter('APPROVED')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'APPROVED' 
                ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-emerald-400 text-xs mb-1">
              <span>Approved</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-300">{metrics.approved}</div>
          </div>

          <div 
            onClick={() => setStatusFilter('IN_PROGRESS')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'IN_PROGRESS' 
                ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-blue-400 text-xs mb-1">
              <span>In Progress</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-blue-300">{metrics.inProgress}</div>
          </div>

          <div 
            onClick={() => setStatusFilter('INVITED')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'INVITED' 
                ? 'bg-slate-850 border-slate-500 ring-2 ring-slate-500/20' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Invited Link</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-slate-300">{metrics.invited}</div>
          </div>
        </div>

        {/* Search & Status Filter Strip */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, phone, PAN, role..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs pb-1 md:pb-0">
            {[
              { id: 'ALL', label: 'All Candidates' },
              { id: 'SUBMITTED', label: 'Submitted' },
              { id: 'CORRECTION_REQUIRED', label: 'Correction Req.' },
              { id: 'APPROVED', label: 'Approved' },
              { id: 'IN_PROGRESS', label: 'In Progress' },
              { id: 'EXPIRED', label: 'Expired' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-850 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Candidate & App No.</th>
                  <th className="py-3.5 px-4">Designation & Department</th>
                  <th className="py-3.5 px-4">Contact & PAN</th>
                  <th className="py-3.5 px-4">KYC Status</th>
                  <th className="py-3.5 px-4">Docs Check</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                      No candidate submissions match your current filters.
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map(candidate => {
                    const isNewUserSubmission = candidate.isUserSubmission;
                    const approvedDocsCount = candidate.documents.filter(d => d.status === 'APPROVED').length;

                    return (
                      <tr 
                        key={candidate.id}
                        className={`hover:bg-slate-850/80 transition-colors group cursor-pointer ${
                          isNewUserSubmission ? 'bg-indigo-950/30' : ''
                        }`}
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        {/* Candidate Name & Avatar */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isNewUserSubmission 
                                ? 'bg-gradient-to-tr from-amber-500 to-indigo-600 text-white ring-2 ring-amber-400' 
                                : 'bg-slate-800 text-indigo-300 border border-slate-700'
                            }`}>
                              {candidate.fullName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-100 text-xs group-hover:text-indigo-300 transition-colors">
                                  {candidate.fullName}
                                </span>
                                {isNewUserSubmission && (
                                  <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/20 px-2 py-0.2 rounded-full border border-amber-500/40 animate-pulse">
                                    ✨ YOUR SUBMISSION
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
                                {candidate.applicationNumber}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Role & Dept */}
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-200">{candidate.role}</div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">{candidate.department}</span>
                        </td>

                        {/* Contact & PAN */}
                        <td className="py-4 px-4">
                          <span className="font-mono text-slate-300 block">+91 {candidate.mobileNumber}</span>
                          <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
                            PAN: <strong className="text-slate-300">{candidate.panNumber || '—'}</strong>
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          {renderStatusBadge(candidate.status)}
                        </td>

                        {/* Document count */}
                        <td className="py-4 px-4">
                          {candidate.documents.length > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-mono font-bold text-slate-200">
                                {approvedDocsCount}/{candidate.documents.length}
                              </span>
                              <span className="text-[10px] text-slate-400">verified</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic">No uploads</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCandidate(candidate);
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700 hover:border-indigo-500 transition-all flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Review KYC</span>
                            </button>
                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Candidate Detail Modal / Drawer */}
      {selectedCandidate && (
        <CandidateDetailDrawer
          candidate={selectedCandidate}
          company={activeCompany}
          onClose={() => setSelectedCandidate(null)}
          onUpdateDocumentStatus={onUpdateDocumentStatus}
          onApproveAllDocuments={onApproveAllDocuments}
        />
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          company={activeCompany}
          onClose={() => setShowInviteModal(false)}
          onSendInvite={(cand) => onAddCandidate(cand as CandidateRecord)}
          onOpenEmployeeFlowWithToken={(cand) => {
            onAddCandidate(cand as CandidateRecord);
            onOpenEmployeeFlow();
          }}
        />
      )}

      {/* Bulk CSV Modal */}
      {showBulkModal && (
        <BulkUploadModal
          company={activeCompany}
          onClose={() => setShowBulkModal(false)}
          onAddCandidates={onAddCandidatesBatch}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          company={activeCompany}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Audit Log Modal */}
      {showAuditModal && (
        <AuditLogModal
          logs={auditLogs}
          onClose={() => setShowAuditModal(false)}
        />
      )}
    </div>
  );
};
