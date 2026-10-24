export type DemoRole = 
  | 'SUPER_ADMIN'
  | 'HR'
  | 'ACCOUNTS'
  | 'PROJECT_COORDINATOR'
  | 'SITE_INCHARGE'
  | 'EMPLOYEE'
  | 'CLIENT_VIEWER';

export type EmploymentStatus = 'ACTIVE' | 'ON_LEAVE' | 'PROBATION' | 'TERMINATED';
export type DocumentVerificationStatus = 'VERIFIED' | 'PENDING' | 'EXPIRED' | 'MISSING';

export interface Employee {
  id: string;
  empId: string;
  name: string;
  designation: string;
  department: string;
  site: string;
  project: string;
  contractor: string;
  joiningDate: string;
  status: EmploymentStatus;
  documentStatus: DocumentVerificationStatus;
  mobile: string;
  email: string;
  pan: string;
  aadhaar: string;
  uan?: string;
  esiNo?: string;
  wageType: 'DAILY' | 'MONTHLY';
  dailyWage?: number;
  monthlyGross?: number;
  bankAccount: string;
  bankIfsc: string;
  bankName: string;
}

export type AttendanceStatus = 'P' | 'A' | 'L' | 'WO' | 'H'; // Present, Absent, Leave, Weekly Off, Holiday

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  siteId: string;
  employeeId: string;
  status: AttendanceStatus;
  overtimeHours: number;
  approved: boolean;
  locked: boolean;
  submittedBy?: string;
  approvedBy?: string;
}

export type PayrollStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'RETURNED';

export interface PayrollRecord {
  id: string;
  month: string; // "October 2026"
  year: number;
  employeeId: string;
  presentDays: number;
  absentDays: number;
  overtimeHours: number;
  basicPay: number;
  hraAndAllowances: number;
  overtimePay: number;
  grossEarnings: number;
  pfDeduction: number; // illustrative 12%
  esiDeduction: number; // illustrative 0.75%
  otherDeductions: number;
  totalDeductions: number;
  netPayable: number;
  status: PayrollStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  remarks?: string;
}

export type ComplianceEvidenceStatus = 'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED';
export type ComplianceReviewStatus = 'PENDING' | 'APPROVED' | 'NEEDS_CORRECTION';

export interface StatutoryComplianceItem {
  id: string;
  requirement: string;
  category: 'STATUTORY_PF_ESI' | 'LABOUR_REGISTERS' | 'SAFETY_PERMITS' | 'WAGE_PAYMENT' | 'CLRA_RETURNS';
  client: string;
  contractor: string;
  project: string;
  site: string;
  applicableMonth: string;
  dueDate: string;
  responsiblePerson: string;
  evidenceStatus: ComplianceEvidenceStatus;
  reviewStatus: ComplianceReviewStatus;
  evidenceFileName?: string;
  notes?: string;
  lastUpdated?: string;
}

export type DocumentType = 
  | 'aadhaar_card'
  | 'pan_card'
  | 'bank_proof'
  | 'photograph'
  | 'signature';

export type DocumentReviewStatus = 
  | 'PENDING'
  | 'APPROVED'
  | 'CORRECTION_REQUIRED'
  | 'REJECTED';

export interface DocumentItem {
  id: string;
  type?: DocumentType;
  title: string;
  category?: 'STATUTORY_RETURN' | 'EMPLOYEE_IDENTITY' | 'WAGE_SHEET' | 'SAFETY_AUDIT' | 'CONTRACT_AGREEMENT';
  fileName: string;
  fileSize: string;
  fileDataUrl?: string; // in-memory data URL or sample
  uploadDate?: string;
  uploadTimestamp?: string;
  expiryDate?: string;
  status?: any; // 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | DocumentReviewStatus
  site?: string;
  employeeId?: string;
  correctionReason?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  isSample?: boolean;
}

export type PackSubmissionStatus = 
  | 'IN_PROGRESS' 
  | 'MISSING_DOCS' 
  | 'PENDING_REVIEW' 
  | 'CHANGES_REQUIRED' 
  | 'INTERNALLY_APPROVED' 
  | 'READY_FOR_SUBMISSION' 
  | 'SUBMITTED' 
  | 'ACKNOWLEDGED';

export interface PackChecklistItem {
  id: string;
  title: string;
  category: string;
  mandatory: boolean;
  isUploaded: boolean;
  fileName?: string;
  status: 'COMPLETED' | 'MISSING' | 'PENDING_REVIEW' | 'REJECTED';
  rejectionReason?: string;
}

export interface MonthlyCompliancePack {
  id: string;
  packCode: string;
  company: string;
  client: string;
  project: string;
  site: string;
  month: string;
  year: number;
  checklistItems: PackChecklistItem[];
  readinessPercentage: number;
  hrApproved: boolean;
  accountsApproved: boolean;
  siteApproved: boolean;
  status: PackSubmissionStatus;
  submissionDate?: string;
  referenceNumber?: string;
  acknowledgementNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemConfig {
  companyName: string;
  sites: string[];
  projects: string[];
  clients: string[];
  contractors: string[];
  designations: string[];
  reminderIntervals: string;
}

/* =========================================================
   KYC Onboarding Demo Types (Preserved for Interactive Flow)
   ========================================================= */

export type KycStatus = 
  | 'INVITED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'CORRECTION_REQUIRED'
  | 'APPROVED'
  | 'EXPIRED'
  | 'REJECTED';

export interface CandidateRecord {
  id: string;
  applicationNumber: string;
  companyName: string;
  fullName: string;
  fatherName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  bloodGroup?: string;
  mobileNumber: string;
  email: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  
  // Address
  currentAddressLine1: string;
  currentAddressLine2?: string;
  currentCity: string;
  currentState: string;
  currentPincode: string;
  permanentSameAsCurrent: boolean;
  permanentAddressLine1?: string;
  permanentAddressLine2?: string;
  permanentCity?: string;
  permanentState?: string;
  permanentPincode?: string;

  // Banking & Statutory
  panNumber: string;
  aadhaarNumber: string;
  bankAccountNumber: string;
  bankName: string;
  ifscCode: string;
  bankBranch?: string;
  uanNumber?: string;
  esicNumber?: string;

  // Documents
  documents: DocumentItem[];
  signatureDataUrl?: string;

  // Meta
  role: string;
  department: string;
  joiningDate: string;
  status: KycStatus;
  createdAt: string;
  submittedAt?: string;
  approvedAt?: string;
  isUserSubmission?: boolean;
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  candidateId?: string;
  candidateName?: string;
  action: string;
  details: string;
  performedBy: string;
  category: 'INVITE' | 'AUTH' | 'FORM' | 'DOCUMENT' | 'REVIEW' | 'EXPORT' | 'SYSTEM';
}

export interface SimulatedNotification {
  id: string;
  timestamp: string;
  channel: 'WHATSAPP' | 'SMS' | 'EMAIL';
  recipientName: string;
  recipientPhone: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
}

export interface CompanyConfig {
  id: string;
  name: string;
  tagline: string;
  logoUrl?: string;
  brandColor: string;
  isCustom?: boolean;
}

