import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Building2, 
  MapPin, 
  Edit3, 
  Phone,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { Employee, EmploymentStatus, DocumentVerificationStatus, SystemConfig } from '../../types';
import { EmployeeModal } from './EmployeeModal';

interface EmployeeDirectoryProps {
  employees: Employee[];
  config: SystemConfig;
  onSaveEmployee: (employee: Employee) => void;
  isOpenAddModalDefault?: boolean;
}

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({
  employees,
  config,
  onSaveEmployee,
  isOpenAddModalDefault = false
}) => {
  const [search, setSearch] = useState('');
  const [siteFilter, setSiteFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(isOpenAddModalDefault);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSite = siteFilter === 'ALL' || emp.site === siteFilter;
      const matchesStatus = statusFilter === 'ALL' || emp.status === statusFilter;
      const matchesSearch = 
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.empId.toLowerCase().includes(search.toLowerCase()) ||
        emp.designation.toLowerCase().includes(search.toLowerCase()) ||
        emp.mobile.includes(search) ||
        emp.pan.toLowerCase().includes(search.toLowerCase());
      return matchesSite && matchesStatus && matchesSearch;
    });
  }, [employees, siteFilter, statusFilter, search]);

  const handleEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const renderStatusBadge = (status: EmploymentStatus) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
          </span>
        );
      case 'ON_LEAVE':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> On Leave
          </span>
        );
      case 'PROBATION':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Probation
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  const renderDocBadge = (status: DocumentVerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-400">
            <CheckCircle2 className="w-3 h-3" /> Docs OK
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400">
            <AlertTriangle className="w-3 h-3" /> Expired
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-400" />
            <span>Workforce Directory ({filteredEmployees.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage deployments, statutory wage profiles and identity proofs
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-teal-500/20 active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Staff</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-2xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, designation, phone, PAN..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Deployment Sites</option>
            {config.sites.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          {['ALL', 'ACTIVE', 'ON_LEAVE', 'PROBATION'].map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Card List (Visible on mobile screens) */}
      <div className="md:hidden space-y-3">
        {filteredEmployees.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-500 text-xs">
            No employees match the current filters.
          </div>
        ) : (
          filteredEmployees.map(emp => (
            <div
              key={emp.id}
              onClick={() => handleEdit(emp)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl space-y-3 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-teal-300 font-black flex items-center justify-center text-sm flex-shrink-0">
                    {emp.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">{emp.name}</h3>
                      <span className="font-mono text-[10px] text-teal-400 bg-teal-500/10 px-1.5 py-0.2 rounded border border-teal-500/20">
                        {emp.empId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{emp.designation}</p>
                  </div>
                </div>

                <div className="text-right">
                  {renderStatusBadge(emp.status)}
                </div>
              </div>

              {/* Site & Wage strip */}
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-850 rounded-xl border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px]">SITE</span>
                  <span className="text-slate-300 font-medium truncate block">{emp.site}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">WAGE RATE</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {emp.wageType === 'MONTHLY' ? `₹${emp.monthlyGross?.toLocaleString('en-IN')}/mo` : `₹${emp.dailyWage}/day`}
                  </span>
                </div>
              </div>

              {/* Footer row: Docs & Action */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div>{renderDocBadge(emp.documentStatus)}</div>
                <div className="flex items-center gap-1 text-teal-400 font-bold text-xs">
                  <span>View & Edit</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View (Visible on tablet & desktop) */}
      <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-850 text-slate-400 border-b border-slate-800 text-[10px] uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Staff Name & ID</th>
                <th className="py-3.5 px-4">Designation & Department</th>
                <th className="py-3.5 px-4">Site Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Wage Model</th>
                <th className="py-3.5 px-4">Documents</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredEmployees.map(emp => (
                <tr 
                  key={emp.id} 
                  onClick={() => handleEdit(emp)}
                  className="hover:bg-slate-850/80 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-xs">{emp.name}</div>
                    <span className="font-mono text-[11px] text-teal-400">{emp.empId}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-200 font-semibold">{emp.designation}</div>
                    <span className="text-[11px] text-slate-500">{emp.department}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    {emp.site}
                  </td>
                  <td className="py-3.5 px-4">
                    {renderStatusBadge(emp.status)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    {emp.wageType === 'MONTHLY' ? `₹${emp.monthlyGross?.toLocaleString('en-IN')}` : `₹${emp.dailyWage}/d`}
                  </td>
                  <td className="py-3.5 px-4">
                    {renderDocBadge(emp.documentStatus)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(emp);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <EmployeeModal
          employee={selectedEmployee}
          config={config}
          onSave={onSaveEmployee}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
