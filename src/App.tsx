import React, { useState, useEffect, useCallback } from 'react';
import { 
  DemoRole, 
  Employee, 
  AttendanceRecord, 
  PayrollRecord, 
  StatutoryComplianceItem, 
  DocumentItem, 
  MonthlyCompliancePack, 
  SystemConfig,
  CandidateRecord
} from './types';
import { complianceStore } from './services/complianceStore';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav, NavTab } from './components/layout/BottomNav';
import { Sidebar } from './components/layout/Sidebar';
import { RoleSelectorModal } from './components/layout/RoleSelectorModal';
import { MoreMenuModal } from './components/layout/MoreMenuModal';
import { MobileDashboard } from './components/dashboard/MobileDashboard';
import { EmployeeDirectory } from './components/employees/EmployeeDirectory';
import { EmployeeModal } from './components/employees/EmployeeModal';
import { AttendanceView } from './components/attendance/AttendanceView';
import { PayrollView } from './components/payroll/PayrollView';
import { ComplianceTracker } from './components/compliance/ComplianceTracker';
import { DocumentCentre } from './components/documents/DocumentCentre';
import { CompliancePackList } from './components/packs/CompliancePackList';
import { CompliancePackCompiler } from './components/packs/CompliancePackCompiler';
import { SystemSettings } from './components/settings/SystemSettings';
import { SimulatedNotificationsDrawer } from './components/SimulatedNotificationsDrawer';
import { PhoneFrame } from './components/PhoneFrame';
import { EmployeePortal } from './components/employee/EmployeePortal';
import { triggerConfetti } from './utils/confetti';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<DemoRole>('SUPER_ADMIN');
  const [config, setConfig] = useState<SystemConfig>(complianceStore.getConfig());
  const [employees, setEmployees] = useState<Employee[]>(complianceStore.getEmployees());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(complianceStore.getAttendance());
  const [payroll, setPayroll] = useState<PayrollRecord[]>(complianceStore.getPayroll());
  const [complianceItems, setComplianceItems] = useState<StatutoryComplianceItem[]>(complianceStore.getComplianceItems());
  const [documents, setDocuments] = useState<DocumentItem[]>(complianceStore.getDocuments());
  const [packs, setPacks] = useState<MonthlyCompliancePack[]>(complianceStore.getPacks());

  // Active Compiler Pack (if editing a specific 9-step pack)
  const [activeCompilerPack, setActiveCompilerPack] = useState<MonthlyCompliancePack | null>(null);

  // Modals & Drawers
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  // State sync from store
  const refreshStoreState = useCallback(() => {
    setCurrentRole(complianceStore.getRole());
    setConfig(complianceStore.getConfig());
    setEmployees(complianceStore.getEmployees());
    setAttendance(complianceStore.getAttendance());
    setPayroll(complianceStore.getPayroll());
    setComplianceItems(complianceStore.getComplianceItems());
    setDocuments(complianceStore.getDocuments());
    setPacks(complianceStore.getPacks());
  }, []);

  useEffect(() => {
    refreshStoreState();
    const unsub = complianceStore.subscribe(() => {
      refreshStoreState();
    });
    return unsub;
  }, [refreshStoreState]);

  // Handlers
  const handleRoleSelect = (role: DemoRole) => {
    complianceStore.setRole(role);
  };

  const handleResetDemo = () => {
    complianceStore.resetDemoData();
    setActiveTab('dashboard');
    setActiveCompilerPack(null);
    triggerConfetti();
  };

  const handleCreateNewPack = () => {
    const newPack: MonthlyCompliancePack = {
      id: `pack-${Date.now()}`,
      packCode: `MCP-2026-10-${Math.floor(100 + Math.random() * 900)}`,
      company: config.companyName,
      client: config.clients[0],
      project: config.projects[0],
      site: config.sites[0],
      month: 'October',
      year: 2026,
      readinessPercentage: 25,
      hrApproved: false,
      accountsApproved: false,
      siteApproved: false,
      status: 'IN_PROGRESS',
      createdAt: new Date().toISOString().substring(0, 10),
      updatedAt: new Date().toISOString().substring(0, 10),
      checklistItems: [
        { id: 'item-1', title: 'EPFO Monthly Electronic Challan & Reconciliation', category: 'PF & ESI', mandatory: true, isUploaded: false, status: 'MISSING' },
        { id: 'item-2', title: 'ESIC Contribution Statement with Payment Stamp', category: 'PF & ESI', mandatory: true, isUploaded: false, status: 'MISSING' },
        { id: 'item-3', title: 'Form B Wage Register Signed by Principal Employer', category: 'Wages', mandatory: true, isUploaded: false, status: 'MISSING' },
        { id: 'item-4', title: 'Bank Advice Summary for NEFT Direct Salary Transfer', category: 'Wages', mandatory: true, isUploaded: false, status: 'MISSING' },
        { id: 'item-5', title: 'Form D Attendance Muster Roll Signed by Site Incharge', category: 'Attendance', mandatory: true, isUploaded: true, fileName: 'Site_Muster_Oct2026.pdf', status: 'COMPLETED' },
        { id: 'item-6', title: 'Labour Welfare Fund (LWF) Remittance Receipt', category: 'Statutory', mandatory: true, isUploaded: false, status: 'MISSING' },
        { id: 'item-7', title: 'Weekly Scaffold & Height Work Safety Permit Certificate', category: 'Safety', mandatory: false, isUploaded: true, fileName: 'Scaffold_Log_Week3.pdf', status: 'COMPLETED' }
      ]
    };
    complianceStore.savePack(newPack);
    setActiveCompilerPack(newPack);
    setActiveTab('packs');
  };

  // Simulated notifications list
  const simulatedNotifications = [
    {
      id: 'notif-1',
      timestamp: '10 mins ago',
      channel: 'WHATSAPP' as const,
      recipientName: 'Harish R. (Site Incharge)',
      recipientPhone: '90000 00001',
      title: 'Site Attendance Muster Reminder',
      message: 'Please complete and lock the attendance muster for Cyber City Metro Station before 6:00 PM.',
      isRead: false
    },
    {
      id: 'notif-2',
      timestamp: '2 hours ago',
      channel: 'SMS' as const,
      recipientName: 'Sunil K. (Accounts)',
      recipientPhone: '90000 00007',
      title: 'October Payroll Review Ready',
      message: 'Wages calculation for 10 staff members is ready for your approval.',
      isRead: true
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <TopHeader
        currentRole={currentRole}
        onOpenRoleSelector={() => setShowRoleModal(true)}
        onResetDemo={handleResetDemo}
        onOpenNotifications={() => setShowNotifications(true)}
        companyName={config.companyName}
      />

      {/* Main Responsive Layout: Sidebar on Desktop + Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tablet / Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 'packs') setActiveCompilerPack(null);
          }}
          currentRole={currentRole}
          onResetDemo={handleResetDemo}
        />

        {/* Scrollable Content Viewport */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-6xl mx-auto w-full">
            {/* 1. DASHBOARD */}
            {activeTab === 'dashboard' && (
              <MobileDashboard
                currentRole={currentRole}
                employees={employees}
                attendance={attendance}
                payroll={payroll}
                complianceItems={complianceItems}
                documents={documents}
                packs={packs}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  if (tab !== 'packs') setActiveCompilerPack(null);
                }}
                onOpenAddEmployee={() => setShowAddEmployeeModal(true)}
                onOpenCreatePack={handleCreateNewPack}
              />
            )}

            {/* 2. EMPLOYEES DIRECTORY */}
            {activeTab === 'employees' && (
              <EmployeeDirectory
                employees={employees}
                config={config}
                onSaveEmployee={(emp) => complianceStore.saveEmployee(emp)}
              />
            )}

            {/* 3. ATTENDANCE WORKFLOW */}
            {activeTab === 'attendance' && (
              <AttendanceView
                attendanceRecords={attendance}
                employees={employees}
                config={config}
                onSaveBatch={(records) => complianceStore.saveAttendanceBatch(records)}
                onApproveSite={(siteId, date, approver) => complianceStore.approveSiteAttendance(siteId, date, approver)}
              />
            )}

            {/* 4. COMPLIANCE TRACKER */}
            {activeTab === 'compliance' && (
              <ComplianceTracker
                items={complianceItems}
                config={config}
                onSaveItem={(item) => complianceStore.saveComplianceItem(item)}
              />
            )}

            {/* 5. MONTHLY COMPLIANCE PACKS (THE HERO FEATURE) */}
            {activeTab === 'packs' && (
              activeCompilerPack ? (
                <CompliancePackCompiler
                  pack={activeCompilerPack}
                  config={config}
                  onSavePack={(pack) => complianceStore.savePack(pack)}
                  onBackToList={() => setActiveCompilerPack(null)}
                />
              ) : (
                <CompliancePackList
                  packs={packs}
                  config={config}
                  onSelectPack={(pack) => setActiveCompilerPack(pack)}
                  onCreateNewPack={handleCreateNewPack}
                />
              )
            )}

            {/* 6. PAYROLL WORKSPACE */}
            {activeTab === 'payroll' && (
              <PayrollView
                payrollRecords={payroll}
                employees={employees}
                onUpdateStatus={(id, status, reviewer, remarks) => 
                  complianceStore.updatePayrollStatus(id, status, reviewer, remarks)
                }
              />
            )}

            {/* 7. DOCUMENT CENTRE */}
            {activeTab === 'documents' && (
              <DocumentCentre
                documents={documents}
                config={config}
                onSaveDocument={(doc) => complianceStore.saveDocument(doc)}
              />
            )}

            {/* 8. DIGITAL KYC ONBOARDING (DEMO LOOP) */}
            {activeTab === 'kyc_onboarding' && (
              <div className="py-2">
                <div className="mb-4 text-center">
                  <h2 className="text-lg font-bold text-white">Interactive Candidate KYC Onboarding</h2>
                  <p className="text-xs text-slate-400">Experience how new hires complete their joining formalities via mobile WhatsApp link</p>
                </div>
                <PhoneFrame
                  isFrameEnabled={true}
                  onToggleFrame={() => {}}
                >
                  <EmployeePortal
                    company={{ id: 'securewave', name: config.companyName, tagline: 'Civil & Labour Contractors', brandColor: '#0d9488' }}
                    onSubmissionSuccess={(sub) => {
                      triggerConfetti();
                      setActiveTab('employees');
                    }}
                    onSwitchToHr={() => setActiveTab('dashboard')}
                    userSubmission={null}
                    onUpdateSubmission={() => {}}
                  />
                </PhoneFrame>
              </div>
            )}

            {/* 9. SETTINGS */}
            {activeTab === 'settings' && (
              <SystemSettings
                config={config}
                onSaveConfig={(cfg) => complianceStore.updateConfig(cfg)}
                onResetDemo={handleResetDemo}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'more') {
            setShowMoreModal(true);
          } else {
            setActiveTab(tab);
            if (tab !== 'packs') setActiveCompilerPack(null);
          }
        }}
        pendingApprovalsCount={attendance.filter(a => !a.approved).length + payroll.filter(p => p.status === 'PENDING_REVIEW').length}
      />

      {/* Role Selector Modal */}
      {showRoleModal && (
        <RoleSelectorModal
          currentRole={currentRole}
          onSelectRole={handleRoleSelect}
          onClose={() => setShowRoleModal(false)}
        />
      )}

      {/* More Menu Drawer (Mobile) */}
      {showMoreModal && (
        <MoreMenuModal
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 'packs') setActiveCompilerPack(null);
            setShowMoreModal(false);
          }}
          onClose={() => setShowMoreModal(false)}
          onResetDemo={handleResetDemo}
        />
      )}

      {/* Simulated Notifications Drawer */}
      {showNotifications && (
        <SimulatedNotificationsDrawer
          notifications={simulatedNotifications}
          onClose={() => setShowNotifications(false)}
          onOpenEmployeeFlow={() => {
            setActiveTab('kyc_onboarding');
            setShowNotifications(false);
          }}
        />
      )}

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <EmployeeModal
          config={config}
          onSave={(emp) => complianceStore.saveEmployee(emp)}
          onClose={() => setShowAddEmployeeModal(false)}
        />
      )}
    </div>
  );
};

export default App;
