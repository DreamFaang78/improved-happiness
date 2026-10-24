export type KycStatus = 
  | 'INVITED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'CORRECTION_REQUIRED'
  | 'APPROVED'
  | 'EXPIRED'
  | 'REJECTED';

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
  type: DocumentType;
  title: string;
  fileName: string;
  fileSize: string;
  fileDataUrl?: string; // in-memory only data URL or SVG sample
  uploadTimestamp: string;
  status: DocumentReviewStatus;
  correctionReason?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  isSample?: boolean;
}

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
  performedBy: string; // e.g. "Candidate (Rahul S.)", "HR Admin (Priya M.)", "System"
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
