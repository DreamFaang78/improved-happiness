import React from 'react';
import { CheckCircle2, ArrowRight, LayoutDashboard, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { CandidateRecord } from '../../types';

interface SubmissionSuccessScreenProps {
  submission: CandidateRecord;
  onSwitchToHr: () => void;
  language: 'en' | 'hi';
}

export const SubmissionSuccessScreen: React.FC<SubmissionSuccessScreenProps> = ({
  submission,
  onSwitchToHr,
  language
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 select-none overflow-y-auto justify-between p-6">
      <div className="space-y-6 pt-4 text-center">
        {/* Animated Big Checkmark */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl ring-8 ring-emerald-50 animate-bounce-gentle">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            {language === 'en' ? 'Submission Received' : 'आवेदन सफलतापूर्वक प्राप्त'}
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-3">
            {language === 'en' ? 'KYC Dossier Submitted!' : 'KYC दस्तावेज़ जमा हो गया!'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {language === 'en'
              ? `Thank you, ${submission.fullName}. Your onboarding application has been registered with ${submission.companyName}.`
              : `धन्यवाद, ${submission.fullName}। आपका आवेदन ${submission.companyName} में दर्ज कर लिया गया है।`}
          </p>
        </div>

        {/* Application Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-left max-w-xs mx-auto space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
            <span className="text-slate-400">Application Number</span>
            <span className="font-mono font-bold text-slate-900">{submission.applicationNumber}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
            <span className="text-slate-400">Designation</span>
            <span className="font-semibold text-slate-800">{submission.role || 'Junior Project Engineer'}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Current Status</span>
            <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <Clock className="w-3 h-3" /> Under Review
            </span>
          </div>
        </div>

        {/* Highlighted Handover Box */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-4 text-left shadow-sm">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs mb-1">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Interactive Demo: The 2-Sided Experience</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            You just completed the candidate onboarding flow! Now switch to the <strong>HR Dashboard</strong> to see your exact submission waiting at the top marked <strong className="text-indigo-600">NEW</strong>, inspect the documents, and test approving or requesting corrections!
          </p>
        </div>
      </div>

      {/* Switch to HR Dashboard Button */}
      <div className="pt-6">
        <button
          type="button"
          onClick={onSwitchToHr}
          className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all group"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Now See What HR Sees</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          Switches view to the HR portal side of the portal
        </p>
      </div>
    </div>
  );
};
