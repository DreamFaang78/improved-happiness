import { 
  DemoRole, 
  Employee, 
  AttendanceRecord, 
  PayrollRecord, 
  StatutoryComplianceItem, 
  DocumentItem, 
  MonthlyCompliancePack, 
  SystemConfig,
  AttendanceStatus,
  PayrollStatus
} from '../types';
import { 
  INITIAL_CONFIG, 
  INITIAL_EMPLOYEES, 
  INITIAL_ATTENDANCE, 
  INITIAL_PAYROLL, 
  INITIAL_COMPLIANCE_ITEMS, 
  INITIAL_DOCUMENTS, 
  INITIAL_COMPLIANCE_PACKS 
} from '../data/complianceSeed';

const STORE_KEYS = {
  ROLE: 'sw_compliance_role_v2',
  CONFIG: 'sw_compliance_config_v2',
  EMPLOYEES: 'sw_compliance_employees_v2',
  ATTENDANCE: 'sw_compliance_attendance_v2',
  PAYROLL: 'sw_compliance_payroll_v2',
  COMPLIANCE: 'sw_compliance_items_v2',
  DOCUMENTS: 'sw_compliance_docs_v2',
  PACKS: 'sw_compliance_packs_v2'
};

type Listener = () => void;

class ComplianceStore {
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORE_KEYS.ROLE)) {
      localStorage.setItem(STORE_KEYS.ROLE, 'SUPER_ADMIN');
    }
    if (!localStorage.getItem(STORE_KEYS.CONFIG)) {
      localStorage.setItem(STORE_KEYS.CONFIG, JSON.stringify(INITIAL_CONFIG));
    }
    if (!localStorage.getItem(STORE_KEYS.EMPLOYEES)) {
      localStorage.setItem(STORE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    }
    if (!localStorage.getItem(STORE_KEYS.ATTENDANCE)) {
      localStorage.setItem(STORE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
    }
    if (!localStorage.getItem(STORE_KEYS.PAYROLL)) {
      localStorage.setItem(STORE_KEYS.PAYROLL, JSON.stringify(INITIAL_PAYROLL));
    }
    if (!localStorage.getItem(STORE_KEYS.COMPLIANCE)) {
      localStorage.setItem(STORE_KEYS.COMPLIANCE, JSON.stringify(INITIAL_COMPLIANCE_ITEMS));
    }
    if (!localStorage.getItem(STORE_KEYS.DOCUMENTS)) {
      localStorage.setItem(STORE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
    }
    if (!localStorage.getItem(STORE_KEYS.PACKS)) {
      localStorage.setItem(STORE_KEYS.PACKS, JSON.stringify(INITIAL_COMPLIANCE_PACKS));
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error('Store notification error:', err);
      }
    });
  }

  // --- Role Management ---
  public getRole(): DemoRole {
    this.ensureInitialized();
    return (localStorage.getItem(STORE_KEYS.ROLE) as DemoRole) || 'SUPER_ADMIN';
  }

  public setRole(role: DemoRole): void {
    localStorage.setItem(STORE_KEYS.ROLE, role);
    this.notify();
  }

  // --- Config Management ---
  public getConfig(): SystemConfig {
    this.ensureInitialized();
    const data = localStorage.getItem(STORE_KEYS.CONFIG);
    return data ? JSON.parse(data) : { ...INITIAL_CONFIG };
  }

  public updateConfig(config: SystemConfig): void {
    localStorage.setItem(STORE_KEYS.CONFIG, JSON.stringify(config));
    this.notify();
  }

  // --- Employee Management ---
  public getEmployees(): Employee[] {
    this.ensureInitialized();
    const data = localStorage.getItem(STORE_KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : [...INITIAL_EMPLOYEES];
  }

  public getEmployeeById(id: string): Employee | undefined {
    return this.getEmployees().find(e => e.id === id || e.empId === id);
  }

  public saveEmployee(emp: Employee): void {
    const list = this.getEmployees();
    const index = list.findIndex(e => e.id === emp.id);
    if (index >= 0) {
      list[index] = emp;
    } else {
      list.unshift(emp);
    }
    localStorage.setItem(STORE_KEYS.EMPLOYEES, JSON.stringify(list));
    this.notify();
  }

  // --- Attendance Management ---
  public getAttendance(): AttendanceRecord[] {
    this.ensureInitialized();
    const data = localStorage.getItem(STORE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [...INITIAL_ATTENDANCE];
  }

  public saveAttendanceBatch(records: AttendanceRecord[]): void {
    const list = this.getAttendance();
    records.forEach(rec => {
      const idx = list.findIndex(a => a.employeeId === rec.employeeId && a.date === rec.date);
      if (idx >= 0) {
        list[idx] = rec;
      } else {
        list.push(rec);
      }
    });
    localStorage.setItem(STORE_KEYS.ATTENDANCE, JSON.stringify(list));
    this.notify();
  }

  public approveSiteAttendance(siteId: string, date: string, approver: string): void {
    const list = this.getAttendance().map(a => {
      if (a.siteId === siteId && a.date === date) {
        return { ...a, approved: true, approvedBy: approver };
      }
      return a;
    });
    localStorage.setItem(STORE_KEYS.ATTENDANCE, JSON.stringify(list));
    this.notify();
  }

  // --- Payroll Management ---
  public getPayroll(): PayrollRecord[] {
    this.ensureInitialized();
    const data = localStorage.getItem(STORE_KEYS.PAYROLL);
    return data ? JSON.parse(data) : [...INITIAL_PAYROLL];
  }

  public updatePayrollStatus(id: string, status: PayrollStatus, reviewer?: string, remarks?: string): void {
    const list = this.getPayroll().map(p => {
      if (p.id === id) {
        return {
          ...p,
          status,
          reviewedBy: reviewer || 'Authorized Reviewer',
          reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          remarks: remarks || p.remarks
        };
      }
      return p;
    });
    localStorage.setItem(STORE_KEYS.PAYROLL, JSON.stringify(list));
    this.notify();
  }

  // --- Compliance Items Tracker ---
  public getComplianceItems(): StatutoryComplianceItem[] {
    this.ensureInitialized();
    const data = localStorage.getItem(STORE_KEYS.COMPLIANCE);
    return data ? JSON.parse(data) : [...INITIAL_COMPLIANCE_ITEMS];
  }

  public saveComplianceItem(item: StatutoryComplianceItem): void {
    const list = this.getComplianceItems();
    const idx = list.findIndex(c => c.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    localStorage.setItem(STORE_KEYS.COMPLIANCE, JSON.stringify(list));
    this.notify();
  }

  // --- Document Centre ---
  public getDocuments(): DocumentItem[] {
    this.ensureInitialized();
    const data = localStorage.getItem(STORE_KEYS.DOCUMENTS);
    return data ? JSON.parse(data) : [...INITIAL_DOCUMENTS];
  }

  public saveDocument(doc: DocumentItem): void {
    const list = this.getDocuments();
    list.unshift(doc);
    localStorage.setItem(STORE_KEYS.DOCUMENTS, JSON.stringify(list));
    this.notify();
  }

  // --- Monthly Compliance Packs ---
  public getPacks(): MonthlyCompliancePack[] {
    this.ensureInitialized();
    const data = localStorage.getItem(STORE_KEYS.PACKS);
    return data ? JSON.parse(data) : [...INITIAL_COMPLIANCE_PACKS];
  }

  public savePack(pack: MonthlyCompliancePack): void {
    const list = this.getPacks();
    const idx = list.findIndex(p => p.id === pack.id);
    if (idx >= 0) {
      list[idx] = { ...pack, updatedAt: new Date().toISOString().substring(0, 10) };
    } else {
      list.unshift(pack);
    }
    localStorage.setItem(STORE_KEYS.PACKS, JSON.stringify(list));
    this.notify();
  }

  // --- Reset Entire Store to Initial Seed ---
  public resetDemoData(): void {
    localStorage.setItem(STORE_KEYS.ROLE, 'SUPER_ADMIN');
    localStorage.setItem(STORE_KEYS.CONFIG, JSON.stringify(INITIAL_CONFIG));
    localStorage.setItem(STORE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    localStorage.setItem(STORE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
    localStorage.setItem(STORE_KEYS.PAYROLL, JSON.stringify(INITIAL_PAYROLL));
    localStorage.setItem(STORE_KEYS.COMPLIANCE, JSON.stringify(INITIAL_COMPLIANCE_ITEMS));
    localStorage.setItem(STORE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
    localStorage.setItem(STORE_KEYS.PACKS, JSON.stringify(INITIAL_COMPLIANCE_PACKS));
    this.notify();
  }
}

export const complianceStore = new ComplianceStore();
