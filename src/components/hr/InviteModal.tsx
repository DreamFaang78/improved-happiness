import React, { useState } from 'react';
import { X, Send, Copy, Check, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
import { CompanyConfig, CandidateRecord } from '../../types';

interface InviteModalProps {
  company: CompanyConfig;
  onClose: () => void;
  onSendInvite: (candidate: Partial<CandidateRecord>) => void;
  onOpenEmployeeFlowWithToken: (candidate: Partial<CandidateRecord>) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  company,
  onClose,
  onSendInvite,
  onOpenEmployeeFlowWithToken
}) => {
  const [candidateName, setCandidateName] = useState('Rahul Sharma');
  const [phone, setPhone] = useState('90000 00001');
  const [role, setRole] = useState('Junior Project Engineer');
  const [department, setDepartment] = useState('Civil Engineering');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const inviteLink = `https://portal.securewaves.in/join?token=sw-${Math.floor(1000 + Math.random() * 9000)}`;
  const messagePreview = `Hi ${candidateName || 'Candidate'}, welcome to ${company.name}! Please complete your digital joining formalities and KYC verification via this secure link: ${inviteLink}. Valid for 48 hours.`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(messagePreview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreate = () => {
    const newCand: Partial<CandidateRecord> = {
      id: `emp-${Date.now()}`,
      applicationNumber: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      companyName: company.name,
      fullName: candidateName,
      mobileNumber: phone.replace(/\D/g, ''),
      role,
      department,
      status: 'INVITED',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      documents: []
    };
    onSendInvite(newCand);
    onClose();
  };

  const handleOpenDirectly = () => {
    const newCand: Partial<CandidateRecord> = {
      id: `emp-${Date.now()}`,
      applicationNumber: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      companyName: company.name,
      fullName: candidateName,
      mobileNumber: phone.replace(/\D/g, ''),
      role,
      department,
      status: 'INVITED',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      documents: []
    };
    onSendInvite(newCand);
    onOpenEmployeeFlowWithToken(newCand);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm sm:text-base">Invite Candidate for Digital KYC</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Candidate Full Name *</label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Number *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Role / Designation</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* WhatsApp Message Preview */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Simulated WhatsApp Dispatch
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-emerald-100 font-mono leading-relaxed">
              {messagePreview}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleOpenDirectly}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Candidate Flow Now</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-sm"
            >
              Create Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
