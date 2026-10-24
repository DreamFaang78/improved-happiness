import React, { useState } from 'react';
import { X, Building2, Sparkles, Check, Upload } from 'lucide-react';
import { CompanyConfig } from '../types';

interface CompanyModalProps {
  currentCompany: CompanyConfig;
  onSaveCompany: (company: CompanyConfig) => void;
  onClose: () => void;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({
  currentCompany,
  onSaveCompany,
  onClose
}) => {
  const [name, setName] = useState(currentCompany.name);
  const [tagline, setTagline] = useState(currentCompany.tagline || 'Digital Workforce Onboarding');
  const [brandColor, setBrandColor] = useState(currentCompany.brandColor || '#4f46e5');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveCompany({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim(),
      brandColor,
      isCustom: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base">Personalize Demo with Your Company</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Enter your organization's name to see your brand dynamically branded across employee messages, WhatsApp previews, HR dashboard, and the watermarked KYC PDF dossier.
          </p>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Infra Projects Pvt. Ltd."
              className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Industry / Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. EPC & Civil Contractors"
              className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Brand Accent Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
              />
              <span className="font-mono text-xs text-slate-600 uppercase">{brandColor}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply Custom Branding</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
