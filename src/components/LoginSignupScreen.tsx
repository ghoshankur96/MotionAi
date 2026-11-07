import React, { useState } from 'react';
import { UserProfile } from '../types';
import { PRESET_USERS } from './AuthModal';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  GraduationCap,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface LoginSignupScreenProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginSignupScreen: React.FC<LoginSignupScreenProps> = ({ onLogin }) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Engineering Student / Developer');
  const [department, setDepartment] = useState('Mechanical & Software Engineering');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid educational or enterprise email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setError('Please provide a valid phone number with country/area code.');
      return;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: role.trim() || 'Engineering Fellow',
      department: department.trim() || 'Engineering',
      tasksCompleted: 0,
      tasksPending: 2,
      tasksOverdue: 0,
      onTimeRate: 100,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    onLogin(newUser);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email or choose a preset profile below.');
      return;
    }

    const found = PRESET_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      onLogin(found);
    } else {
      const user: UserProfile = {
        id: `user-${Date.now()}`,
        name: name.trim() || email.split('@')[0].replace('.', ' '),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || '+1 (555) 019-2831',
        role: role || 'Engineering Scholar',
        department: department || 'Engineering',
        tasksCompleted: 5,
        tasksPending: 1,
        tasksOverdue: 0,
        onTimeRate: 98,
        joinedDate: 'Nov 2026'
      };
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] text-[#1A2621] flex flex-col justify-between selection:bg-[#1E4D3A]/20 selection:text-[#0F382A]">
      {/* Top Banner Bar */}
      <header className="border-b border-[#E6E0D5] bg-[#F4EFE6]/80 backdrop-blur px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1B5E43] flex items-center justify-center text-white shadow-sm shadow-[#1B5E43]/20">
              <span className="font-bold text-base tracking-tighter">M</span>
            </div>
            <div>
              <span className="text-base font-bold text-[#144534] tracking-tight block leading-tight">
                Motion Ai
              </span>
              <span className="text-[11px] text-[#556960] font-medium">
                Engineering Workspaces · Google Classroom Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#40564C] font-medium hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-[#1B5E43]" />
            <span>Academic & Enterprise Gateway</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-lg bg-[#FFFFFF] border border-[#E6E0D5] rounded-2xl shadow-xl shadow-[#1B5E43]/5 overflow-hidden">
          
          {/* Card Header */}
          <div className="p-6 sm:p-8 bg-[#F5F1E8]/60 border-b border-[#E6E0D5] text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1B5E43] text-white mb-3 shadow-md shadow-[#1B5E43]/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#144534] tracking-tight">
              Sign In to Motion Ai
            </h1>
            <p className="text-xs text-[#556960] mt-1 max-w-sm mx-auto leading-relaxed">
              Log in to access your engineering worksheets, problem sets, Classroom assignment submissions, and AI daily schedule.
            </p>

            {/* Segmented Tab Switcher */}
            <div className="flex items-center p-1 mt-5 bg-[#EAE4D8] rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setTab('signin'); setError(null); }}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  tab === 'signin' 
                    ? 'bg-[#1B5E43] text-white shadow-sm' 
                    : 'text-[#4A5D54] hover:text-[#1A2621]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setTab('signup'); setError(null); }}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  tab === 'signup' 
                    ? 'bg-[#1B5E43] text-white shadow-sm' 
                    : 'text-[#4A5D54] hover:text-[#1A2621]'
                }`}
              >
                Sign Up (New Scholar)
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-3 bg-[#FEE2E2] border border-[#FCA5A5] rounded-xl text-xs text-[#991B1B]">
                {error}
              </div>
            )}

            {tab === 'signup' ? (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#2D3F37] flex items-center gap-1.5 mb-1">
                    <User className="w-3.5 h-3.5 text-[#1B5E43]" />
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#FAF8F5] border border-[#DDD6C8] focus:border-[#1B5E43] focus:ring-1 focus:ring-[#1B5E43] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1A2621] placeholder:text-[#8C9B93]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2D3F37] flex items-center gap-1.5 mb-1">
                    <Phone className="w-3.5 h-3.5 text-[#1B5E43]" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 382-9102"
                    className="w-full bg-[#FAF8F5] border border-[#DDD6C8] focus:border-[#1B5E43] focus:ring-1 focus:ring-[#1B5E43] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1A2621] placeholder:text-[#8C9B93]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2D3F37] flex items-center gap-1.5 mb-1">
                    <Mail className="w-3.5 h-3.5 text-[#1B5E43]" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul.sharma@enterprise.tech"
                    className="w-full bg-[#FAF8F5] border border-[#DDD6C8] focus:border-[#1B5E43] focus:ring-1 focus:ring-[#1B5E43] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1A2621] placeholder:text-[#8C9B93]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#2D3F37] flex items-center gap-1.5 mb-1">
                      <Briefcase className="w-3.5 h-3.5 text-[#1B5E43]" />
                      Specialization / Role
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Mechanics & Software"
                      className="w-full bg-[#FAF8F5] border border-[#DDD6C8] focus:border-[#1B5E43] focus:outline-none rounded-xl px-3 py-2 text-xs text-[#1A2621]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#2D3F37] flex items-center gap-1.5 mb-1">
                      <Building2 className="w-3.5 h-3.5 text-[#1B5E43]" />
                      Faculty / Dept
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#DDD6C8] focus:border-[#1B5E43] focus:outline-none rounded-xl px-3 py-2 text-xs text-[#1A2621]"
                    >
                      <option value="Mechanical & Software Engineering">Mechanical & Software</option>
                      <option value="Applied Mathematics">Applied Mathematics</option>
                      <option value="Civil & Structural">Civil & Structural</option>
                      <option value="Computer Science">Computer Science</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 bg-[#1B5E43] hover:bg-[#144534] text-white text-xs font-bold rounded-xl shadow-md shadow-[#1B5E43]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Complete Registration & Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#2D3F37] flex items-center gap-1.5 mb-1">
                    <Mail className="w-3.5 h-3.5 text-[#1B5E43]" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul.sharma@enterprise.tech"
                    className="w-full bg-[#FAF8F5] border border-[#DDD6C8] focus:border-[#1B5E43] focus:ring-1 focus:ring-[#1B5E43] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1A2621] placeholder:text-[#8C9B93]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#1B5E43] hover:bg-[#144534] text-white text-xs font-bold rounded-xl shadow-md shadow-[#1B5E43]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Log In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Quick 1-Click Fast Switch Demo Accounts */}
            <div className="pt-4 border-t border-[#EAE4D8]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-[#144534] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                  Or 1-Click Instant Demo Profiles:
                </span>
                <span className="text-[10px] text-[#71857C]">Ready to evaluate</span>
              </div>

              <div className="space-y-2">
                {PRESET_USERS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onLogin(preset)}
                    className="w-full p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#DDD6C8] hover:border-[#1B5E43] text-left transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E5DFD3] border border-[#DDD6C8] flex items-center justify-center font-bold text-xs text-[#1B5E43]">
                        {preset.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1A2621] group-hover:text-[#1B5E43] transition-colors">
                          {preset.name}
                        </p>
                        <p className="text-[11px] text-[#556960]">
                          {preset.role} · <span className="font-mono text-[#788C83]">{preset.phone}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#1B5E43] font-mono font-bold block">
                        {preset.onTimeRate}% On-Time
                      </span>
                      <span className="text-[10px] text-[#71857C]">
                        {preset.tasksCompleted} completed
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E6E0D5] bg-[#F4EFE6]/60 py-4 px-6 text-center text-xs text-[#556960]">
        Motion Ai Academic & Task Automation System · Built with n8n, OpenAI, Google Sheets & Classroom Hub
      </footer>
    </div>
  );
};
