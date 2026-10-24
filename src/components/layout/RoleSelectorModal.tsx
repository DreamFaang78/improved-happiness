import React from 'react';
import { X, Shield, Check, Users, Landmark, Building, HardHat, User, Eye, Sparkles } from 'lucide-react';
import { DemoRole } from '../../types';

interface RoleSelectorModalProps {
  currentRole: DemoRole;
  onSelectRole: (role: DemoRole) => void;
  onClose: () => void;
}

const ROLES: Array<{
  id: DemoRole;
  title: string;
  tagline: string;
  badge: string;
  icon: React.ElementType;
  color: string;
}> = [
  {
    id: 'SUPER_ADMIN',
    title: 'Super Admin',
    tagline: 'Complete access to all sites, payroll approvals, statutory returns and configuration',
    badge: 'Full Access',
    icon: Shield,
    color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30'
  },
  {
    id: 'HR',
    title: 'HR Manager',
    tagline: 'Employee records, KYC digital onboarding, documents and labour returns verification',
    badge: 'Workforce & KYC',
    icon: Users,
    color: 'text-teal-400 bg-teal-500/20 border-teal-500/30'
  },
  {
    id: 'ACCOUNTS',
    title: 'Accounts Lead',
    tagline: 'Monthly payroll review, bank transfer NEFT proof, PF/ESI challans reconciliation',
    badge: 'Payroll & Bank',
    icon: Landmark,
    color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
  },
  {
    id: 'PROJECT_COORDINATOR',
    title: 'Project Coordinator',
    tagline: 'Site-wise workforce counts, project progress, and contractor compliance readiness',
    badge: 'Projects & Sites',
    icon: Building,
    color: 'text-amber-400 bg-amber-500/20 border-amber-500/30'
  },
  {
    id: 'SITE_INCHARGE',
    title: 'Site Incharge / Timekeeper',
    tagline: 'Mark daily attendance (P/A/WO/OT), muster rolls and height work safety permits',
    badge: 'Site Muster',
    icon: HardHat,
    color: 'text-orange-400 bg-orange-500/20 border-orange-500/30'
  },
  {
    id: 'EMPLOYEE',
    title: 'New Hire / Employee',
    tagline: 'Self-service view of personal profile, uploaded identity documents, and monthly payslips',
    badge: 'Self-Service',
    icon: User,
    color: 'text-blue-400 bg-blue-500/20 border-blue-500/30'
  },
  {
    id: 'CLIENT_VIEWER',
    title: 'Client Compliance Auditor',
    tagline: 'Audit-ready view for Principal Employers (L&T, NHAI) to review monthly compliance packs',
    badge: 'Auditor View',
    icon: Eye,
    color: 'text-purple-400 bg-purple-500/20 border-purple-500/30'
  }
];

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  currentRole,
  onSelectRole,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm select-none">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-teal-500/20 text-teal-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">Switch Demo Perspective</h3>
              <p className="text-[11px] text-slate-400">
                Experience role-tailored dashboards, permissions & workflows
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 text-xs">
          {ROLES.map(role => {
            const isSelected = role.id === currentRole;
            const Icon = role.icon;

            return (
              <div
                key={role.id}
                onClick={() => {
                  onSelectRole(role.id);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-teal-950/40 border-teal-500 ring-2 ring-teal-500/20'
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                <div className={`p-2 rounded-xl border flex-shrink-0 mt-0.5 ${role.color}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-white truncate">{role.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 flex-shrink-0">
                      {role.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {role.tagline}
                  </p>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Disclaimer Footer */}
        <div className="p-3 bg-slate-850 border-t border-slate-800 text-[10px] text-slate-400 text-center font-mono">
          Note: Demo role selector operates UI simulation mode for client walkthroughs.
        </div>
      </div>
    </div>
  );
};
