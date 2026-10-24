export const validatePan = (pan: string): { isValid: boolean; message?: string } => {
  const clean = pan.trim().toUpperCase();
  if (!clean) return { isValid: false, message: 'PAN number is required' };
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(clean)) {
    return { isValid: false, message: 'Invalid PAN format. Example: ABCDE1234F' };
  }
  return { isValid: true };
};

export const validateAadhaar = (aadhaar: string): { isValid: boolean; message?: string } => {
  const clean = aadhaar.replace(/\s+/g, '').trim();
  if (!clean) return { isValid: false, message: 'Aadhaar number is required' };
  if (!/^\d{12}$/.test(clean)) {
    return { isValid: false, message: 'Aadhaar must be exactly 12 numeric digits' };
  }
  return { isValid: true };
};

export const formatAadhaar = (val: string): string => {
  const digits = val.replace(/\D/g, '').slice(0, 12);
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.substring(i, i + 4));
  }
  return parts.join(' ');
};

export const validateIfsc = (ifsc: string): { isValid: boolean; message?: string; bankName?: string; branch?: string } => {
  const clean = ifsc.trim().toUpperCase();
  if (!clean) return { isValid: false, message: 'IFSC Code is required' };
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  if (!ifscRegex.test(clean)) {
    return { isValid: false, message: 'Invalid IFSC. 4 letters, 0, then 6 alphanumeric characters (e.g. HDFC0001234)' };
  }

  // Simulated Bank Lookup based on prefix
  const prefix = clean.substring(0, 4);
  const bankDirectory: Record<string, { bank: string; branch: string }> = {
    'HDFC': { bank: 'HDFC Bank Ltd.', branch: 'Cyber City Branch, Gurugram' },
    'SBIN': { bank: 'State Bank of India', branch: 'Industrial Finance Branch, New Delhi' },
    'ICIC': { bank: 'ICICI Bank Ltd.', branch: 'Bandra Kurla Complex Branch, Mumbai' },
    'AXIS': { bank: 'Axis Bank Ltd.', branch: 'Sector 62 Branch, Noida' },
    'KKBK': { bank: 'Kotak Mahindra Bank', branch: 'Nariman Point Branch, Mumbai' },
    'PUNB': { bank: 'Punjab National Bank', branch: 'Connaught Place Branch, New Delhi' },
    'BARB': { bank: 'Bank of Baroda', branch: 'Alkapuri Branch, Vadodara' }
  };

  const match = bankDirectory[prefix] || { bank: `${prefix} Bank`, branch: 'Commercial Branch' };
  return { isValid: true, bankName: match.bank, branch: match.branch };
};

export const validatePincode = (pin: string): { isValid: boolean; message?: string } => {
  const clean = pin.trim();
  if (!clean) return { isValid: false, message: 'PIN code is required' };
  if (!/^\d{6}$/.test(clean)) {
    return { isValid: false, message: 'PIN code must be a 6-digit postal code' };
  }
  return { isValid: true };
};

export const validateUan = (uan: string): { isValid: boolean; message?: string } => {
  const clean = uan.trim();
  if (!clean) return { isValid: true }; // optional if not previously registered
  if (!/^\d{12}$/.test(clean)) {
    return { isValid: false, message: 'UAN must be a 12-digit number' };
  }
  return { isValid: true };
};

export const validatePhone = (phone: string): { isValid: boolean; message?: string } => {
  const clean = phone.replace(/\D/g, '');
  if (!clean) return { isValid: false, message: 'Mobile number is required' };
  if (!/^[6-9]\d{9}$/.test(clean)) {
    return { isValid: false, message: 'Enter a valid 10-digit Indian mobile number starting with 6-9' };
  }
  return { isValid: true };
};

export const validateAge = (dobString: string): { isValid: boolean; message?: string; age?: number } => {
  if (!dobString) return { isValid: false, message: 'Date of birth is required' };
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return { isValid: false, message: 'Invalid date of birth' };
  
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age < 18) {
    return { isValid: false, message: `Applicant must be at least 18 years old (current calculated age: ${age})` };
  }
  if (age > 75) {
    return { isValid: false, message: 'Please check date of birth' };
  }
  return { isValid: true, age };
};

export const validateBankAccount = (acc: string, confirmAcc?: string): { isValid: boolean; message?: string } => {
  const clean = acc.trim();
  if (!clean) return { isValid: false, message: 'Bank account number is required' };
  if (!/^\d{9,18}$/.test(clean)) {
    return { isValid: false, message: 'Bank account must be between 9 and 18 numeric digits' };
  }
  if (confirmAcc !== undefined && clean !== confirmAcc.trim()) {
    return { isValid: false, message: 'Bank account numbers do not match' };
  }
  return { isValid: true };
};
