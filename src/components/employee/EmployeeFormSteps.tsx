import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Landmark, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  ArrowRight, 
  ArrowLeft,
  Eye,
  Trash2,
  Building,
  Check
} from 'lucide-react';
import { CandidateRecord, DocumentItem, DocumentType } from '../../types';
import { 
  validatePan, 
  validateAadhaar, 
  formatAadhaar, 
  validateIfsc, 
  validatePincode, 
  validateUan, 
  validatePhone, 
  validateAge, 
  validateBankAccount 
} from '../../utils/validation';
import { getSampleDocSvg } from '../../utils/sampleDocs';
import { SignaturePad } from './SignaturePad';

interface EmployeeFormStepsProps {
  initialData: Partial<CandidateRecord>;
  onStepComplete: (step: number, data: Partial<CandidateRecord>) => void;
  onProceedToReview: (finalData: CandidateRecord) => void;
  language: 'en' | 'hi';
  activeStep: number;
  setActiveStep: (step: number) => void;
}

export const EmployeeFormSteps: React.FC<EmployeeFormStepsProps> = ({
  initialData,
  onStepComplete,
  onProceedToReview,
  language,
  activeStep,
  setActiveStep
}) => {
  // Form State
  const [formData, setFormData] = useState<CandidateRecord>({
    id: initialData.id || `emp-${Date.now()}`,
    applicationNumber: initialData.applicationNumber || `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    companyName: initialData.companyName || 'SecureWave Projects Pvt. Ltd.',
    fullName: initialData.fullName || '',
    fatherName: initialData.fatherName || '',
    dateOfBirth: initialData.dateOfBirth || '',
    gender: initialData.gender || 'Male',
    bloodGroup: initialData.bloodGroup || 'B+',
    mobileNumber: initialData.mobileNumber || '9000000001',
    email: initialData.email || '',
    emergencyContactName: initialData.emergencyContactName || '',
    emergencyContactRelation: initialData.emergencyContactRelation || 'Father',
    emergencyContactPhone: initialData.emergencyContactPhone || '',

    currentAddressLine1: initialData.currentAddressLine1 || '',
    currentAddressLine2: initialData.currentAddressLine2 || '',
    currentCity: initialData.currentCity || '',
    currentState: initialData.currentState || '',
    currentPincode: initialData.currentPincode || '',
    permanentSameAsCurrent: initialData.permanentSameAsCurrent ?? true,
    permanentAddressLine1: initialData.permanentAddressLine1 || '',
    permanentAddressLine2: initialData.permanentAddressLine2 || '',
    permanentCity: initialData.permanentCity || '',
    permanentState: initialData.permanentState || '',
    permanentPincode: initialData.permanentPincode || '',

    panNumber: initialData.panNumber || '',
    aadhaarNumber: initialData.aadhaarNumber || '',
    bankAccountNumber: initialData.bankAccountNumber || '',
    bankName: initialData.bankName || '',
    ifscCode: initialData.ifscCode || '',
    bankBranch: initialData.bankBranch || '',
    uanNumber: initialData.uanNumber || '',
    esicNumber: initialData.esicNumber || '',

    documents: initialData.documents || [],
    signatureDataUrl: initialData.signatureDataUrl || '',

    role: initialData.role || 'Junior Project Engineer',
    department: initialData.department || 'Operations',
    joiningDate: initialData.joiningDate || '2026-11-01',
    status: 'IN_PROGRESS',
    createdAt: initialData.createdAt || new Date().toISOString()
  });

  const [confirmBankAccount, setConfirmBankAccount] = useState(formData.bankAccountNumber || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bankLookupResult, setBankLookupResult] = useState<{ bank?: string; branch?: string } | null>(null);

  // Sync IFSC lookup if already populated
  useEffect(() => {
    if (formData.ifscCode) {
      const res = validateIfsc(formData.ifscCode);
      if (res.isValid && res.bankName) {
        setBankLookupResult({ bank: res.bankName, branch: res.branch });
      }
    }
  }, [formData.ifscCode]);

  // Autofill helpers per step
  const autofillCurrentStep = () => {
    setErrors({});
    if (activeStep === 1) {
      setFormData(prev => ({
        ...prev,
        fullName: 'Rahul Sharma',
        fatherName: 'Ramesh Sharma',
        dateOfBirth: '1996-08-14',
        gender: 'Male',
        bloodGroup: 'B+',
        mobileNumber: '9000000001',
        email: 'rahul.sharma.demo@securewaves.in',
        emergencyContactName: 'Ramesh Sharma',
        emergencyContactRelation: 'Father',
        emergencyContactPhone: '9000090001'
      }));
    } else if (activeStep === 2) {
      setFormData(prev => ({
        ...prev,
        currentAddressLine1: 'Flat 402, Shanti Heights, Sector 45',
        currentAddressLine2: 'Near Golf Course Road',
        currentCity: 'Gurugram',
        currentState: 'Haryana',
        currentPincode: '122003',
        permanentSameAsCurrent: true
      }));
    } else if (activeStep === 3) {
      const ifsc = 'HDFC0001234';
      const ifscRes = validateIfsc(ifsc);
      setFormData(prev => ({
        ...prev,
        panNumber: 'ABCDE1234F',
        aadhaarNumber: 'XXXX XXXX 1234',
        bankAccountNumber: '50100234891288',
        ifscCode: ifsc,
        bankName: ifscRes.bankName || 'HDFC Bank Ltd.',
        bankBranch: ifscRes.branch || 'Cyber City Branch, Gurugram',
        uanNumber: '100000000001',
        esicNumber: '11000000000000001'
      }));
      setConfirmBankAccount('50100234891288');
      setBankLookupResult({ bank: ifscRes.bankName, branch: ifscRes.branch });
    } else if (activeStep === 4) {
      // Attach all 4 sample documents + sample signature
      const sampleDocs: DocumentItem[] = [
        {
          id: `doc-aadh-${Date.now()}`,
          type: 'aadhaar_card',
          title: 'Aadhaar Card (Masked)',
          fileName: 'rahul_aadhaar_sample.pdf',
          fileSize: '412 KB',
          fileDataUrl: getSampleDocSvg('aadhaar_card', formData.fullName || 'Rahul Sharma'),
          uploadTimestamp: new Date().toISOString(),
          status: 'PENDING',
          isSample: true
        },
        {
          id: `doc-pan-${Date.now()}`,
          type: 'pan_card',
          title: 'PAN Card',
          fileName: 'rahul_pan_sample.jpg',
          fileSize: '320 KB',
          fileDataUrl: getSampleDocSvg('pan_card', formData.fullName || 'Rahul Sharma'),
          uploadTimestamp: new Date().toISOString(),
          status: 'PENDING',
          isSample: true
        },
        {
          id: `doc-bank-${Date.now()}`,
          type: 'bank_proof',
          title: 'Cancelled Cheque',
          fileName: 'rahul_cheque_sample.jpg',
          fileSize: '510 KB',
          fileDataUrl: getSampleDocSvg('bank_proof', formData.fullName || 'Rahul Sharma'),
          uploadTimestamp: new Date().toISOString(),
          status: 'PENDING',
          isSample: true
        },
        {
          id: `doc-photo-${Date.now()}`,
          type: 'photograph',
          title: 'Passport Photo',
          fileName: 'rahul_photo_sample.jpg',
          fileSize: '190 KB',
          fileDataUrl: getSampleDocSvg('photograph', formData.fullName || 'Rahul Sharma'),
          uploadTimestamp: new Date().toISOString(),
          status: 'PENDING',
          isSample: true
        }
      ];

      setFormData(prev => ({
        ...prev,
        documents: sampleDocs,
        signatureDataUrl: getSampleDocSvg('signature', formData.fullName || 'Rahul Sharma')
      }));
    }
  };

  // Attach individual sample document
  const attachSampleDoc = (type: DocumentType, title: string) => {
    const existing = formData.documents.filter(d => d.type !== type);
    const newDoc: DocumentItem = {
      id: `doc-${type}-${Date.now()}`,
      type,
      title,
      fileName: `${type}_sample.svg`,
      fileSize: '340 KB',
      fileDataUrl: getSampleDocSvg(type, formData.fullName || 'Rahul Sharma'),
      uploadTimestamp: new Date().toISOString(),
      status: 'PENDING',
      isSample: true
    };
    setFormData(prev => ({
      ...prev,
      documents: [...existing, newDoc]
    }));
  };

  // Upload local file safely into browser memory
  const handleLocalFileUpload = (type: DocumentType, title: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const existing = formData.documents.filter(d => d.type !== type);
      const newDoc: DocumentItem = {
        id: `doc-local-${Date.now()}`,
        type,
        title,
        fileName: file.name,
        fileSize: `${Math.round(file.size / 1024)} KB`,
        fileDataUrl: dataUrl, // in-memory only
        uploadTimestamp: new Date().toISOString(),
        status: 'PENDING',
        isSample: false
      };
      setFormData(prev => ({
        ...prev,
        documents: [...existing, newDoc]
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeDoc = (type: DocumentType) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.type !== type)
    }));
  };

  // Step Validation Handlers
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.fatherName.trim()) errs.fatherName = "Father's name is required";
    
    const ageRes = validateAge(formData.dateOfBirth);
    if (!ageRes.isValid) errs.dateOfBirth = ageRes.message || 'Invalid age';

    const phoneRes = validatePhone(formData.mobileNumber);
    if (!phoneRes.isValid) errs.mobileNumber = phoneRes.message || 'Invalid mobile number';

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Valid email address is required';
    }

    if (!formData.emergencyContactPhone || !/^[6-9]\d{9}$/.test(formData.emergencyContactPhone.replace(/\D/g, ''))) {
      errs.emergencyContactPhone = 'Valid 10-digit emergency contact required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.currentAddressLine1.trim()) errs.currentAddressLine1 = 'Address Line 1 is required';
    if (!formData.currentCity.trim()) errs.currentCity = 'City is required';
    if (!formData.currentState.trim()) errs.currentState = 'State is required';
    
    const pinRes = validatePincode(formData.currentPincode);
    if (!pinRes.isValid) errs.currentPincode = pinRes.message || 'Invalid PIN code';

    if (!formData.permanentSameAsCurrent) {
      if (!formData.permanentAddressLine1?.trim()) errs.permanentAddressLine1 = 'Permanent address is required';
      if (!formData.permanentCity?.trim()) errs.permanentCity = 'Permanent city is required';
      if (!formData.permanentPincode || !/^\d{6}$/.test(formData.permanentPincode)) {
        errs.permanentPincode = 'Valid 6-digit PIN code required';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};
    
    const panRes = validatePan(formData.panNumber);
    if (!panRes.isValid) errs.panNumber = panRes.message || 'Invalid PAN format';

    const aadhaarRes = validateAadhaar(formData.aadhaarNumber);
    if (!aadhaarRes.isValid) errs.aadhaarNumber = aadhaarRes.message || 'Invalid Aadhaar format';

    const bankRes = validateBankAccount(formData.bankAccountNumber, confirmBankAccount);
    if (!bankRes.isValid) errs.bankAccountNumber = bankRes.message || 'Invalid bank account';

    const ifscRes = validateIfsc(formData.ifscCode);
    if (!ifscRes.isValid) {
      errs.ifscCode = ifscRes.message || 'Invalid IFSC code';
    } else {
      setFormData(prev => ({
        ...prev,
        bankName: ifscRes.bankName || prev.bankName,
        bankBranch: ifscRes.branch || prev.bankBranch
      }));
    }

    const uanRes = validateUan(formData.uanNumber || '');
    if (!uanRes.isValid) errs.uanNumber = uanRes.message || 'Invalid UAN';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep4 = (): boolean => {
    const errs: Record<string, string> = {};
    const requiredTypes: DocumentType[] = ['aadhaar_card', 'pan_card', 'bank_proof'];
    
    requiredTypes.forEach(type => {
      const exists = formData.documents.some(d => d.type === type);
      if (!exists) {
        errs[type] = `Please upload or attach sample for ${type.replace('_', ' ')}`;
      }
    });

    if (!formData.signatureDataUrl) {
      errs.signature = 'Please draw or apply your digital signature';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 1 && validateStep1()) {
      onStepComplete(1, formData);
      setActiveStep(2);
    } else if (activeStep === 2 && validateStep2()) {
      onStepComplete(2, formData);
      setActiveStep(3);
    } else if (activeStep === 3 && validateStep3()) {
      onStepComplete(3, formData);
      setActiveStep(4);
    } else if (activeStep === 4 && validateStep4()) {
      onStepComplete(4, formData);
      onProceedToReview(formData);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const stepTitles = [
    { num: 1, title: 'Personal', icon: User },
    { num: 2, title: 'Address', icon: MapPin },
    { num: 3, title: 'Banking & ID', icon: Landmark },
    { num: 4, title: 'Documents', icon: FileText }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 select-none overflow-y-auto">
      {/* Top Progress Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">
              {language === 'en' ? `Step ${activeStep} of 4` : `चरण ${activeStep} / 4`}
            </span>
            <span className="text-xs text-slate-400 font-medium">•</span>
            <span className="text-xs font-medium text-slate-600">
              {stepTitles[activeStep - 1].title}
            </span>
          </div>

          {/* Quick Fill Button */}
          <button
            type="button"
            onClick={autofillCurrentStep}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 rounded-lg active:scale-95 transition-all shadow-xs"
            title="Populate current step with sample data"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'en' ? 'Fill Sample Data' : 'सैंपल डेटा भरें'}</span>
          </button>
        </div>

        {/* Stepper Dots & Progress Bar */}
        <div className="grid grid-cols-4 gap-1.5">
          {stepTitles.map(s => {
            const isCompleted = s.num < activeStep;
            const isCurrent = s.num === activeStep;
            return (
              <div key={s.num} className="space-y-1">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-emerald-500' 
                      : isCurrent 
                        ? 'bg-indigo-600' 
                        : 'bg-slate-200'
                  }`} 
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-4 sm:p-5 flex-1 space-y-4">
        {/* STEP 1: Personal Details */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Name (as per PAN & Aadhaar) *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full px-3 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all ${
                    errors.fullName ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-rose-600 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Father's / Guardian's Name *
                </label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  placeholder="e.g. Ramesh Sharma"
                  className={`w-full px-3 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all ${
                    errors.fatherName ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                {errors.fatherName && <p className="text-[11px] text-rose-600 mt-1">{errors.fatherName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Date of Birth (DOB) *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className={`w-full px-3 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all ${
                      errors.dateOfBirth ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-[11px] text-rose-600 mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="10-digit mobile"
                    className={`w-full px-3 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none font-mono ${
                      errors.mobileNumber ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                  {errors.mobileNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.mobileNumber}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. rahul@example.com"
                  className={`w-full px-3 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none ${
                    errors.email ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                Emergency Contact Details
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Relationship</label>
                  <input
                    type="text"
                    value={formData.emergencyContactRelation}
                    onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                    placeholder="Father / Spouse / Sister"
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Emergency Phone *</label>
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  placeholder="10-digit mobile"
                  className={`w-full px-3 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none font-mono ${
                    errors.emergencyContactPhone ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                {errors.emergencyContactPhone && <p className="text-[11px] text-rose-600 mt-1">{errors.emergencyContactPhone}</p>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Address Details */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                Current Residential Address
              </span>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  value={formData.currentAddressLine1}
                  onChange={(e) => setFormData({ ...formData, currentAddressLine1: e.target.value })}
                  placeholder="House / Flat No., Building Name, Street"
                  className={`w-full px-3 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none ${
                    errors.currentAddressLine1 ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                {errors.currentAddressLine1 && <p className="text-[11px] text-rose-600 mt-1">{errors.currentAddressLine1}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={formData.currentAddressLine2}
                  onChange={(e) => setFormData({ ...formData, currentAddressLine2: e.target.value })}
                  placeholder="Landmark, Area / Sector"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">City *</label>
                  <input
                    type="text"
                    value={formData.currentCity}
                    onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                    placeholder="e.g. Gurugram"
                    className={`w-full px-3 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none ${
                      errors.currentCity ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                  {errors.currentCity && <p className="text-[11px] text-rose-600 mt-1">{errors.currentCity}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">State *</label>
                  <input
                    type="text"
                    value={formData.currentState}
                    onChange={(e) => setFormData({ ...formData, currentState: e.target.value })}
                    placeholder="e.g. Haryana"
                    className={`w-full px-3 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none ${
                      errors.currentState ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                  {errors.currentState && <p className="text-[11px] text-rose-600 mt-1">{errors.currentState}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">PIN Code (6 digits) *</label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.currentPincode}
                  onChange={(e) => setFormData({ ...formData, currentPincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  placeholder="e.g. 122003"
                  className={`w-full px-3 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none font-mono ${
                    errors.currentPincode ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                {errors.currentPincode && <p className="text-[11px] text-rose-600 mt-1">{errors.currentPincode}</p>}
              </div>
            </div>

            {/* Permanent Address Toggle */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.permanentSameAsCurrent}
                  onChange={(e) => setFormData({ ...formData, permanentSameAsCurrent: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Permanent address is same as current address
                </span>
              </label>

              {!formData.permanentSameAsCurrent && (
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Permanent Address *</label>
                    <input
                      type="text"
                      value={formData.permanentAddressLine1 || ''}
                      onChange={(e) => setFormData({ ...formData, permanentAddressLine1: e.target.value })}
                      placeholder="Permanent address"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={formData.permanentCity || ''}
                      onChange={(e) => setFormData({ ...formData, permanentCity: e.target.value })}
                      placeholder="City"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.permanentPincode || ''}
                      onChange={(e) => setFormData({ ...formData, permanentPincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      placeholder="PIN Code"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Banking & Statutory */}
        {activeStep === 3 && (
          <div className="space-y-4">
            {/* Identity Numbers */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                Statutory Identifiers
              </span>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Permanent Account Number (PAN) *
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={formData.panNumber}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase().trim() })}
                  placeholder="e.g. ABCDE1234F"
                  className={`w-full px-3 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none font-mono uppercase tracking-wider ${
                    errors.panNumber ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                {errors.panNumber ? (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.panNumber}</p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-0.5">Format: 5 letters, 4 digits, 1 letter</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Aadhaar Number (12 digits / Masked) *
                </label>
                <input
                  type="text"
                  value={formData.aadhaarNumber}
                  onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                  placeholder="e.g. XXXX XXXX 1234"
                  className={`w-full px-3 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none font-mono tracking-wider ${
                    errors.aadhaarNumber ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                {errors.aadhaarNumber ? (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.aadhaarNumber}</p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-0.5">Sample card format accepted</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">EPFO UAN (12 digits)</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={formData.uanNumber || ''}
                    onChange={(e) => setFormData({ ...formData, uanNumber: e.target.value.replace(/\D/g, '') })}
                    placeholder="100000000001"
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                  {errors.uanNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.uanNumber}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">ESIC IP Number</label>
                  <input
                    type="text"
                    value={formData.esicNumber || ''}
                    onChange={(e) => setFormData({ ...formData, esicNumber: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                Direct Salary Bank Account
              </span>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Bank IFSC Code *
                </label>
                <input
                  type="text"
                  maxLength={11}
                  value={formData.ifscCode}
                  onChange={(e) => {
                    const clean = e.target.value.toUpperCase().trim();
                    setFormData({ ...formData, ifscCode: clean });
                    const res = validateIfsc(clean);
                    if (res.isValid && res.bankName) {
                      setBankLookupResult({ bank: res.bankName, branch: res.branch });
                      setFormData(prev => ({
                        ...prev,
                        ifscCode: clean,
                        bankName: res.bankName || '',
                        bankBranch: res.branch || ''
                      }));
                    } else {
                      setBankLookupResult(null);
                    }
                  }}
                  placeholder="e.g. HDFC0001234 or SBIN0000456"
                  className={`w-full px-3 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none font-mono uppercase tracking-wider ${
                    errors.ifscCode ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                {errors.ifscCode && <p className="text-[11px] text-rose-600 mt-1">{errors.ifscCode}</p>}

                {/* Instant Bank Lookup Feedback Badge */}
                {bankLookupResult && (
                  <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                    <Building className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold">{bankLookupResult.bank}</span>
                      <span className="text-[11px] text-emerald-600 block">{bankLookupResult.branch}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Bank Account Number *
                </label>
                <input
                  type="password"
                  value={formData.bankAccountNumber}
                  onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value.replace(/\D/g, '') })}
                  placeholder="Enter 9-18 digit account number"
                  className={`w-full px-3 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none font-mono ${
                    errors.bankAccountNumber ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Confirm Bank Account Number *
                </label>
                <input
                  type="text"
                  value={confirmBankAccount}
                  onChange={(e) => setConfirmBankAccount(e.target.value.replace(/\D/g, ''))}
                  placeholder="Re-enter bank account number"
                  className={`w-full px-3 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none font-mono ${
                    errors.bankAccountNumber ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                {errors.bankAccountNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.bankAccountNumber}</p>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Documents & Signature */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                    Upload Identity Proofs
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Use our built-in fictional samples or choose a local file (kept in-memory only).
                  </p>
                </div>
              </div>

              {/* Document Rows */}
              {[
                { type: 'aadhaar_card' as DocumentType, title: 'Aadhaar Card (Front/Back)' },
                { type: 'pan_card' as DocumentType, title: 'PAN Card' },
                { type: 'bank_proof' as DocumentType, title: 'Bank Proof (Cancelled Cheque / Passbook)' },
                { type: 'photograph' as DocumentType, title: 'Passport Size Photograph' }
              ].map(docConfig => {
                const attached = formData.documents.find(d => d.type === docConfig.type);
                const hasError = errors[docConfig.type];

                return (
                  <div 
                    key={docConfig.type} 
                    className={`p-3.5 rounded-xl border transition-all ${
                      attached 
                        ? 'bg-emerald-50/40 border-emerald-300' 
                        : hasError
                          ? 'bg-rose-50/50 border-rose-300'
                          : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {attached ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="text-xs font-bold text-slate-800">{docConfig.title}</span>
                      </div>

                      {attached && (
                        <button
                          type="button"
                          onClick={() => removeDoc(docConfig.type)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                          title="Remove attached file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {attached ? (
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono text-[11px] text-slate-700 truncate max-w-[160px]">
                            {attached.fileName}
                          </span>
                          <span className="text-[10px] text-slate-400">({attached.fileSize})</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          Attached
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {/* Attach Sample Button */}
                        <button
                          type="button"
                          onClick={() => attachSampleDoc(docConfig.type, docConfig.title)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Attach Sample Document</span>
                        </button>

                        {/* Local File Upload (kept purely in browser memory) */}
                        <label className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5 text-slate-500" />
                          <span>Choose File</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleLocalFileUpload(docConfig.type, docConfig.title, file);
                            }}
                          />
                        </label>
                      </div>
                    )}

                    {hasError && (
                      <p className="text-[11px] text-rose-600 mt-1">{hasError}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Interactive Signature Pad */}
            <div>
              <SignaturePad
                candidateName={formData.fullName || 'Rahul Sharma'}
                initialSignature={formData.signatureDataUrl}
                onSave={(sigUrl) => {
                  setFormData(prev => ({ ...prev, signatureDataUrl: sigUrl }));
                  if (errors.signature) {
                    setErrors(prev => {
                      const copy = { ...prev };
                      delete copy.signature;
                      return copy;
                    });
                  }
                }}
              />
              {errors.signature && (
                <p className="text-[11px] text-rose-600 mt-1.5 px-2">{errors.signature}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between sticky bottom-0 z-20 shadow-md">
        {activeStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'en' ? 'Back' : 'पीछे'}</span>
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
        >
          <span>
            {activeStep === 4 
              ? (language === 'en' ? 'Review & Submit' : 'समीक्षा करें और जमा करें')
              : (language === 'en' ? 'Continue' : 'आगे बढ़ें')}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
