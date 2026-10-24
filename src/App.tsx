import React, { useState, useEffect, useCallback } from 'react';
import { 
  CandidateRecord, 
  CompanyConfig, 
  AuditLogEntry, 
  SimulatedNotification,
  DocumentReviewStatus 
} from './types';
import { dataProvider } from './services/dataProvider';
import { DemoBar } from './components/DemoBar';
import { LandingHero } from './components/LandingHero';
import { PhoneFrame } from './components/PhoneFrame';
import { EmployeePortal } from './components/employee/EmployeePortal';
import { HrDashboard } from './components/hr/HrDashboard';
import { CompanyModal } from './components/CompanyModal';
import { PresenterNotes } from './components/PresenterNotes';
import { GuidedTour } from './components/GuidedTour';
import { SimulatedNotificationsDrawer } from './components/SimulatedNotificationsDrawer';
import { ClosingRecapModal } from './components/ClosingRecapModal';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'employee' | 'hr'>('landing');
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [notifications, setNotifications] = useState<SimulatedNotification[]>([]);
  const [allCompanies, setAllCompanies] = useState<CompanyConfig[]>([]);
  const [activeCompany, setActiveCompany] = useState<CompanyConfig>({
    id: 'securewave',
    name: 'SecureWave Projects Pvt. Ltd.',
    tagline: 'Civil Engineering & Infrastructure Contractors',
    brandColor: '#4f46e5'
  });
  const [userSubmission, setUserSubmission] = useState<CandidateRecord | null>(null);

  // Layout & Utility states
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [showPresenterNotes, setShowPresenterNotes] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [showClosingRecap, setShowClosingRecap] = useState(false);

  // Load initial data from dataProvider
  const refreshData = useCallback(async () => {
    const [cands, logs, notifs, comps, activeComp] = await Promise.all([
      dataProvider.getCandidates(),
      dataProvider.getAuditLogs(),
      dataProvider.getNotifications(),
      dataProvider.getCompanies(),
      dataProvider.getActiveCompany()
    ]);

    setCandidates(cands);
    setAuditLogs(logs);
    setNotifications(notifs);
    setAllCompanies(comps);
    setActiveCompany(activeComp);

    // Look for user's own submission if any
    const mySub = cands.find(c => c.isUserSubmission);
    if (mySub) {
      setUserSubmission(mySub);
    }
  }, []);

  useEffect(() => {
    refreshData();
    const unsubscribe = dataProvider.subscribe(() => {
      refreshData();
    });
    return unsubscribe;
  }, [refreshData]);

  // Handlers
  const handleRoleChange = (role: 'employee' | 'hr') => {
    setCurrentView(role);
  };

  const handleSelectCompany = async (company: CompanyConfig) => {
    setActiveCompany(company);
    await dataProvider.setActiveCompany(company);
    await dataProvider.addAuditLog({
      action: 'Active Company Switched',
      details: `Demonstration entity updated to ${company.name}`,
      performedBy: 'Demo Presenter',
      category: 'SYSTEM'
    });
  };

  const handleResetDemo = async () => {
    await dataProvider.resetToSeed();
    setUserSubmission(null);
    setCurrentView('landing');
    setShowClosingRecap(false);
    await refreshData();
  };

  const handleSubmissionSuccess = async (submission: CandidateRecord) => {
    setUserSubmission(submission);
    await dataProvider.saveCandidate(submission);

    // Add Audit Log
    await dataProvider.addAuditLog({
      candidateId: submission.id,
      candidateName: submission.fullName,
      action: 'KYC Dossier Submitted',
      details: `Candidate completed all 4 onboarding steps with PAN ${submission.panNumber} and bank IFSC ${submission.ifscCode}`,
      performedBy: `Candidate (${submission.fullName})`,
      category: 'FORM'
    });

    // Add Simulated Notification
    await dataProvider.addNotification({
      channel: 'WHATSAPP',
      recipientName: 'HR Operations',
      recipientPhone: '90000 00000',
      title: `New KYC Submission: ${submission.fullName}`,
      message: `${submission.fullName} has completed onboarding form and uploaded all statutory proofs. Waiting for HR review.`,
      link: `/review?id=${submission.id}`,
      isRead: false
    });
  };

  const handleUpdateDocumentStatus = async (
    candidateId: string, 
    docId: string, 
    status: DocumentReviewStatus, 
    reason?: string
  ): Promise<CandidateRecord> => {
    const updated = await dataProvider.updateDocumentStatus(candidateId, docId, status, reason);
    if (updated.isUserSubmission) {
      setUserSubmission(updated);
    }
    await refreshData();
    return updated;
  };

  const handleApproveAllDocuments = async (candidateId: string): Promise<void> => {
    const target = await dataProvider.getCandidateById(candidateId);
    if (!target) return;

    for (const doc of target.documents) {
      await dataProvider.updateDocumentStatus(candidateId, doc.id, 'APPROVED');
    }
    await refreshData();
  };

  const handleAddCandidate = async (cand: CandidateRecord) => {
    await dataProvider.saveCandidate(cand);
    await dataProvider.addAuditLog({
      candidateId: cand.id,
      candidateName: cand.fullName,
      action: 'New Candidate Invited',
      details: `Generated joining invite for role: ${cand.role}`,
      performedBy: 'HR Admin',
      category: 'INVITE'
    });
    await dataProvider.addNotification({
      channel: 'WHATSAPP',
      recipientName: cand.fullName,
      recipientPhone: cand.mobileNumber,
      title: 'Joining Invite Dispatched',
      message: `Welcome to ${cand.companyName}! Please complete your KYC via: https://portal.demo/join?token=sw-${cand.id}`,
      isRead: false
    });
    await refreshData();
  };

  const handleAddCandidatesBatch = async (batch: CandidateRecord[]) => {
    for (const cand of batch) {
      await dataProvider.saveCandidate(cand);
    }
    await dataProvider.addAuditLog({
      action: 'Bulk CSV Candidate Import',
      details: `Imported and dispatched invites for ${batch.length} candidates`,
      performedBy: 'HR Admin (Bulk Operations)',
      category: 'INVITE'
    });
    await refreshData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Demo Sticky Bar */}
      <DemoBar
        currentRole={currentView === 'landing' ? 'employee' : currentView}
        onRoleChange={handleRoleChange}
        onResetDemo={handleResetDemo}
        onAutofill={() => {
          // If in employee view, we trigger autofill through employee portal
          if (currentView !== 'employee') {
            setCurrentView('employee');
          }
        }}
        activeCompany={activeCompany}
        allCompanies={allCompanies}
        onSelectCompany={handleSelectCompany}
        onOpenCompanyModal={() => setShowCompanyModal(true)}
        isPhoneFrame={isPhoneFrame}
        onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        showPresenterNotes={showPresenterNotes}
        onTogglePresenterNotes={() => setShowPresenterNotes(!showPresenterNotes)}
        onStartTour={() => setShowGuidedTour(true)}
        notifications={notifications}
        onOpenNotifications={() => setShowNotificationsDrawer(true)}
        onOpenClosingRecap={() => setShowClosingRecap(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentView === 'landing' && (
          <LandingHero
            activeCompany={activeCompany}
            onUpdateCompany={handleSelectCompany}
            onStartEmployee={() => setCurrentView('employee')}
            onStartHr={() => setCurrentView('hr')}
            onStartTour={() => {
              setShowGuidedTour(true);
              setCurrentView('employee');
            }}
          />
        )}

        {currentView === 'employee' && (
          <PhoneFrame
            isFrameEnabled={isPhoneFrame}
            onToggleFrame={() => setIsPhoneFrame(!isPhoneFrame)}
          >
            <EmployeePortal
              company={activeCompany}
              onSubmissionSuccess={handleSubmissionSuccess}
              onSwitchToHr={() => setCurrentView('hr')}
              userSubmission={userSubmission}
              onUpdateSubmission={async (updated) => {
                setUserSubmission(updated);
                await dataProvider.saveCandidate(updated);
                await dataProvider.addAuditLog({
                  candidateId: updated.id,
                  candidateName: updated.fullName,
                  action: 'Correction Resubmitted by Candidate',
                  details: 'Candidate replaced flagged documents and resubmitted dossier to HR',
                  performedBy: `Candidate (${updated.fullName})`,
                  category: 'FORM'
                });
                await refreshData();
              }}
            />
          </PhoneFrame>
        )}

        {currentView === 'hr' && (
          <HrDashboard
            candidates={candidates}
            activeCompany={activeCompany}
            allCompanies={allCompanies}
            onSelectCompany={handleSelectCompany}
            onUpdateDocumentStatus={handleUpdateDocumentStatus}
            onApproveAllDocuments={handleApproveAllDocuments}
            onAddCandidate={handleAddCandidate}
            onAddCandidatesBatch={handleAddCandidatesBatch}
            auditLogs={auditLogs}
            onOpenEmployeeFlow={() => setCurrentView('employee')}
          />
        )}
      </main>

      {/* Presenter Pitch Notes Drawer */}
      {showPresenterNotes && (
        <PresenterNotes
          currentRole={currentView === 'hr' ? 'hr' : 'employee'}
          onClose={() => setShowPresenterNotes(false)}
        />
      )}

      {/* Guided Tour Modal */}
      {showGuidedTour && (
        <GuidedTour
          onClose={() => setShowGuidedTour(false)}
          onNavigateRole={(role) => setCurrentView(role)}
        />
      )}

      {/* Company Personalization Modal */}
      {showCompanyModal && (
        <CompanyModal
          currentCompany={activeCompany}
          onSaveCompany={handleSelectCompany}
          onClose={() => setShowCompanyModal(false)}
        />
      )}

      {/* Simulated Notifications Drawer */}
      {showNotificationsDrawer && (
        <SimulatedNotificationsDrawer
          notifications={notifications}
          onClose={() => setShowNotificationsDrawer(false)}
          onOpenEmployeeFlow={() => setCurrentView('employee')}
        />
      )}

      {/* Executive Sales Recap Modal */}
      {showClosingRecap && (
        <ClosingRecapModal
          company={activeCompany}
          onClose={() => setShowClosingRecap(false)}
          onResetDemo={handleResetDemo}
        />
      )}
    </div>
  );
};

export default App;
