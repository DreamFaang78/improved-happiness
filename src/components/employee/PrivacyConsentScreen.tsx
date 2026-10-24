import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, FileCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { CompanyConfig } from '../../types';

interface PrivacyConsentScreenProps {
  company: CompanyConfig;
  onConsent: () => void;
  onBack: () => void;
  language: 'en' | 'hi';
}

export const PrivacyConsentScreen: React.FC<PrivacyConsentScreenProps> = ({
  company,
  onConsent,
  onBack,
  language
}) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 select-none overflow-y-auto">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
            {company.name}
          </span>
          <h2 className="text-sm font-bold text-slate-800">
            {language === 'en' ? 'Digital Consent & Notice' : 'डिजिटल सहमति एवं नोटिस'}
          </h2>
        </div>
        <div className="w-8" />
      </div>

      {/* Main Content */}
      <div className="p-5 flex-1 space-y-4">
        {/* Trust Hero Banner */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md shadow-indigo-600/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            {language === 'en' ? 'Safe, Secure & Encrypted' : 'सुरक्षित और एन्क्रिप्टेड'}
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
            {language === 'en' 
              ? 'Your onboarding documents are processed strictly for statutory employment requirements.'
              : 'आपके दस्तावेज़ केवल वैधानिक रोजगार आवश्यकताओं के लिए संसाधित किए जाते हैं।'}
          </p>
        </div>

        {/* Consent Points */}
        <div className="space-y-3">
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs flex items-start gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                {language === 'en' ? 'Identity Authentication' : 'पहचान सत्यापन'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                {language === 'en'
                  ? 'Verification of PAN and Masked Aadhaar (without storing unmasked biometrics) as per statutory guidelines.'
                  : 'वैधानिक दिशा-निर्देशों के अनुसार पैन और मास्क्ड आधार का सत्यापन।'}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs flex items-start gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-0.5">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                {language === 'en' ? 'Direct Salary Account Linking' : 'वेतन खाता लिंकिंग'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                {language === 'en'
                  ? 'Bank account and IFSC validation to ensure prompt, direct deposit of monthly salary disbursements.'
                  : 'मासिक वेतन के सीधे हस्तांतरण के लिए बैंक खाता और आईएफएससी कोड का सत्यापन।'}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs flex items-start gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                {language === 'en' ? 'EPFO & ESIC Compliance' : 'EPFO और ESIC वैधानिक अनुपालन'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                {language === 'en'
                  ? 'UAN and ESIC linking for Employee Provident Fund and medical insurance scheme enrolment.'
                  : 'कर्मचारी भविष्य निधि और चिकित्सा बीमा के लिए यूएएन और ईएसआईसी लिंकिंग।'}
              </p>
            </div>
          </div>
        </div>

        {/* Checkbox Agreement */}
        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span className="text-xs font-medium text-slate-700 leading-snug">
              {language === 'en' ? (
                <>
                  I confirm that all information provided is accurate and grant consent to <strong>{company.name}</strong> to verify my credentials for employment onboarding.
                </>
              ) : (
                <>
                  मैं पुष्टि करता/करती हूँ कि दी गई सभी जानकारी सही है और <strong>{company.name}</strong> को सत्यापन की सहमति देता/देती हूँ।
                </>
              )}
            </span>
          </label>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-4 bg-white border-t border-slate-200 sticky bottom-0">
        <button
          type="button"
          onClick={onConsent}
          disabled={!agreed}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
        >
          <span>{language === 'en' ? 'I Agree & Continue' : 'मैं सहमत हूँ और आगे बढ़ें'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
