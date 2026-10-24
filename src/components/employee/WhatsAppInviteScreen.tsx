import React from 'react';
import { ArrowRight, ShieldCheck, CheckCheck, Clock, ExternalLink, Sparkles } from 'lucide-react';
import { CompanyConfig } from '../../types';

interface WhatsAppInviteScreenProps {
  company: CompanyConfig;
  onOpenLink: () => void;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
}

export const WhatsAppInviteScreen: React.FC<WhatsAppInviteScreenProps> = ({
  company,
  onOpenLink,
  language,
  onToggleLanguage
}) => {
  return (
    <div className="flex flex-col h-full bg-[#0b141a] text-slate-100 select-none">
      {/* WhatsApp Chat Header */}
      <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-[#2a3942]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-emerald-500/50">
            {company.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-sm text-slate-100 truncate max-w-[170px] sm:max-w-xs">
                {company.name}
              </h3>
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-[#0b141a] flex items-center justify-center text-[9px] font-bold">
                ✓
              </span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">Official HR Onboarding Desk</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleLanguage}
          className="text-xs px-2.5 py-1 rounded bg-[#2a3942] text-slate-300 hover:text-white font-medium border border-slate-700 transition-colors"
        >
          {language === 'en' ? 'हिंदी' : 'English'}
        </button>
      </div>

      {/* Chat Conversation Area */}
      <div 
        className="flex-1 p-4 overflow-y-auto space-y-4"
        style={{
          backgroundImage: `radial-gradient(#1f2c34 1.5px, transparent 1.5px)`,
          backgroundSize: '20px 20px'
        }}
      >
        {/* Encrypted Notice Pill */}
        <div className="flex justify-center">
          <div className="bg-[#182229] border border-[#222e35] text-[11px] text-[#8696a0] px-3 py-1.5 rounded-lg max-w-xs text-center flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Messages and calls are end-to-end encrypted. Demo mode enabled.</span>
          </div>
        </div>

        {/* Date stamp */}
        <div className="flex justify-center">
          <span className="bg-[#182229] text-[10px] text-[#8696a0] px-2.5 py-0.5 rounded font-mono">
            TODAY
          </span>
        </div>

        {/* Message Bubble */}
        <div className="flex justify-start">
          <div className="bg-[#202c33] max-w-[340px] rounded-2xl rounded-tl-sm p-3.5 shadow-lg border border-[#2a3942] text-slate-200">
            <p className="text-xs leading-relaxed mb-3">
              {language === 'en' ? (
                <>
                  Hello <strong>Rahul Sharma</strong>, congratulations on your offer!
                  <br /><br />
                  Welcome to <strong>{company.name}</strong>. Please complete your digital joining formalities and KYC verification via our secure paperless portal.
                </>
              ) : (
                <>
                  नमस्ते <strong>राहुल शर्मा</strong>, नए अवसर की बधाई!
                  <br /><br />
                  <strong>{company.name}</strong> में आपका स्वागत है। कृपया हमारे सुरक्षित डिजिटल पोर्टल के माध्यम से अपनी जॉइनिंग और KYC औपचारिकताएं पूरी करें।
                </>
              )}
            </p>

            {/* Clickable Invitation Link Card */}
            <div className="bg-[#111b21] rounded-xl p-3 border border-[#2a3942] hover:border-indigo-500/50 transition-all group">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-400 mb-1">
                <span>KYC Onboarding Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-slate-400 font-mono mb-2 truncate">
                https://portal.securewaves.in/join?token=sw-8921
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-amber-400">
                <Clock className="w-3 h-3" />
                <span>Link valid for 48 hours • Takes ~3 minutes</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-1">
              <span className="text-[10px] text-[#8696a0]">10:45 AM</span>
              <div className="flex items-center gap-0.5 text-sky-400">
                <CheckCheck className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Tap Action Callout */}
      <div className="p-4 bg-[#202c33] border-t border-[#2a3942]">
        <button
          type="button"
          onClick={onOpenLink}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all group"
        >
          <span>Tap to Open Joining Link</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-center text-[11px] text-slate-400 mt-2">
          Step 1 of the employee journey • No app download required
        </p>
      </div>
    </div>
  );
};
