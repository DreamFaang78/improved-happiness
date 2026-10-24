import { 
  CandidateRecord, 
  AuditLogEntry, 
  SimulatedNotification, 
  CompanyConfig, 
  DocumentReviewStatus 
} from '../types';
import { 
  SEED_CANDIDATES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_COMPANIES 
} from '../data/seedData';

const STORAGE_KEYS = {
  CANDIDATES: 'kyc_demo_candidates_v1',
  AUDIT_LOGS: 'kyc_demo_audit_logs_v1',
  NOTIFICATIONS: 'kyc_demo_notifications_v1',
  COMPANIES: 'kyc_demo_companies_v1',
  ACTIVE_COMPANY_ID: 'kyc_demo_active_company_id_v1',
  CURRENT_SUBMISSION: 'kyc_demo_current_submission_v1'
};

// In-memory only file storage: strictly never persisted to disk or sent over network
const memoryFileStore = new Map<string, string>();

type ListenerCallback = () => void;

class MockDataProvider {
  private listeners: Set<ListenerCallback> = new Set();

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.CANDIDATES)) {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(SEED_CANDIDATES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMPANIES)) {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(INITIAL_COMPANIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_COMPANY_ID)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_COMPANY_ID, INITIAL_COMPANIES[0].id);
    }
  }

  public subscribe(callback: ListenerCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error('Listener callback error', err);
      }
    });
  }

  // Candidates
  public async getCandidates(): Promise<CandidateRecord[]> {
    this.ensureInitialized();
    const data = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
    return data ? JSON.parse(data) : [...SEED_CANDIDATES];
  }

  public async getCandidateById(id: string): Promise<CandidateRecord | null> {
    const list = await this.getCandidates();
    return list.find(c => c.id === id) || null;
  }

  public async saveCandidate(candidate: CandidateRecord): Promise<CandidateRecord> {
    const list = await this.getCandidates();
    const index = list.findIndex(c => c.id === candidate.id);
    if (index >= 0) {
      list[index] = candidate;
    } else {
      list.unshift(candidate); // put newest at top
    }
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(list));
    this.notify();
    return candidate;
  }

  public async updateDocumentStatus(
    candidateId: string, 
    docId: string, 
    status: DocumentReviewStatus, 
    reason?: string
  ): Promise<CandidateRecord> {
    const candidate = await this.getCandidateById(candidateId);
    if (!candidate) throw new Error('Candidate not found');

    const docIndex = candidate.documents.findIndex(d => d.id === docId);
    if (docIndex >= 0) {
      const doc = candidate.documents[docIndex];
      doc.status = status;
      doc.reviewedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      doc.reviewedBy = 'HR Operations Admin';
      if (reason) {
        doc.correctionReason = reason;
      }
    }

    // Check overall candidate status
    const allApproved = candidate.documents.length > 0 && candidate.documents.every(d => d.status === 'APPROVED');
    const hasCorrection = candidate.documents.some(d => d.status === 'CORRECTION_REQUIRED');
    const hasRejected = candidate.documents.some(d => d.status === 'REJECTED');

    const previousStatus = candidate.status;
    if (hasCorrection) {
      candidate.status = 'CORRECTION_REQUIRED';
    } else if (hasRejected) {
      candidate.status = 'REJECTED';
    } else if (allApproved) {
      candidate.status = 'APPROVED';
      candidate.approvedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }

    await this.saveCandidate(candidate);

    // Add audit entry
    const docTitle = candidate.documents[docIndex]?.title || 'Document';
    await this.addAuditLog({
      candidateId: candidate.id,
      candidateName: candidate.fullName,
      action: `Document ${status}: ${docTitle}`,
      details: reason ? `Reason provided: "${reason}"` : `HR marked status as ${status}`,
      performedBy: 'HR Operations Admin',
      category: 'REVIEW'
    });

    // If status changed to CORRECTION_REQUIRED, send simulated WhatsApp alert
    if (status === 'CORRECTION_REQUIRED' && reason) {
      await this.addNotification({
        channel: 'WHATSAPP',
        recipientName: candidate.fullName,
        recipientPhone: candidate.mobileNumber,
        title: `Correction Requested: ${docTitle}`,
        message: `Hello ${candidate.fullName}, your document (${docTitle}) requires a quick correction: "${reason}". Please update it here: https://portal.demo/correction?id=${candidate.id}`,
        link: `/correction?id=${candidate.id}`,
        isRead: false
      });
    } else if (candidate.status === 'APPROVED' && previousStatus !== 'APPROVED') {
      await this.addNotification({
        channel: 'WHATSAPP',
        recipientName: candidate.fullName,
        recipientPhone: candidate.mobileNumber,
        title: 'KYC Approved & Onboarding Complete! 🎉',
        message: `Congratulations ${candidate.fullName}! All your KYC documents have been reviewed and approved by ${candidate.companyName}. Welcome aboard!`,
        isRead: false
      });
    }

    return candidate;
  }

  // Audit Logs
  public async getAuditLogs(): Promise<AuditLogEntry[]> {
    this.ensureInitialized();
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return data ? JSON.parse(data) : [...INITIAL_AUDIT_LOGS];
  }

  public async addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> {
    const list = await this.getAuditLogs();
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: formatted
    };
    list.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(list.slice(0, 100))); // keep latest 100
    this.notify();
    return newEntry;
  }

  // Notifications
  public async getNotifications(): Promise<SimulatedNotification[]> {
    this.ensureInitialized();
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [...INITIAL_NOTIFICATIONS];
  }

  public async addNotification(item: Omit<SimulatedNotification, 'id' | 'timestamp'>): Promise<SimulatedNotification> {
    const list = await this.getNotifications();
    const newNotification: SimulatedNotification = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now'
    };
    list.unshift(newNotification);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    this.notify();
    return newNotification;
  }

  public async markNotificationAsRead(id: string): Promise<void> {
    const list = await this.getNotifications();
    const target = list.find(n => n.id === id);
    if (target) {
      target.isRead = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
      this.notify();
    }
  }

  // Companies & Personalization
  public async getCompanies(): Promise<CompanyConfig[]> {
    this.ensureInitialized();
    const data = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    return data ? JSON.parse(data) : [...INITIAL_COMPANIES];
  }

  public async getActiveCompany(): Promise<CompanyConfig> {
    const companies = await this.getCompanies();
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_COMPANY_ID) || companies[0].id;
    return companies.find(c => c.id === activeId) || companies[0];
  }

  public async setActiveCompany(company: CompanyConfig): Promise<void> {
    const companies = await this.getCompanies();
    const existingIndex = companies.findIndex(c => c.id === company.id);
    if (existingIndex >= 0) {
      companies[existingIndex] = company;
    } else {
      companies.push(company);
    }
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_COMPANY_ID, company.id);
    this.notify();
  }

  // Memory File Store (Guaranteed zero leakage to network/disk)
  public storeFileInMemory(key: string, fileDataUrl: string): void {
    memoryFileStore.set(key, fileDataUrl);
  }

  public getFileFromMemory(key: string): string | undefined {
    return memoryFileStore.get(key);
  }

  // Reset demo back to clean initial seed
  public async resetToSeed(): Promise<void> {
    memoryFileStore.clear();
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(SEED_CANDIDATES));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(INITIAL_COMPANIES));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_COMPANY_ID, INITIAL_COMPANIES[0].id);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SUBMISSION);
    this.notify();
  }
}

export const dataProvider = new MockDataProvider();
