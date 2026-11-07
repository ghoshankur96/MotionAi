import React, { useState } from 'react';
import { Download, Bot, Sparkles, RefreshCw, User, LogOut, ChevronDown, CheckCircle2, GraduationCap } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'classroom' | 'workspace' | 'sheets' | 'trello' | 'simulator' | 'canvas' | 'logs' | 'docs';
  setActiveTab: (tab: 'classroom' | 'workspace' | 'sheets' | 'trello' | 'simulator' | 'canvas' | 'logs' | 'docs') => void;
  onOpenExport: () => void;
  onRunSample: () => void;
  isRunning: boolean;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenExport,
  onRunSample,
  isRunning,
  currentUser,
  onLogout
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E6E0D5] bg-[#FAF7F2]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 h-16">
        
        {/* Zone 1: Brand Wordmark (Cream & Green) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#1B5E43] flex items-center justify-center text-white shadow-sm shadow-[#1B5E43]/20">
            <span className="font-bold text-sm tracking-tighter">M</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold tracking-tight text-[#144534] whitespace-nowrap">
              Motion Ai
            </span>
            <span className="text-xs text-[#1B5E43] font-medium hidden sm:inline">
              Work & Classroom
            </span>
          </div>
        </div>

        {/* Zone 2: Single-Line Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-[#556960]">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'workspace' ? 'text-[#1B5E43] font-bold border-b-2 border-[#1B5E43] pb-0.5' : 'hover:text-[#144534]'
            }`}
          >
            Main Dashboard
          </button>
          <button
            onClick={() => setActiveTab('classroom')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'classroom' ? 'text-[#1B5E43] font-bold border-b-2 border-[#1B5E43] pb-0.5' : 'hover:text-[#144534]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Classroom (Turn In)</span>
          </button>
          <button
            onClick={() => setActiveTab('sheets')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'sheets' ? 'text-[#1B5E43] font-bold border-b-2 border-[#1B5E43] pb-0.5' : 'hover:text-[#144534]'
            }`}
          >
            Google Sheets
          </button>
          <button
            onClick={() => setActiveTab('trello')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'trello' ? 'text-[#1B5E43] font-bold border-b-2 border-[#1B5E43] pb-0.5' : 'hover:text-[#144534]'
            }`}
          >
            Trello Board
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'simulator' ? 'text-[#1B5E43] font-bold border-b-2 border-[#1B5E43] pb-0.5' : 'hover:text-[#144534]'
            }`}
          >
            Telegram Bot
          </button>
          <button
            onClick={() => setActiveTab('canvas')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'canvas' ? 'text-[#1B5E43] font-bold border-b-2 border-[#1B5E43] pb-0.5' : 'hover:text-[#144534]'
            }`}
          >
            n8n Pipeline
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'logs' ? 'text-[#1B5E43] font-bold border-b-2 border-[#1B5E43] pb-0.5' : 'hover:text-[#144534]'
            }`}
          >
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'docs' ? 'text-[#1B5E43] font-bold border-b-2 border-[#1B5E43] pb-0.5' : 'hover:text-[#144534]'
            }`}
          >
            Guide
          </button>
        </nav>

        {/* Zone 3: Primary Actions & User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onRunSample}
            disabled={isRunning}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#144534] bg-[#F4EFE6] hover:bg-[#EAE4D8] border border-[#DDD6C8] rounded-xl transition-all cursor-pointer disabled:opacity-50"
            title="Execute meeting sync"
          >
            {isRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#1B5E43]" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            )}
            <span>Run Sync</span>
          </button>

          <button
            onClick={onOpenExport}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#1B5E43] hover:bg-[#144534] rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export n8n</span>
          </button>

          {/* User Profile / Logout Dropdown */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 bg-white hover:bg-[#F5F1E8] border border-[#DDD6C8] rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-[#144534] block leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#1B5E43] leading-tight block">
                    {currentUser.onTimeRate}% On-Time
                  </span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-[#1B5E43] flex items-center justify-center font-bold text-xs text-white">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#71857C] pr-0.5" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#E6E0D5] shadow-2xl p-3.5 z-50 space-y-2.5 text-xs text-[#2D3F37]"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="pb-2 border-b border-[#EAE4D8]">
                    <p className="font-bold text-[#144534]">{currentUser.name}</p>
                    <p className="text-[#556960] text-[11px] truncate">{currentUser.email}</p>
                    <p className="text-[11px] font-mono text-[#788C83]">{currentUser.phone}</p>
                    <p className="text-[11px] text-[#1B5E43] font-semibold mt-1">{currentUser.role}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center py-1">
                    <div className="p-2 bg-[#FAF8F5] rounded-xl border border-[#EAE4D8]">
                      <span className="font-mono font-bold text-[#144534] block text-sm">{currentUser.tasksCompleted}</span>
                      <span className="text-[10px] text-[#556960]">Completed</span>
                    </div>
                    <div className="p-2 bg-[#FAF8F5] rounded-xl border border-[#EAE4D8]">
                      <span className="font-mono font-bold text-[#1B5E43] block text-sm">{currentUser.onTimeRate}%</span>
                      <span className="text-[10px] text-[#556960]">On-Time</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#EAE4D8]">
                    <button
                      onClick={onLogout}
                      className="w-full py-1.5 px-2 text-xs text-[#991B1B] hover:bg-[#FEE2E2] font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out (Back to Login)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex lg:hidden items-center justify-around border-t border-[#E6E0D5] px-2 py-2 overflow-x-auto text-xs font-semibold text-[#556960] bg-[#FAF7F2]">
        <button
          onClick={() => setActiveTab('workspace')}
          className={`px-2 py-1 ${activeTab === 'workspace' ? 'text-[#1B5E43] font-bold' : ''}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('classroom')}
          className={`px-2 py-1 ${activeTab === 'classroom' ? 'text-[#1B5E43] font-bold' : ''}`}
        >
          Classroom
        </button>
        <button
          onClick={() => setActiveTab('sheets')}
          className={`px-2 py-1 ${activeTab === 'sheets' ? 'text-[#1B5E43] font-bold' : ''}`}
        >
          Sheets
        </button>
        <button
          onClick={() => setActiveTab('trello')}
          className={`px-2 py-1 ${activeTab === 'trello' ? 'text-[#1B5E43] font-bold' : ''}`}
        >
          Trello
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-2 py-1 ${activeTab === 'simulator' ? 'text-[#1B5E43] font-bold' : ''}`}
        >
          Telegram
        </button>
        <button
          onClick={() => setActiveTab('canvas')}
          className={`px-2 py-1 ${activeTab === 'canvas' ? 'text-[#1B5E43] font-bold' : ''}`}
        >
          n8n
        </button>
      </div>
    </header>
  );
};
