# SecureWave HR & Labour Compliance Management System

> **Mobile-First Enterprise Demonstration Platform**  
> Built for Indian industrial, civil contracting, facility management, and workforce compliance demonstrations.

---

## 🌟 Executive Overview

**SecureWave** is a comprehensive, mobile-first HR and statutory labour compliance management platform designed for client presentations and procurement reviews. It enables executive teams to explore an end-to-end workforce operations suite—from daily site muster roll entries and payroll calculation reviews to statutory return filings and client monthly compliance package creation.

The application is completely self-contained, requiring **zero backend servers, paid APIs, or cloud database credentials**. All demo states reactively persist in browser `localStorage` with a 1-tap demo data reset.

---

## 📱 Mobile-First Design Architecture

The UI is built according to strict mobile-first enterprise design specifications:

- **Color Palette:** Dark Navy (`#0f172a`) primary, vibrant Teal (`#0d9488`) accent, clean soft neutral slate backgrounds, and high-contrast status pills (Emerald, Amber, Rose, Slate).
- **Responsive Navigation:**
  - **Mobile (< 768px):** Compact top enterprise header with role switcher and notifications, paired with an app-style 5-tab bottom navigation bar (`Dashboard`, `Employees`, `Attendance`, `Compliance`, `More`).
  - **Tablet & Desktop (>= 768px):** Collapsible left sidebar with persistent quick metrics and full module links.
- **Strict Mobile Rules:** Minimum 44×44px touch targets, zero accidental horizontal scrolling, safe-area inset support for modern smartphones, and cards instead of overcrowded desktop data grids.

---

## 🚀 Key Functional Modules

### 1. Dynamic Mobile Dashboard
- **Live Computed KPIs:** Total Employees, Active Project Sites, Attendance Pending Approval, Payroll Pending Review, Outstanding Compliance Items, and Expiring Documents.
- **Instant Reactive Sync:** Editing any attendance muster, approving payroll, or uploading compliance evidence immediately recalculates all dashboard metric counters.
- **Role-Aware Quick Actions:** 1-tap triggers for `Add Employee`, `Mark Attendance`, `Review Payroll`, and `Create Compliance Pack`.
- **Site Workforce Distribution:** Live headcount breakdown across sites (Nava Raipur SEZ, Mumbai Metro Line 3, DLF CyberCity).

### 2. Employee Management & Directory
- **Mobile Card View & Desktop Table:** Displays employee ID, trade designation, project site, contractor, and verification status.
- **Search, Filter & Sort:** Instant query filtering across names, designations, and active employment statuses.
- **Add & Edit Employee Modal:** Mobile-friendly single-column form with validation for Indian statutory identifiers (Aadhaar, PAN, EPFO UAN, ESIC, wage structure, and bank IFSC lookup).

### 3. Touch-Friendly Site Attendance Muster
- **Designed for Site Incharges:** Rapid tap controls for `P` (Present), `A` (Absent), `L` (Leave), `WO` (Weekly Off), and `H` (Holiday).
- **Overtime Hours Selector:** Quick dropdown for overtime tracking (0h to 4h).
- **Muster Approval & Lock:** Two-step confirmation for Site Incharges and Project Managers to lock attendance periods and unlock when adjustments are needed.
- **Biometric CSV Import:** Simulates importing biometric attendance records directly into the local state.

### 4. Payroll Workspace & Review
- **Prominent Net Payable Hero Card:** Shows total wage bill and pending review badges.
- **Expandable Statutory Breakdown:** Clean breakdown of Basic Pay, HRA & Allowances, Overtime Earnings, illustrative PF (12%), illustrative ESIC (0.75%), and other deductions.
- **Review Actions:** One-tap `Approve` or `Return for Changes` with required operational remark modal.
- **Printable Demo Payslip:** Formatted A4 printable salary slip.
- **CSV Wage Register Export:** Exports wage registers directly to `.csv`.
- **Mandatory Disclaimer:** *DEMO ONLY — NOT VALIDATED FOR ACTUAL SALARY PAYMENTS OR STATUTORY FILING.*

### 5. Statutory Compliance Tracker
- Covers major Indian statutory requirements:
  - Form B Wage Register under CLRA
  - Monthly PF ECR Electronic Return
  - ESIC Monthly Contribution Challan
  - Site Hot Work & Scaffolding Safety Permits
  - Half-Yearly CLRA Returns
- Real-time status tags (`Pending`, `Uploaded`, `Verified`, `Rejected`) and responsible officer assignments.
- Attachment preview and demo evidence upload simulation.

### 6. Enterprise Document Centre
- Categorized repository (`Statutory Returns`, `Employee KYC`, `Wage Registers`, `Safety Audits`, `Contract Agreements`).
- Expiry date monitoring with visual warnings for documents expiring within 30 days.

