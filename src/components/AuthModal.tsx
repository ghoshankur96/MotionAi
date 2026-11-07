import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  X,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  currentUser: UserProfile | null;
}

export const PRESET_USERS: UserProfile[] = [
  {
    id: 'user-rahul',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@enterprise.tech',
    phone: '+1 (555) 382-9102',
    role: 'Senior Frontend Developer',
    department: 'Web Engineering',
    tasksCompleted: 14,
    tasksPending: 1,
    tasksOverdue: 0,
    onTimeRate: 96,
    joinedDate: 'Jan 2025'
  },
  {
    id: 'user-priya',
    name: 'Priya Patel',
    email: 'priya.patel@enterprise.tech',
    phone: '+1 (555) 847-1923',
    role: 'Lead Backend Engineer',
    department: 'Core Infrastructure',
    tasksCompleted: 19,
    tasksPending: 1,
    tasksOverdue: 1,
    onTimeRate: 88,
    joinedDate: 'Oct 2024'
  },
  {
    id: 'user-alex',
    name: 'Alex Miller',
    email: 'alex.miller@enterprise.tech',
    phone: '+1 (555) 672-4019',
    role: 'Staff Product Manager',
    department: 'Product & Strategy',
    tasksCompleted: 27,
    tasksPending: 2,
    tasksOverdue: 0,
    onTimeRate: 98,
    joinedDate: 'Mar 2024'
  }
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentUser
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [department, setDepartment] = useState('Engineering');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid company email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setError('Please enter a valid phone number with area/country code.');
      return;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: role.trim() || 'Team Member',
      department: department.trim() || 'General Operations',
      tasksCompleted: 0,
      tasksPending: 1,
      tasksOverdue: 0,
      onTimeRate: 100,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    onLogin(newUser);
    onClose();
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email or select a team member below.');
      return;
    }

    // Check preset or match
    const found = PRESET_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      onLogin(found);
      onClose();
    } else {
      // Auto-create or login with entered details
      const user: UserProfile = {
        id: `user-${Date.now()}`,
        name: name.trim() || email.split('@')[0].replace('.', ' '),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || '+1 (555) 019-2831',
        role: role || 'Enterprise Associate',
        department: department || 'Engineering',
        tasksCompleted: 5,
        tasksPending: 1,
        tasksOverdue: 0,
        onTimeRate: 100,
        joinedDate: 'Nov 2026'
      };
      onLogin(user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/70 relative">
          {currentUser && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Enterprise Employee Portal
              </h3>
              <p className="text-xs text-slate-400">
                Log in to access your AI daily task schedule & work countdown timers
              </p>
            </div>
          </div>

          {/* Tab selector */}
          <div className="flex items-center p-1 mt-5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => { setTab('signin'); setError(null); }}
              className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
                tab === 'signin' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setError(null); }}
              className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
                tab === 'signup' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up (New Employee)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-5">
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300">
              {error}
            </div>
          )}

          {tab === 'signup' ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 234-5678"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul.sharma@enterprise.tech"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                    Role / Job Title
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Frontend Engineer"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="QA & Testing">QA & Testing</option>
                    <option value="DevOps & Infra">DevOps & Infra</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Create Employee Account & Start Today</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  Work Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul.sharma@enterprise.tech"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Log In to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick 1-Click Fast Switch for Demo Employees */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Quick Switch Demo Accounts:
              </span>
              <span className="text-[10px] text-slate-500">1-click test</span>
            </div>

            <div className="space-y-2">
              {PRESET_USERS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onLogin(preset);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400">
                      {preset.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {preset.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {preset.role} · <span className="font-mono text-slate-500">{preset.phone}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-400 font-mono font-medium block">
                      {preset.onTimeRate}% On-Time
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {preset.tasksCompleted} completed
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
