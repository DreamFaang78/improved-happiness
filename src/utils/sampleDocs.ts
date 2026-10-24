// SVG Sample Documents generator for safe, client-side demo KYC verification
// Adheres strictly to PRD: No real government logos, watermark "SAMPLE", fictional identifiers

export const getSampleDocSvg = (
  type: 'aadhaar_card' | 'pan_card' | 'bank_proof' | 'photograph' | 'signature',
  name: string = 'Rahul Sharma',
  extraInfo?: string
): string => {
  let svgContent = '';

  if (type === 'aadhaar_card') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="100%" height="100%">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fffbeb" />
            <stop offset="100%" stop-color="#f8fafc" />
          </linearGradient>
          <pattern id="diagonalHatch" width="40" height="40" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="40" stroke="#f1f5f9" stroke-width="2" />
          </pattern>
        </defs>
        
        <!-- Background -->
        <rect width="600" height="380" rx="16" fill="url(#bgGrad)" stroke="#cbd5e1" stroke-width="3" />
        <rect width="600" height="380" rx="16" fill="url(#diagonalHatch)" opacity="0.6" />
        
        <!-- Header Strip -->
        <rect x="0" y="0" width="600" height="60" rx="16" fill="#1e293b" />
        <rect x="0" y="45" width="600" height="15" fill="#1e293b" />
        <text x="30" y="38" font-family="sans-serif" font-weight="700" font-size="20" fill="#ffffff" letter-spacing="1">DEMO IDENTITY CARD (SAMPLE ONLY)</text>
        <text x="560" y="38" font-family="sans-serif" font-weight="600" font-size="14" fill="#94a3b8" text-anchor="end">NON-GOVERNMENT</text>

        <!-- Watermark diagonal text -->
        <text x="300" y="220" font-family="sans-serif" font-size="52" font-weight="900" fill="#ef4444" fill-opacity="0.12" text-anchor="middle" transform="rotate(-25 300 220)" letter-spacing="4">SAMPLE DEMO ONLY</text>

        <!-- Photo Silhouette Frame -->
        <rect x="36" y="90" width="110" height="140" rx="8" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2" />
        <circle cx="91" cy="140" r="28" fill="#64748b" />
        <path d="M51 215 C51 180, 131 180, 131 215 Z" fill="#64748b" />
        <rect x="36" y="235" width="110" height="24" rx="4" fill="#3b82f6" />
        <text x="91" y="251" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">KYC VERIFIED</text>

        <!-- Details -->
        <text x="170" y="112" font-family="sans-serif" font-size="13" font-weight="600" fill="#64748b">NAME / नाम</text>
        <text x="170" y="136" font-family="sans-serif" font-size="20" font-weight="700" fill="#0f172a">${name}</text>

        <text x="170" y="172" font-family="sans-serif" font-size="13" font-weight="600" fill="#64748b">DOB / जन्म तिथि: <tspan fill="#0f172a" font-weight="700">14/08/1996</tspan></text>
        <text x="170" y="200" font-family="sans-serif" font-size="13" font-weight="600" fill="#64748b">GENDER / लिंग: <tspan fill="#0f172a" font-weight="700">MALE / पुरुष</tspan></text>
        <text x="170" y="228" font-family="sans-serif" font-size="12" font-weight="500" fill="#64748b">Father: Ramesh Sharma</text>

        <!-- QR Code Placeholder -->
        <rect x="440" y="90" width="120" height="120" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" />
        <rect x="455" y="105" width="30" height="30" fill="#0f172a" />
        <rect x="515" y="105" width="30" height="30" fill="#0f172a" />
        <rect x="455" y="165" width="30" height="30" fill="#0f172a" />
        <rect x="495" y="145" width="20" height="20" fill="#0f172a" />
        <text x="500" y="224" font-family="sans-serif" font-size="10" font-weight="bold" fill="#64748b" text-anchor="middle">DEMO QR CODE</text>

        <!-- Masked Number Bar -->
        <rect x="25" y="280" width="550" height="70" rx="10" fill="#f1f5f9" stroke="#e2e8f0" />
        <text x="300" y="325" font-family="monospace" font-size="28" font-weight="800" fill="#0f172a" letter-spacing="6" text-anchor="middle">XXXX  XXXX  1234</text>
        <text x="300" y="344" font-family="sans-serif" font-size="11" font-weight="600" fill="#ef4444" text-anchor="middle">DEMO DATA ONLY • SAFE BY DESIGN • NO REAL CITIZEN DATA</text>
      </svg>
    `;
  } else if (type === 'pan_card') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="100%" height="100%">
        <defs>
          <linearGradient id="panGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ecfeff" />
            <stop offset="100%" stop-color="#cffafe" />
          </linearGradient>
        </defs>
        <rect width="600" height="380" rx="16" fill="url(#panGrad)" stroke="#0891b2" stroke-width="3" />
        
        <!-- Header -->
        <rect x="0" y="0" width="600" height="65" rx="16" fill="#0e7490" />
        <rect x="0" y="50" width="600" height="15" fill="#0e7490" />
        <text x="30" y="32" font-family="sans-serif" font-weight="800" font-size="17" fill="#ffffff" letter-spacing="1">INCOME TAX VERIFICATION MOCKUP</text>
        <text x="30" y="52" font-family="sans-serif" font-weight="500" font-size="12" fill="#cffafe">PERMANENT ACCOUNT CARD DEMO</text>
        
        <!-- Watermark -->
        <text x="300" y="220" font-family="sans-serif" font-size="48" font-weight="900" fill="#0284c7" fill-opacity="0.15" text-anchor="middle" transform="rotate(-25 300 220)">SAMPLE PAN CARD</text>

        <!-- Photo -->
        <rect x="40" y="95" width="110" height="135" rx="6" fill="#f1f5f9" stroke="#0891b2" stroke-width="2" />
        <circle cx="95" cy="145" r="28" fill="#475569" />
        <path d="M55 220 C55 185, 135 185, 135 220 Z" fill="#475569" />

        <!-- Signature Box -->
        <rect x="40" y="245" width="140" height="48" rx="4" fill="#ffffff" stroke="#94a3b8" />
        <path d="M 50 275 Q 80 255 110 270 T 165 260" fill="none" stroke="#0f172a" stroke-width="2.5" />
        <text x="45" y="304" font-family="sans-serif" font-size="10" font-weight="600" fill="#64748b">CARDHOLDER SIGNATURE</text>

        <!-- Details -->
        <text x="175" y="112" font-family="sans-serif" font-size="11" font-weight="700" fill="#64748b">PERMANENT ACCOUNT NUMBER (PAN)</text>
        <text x="175" y="140" font-family="monospace" font-size="26" font-weight="800" fill="#0f172a" letter-spacing="3">ABCDE1234F</text>

        <text x="175" y="180" font-family="sans-serif" font-size="11" font-weight="600" fill="#64748b">NAME</text>
        <text x="175" y="202" font-family="sans-serif" font-size="18" font-weight="700" fill="#0f172a">${name.toUpperCase()}</text>

        <text x="175" y="235" font-family="sans-serif" font-size="11" font-weight="600" fill="#64748b">FATHER'S NAME</text>
        <text x="175" y="255" font-family="sans-serif" font-size="15" font-weight="600" fill="#1e293b">RAMESH SHARMA</text>

        <text x="175" y="285" font-family="sans-serif" font-size="11" font-weight="600" fill="#64748b">DATE OF BIRTH</text>
        <text x="175" y="305" font-family="sans-serif" font-size="15" font-weight="600" fill="#1e293b">14/08/1996</text>

        <!-- Hologram mock -->
        <rect x="470" y="100" width="85" height="75" rx="8" fill="#e2e8f0" stroke="#0891b2" />
        <text x="512" y="142" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0e7490" text-anchor="middle">SECURITY</text>
        <text x="512" y="156" font-family="sans-serif" font-size="9" fill="#64748b" text-anchor="middle">HOLOGRAM</text>

        <!-- Bottom alert -->
        <rect x="0" y="340" width="600" height="40" rx="0" fill="#0f172a" />
        <text x="300" y="365" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38bdf8" text-anchor="middle">FICTIONAL DATA RECORD • DESIGNED FOR SALES DEMO VALIDATION</text>
      </svg>
    `;
  } else if (type === 'bank_proof') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 340" width="100%" height="100%">
        <rect width="650" height="340" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="2.5" />
        
        <!-- Watermark -->
        <text x="325" y="190" font-family="sans-serif" font-size="70" font-weight="900" fill="#dc2626" fill-opacity="0.25" text-anchor="middle" transform="rotate(-15 325 190)" letter-spacing="6">CANCELLED</text>
        <line x1="120" y1="280" x2="520" y2="60" stroke="#dc2626" stroke-width="5" stroke-dasharray="12 8" opacity="0.4" />
        <line x1="140" y1="290" x2="540" y2="70" stroke="#dc2626" stroke-width="5" stroke-dasharray="12 8" opacity="0.4" />

        <!-- Cheque Bank details -->
        <text x="35" y="42" font-family="sans-serif" font-size="18" font-weight="800" fill="#14532d">HDFC BANK LTD.</text>
        <text x="35" y="60" font-family="sans-serif" font-size="12" fill="#475569">Cyber City Branch, Gurugram - 122002</text>
        <text x="35" y="78" font-family="sans-serif" font-size="12" font-weight="bold" fill="#15803d">RTGS / NEFT IFSC: HDFC0001234</text>

        <!-- Date boxes -->
        <g transform="translate(470, 25)">
          <text x="0" y="-8" font-family="sans-serif" font-size="10" font-weight="bold" fill="#64748b">DATE: DD MM YYYY</text>
          <rect x="0" y="0" width="18" height="24" fill="#ffffff" stroke="#94a3b8" />
          <rect x="18" y="0" width="18" height="24" fill="#ffffff" stroke="#94a3b8" />
          <rect x="40" y="0" width="18" height="24" fill="#ffffff" stroke="#94a3b8" />
          <rect x="58" y="0" width="18" height="24" fill="#ffffff" stroke="#94a3b8" />
          <rect x="80" y="0" width="18" height="24" fill="#ffffff" stroke="#94a3b8" />
          <rect x="98" y="0" width="18" height="24" fill="#ffffff" stroke="#94a3b8" />
          <rect x="116" y="0" width="18" height="24" fill="#ffffff" stroke="#94a3b8" />
          <rect x="134" y="0" width="18" height="24" fill="#ffffff" stroke="#94a3b8" />
        </g>

        <!-- Payee -->
        <text x="35" y="118" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">PAY __________________________________________________________________ OR BEARER</text>
        <text x="35" y="152" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">RUPEES _________________________________________________________________________</text>

        <!-- Account Box -->
        <rect x="35" y="185" width="280" height="42" rx="4" fill="#ffffff" stroke="#047857" stroke-width="1.5" />
        <text x="45" y="200" font-family="sans-serif" font-size="10" font-weight="bold" fill="#047857">A/C NO.</text>
        <text x="45" y="221" font-family="monospace" font-size="18" font-weight="800" fill="#0f172a" letter-spacing="2">50100234891288</text>

        <!-- Signature area -->
        <text x="500" y="240" font-family="sans-serif" font-size="12" font-weight="bold" fill="#14532d" text-anchor="middle">${name.toUpperCase()}</text>
        <text x="500" y="258" font-family="sans-serif" font-size="11" fill="#64748b" text-anchor="middle">Authorized Signatory</text>

        <!-- Bottom MICR strip -->
        <rect x="0" y="285" width="650" height="55" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
        <text x="325" y="320" font-family="monospace" font-size="18" font-weight="600" fill="#334155" text-anchor="middle" letter-spacing="4">⑈100293⑈ 110240012⑆ 001234⑈ 29</text>
      </svg>
    `;
  } else if (type === 'photograph') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="100%" height="100%">
        <rect width="400" height="480" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3" />
        <defs>
          <linearGradient id="photoGrad" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stop-color="#3b82f6" />
            <stop offset="100%" stop-color="#1d4ed8" />
          </linearGradient>
        </defs>
        
        <!-- Studio Background -->
        <rect x="20" y="20" width="360" height="440" rx="8" fill="#e2e8f0" />
        
        <!-- Avatar Figure -->
        <circle cx="200" cy="180" r="75" fill="#475569" />
        <path d="M 80 430 C 80 300, 320 300, 320 430 Z" fill="#1e293b" />
        <!-- Collared shirt accent -->
        <polygon points="175,300 200,340 225,300 200,380" fill="#ffffff" />
        <polygon points="194,330 206,330 200,430" fill="#ef4444" />

        <!-- Watermark -->
        <rect x="40" y="380" width="320" height="44" rx="6" fill="#0f172a" fill-opacity="0.85" />
        <text x="200" y="408" font-family="sans-serif" font-size="13" font-weight="bold" fill="#38bdf8" text-anchor="middle">PASSPORT PHOTO • DEMO SAMPLE</text>
        <text x="200" y="445" font-family="sans-serif" font-size="12" font-weight="600" fill="#64748b" text-anchor="middle">${name}</text>
      </svg>
    `;
  } else {
    // Signature
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="100%" height="100%">
        <rect width="500" height="200" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
        <line x1="40" y1="150" x2="460" y2="150" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6 4" />
        <path d="M 70 135 C 100 80, 110 50, 130 110 C 145 155, 160 80, 190 120 C 215 145, 235 90, 260 115 C 290 140, 320 70, 360 110 C 390 135, 420 125, 440 100" fill="none" stroke="#1e3a8a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
        <text x="70" y="172" font-family="sans-serif" font-size="12" font-weight="bold" fill="#64748b">DIGITALLY VERIFIED SIGNATURE: ${name.toUpperCase()}</text>
        <text x="440" y="172" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="end">TIMESTAMP: 2026-10-24 14:30:12</text>
      </svg>
    `;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};
