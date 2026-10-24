import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  MapPin, 
  HardHat, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw,
  Check,
  Shield
} from 'lucide-react';
import { SystemConfig } from '../../types';
import { triggerConfetti } from '../../utils/confetti';

interface SystemSettingsProps {
  config: SystemConfig;
  onSaveConfig: (config: SystemConfig) => void;
  onResetDemo: () => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({
  config,
  onSaveConfig,
  onResetDemo
}) => {
  const [currentConfig, setCurrentConfig] = useState<SystemConfig>(config);
  const [newSite, setNewSite] = useState('');
  const [newProject, setNewProject] = useState('');
  const [newDesignation, setNewDesignation] = useState('');
  const [saved, setSaved] = useState(false);

  const handleAddSite = () => {
    if (!newSite.trim()) return;
    if (currentConfig.sites.includes(newSite.trim())) return;
    setCurrentConfig(prev => ({
      ...prev,
      sites: [...prev.sites, newSite.trim()]
    }));
    setNewSite('');
  };

  const handleRemoveSite = (siteName: string) => {
    setCurrentConfig(prev => ({
      ...prev,
      sites: prev.sites.filter(s => s !== siteName)
    }));
  };

  const handleAddProject = () => {
    if (!newProject.trim()) return;
    if (currentConfig.projects.includes(newProject.trim())) return;
    setCurrentConfig(prev => ({
      ...prev,
      projects: [...prev.projects, newProject.trim()]
    }));
    setNewProject('');
  };

  const handleRemoveProject = (projectName: string) => {
    setCurrentConfig(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p !== projectName)
    }));
  };

  const handleAddDesignation = () => {
    if (!newDesignation.trim()) return;
    if (currentConfig.designations.includes(newDesignation.trim())) return;
    setCurrentConfig(prev => ({
      ...prev,
      designations: [...prev.designations, newDesignation.trim()]
    }));
    setNewDesignation('');
  };

  const handleRemoveDesignation = (desig: string) => {
    setCurrentConfig(prev => ({
      ...prev,
      designations: prev.designations.filter(d => d !== desig)
    }));
  };

  const handleSave = () => {
    onSaveConfig(currentConfig);
    setSaved(true);
    triggerConfetti();
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-teal-400" />
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Master Configuration & Enterprise Settings
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize deployment sites, projects, designations, and reminder intervals dynamically
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md active:scale-95 flex-shrink-0"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Saved Changes!' : 'Save System Settings'}</span>
          </button>
        </div>
      </div>

      {/* Section 1: Company Profile */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
        <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
          Enterprise Name
        </span>
        <input
          type="text"
          value={currentConfig.companyName}
          onChange={(e) => setCurrentConfig({ ...currentConfig, companyName: e.target.value })}
          className="w-full px-3 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
        />
      </div>

      {/* Section 2: Deployment Sites */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
        <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
          Operational Sites ({currentConfig.sites.length})
        </span>

        <div className="flex gap-2">
          <input
            type="text"
            value={newSite}
            onChange={(e) => setNewSite(e.target.value)}
            placeholder="Add new site (e.g. Ring Road Toll Plaza Site D)..."
            className="flex-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="button"
            onClick={handleAddSite}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-teal-300 font-bold text-xs rounded-xl border border-slate-700"
          >
            Add Site
          </button>
        </div>

        <div className="space-y-1.5 pt-1 text-xs">
          {currentConfig.sites.map(s => (
            <div key={s} className="p-2.5 bg-slate-850 rounded-xl border border-slate-800 flex items-center justify-between text-slate-200">
              <span className="font-medium">{s}</span>
              {currentConfig.sites.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSite(s)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Designations */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
        <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
          Staff Designations ({currentConfig.designations.length})
        </span>

        <div className="flex gap-2">
          <input
            type="text"
            value={newDesignation}
            onChange={(e) => setNewDesignation(e.target.value)}
            placeholder="Add new role (e.g. Mechanical Foreman)..."
            className="flex-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400"
          />
          <button
            type="button"
            onClick={handleAddDesignation}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-teal-300 font-bold text-xs rounded-xl border border-slate-700"
          >
            Add Role
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
          {currentConfig.designations.map(d => (
            <span key={d} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-850 rounded-xl border border-slate-750 text-slate-300">
              <span>{d}</span>
              {currentConfig.designations.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveDesignation(d)}
                  className="text-slate-500 hover:text-rose-400"
                >
                  ✕
                </button>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Section 4: Demo Reset Card */}
      <div className="bg-rose-950/20 border border-rose-500/30 p-5 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo to Factory Seeds</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Restore all 15 employee profiles, attendance muster, payroll reviews, and monthly compliance packs back to default seed records.
        </p>
        <button
          type="button"
          onClick={onResetDemo}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          Reset All Demo Records
        </button>
      </div>
    </div>
  );
};
