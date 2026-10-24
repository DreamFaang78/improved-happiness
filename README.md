# improved-happiness

## Digital Joining & Instant KYC Verification Portal (Interactive Demo)

A polished, safe, self-contained interactive demo of an enterprise digital onboarding and KYC verification portal. It lets prospective clients experience the entire journey—from HR dispatching a joining invite to approving the KYC dossier—in under 5 minutes on both laptops and mobile devices with zero server setup and zero real data leaks.

---

## 🌟 Core Concept: One Link, Two Sides

The visitor can experience the platform from both perspectives:
1. **The New Hire (Employee Flow):**
   - Simulated WhatsApp invite bubble with secure 48-hour joining link
   - Digital privacy notice and statutory consent
   - Sample OTP authentication (fixed code `4291` with 1-tap autofill)
   - 4-Step KYC form with real-time validation:
     - **Personal details** (age validation >= 18)
     - **Address** with 6-digit PIN code check
     - **Banking & Statutory** with strict PAN regex check and **instant automated bank branch lookup** via IFSC code (e.g. HDFC Bank, SBI, ICICI Bank)
     - **Document Uploads & Digital Signature** (one-tap sample cards marked `SAMPLE DEMO ONLY` or local in-memory files + interactive HTML5 canvas signature pad)
   - Review, statutory declaration, submission with confetti, and direct prompt to switch to HR dashboard.
2. **HR Operations Admin:**
   - Real-time command center with status metric counters (Total, Submitted, Correction Required, Approved, In Progress, Invited, Expired)
   - Pinned user submission at the very top marked `✨ YOUR SUBMISSION (NEW)`
   - Split-screen candidate drawer:
     - Left: Candidate profile, banking, EPFO/ESIC, and address dossier
     - Right: Interactive Document Viewer with Zoom In/Out, Rotate 90°, Fullscreen, and Review Actions (`Approve`, `Request Correction`, `Reject`)
   - Bidirectional correction loop: Requesting a document correction automatically simulates a WhatsApp ping to the candidate with a direct re-upload link
   - 1-Click "Quick Approve All" and "Download Watermarked KYC Dossier (PDF)"
   - Immutable real-time compliance audit log

---

## 🛠️ Tech Stack

- **Framework:** React 18 with Vite & TypeScript
- **Styling:** Tailwind CSS with custom design tokens & glassmorphism
- **Icons:** Lucide React
- **Animations & FX:** Pure Canvas Confetti & subtle CSS micro-animations
- **Data Architecture:** `DataProvider` interface with `MockDataProvider` (localStorage persistence + memory-only file isolation)

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
# http://localhost:3000/
```

To build for production:
```bash
npm run build
npm run preview
```

---

## 🔒 Safe by Design

- **100% Client-Side Isolation:** No typed names, bank details, or uploaded documents are transmitted to external servers.
- **In-Memory File Handling:** Uploaded images and PDFs stay strictly in browser RAM and are lost on refresh.
- **Fictional Identities:** All seeded Aadhaar, PAN, and phone records are mathematically valid format simulations clearly labeled with sample tags.
