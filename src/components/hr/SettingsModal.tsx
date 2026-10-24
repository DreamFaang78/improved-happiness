import React, { useState } from 'react';
import { X, Settings, Shield, Sliders, Check, Save } from 'lucide-react';
import { CompanyConfig } from '../../types';

interface SettingsModalProps {
  company: CompanyConfig;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  company,
  onClose
}) => {
  const [requireUan, setRequireUan] = useState(true);
  const [requireEsic, setRequireEsic] = useState(false);
  const [requireBloodGroup, setRequireBloodGroup] = useState(true);
  const [requireBankCheque, setRequireBankCheque] = useState(true);
  const [requireSignaturePad, setRequireSignaturePad] = useState(true);
  const [linkExpiryHours, setLinkExpiryHours] = useState('48');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm sm:text-base">Company KYC Configuration Preview</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Mandatory KYC Documents for {company.name}
            </h4>
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <span className="font-medium text-slate-700">Aadhaar Card (Offline / Masked UIDAI)</span>
                <input type="checkbox" checked={true} disabled className="w-4 h-4 text-indigo-600 rounded opacity-70" />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <span className="font-medium text-slate-700">PAN Card (Income Tax Verification)</span>
                <input type="checkbox" checked={true} disabled className="w-4 h-4 text-indigo-600 rounded opacity-70" />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <span className="font-medium text-slate-700">Bank Proof (Cancelled Cheque / Passbook)</span>
                <input
                  type="checkbox"
                  checked={requireBankCheque}
                  onChange={(e) => setRequireBankCheque(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <span className="font-medium text-slate-700">Interactive Digital Signature Drawing</span>
                <input
                  type="checkbox"
                  checked={requireSignaturePad}
                  onChange={(e) => setRequireSignaturePad(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </label>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Statutory Field Rules
            </h4>
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <span className="font-medium text-slate-700">Mandate EPFO UAN (12 digits)</span>
                <input
                  type="checkbox"
                  checked={requireUan}
                  onChange={(e) => setRequireUan(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <span className="font-medium text-slate-700">Mandate Blood Group for Site Safety Records</span>
                <input
                  type="checkbox"
                  checked={requireBloodGroup}
                  onChange={(e) => setRequireBloodGroup(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </label>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Candidate Link Expiry Window
            </h4>
            <select
              value={linkExpiryHours}
              onChange={(e) => setLinkExpiryHours(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="24">24 Hours (Urgent joining)</option>
              <option value="48">48 Hours (Standard)</option>
              <option value="72">72 Hours (Weekend buffer)</option>
              <option value="168">7 Days</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saved ? 'Saved!' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
