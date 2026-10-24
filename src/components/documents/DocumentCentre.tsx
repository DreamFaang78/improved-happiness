import React, { useState } from 'react';
import { 
  FolderKanban, 
  Search, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  Download,
  Filter,
  Sparkles
} from 'lucide-react';
import { DocumentItem, SystemConfig } from '../../types';
import { triggerConfetti } from '../../utils/confetti';

interface DocumentCentreProps {
  documents: DocumentItem[];
  config: SystemConfig;
  onSaveDocument: (doc: DocumentItem) => void;
}

export const DocumentCentre: React.FC<DocumentCentreProps> = ({
  documents,
  config,
  onSaveDocument
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSite, setSelectedSite] = useState('ALL');

  const filteredDocs = documents.filter(doc => {
    const matchesCat = selectedCategory === 'ALL' || doc.category === selectedCategory;
    const matchesSite = selectedSite === 'ALL' || doc.site === selectedSite;
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) || doc.fileName.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSite && matchesSearch;
  });

  const handleUploadSample = () => {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: 'New Site Labour Safety Clearance Certificate',
      category: 'SAFETY_AUDIT',
      fileName: 'Site_Safety_Clearance_Oct2026.pdf',
      fileSize: '1.4 MB',
      uploadDate: new Date().toISOString().substring(0, 10),
      expiryDate: '2027-10-24',
      status: 'VALID',
      site: config.sites[0]
    };
    onSaveDocument(newDoc);
    triggerConfetti();
  };

  const renderExpiryBadge = (status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED', expiryDate?: string) => {
    switch (status) {
      case 'VALID':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Valid until {expiryDate || 'Permanent'}
          </span>
        );
      case 'EXPIRING_SOON':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-full animate-pulse">
            <AlertTriangle className="w-3 h-3" /> Expiring: {expiryDate}
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3" /> Expired
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-blue-400" />
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Statutory Document Centre & Vault
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure client-side document library with automated expiry warnings & audit logs
            </p>
          </div>

          <button
            type="button"
            onClick={handleUploadSample}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 flex-shrink-0"
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>Upload Demo Document</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents by name or filename..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Categories</option>
            <option value="STATUTORY_RETURN">Statutory Returns (PF/ESI/LWF)</option>
            <option value="WAGE_SHEET">Signed Wage Sheets & Registers</option>
            <option value="SAFETY_AUDIT">Safety Clearances & Scaffolding Logs</option>
            <option value="CONTRACT_AGREEMENT">CLRA Licenses & Contract Copies</option>
          </select>
        </div>
      </div>

      {/* Document Cards */}
      <div className="space-y-3">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl space-y-2.5 shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-teal-300 flex-shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{doc.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="font-mono text-teal-400">{doc.fileName}</span>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                  </div>
                </div>
              </div>

              <div>{renderExpiryBadge(doc.status, doc.expiryDate)}</div>
            </div>

            {/* Site & Meta Strip */}
            <div className="flex items-center justify-between p-2.5 bg-slate-850 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              <span>Site: <strong className="text-slate-300">{doc.site}</strong></span>
              <span>Uploaded: {doc.uploadDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
