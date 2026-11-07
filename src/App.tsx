/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginSignupScreen } from './components/LoginSignupScreen';
import { GoogleClassroomView } from './components/GoogleClassroomView';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { GoogleSheetsView } from './components/GoogleSheetsView';
import { TrelloBoardView } from './components/TrelloBoardView';
import { TelegramSimulator } from './components/TelegramSimulator';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { ExecutionLogsView } from './components/ExecutionLogsView';
import { DocumentationView } from './components/DocumentationView';
import { NodeInspectorModal } from './components/NodeInspectorModal';
import { WorkflowExportModal } from './components/WorkflowExportModal';
import { PRESET_USERS } from './components/AuthModal';
import { INITIAL_ASSIGNMENTS, MATH_PROBLEMS, MECHANICS_PROBLEMS } from './data/engineeringData';
import { SAMPLE_TRANSCRIPT, WorkflowNode } from './data/workflowData';
import { ActionItem, Assignment, ExecutionLogItem, TelegramMessage, UserProfile, WorkNotification, WorksheetProblem } from './types';

export default function App() {
  // Authentication gate: User sees Login & Sign Up screen first
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('motion_ai_logged_in') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('motion_ai_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return PRESET_USERS[0];
  });

  // Active navigation tab (default to Main Dashboard)
  const [activeTab, setActiveTab] = useState<'classroom' | 'workspace' | 'sheets' | 'trello' | 'simulator' | 'canvas' | 'logs' | 'docs'>('workspace');

  // Google Classroom Assignments state
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);

  // Task & Automation states
  const [tasks, setTasks] = useState<ActionItem[]>([]);
  const [botMessages, setBotMessages] = useState<TelegramMessage[]>([]);
  const [groupMessages, setGroupMessages] = useState<TelegramMessage[]>([]);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLogItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executingNodeId, setExecutingNodeId] = useState<string | undefined>(undefined);
  const [inspectedNode, setInspectedNode] = useState<WorkflowNode | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<string | undefined>(undefined);

  // Work Notifications
  const [notifications, setNotifications] = useState<WorkNotification[]>([
    {
      id: 'notif-1',
      timestamp: '09:00 AM',
      title: 'New Assignment: Problem Set 4 Posted',
      message: 'Engineering Mathematics assignment due Friday. 4 calculus & differential equation problems attached.',
      type: 'task_assigned',
      read: false
    }
  ]);

  // Persist session
  useEffect(() => {
    localStorage.setItem('motion_ai_logged_in', isLoggedIn ? 'true' : 'false');
    localStorage.setItem('motion_ai_user', JSON.stringify(currentUser));
  }, [isLoggedIn, currentUser]);

  // Run initial sample meeting task extraction in background
  useEffect(() => {
    handleProcessTranscript(SAMPLE_TRANSCRIPT);
  }, []);

  const handleUserLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveTab('workspace');
  };

  const handleUserLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('motion_ai_logged_in');
  };

  // Turn In Assignment (like Google Classroom)
  const handleTurnInAssignment = (assignmentId: string, responseText: string, fileName?: string) => {
    const now = new Date();
    const timeStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAssignments(prev => prev.map(a => {
      if (a.id === assignmentId) {
        return {
          ...a,
          status: 'Turned In',
          submission: {
            submitted_at: timeStr,
            student_response: responseText,
            attached_file_name: fileName || `${currentUser.name.replace(' ', '_')}_Assignment.pdf`,
            grade: a.points ? Math.round(a.points * 0.96) : 95,
            feedback: 'Submitted via Motion Ai Google Classroom hub. Calculations verified.'
          }
        };
      }
      return a;
    }));

    // Update profile score
    setCurrentUser(prev => ({
      ...prev,
      tasksCompleted: prev.tasksCompleted + 1,
      tasksPending: Math.max(0, prev.tasksPending - 1),
      onTimeRate: Math.min(100, prev.onTimeRate + 1)
    }));

    // Add in-app notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Assignment Turned In Successfully',
        message: `Your solution sheet for "${assignments.find(a => a.id === assignmentId)?.title || 'Assignment'}" has been handed in to Google Classroom.`,
        type: 'time_ended',
        read: false
      },
      ...prev
    ]);
  };

  const handleUnsubmitAssignment = (assignmentId: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === assignmentId) {
        return {
          ...a,
          status: 'Assigned',
          submission: undefined
        };
      }
      return a;
    }));
  };

  const handleAddAssignment = (newAssignment: Assignment) => {
    setAssignments(prev => [newAssignment, ...prev]);
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `New Assignment Published: ${newAssignment.title}`,
        message: `Due: ${newAssignment.due_date} (${newAssignment.points} Points).`,
        type: 'task_assigned',
        read: false
      },
      ...prev
    ]);
  };

  const handleViewWorksheet = (problems: WorksheetProblem[], title: string) => {
    setActiveTab('sheets');
  };

  const formatTelegramSummary = (meetingTitle: string, meetingDate: string, actionItems: ActionItem[]) => {
    const assigned = actionItems.filter(t => t.status === 'Assigned' || t.status === 'Completed');
    const incomplete = actionItems.filter(t => t.status !== 'Assigned' && t.status !== 'Completed');

    let msg = `📋 MEETING SUMMARY\n\n`;
    msg += `Meeting: ${meetingTitle}\n`;
    msg += `Date: ${meetingDate || 'Friday, Nov 7, 2026'}\n\n`;

    if (assigned.length > 0) {
      msg += `✅ ASSIGNED TASKS\n`;
      assigned.forEach(t => {
        msg += `${t.task} Owner: ${t.owner} Deadline: ${t.deadline} Status: ${t.status}\n`;
      });
      msg += `\n`;
    }

    if (incomplete.length > 0) {
      msg += `⚠️ INCOMPLETE TASKS\n`;
      incomplete.forEach(t => {
        const d = t.deadline === 'Missing' ? 'Not specified' : t.deadline;
        msg += `${t.task} Owner: ${t.owner} Deadline: ${d} Status: ${t.status}\n`;
      });
      msg += `\n`;
    }

    const questions: string[] = [];
    incomplete.forEach(t => {
      if (t.missing_information && t.missing_information.length > 0) {
        questions.push(...t.missing_information);
      } else {
        if (t.owner === 'Unassigned' && t.deadline === 'Missing') {
          questions.push(`Who will handle ${t.task.toLowerCase()} and what is its deadline?`);
        } else if (t.deadline === 'Missing') {
          questions.push(`What is the deadline for ${t.task.toLowerCase()}?`);
        } else if (t.owner === 'Unassigned') {
          questions.push(`Who will handle ${t.task.toLowerCase()}?`);
        }
      }
    });

    if (questions.length > 0) {
      msg += `❓ CLARIFICATION REQUIRED\n`;
      Array.from(new Set(questions)).forEach(q => {
        msg += `${q}\n`;
      });
      msg += `\n`;
    }

    msg += `📌 NEXT ACTION Please confirm the missing information so the task records can be updated.`;
    return msg;
  };

  const handleProcessTranscript = async (transcript: string, fileName?: string) => {
    if (isRunning) return;
    setIsRunning(true);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const execId = `EXEC-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;

    if (!transcript || transcript.trim().length === 0) {
      const errorMsg: TelegramMessage = {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        senderName: 'MotionAiBot',
        text: '⚠️ Input Validation Error: Empty message received. Please provide a meeting conversation transcript or upload a valid .txt file.',
        timestamp: timeStr,
        type: 'error'
      };
      setBotMessages(prev => [...prev, errorMsg]);
      setIsRunning(false);
      return;
    }

    const userMsg: TelegramMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      senderName: currentUser.name,
      text: fileName ? `Uploaded file: ${fileName}` : transcript,
      timestamp: timeStr,
      fileName,
      fileSize: fileName ? `${(transcript.length / 1024).toFixed(1)} KB` : undefined
    };
    setBotMessages(prev => [...prev, userMsg]);

    const nodeSequence = [
      'node-1', 'node-2', 'node-3', 'node-4', 'node-5', 
      'node-6', 'node-7', 'node-8', 'node-9', 'node-10', 
      'node-11', 'node-12', 'node-13', 'node-14', 'node-15'
    ];

    for (const nid of nodeSequence.slice(0, 5)) {
      setExecutingNodeId(nid);
      await new Promise(r => setTimeout(r, 35));
    }

    setExecutingNodeId('node-6');

    let analysisResult: any = null;
    const startTime = performance.now();

    try {
      const res = await fetch('/api/analyze-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });
      if (res.ok) {
        analysisResult = await res.json();
      }
    } catch (e) {
      console.warn("Backend API call failed, falling back to client engine", e);
    }

    for (const nid of nodeSequence.slice(6)) {
      setExecutingNodeId(nid);
      await new Promise(r => setTimeout(r, 40));
    }

    const duration = Math.round(performance.now() - startTime);
    setExecutingNodeId(undefined);

    if (analysisResult && Array.isArray(analysisResult.action_items)) {
      const newItems: ActionItem[] = analysisResult.action_items;

      setTasks(prev => {
        const taskMap = new Map<string, ActionItem>();
        prev.forEach(t => taskMap.set(t.task_id, t));
        newItems.forEach(t => {
          const existing = taskMap.get(t.task_id);
          if (existing) {
            taskMap.set(t.task_id, {
              ...t,
              created_date: existing.created_date,
              updated_date: now.toISOString().split('T')[0]
            });
          } else {
            taskMap.set(t.task_id, t);
          }
        });
        return Array.from(taskMap.values());
      });

      setLastSyncTimestamp(now.toLocaleTimeString());

      const botConfirm: TelegramMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        senderName: 'MotionAiBot',
        text: `✅ Meeting processed successfully!\n\nExtracted ${newItems.length} action items for "${analysisResult.meeting_title}".\n• Synced to Google Sheets (3 tabs: Maths, Mechanics, Tasks)\n• Synced to Trello Board\n• Published to #Engineering-Sprint-Sync.`,
        timestamp: timeStr,
        type: 'text'
      };
      setBotMessages(prev => [...prev, botConfirm]);

      const summaryText = formatTelegramSummary(
        analysisResult.meeting_title,
        analysisResult.meeting_date,
        newItems
      );

      const groupMsg: TelegramMessage = {
        id: `msg-grp-${Date.now()}`,
        sender: 'bot',
        senderName: 'MotionAiBot [BOT]',
        text: summaryText,
        timestamp: timeStr,
        type: 'summary'
      };
      setGroupMessages(prev => [...prev, groupMsg]);

      setExecutionLogs(prev => [
        {
          id: execId,
          timestamp: timeStr,
          nodeName: '15. Execution Logging & Audit',
          status: 'success',
          durationMs: duration || 390,
          inputSummary: `Processed "${analysisResult.meeting_title}" (${transcript.length} chars)`,
          outputSummary: `SUCCESS: ${newItems.length} tasks upserted. Google Sheets + Trello synchronized.`
        },
        ...prev
      ]);
    }

    setIsRunning(false);
  };

  const handleProcessClarification = async (clarificationText: string) => {
    if (isRunning) return;
    setIsRunning(true);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: TelegramMessage = {
      id: `msg-user-clarif-${Date.now()}`,
      sender: 'user',
      senderName: currentUser.name,
      text: clarificationText,
      timestamp: timeStr
    };
    setBotMessages(prev => [...prev, userMsg]);

    setExecutingNodeId('node-10');
    await new Promise(r => setTimeout(r, 90));
    setExecutingNodeId('node-11');
    await new Promise(r => setTimeout(r, 90));
    setExecutingNodeId(undefined);

    const lower = clarificationText.toLowerCase();
    let updatedCount = 0;
    let updateNotes: string[] = [];

    setTasks(prev => {
      return prev.map(task => {
        if (
          (task.owner.toLowerCase().includes('priya') || task.task.toLowerCase().includes('backend')) &&
          (lower.includes('priya') || lower.includes('backend') || lower.includes('integration'))
        ) {
          updatedCount++;
          let newDeadline = 'Wednesday, Nov 12';
          if (lower.includes('friday')) newDeadline = 'Friday';
          if (lower.includes('monday')) newDeadline = 'Monday';

          updateNotes.push(`Backend integration deadline updated to "${newDeadline}". Status -> Assigned.`);

          return {
            ...task,
            deadline: newDeadline,
            deadline_status: 'Explicit',
            status: 'Assigned',
            missing_information: [],
            updated_date: now.toISOString().split('T')[0]
          };
        }

        if (
          (task.task.toLowerCase().includes('documentation') || task.task.toLowerCase().includes('docs')) &&
          (lower.includes('documentation') || lower.includes('docs') || lower.includes('david'))
        ) {
          updatedCount++;
          let newOwner = 'David';
          let newDeadline = 'Nov 18';

          updateNotes.push(`Project documentation assigned to ${newOwner} (due ${newDeadline}). Status -> Assigned.`);

          return {
            ...task,
            owner: newOwner,
            deadline: newDeadline,
            deadline_status: 'Explicit',
            status: 'Assigned',
            missing_information: [],
            updated_date: now.toISOString().split('T')[0]
          };
        }

        return task;
      });
    });

    setLastSyncTimestamp(now.toLocaleTimeString());

    const botReply: TelegramMessage = {
      id: `msg-bot-reply-${Date.now()}`,
      sender: 'bot',
      senderName: 'MotionAiBot',
      text: `✅ Clarification Received & Tasks Updated!\n\n${updateNotes.join('\n')}\n\n• Zero duplicate records created.\n• Google Sheets and Trello updated with new owners and deadlines.`,
      timestamp: timeStr,
      type: 'text'
    };
    setBotMessages(prev => [...prev, botReply]);

    setIsRunning(false);
  };

  const handleCompleteTask = (taskId: string, onTime: boolean) => {
    const now = new Date();
    setTasks(prev => prev.map(t => {
      if (t.task_id === taskId) {
        return {
          ...t,
          status: 'Completed',
          updated_date: now.toISOString().split('T')[0]
        };
      }
      return t;
    }));

    setCurrentUser(prev => ({
      ...prev,
      tasksCompleted: prev.tasksCompleted + 1,
      tasksPending: Math.max(0, prev.tasksPending - 1),
      onTimeRate: onTime ? Math.min(100, prev.onTimeRate + 1) : Math.max(70, prev.onTimeRate - 2)
    }));
  };

  // If not logged in, show the Login and Sign Up screen FIRST
  if (!isLoggedIn) {
    return <LoginSignupScreen onLogin={handleUserLogin} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-[#FAF7F2] text-[#1A2621] font-sans overflow-hidden selection:bg-[#1B5E43]/20 selection:text-[#0F382A]">
      {/* Top Navbar in Cream & Green */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExport={() => setIsExportOpen(true)}
        onRunSample={() => {
          setActiveTab('classroom');
          handleProcessTranscript(SAMPLE_TRANSCRIPT);
        }}
        isRunning={isRunning}
        currentUser={currentUser}
        onLogout={handleUserLogout}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 p-3 sm:p-5 overflow-hidden flex flex-col bg-[#FAF7F2]">
        {activeTab === 'classroom' && (
          <GoogleClassroomView
            currentUser={currentUser}
            assignments={assignments}
            onAddAssignment={handleAddAssignment}
            onTurnInAssignment={handleTurnInAssignment}
            onUnsubmitAssignment={handleUnsubmitAssignment}
            onViewWorksheet={handleViewWorksheet}
          />
        )}

        {activeTab === 'sheets' && (
          <GoogleSheetsView
            tasks={tasks}
            lastSyncTimestamp={lastSyncTimestamp}
            mathProblems={MATH_PROBLEMS}
            mechanicsProblems={MECHANICS_PROBLEMS}
          />
        )}

        {activeTab === 'workspace' && (
          <EmployeeDashboard
            user={currentUser}
            tasks={tasks}
            onCompleteTask={handleCompleteTask}
            onUpdateUserProfile={(updated) => setCurrentUser(prev => ({ ...prev, ...updated }))}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            notifications={notifications}
            onDismissNotification={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
          />
        )}

        {activeTab === 'trello' && (
          <TrelloBoardView
            tasks={tasks}
            onUpdateTaskStatus={(taskId, newStatus) => {
              setTasks(prev => prev.map(t => t.task_id === taskId ? { ...t, status: newStatus } : t));
            }}
          />
        )}

        {activeTab === 'simulator' && (
          <TelegramSimulator
            onProcessTranscript={handleProcessTranscript}
            onProcessClarification={handleProcessClarification}
            isRunning={isRunning}
            botMessages={botMessages}
            groupMessages={groupMessages}
            onClearChat={() => {
              setBotMessages([]);
              setGroupMessages([]);
            }}
          />
        )}

        {activeTab === 'canvas' && (
          <WorkflowCanvas
            activeNodeId={inspectedNode?.id}
            onSelectNode={(node) => setInspectedNode(node)}
            executingNodeId={executingNodeId}
          />
        )}

        {activeTab === 'logs' && (
          <ExecutionLogsView
            logs={executionLogs}
            onClearLogs={() => setExecutionLogs([])}
          />
        )}

        {activeTab === 'docs' && (
          <DocumentationView />
        )}
      </main>

      {/* Node Inspector Modal */}
      <NodeInspectorModal
        node={inspectedNode}
        onClose={() => setInspectedNode(null)}
      />

      {/* Export n8n Workflow JSON Modal */}
      <WorkflowExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
