import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Send, 
  ShieldCheck, 
  FileText, 
  User, 
  MapPin, 
  Landmark, 
  Check,
  AlertCircle
} from 'lucide-react';
import { CandidateRecord, CompanyConfig } from '../../types';
import { triggerConfetti } from '../../utils/confetti';

interface ReviewAndSubmitScreenProps {
  formData: CandidateRecord;
  company: CompanyConfig;
  onBack: () => void;
  onSubmit: (finalData: CandidateRecord) => void;
  language: 'en' | 'hi';
}

export const ReviewAndSubmitScreen: React.FC<ReviewAndSubmitScreenProps> = ({
  formData,
  company,
  onBack,
  onSubmit,
  language
}) => {
  const [declared, setDeclared] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!declared) return;
    setIsSubmitting(true);
    triggerConfetti();

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit({
        ...formData,
        status: 'SUBMITTED',
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        isUserSubmission: true
      });
    }, 700);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 select-none overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold text-slate-900">
          {language === 'en' ? 'Review & Confirmation' : 'समीक्षा एवं पुष्टि'}
        </span>
        <div className="w-8" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 space-y-4">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3.5 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              {language === 'en' ? 'Please review your details carefully' : 'कृपया अपने विवरण की सावधानीपूर्वक समीक्षा करें'}
            </h3>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {language === 'en' 
                ? 'Once submitted, details are forwarded directly to HR for verification.' 
                : 'जमा करने के बाद विवरण सीधे सत्यापन के लिए एचआर को भेजा जाएगा।'}
            </p>
          </div>
        </div>

        {/* Card 1: Personal Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {language === 'en' ? 'Personal Details' : 'व्यक्तिगत विवरण'}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-y-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">FULL NAME</span>
              <span className="font-semibold text-slate-900">{formData.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">FATHER'S NAME</span>
              <span className="font-semibold text-slate-900">{formData.fatherName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">DATE OF BIRTH</span>
              <span className="font-semibold text-slate-900">{formData.dateOfBirth}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">GENDER / BLOOD GROUP</span>
              <span className="font-semibold text-slate-900">{formData.gender} ({formData.bloodGroup})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">MOBILE NUMBER</span>
              <span className="font-semibold text-slate-900 font-mono">+91 {formData.mobileNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">EMAIL ADDRESS</span>
              <span className="font-semibold text-slate-900 truncate block">{formData.email}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Address */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {language === 'en' ? 'Address Details' : 'पते का विवरण'}
            </h4>
          </div>

          <div className="text-xs space-y-1">
            <span className="text-slate-400 block text-[10px]">CURRENT RESIDENCE</span>
            <p className="font-medium text-slate-800">
              {formData.currentAddressLine1} {formData.currentAddressLine2}<br />
              {formData.currentCity}, {formData.currentState} - <span className="font-mono">{formData.currentPincode}</span>
            </p>
          </div>
        </div>

        {/* Card 3: Statutory & Banking */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Landmark className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {language === 'en' ? 'Banking & Compliance' : 'बैंकिंग एवं अनुपालन'}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-y-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">PAN NUMBER</span>
              <span className="font-mono font-bold text-slate-900">{formData.panNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">AADHAAR (MASKED)</span>
              <span className="font-mono font-bold text-slate-900">{formData.aadhaarNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">BANK NAME</span>
              <span className="font-semibold text-slate-900">{formData.bankName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">IFSC CODE</span>
              <span className="font-mono font-bold text-indigo-600">{formData.ifscCode}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-[10px]">ACCOUNT NUMBER</span>
              <span className="font-mono font-bold text-slate-900">{formData.bankAccountNumber}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Attached Documents & Signature */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {language === 'en' ? 'Attached Files' : 'संलग्न दस्तावेज़'}
            </h4>
          </div>

          <div className="space-y-1.5">
            {formData.documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-700 font-medium">{doc.title}</span>
                <span className="font-mono text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Attached
                </span>
              </div>
            ))}
          </div>

          {formData.signatureDataUrl && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block text-[10px] mb-1">DIGITAL SIGNATURE</span>
              <div className="h-14 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-center p-1">
                <img src={formData.signatureDataUrl} alt="Signature" className="max-h-12 max-w-full object-contain" />
              </div>
            </div>
          )}
        </div>

        {/* Statutory Declaration Checkbox */}
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={declared}
              onChange={(e) => setDeclared(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <span className="text-xs font-medium text-slate-800 leading-snug">
              {language === 'en' ? (
                <>
                  I declare that the information provided is correct and authorise <strong>{company.name}</strong> to process my KYC dossier for employment onboarding.
                </>
              ) : (
                <>
                  मैं घोषणा करता/करती हूँ कि दी गई जानकारी सही है और <strong>{company.name}</strong> को मेरे KYC सत्यापन के लिए अधिकृत करता/करती हूँ।
                </>
              )}
            </span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-4 bg-white border-t border-slate-200 sticky bottom-0 z-20 shadow-md">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!declared || isSubmitting}
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none active:scale-95 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
        >
          {isSubmitting ? (
            <span>{language === 'en' ? 'Submitting Application...' : 'आवेदन जमा हो रहा है...'}</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{language === 'en' ? 'Submit KYC Application' : 'KYC आवेदन जमा करें'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
