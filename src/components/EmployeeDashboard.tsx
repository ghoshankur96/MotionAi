import React, { useState, useEffect } from 'react';
import { UserProfile, ActionItem, ScheduleItem, WorkNotification } from '../types';
import { 
  Bot, 
  Sparkles, 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertCircle, 
  Bell, 
  Award, 
  TrendingUp, 
  ArrowRight, 
  Timer, 
  Check, 
  RotateCcw,
  GraduationCap,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

interface EmployeeDashboardProps {
  user: UserProfile;
  tasks: ActionItem[];
  onCompleteTask: (taskId: string, onTime: boolean) => void;
  onUpdateUserProfile: (updated: Partial<UserProfile>) => void;
  onNavigateToTab: (tab: 'classroom' | 'sheets' | 'trello') => void;
  notifications: WorkNotification[];
  onDismissNotification: (id: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  user,
  tasks,
  onCompleteTask,
  onNavigateToTab,
  notifications,
  onDismissNotification
}) => {
  const [activeTask, setActiveTask] = useState<ActionItem | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showCompletionPrompt, setShowCompletionPrompt] = useState<boolean>(false);

  const firstName = user.name.split(' ')[0];
  const userTasks = tasks.filter(t => 
    t.owner.toLowerCase().includes(firstName.toLowerCase()) || 
    t.owner.toLowerCase().includes(user.name.toLowerCase()) ||
    t.owner.toLowerCase() === 'unassigned'
  );

  const [scheduleItems] = useState<ScheduleItem[]>([
    {
      id: 'sch-1',
      title: 'Daily Engineering Standup & Sprint Sync',
      type: 'meeting',
      startTime: '09:30 AM',
      endTime: '10:00 AM',
      durationMinutes: 30,
      isCompleted: true,
      status: 'completed'
    },
    {
      id: 'sch-2',
      title: 'AI Assigned Focus Block: Frontend Development Task',
      type: 'deep_work',
      startTime: '10:15 AM',
      endTime: '11:30 AM',
      durationMinutes: 75,
      isCompleted: false,
      status: 'in_progress'
    },
    {
      id: 'sch-3',
      title: 'Sprint Alignment & Backend Integration Review (Priya & Alex)',
      type: 'meeting',
      startTime: '02:00 PM',
      endTime: '02:45 PM',
      durationMinutes: 45,
      isCompleted: false,
      status: 'upcoming'
    },
    {
      id: 'sch-4',
      title: 'Project Documentation & Code Audit Session',
      type: 'review',
      startTime: '03:30 PM',
      endTime: '04:30 PM',
      durationMinutes: 60,
      isCompleted: false,
      status: 'upcoming'
    },
    {
      id: 'sch-5',
      title: 'Sprint Deliverable Handoff & Telegram Summary Broadcast',
      type: 'review',
      startTime: '04:45 PM',
      endTime: '05:15 PM',
      durationMinutes: 30,
      isCompleted: false,
      status: 'upcoming'
    }
  ]);

  useEffect(() => {
    if (!activeTask && userTasks.length > 0) {
      const pending = userTasks.find(t => t.status === 'Assigned') || userTasks[0];
      setActiveTask(pending);
    }
  }, [userTasks, activeTask]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(sec => sec - 1);
      }, 1000);
    } else if (isTimerRunning && timerSeconds === 0) {
      setIsTimerRunning(false);
      setShowCompletionPrompt(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimerDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWorkOnTask = (task: ActionItem) => {
    setActiveTask(task);
    setTimerSeconds(25 * 60);
    setIsTimerRunning(true);
    setShowCompletionPrompt(false);
  };

  const handleManualCompletion = (onTime: boolean) => {
    if (activeTask) {
      onCompleteTask(activeTask.task_id, onTime);
      setShowCompletionPrompt(false);
      setIsTimerRunning(false);
      setTimerSeconds(25 * 60);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FAF7F2] text-[#1A2621] border border-[#E6E0D5] rounded-2xl overflow-hidden shadow-xl">
      {/* Employee Greeting & AI Briefing Banner in Cream & Green */}
      <div className="p-6 border-b border-[#E6E0D5] bg-[#F5F1E8]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1B5E43] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-[#1B5E43]/20">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#144534] tracking-tight">
                  Welcome, {user.name}
                </h2>
                <span className="text-xs font-mono text-[#1B5E43] bg-[#DEF7EC] border border-[#84E1BC] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E43]" />
                  Active Scholar
                </span>
              </div>
              <p className="text-xs text-[#556960] mt-0.5">
                {user.role} · <span className="text-[#1B5E43] font-semibold">{user.department}</span> · <span className="font-mono text-[#71857C]">{user.email}</span>
              </p>

              {/* AI Daily Briefing */}
              <div className="mt-3.5 p-3.5 rounded-xl bg-white border border-[#DDD6C8] flex items-start gap-3 max-w-3xl shadow-sm">
                <Bot className="w-4 h-4 text-[#1B5E43] shrink-0 mt-0.5" />
                <div className="text-xs text-[#2D3F37] leading-relaxed">
                  <strong className="text-[#144534]">Motion Ai Intelligence Directive:</strong> From the latest Sprint Sync transcript, the bot has automatically designated your primary tasks, scheduled collaboration meetings, and allocated focus blocks. Keep work session timers running to maintain your <strong>{user.onTimeRate}% on-time completion record</strong>.
                </div>
              </div>
            </div>
          </div>

          {/* Productivity Score Card */}
          <div className="flex items-center gap-3 bg-white border border-[#DDD6C8] p-3 rounded-2xl shadow-sm">
            <div className="text-center px-3 border-r border-[#EAE4D8]">
              <span className="text-xl font-bold font-mono text-[#144534] block">
                {user.tasksCompleted}
              </span>
              <span className="text-[10px] text-[#556960] uppercase tracking-wider font-semibold">Completed</span>
            </div>
            <div className="text-center px-3 border-r border-[#EAE4D8]">
              <span className="text-xl font-bold font-mono text-[#D97706] block">
                {user.tasksPending}
              </span>
              <span className="text-[10px] text-[#556960] uppercase tracking-wider font-semibold">Pending</span>
            </div>
            <div className="text-center px-3">
              <span className="text-xl font-bold font-mono text-[#1B5E43] block">
                {user.onTimeRate}%
              </span>
              <span className="text-[10px] text-[#556960] uppercase tracking-wider font-semibold">On-Time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          
          {/* Left Column: Active Focus Timer & Work Items (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Active Work Session Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#E6E0D5] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D8]">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-[#1B5E43]" />
                  <h3 className="text-xs font-bold text-[#144534] uppercase tracking-wider">
                    Current Focus Work Session
                  </h3>
                </div>
                {activeTask && (
                  <span className="text-[11px] font-mono text-[#1B5E43] bg-[#DEF7EC] px-2 py-0.5 rounded font-bold border border-[#84E1BC]">
                    {activeTask.task_id}
                  </span>
                )}
              </div>

              {activeTask ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-[#144534]">
                      {activeTask.task}
                    </h4>
                    <p className="text-xs text-[#556960] mt-1">
                      Assigned to <strong className="text-[#1A2621]">{activeTask.owner}</strong> · Deadline: <strong className="text-[#1B5E43] font-mono">{activeTask.deadline}</strong> · Priority: <span className="text-[#C2410C] font-semibold">{activeTask.priority}</span>
                    </p>
                  </div>

                  {/* Big Digital Countdown Timer */}
                  <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#DDD6C8] flex flex-col items-center justify-center">
                    <span className="text-5xl font-mono font-bold tracking-widest text-[#144534] tabular-nums">
                      {formatTimerDisplay(timerSeconds)}
                    </span>
                    <span className="text-xs text-[#556960] mt-2 font-medium">
                      {isTimerRunning ? 'Session in progress · Prompt will trigger at zero' : 'Timer Ready to Start'}
                    </span>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#EAE4D8] h-2 rounded-full mt-4 overflow-hidden">
                      <div 
                        className="bg-[#1B5E43] h-full transition-all duration-1000"
                        style={{ width: `${((25 * 60 - timerSeconds) / (25 * 60)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          isTimerRunning 
                            ? 'bg-[#D97706] hover:bg-[#B45309] text-white shadow-sm' 
                            : 'bg-[#1B5E43] hover:bg-[#144534] text-white shadow-md shadow-[#1B5E43]/20'
                        }`}
                      >
                        {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isTimerRunning ? 'Pause Session' : 'Start Focus Work'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsTimerRunning(false);
                          setTimerSeconds(25 * 60);
                        }}
                        className="p-2.5 text-[#556960] hover:text-[#1A2621] bg-[#F5F1E8] hover:bg-[#EAE4D8] rounded-xl border border-[#DDD6C8] transition-all cursor-pointer"
                        title="Reset 25m Timer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleManualCompletion(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#03543F] bg-[#DEF7EC] hover:bg-[#BCF0DA] border border-[#84E1BC] rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5 text-[#1B5E43]" />
                      <span>Mark Deliverable Done</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[#71857C]">
                  Select an engineering deliverable below to launch the work timer.
                </div>
              )}
            </div>

            {/* Time Ended Completion Verification Prompt */}
            {showCompletionPrompt && (
              <div className="p-5 rounded-2xl bg-[#FEF3C7] border border-[#F59E0B] space-y-3 shadow-md animate-in fade-in">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#92400E]">
                      Session Time Expired!
                    </h4>
                    <p className="text-xs text-[#78350F] mt-0.5 leading-relaxed">
                      The allotted 25-minute focus session for <strong>"{activeTask?.task}"</strong> has finished. Please verify your progress:
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleManualCompletion(true)}
                    className="px-4 py-2 bg-[#1B5E43] hover:bg-[#144534] text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm"
                  >
                    ✓ Yes, Completed On-Time
                  </button>
                  <button
                    onClick={() => handleManualCompletion(false)}
                    className="px-4 py-2 bg-[#F3EFE6] hover:bg-[#EAE4D8] text-[#78350F] text-xs font-bold rounded-xl cursor-pointer border border-[#F59E0B]/40"
                  >
                    Mark Overdue
                  </button>
                  <button
                    onClick={() => {
                      setTimerSeconds(15 * 60);
                      setIsTimerRunning(true);
                      setShowCompletionPrompt(false);
                    }}
                    className="px-3 py-1.5 text-[#B45309] hover:underline text-xs font-bold cursor-pointer ml-auto"
                  >
                    +15m Extension
                  </button>
                </div>
              </div>
            )}

            {/* Action Items List */}
            <div className="p-6 rounded-2xl bg-white border border-[#E6E0D5] shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE4D8]">
                <h3 className="text-xs font-bold text-[#144534] uppercase tracking-wider">
                  Assigned Deliverables ({userTasks.length})
                </h3>
                <span className="text-[11px] text-[#556960]">
                  Synchronized from Meetings & Classroom
                </span>
              </div>

              <div className="space-y-2.5">
                {userTasks.map((task) => (
                  <div
                    key={task.task_id}
                    className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                      activeTask?.task_id === task.task_id
                        ? 'bg-[#FAF8F5] border-[#1B5E43] ring-1 ring-[#1B5E43]'
                        : 'bg-white border-[#E6E0D5] hover:border-[#1B5E43]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#1B5E43] font-bold">
                          {task.task_id}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          task.status === 'Completed' 
                            ? 'bg-[#DEF7EC] text-[#03543F]'
                            : task.status === 'Assigned'
                            ? 'bg-[#DEF7EC] text-[#1B5E43]'
                            : 'bg-[#FEF08A] text-[#854D0E]'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-[#144534]">
                        {task.task}
                      </h5>
                      <p className="text-[11px] text-[#556960]">
                        Owner: <strong className="text-[#1A2621]">{task.owner}</strong> · Deadline: <span className="font-mono text-[#1B5E43] font-bold">{task.deadline}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartWorkOnTask(task)}
                      className="px-3.5 py-1.5 text-xs font-bold text-[#144534] bg-[#F5F1E8] hover:bg-[#EAE4D8] rounded-xl border border-[#DDD6C8] cursor-pointer whitespace-nowrap transition-all"
                    >
                      Focus Session
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Today's Schedule & Quick Links (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Daily Schedule Timeline */}
            <div className="p-6 rounded-2xl bg-white border border-[#E6E0D5] shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE4D8]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1B5E43]" />
                  <h3 className="text-xs font-bold text-[#144534] uppercase tracking-wider">
                    Today's Academic & Work Schedule
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#556960] font-semibold">
                  Friday, Nov 7
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {scheduleItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4D8] flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-[#F5F1E8] text-[#1B5E43] shrink-0 mt-0.5 border border-[#DDD6C8]">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-[#556960] font-semibold">
                          {item.startTime} – {item.endTime}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          item.status === 'completed'
                            ? 'text-[#03543F] bg-[#DEF7EC]'
                            : item.status === 'in_progress'
                            ? 'text-[#1B5E43] bg-[#DEF7EC]'
                            : 'text-[#556960] bg-[#EAE4D8]'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-[#144534] mt-0.5">
                        {item.title}
                      </h5>
                      <span className="text-[10px] text-[#71857C] uppercase tracking-wider font-semibold">
                        {item.durationMinutes} mins · {item.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Hub Jump Card */}
            <div className="p-5 rounded-2xl bg-[#1B5E43] text-white shadow-md space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#A7F3D0]" />
                <h4 className="font-bold text-sm">Google Classroom Hub</h4>
              </div>
              <p className="text-xs text-[#D1FAE5] leading-relaxed">
                View homework sets, verify calculations with the formula sheet, and submit your handwritten or PDF assignments.
              </p>
              <button
                onClick={() => onNavigateToTab('classroom')}
                className="w-full py-2.5 bg-white hover:bg-[#F3EFE6] text-[#144534] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Open Google Classroom Submissions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Notifications Feed */}
            <div className="p-6 rounded-2xl bg-white border border-[#E6E0D5] shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE4D8]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#D97706]" />
                  <h3 className="text-xs font-bold text-[#144534] uppercase tracking-wider">
                    Work Notifications ({notifications.length})
                  </h3>
                </div>
              </div>

              <div className="space-y-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE4D8] flex items-start justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <h6 className="text-xs font-bold text-[#144534]">{notif.title}</h6>
                      <p className="text-[11px] text-[#4A5D54] leading-snug">
                        {notif.message}
                      </p>
                      <span className="text-[10px] font-mono text-[#71857C] block pt-1">
                        {notif.timestamp}
                      </span>
                    </div>
                    <button
                      onClick={() => onDismissNotification(notif.id)}
                      className="text-[#71857C] hover:text-[#1A2621] text-xs p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
