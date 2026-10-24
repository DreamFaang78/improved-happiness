import React, { useState, useRef, useEffect } from 'react';
import { Shield, Sparkles, RefreshCw, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { CompanyConfig } from '../../types';

interface OtpVerificationScreenProps {
  company: CompanyConfig;
  onVerified: () => void;
  onBack: () => void;
  language: 'en' | 'hi';
}

const SAMPLE_OTP = '4291';

export const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({
  company,
  onVerified,
  onBack,
  language
}) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null)
  ];

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    setError('');
    const char = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    if (char && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted) {
      const newOtp = ['', '', '', ''];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      const focusIndex = Math.min(pasted.length, 3);
      inputRefs[focusIndex].current?.focus();
    }
  };

  const autofillSampleOtp = () => {
    setOtp(SAMPLE_OTP.split(''));
    setError('');
  };

  const handleVerify = () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      setError(language === 'en' ? 'Please enter all 4 digits' : 'कृपया सभी 4 अंक दर्ज करें');
      return;
    }

    if (fullOtp === SAMPLE_OTP) {
      onVerified();
    } else {
      setError(language === 'en' ? 'Invalid verification code. Please use sample code 4291.' : 'अमान्य कोड। कृपया सैंपल कोड 4291 का उपयोग करें।');
    }
  };

  const handleResend = () => {
    setIsResending(true);
    setResendTimer(30);
    setTimeout(() => {
      setIsResending(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 select-none">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold text-slate-700">
          {language === 'en' ? 'Mobile Verification' : 'मोबाइल सत्यापन'}
        </span>
        <div className="w-8" />
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-indigo-600 shadow-sm">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {language === 'en' ? 'Enter 4-Digit Code' : '4-अंकीय कोड दर्ज करें'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'en' ? 'Verification code sent to ' : 'सत्यापन कोड भेजा गया '}
              <strong className="text-slate-800 font-mono">+91 90000 00001</strong>
            </p>
          </div>

          {/* Sample OTP Hint Pill with Autofill Button */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-800">
                {language === 'en' ? 'Sample OTP:' : 'सैंपल OTP:'}
              </span>
              <span className="font-mono font-bold text-base text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded tracking-widest">
                {SAMPLE_OTP}
              </span>
            </div>

            <button
              type="button"
              onClick={autofillSampleOtp}
              className="px-3 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-xl flex items-center gap-1 shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Autofill' : 'स्वतः भरें'}</span>
            </button>
          </div>

          {/* 4 OTP Digit Boxes */}
          <div className="flex justify-center gap-3 my-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-14 h-16 text-center text-2xl font-bold font-mono bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all shadow-sm"
              />
            ))}
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-medium text-center bg-rose-50 border border-rose-200 p-2 rounded-xl">
              {error}
            </p>
          )}

          {/* Resend Timer & Button */}
          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-xs text-slate-400">
                {language === 'en' ? 'Resend code in ' : 'कोड पुनः भेजें '}
                <span className="font-mono font-semibold text-slate-700">{resendTimer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>{language === 'en' ? 'Resend Code' : 'पुनः कोड भेजें'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Verify CTA */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleVerify}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 transition-all"
          >
            <span>{language === 'en' ? 'Verify & Begin Form' : 'सत्यापित करें और फॉर्म शुरू करें'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