### 7. Monthly Compliance Pack Compiler (Flagship Feature)
The flagship client demonstration feature—a 9-step guided compliance compiler:
1. **Scope Selection:** Select Company, Client, Project, Site, and Billing Month.
2. **Checklist Generation:** Dynamically pulls required statutory documents for the chosen scope.
3. **Completeness Review:** Visual categorization of Completed, Missing, Pending, and Rejected items.
4. **Resolve Missing Items:** Tap missing items to upload demo evidence or mark compliant.
5. **3-Point Internal Review:** Multi-signoff checklist for HR Operations, Accounts & Billing, and Site Incharge.
6. **Readiness Calculation:** Dynamic readiness score percentage with itemized outstanding count.
7. **Approval & Lock:** Package transition to *Internally Approved*.
8. **Export:** Generates print-ready A4 compliance summary and downloadable CSV checklist.
9. **Record Submission:** Record submission date, reference acknowledgment number, and government/client submission notes.
- **Mandatory Disclaimer:** *Submission and acknowledgement statuses are demonstration records; no actual client or government submission is performed.*

### 8. Role-Based Demo Mode
Switch between 7 enterprise personas instantly to demonstrate role-based access control:
- **Super Admin:** Unrestricted access to all modules and configurations.
- **HR:** Employee records, KYC reviews, and statutory HR checklists.
- **Accounts:** Wage calculations, PF/ESI review, and financial evidence.
- **Project Coordinator:** Cross-site monitoring and compliance pack compilation.
- **Site Incharge:** Site-level attendance muster, overtime, and safety permits.
- **Employee:** Personal payslip, profile, and KYC documents.
- **Client Viewer:** Read-only compliance pack review and verified submissions.

### 9. Interactive Candidate KYC Onboarding Flow
- Experience the end-to-end candidate onboarding journey:
  - Simulated WhatsApp invite bubble with secure joining link
  - Sample OTP authentication (fixed demo code `4291` with 1-tap autofill)
  - 4-step mobile wizard with Aadhaar, PAN, and automated bank IFSC verification
  - HTML5 canvas digital signature pad
  - Watermarked PDF dossier download with HR review and correction loops.

### 10. Dynamic System Settings & Data Reset
- Customize Company Name, Sample Sites, Projects, Contractors, and Trade Designations on the fly.
- **Reset Demo Data:** Restores original sample dataset with 1-tap confirmation.

---

## 🛠️ Technology Stack

- **Framework:** React 18, Vite 6, TypeScript
- **Styling:** Tailwind CSS (Enterprise Slate & Teal Palette)
- **Icons:** Lucide React
- **Persistence:** Reactive Browser `localStorage` Store (Zero backend dependency)
- **Deployment:** Vercel / Netlify / Cloudflare Pages ready
- **PWA Ready:** `manifest.json`, mobile viewport meta tags, Apple touch icons

---

## 💻 Local Quick Start

```bash
# 1. Clone repository
git clone https://github.com/DreamFaang78/improved-happiness.git
cd improved-happiness

# 2. Install dependencies
npm install

# 3. Launch local development server
npm run dev

# 4. Open in browser
# Local URL: http://localhost:3000/
```

### Production Build & Preview

```bash
# Build production bundle with TypeScript check
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Sample CSV Import File

A sample biometric attendance file is included in the project root: `sample_attendance_biometric.csv` (and downloadable via `/sample_attendance_biometric.csv`).

```csv
employeeId,date,status,overtimeHours
EMP001,2026-10-24,P,0
EMP002,2026-10-24,P,2
EMP003,2026-10-24,P,1
EMP004,2026-10-24,A,0
EMP005,2026-10-24,P,0
EMP006,2026-10-24,L,0
EMP007,2026-10-24,P,3
EMP008,2026-10-24,WO,0
EMP009,2026-10-24,P,0
EMP010,2026-10-24,P,2
```

---

## ☁️ Vercel Deployment Guide

To deploy this project to Vercel:

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete SecureWave mobile-first HR & labour compliance system"
   git push origin main
   ```
2. Log into [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import the `DreamFaang78/improved-happiness` repository.
4. Framework Preset: **Vite** (auto-detected).
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **"Deploy"**. The app will be live on your custom `*.vercel.app` domain in seconds!

---

## ⚖️ Legal & Security Disclaimers

- **Demo Environment Only:** All identities, Aadhaar numbers, PAN numbers, bank accounts, and compliance filings presented are fictional.
- **Calculations Disclaimer:** Payroll deductions and compliance readiness calculations are for software evaluation and client demonstration only; they are not validated for actual legal salary disbarment or government statutory filings.
- **Client-Side Security:** Role switches and localStorage states run entirely inside the client's browser for demonstration agility. Production systems must implement server-side authentication, RBAC, and encrypted databases.
