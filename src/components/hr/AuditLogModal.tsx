import React, { useState } from 'react';
import { X, Shield, Search, Filter, History, Clock } from 'lucide-react';
import { AuditLogEntry } from '../../types';

interface AuditLogModalProps {
  logs: AuditLogEntry[];
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ logs, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredLogs = logs.filter(log => {
    const matchesCategory = selectedCategory === 'ALL' || log.category === selectedCategory;
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      (log.candidateName && log.candidateName.toLowerCase().includes(search.toLowerCase())) ||
      log.performedBy.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">Live Compliance Audit Trail</h3>
              <p className="text-xs text-slate-400">
                Immutable, real-time event log of every onboarding action, review decision & document access
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search actions, candidate name, or verifier..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['ALL', 'REVIEW', 'DOCUMENT', 'FORM', 'AUTH', 'INVITE'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Table */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No matching audit entries found.
            </div>
          ) : (
            filteredLogs.map(log => (
              <div
                key={log.id}
                className="bg-slate-800/80 border border-slate-750 hover:border-slate-700 p-3.5 rounded-xl text-xs space-y-1 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {log.timestamp}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {log.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    By: <strong className="text-slate-300">{log.performedBy}</strong>
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <h4 className="font-bold text-white text-xs">{log.action}</h4>
                  {log.candidateName && (
                    <span className="text-slate-400 text-[11px]">
                      Candidate: <span className="text-indigo-300 font-medium">{log.candidateName}</span>
                    </span>
                  )}
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed pt-0.5">
                  {log.details}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>{filteredLogs.length} events logged in session</span>
          <span className="text-emerald-400">● Live Audit Socket Connected (Browser-Local)</span>
        </div>
      </div>
    </div>
  );
};
