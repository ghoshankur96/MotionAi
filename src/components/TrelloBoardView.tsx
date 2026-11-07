import React, { useState } from 'react';
import { ActionItem } from '../types';
import { 
  Trello, 
  Calendar, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Plus, 
  ExternalLink,
  Kanban
} from 'lucide-react';

interface TrelloBoardViewProps {
  tasks: ActionItem[];
  onUpdateTaskStatus?: (taskId: string, newStatus: ActionItem['status']) => void;
}

export const TrelloBoardView: React.FC<TrelloBoardViewProps> = ({
  tasks,
  onUpdateTaskStatus
}) => {
  // Columns matching Kanban workflow
  const columns = [
    {
      id: 'backlog',
      title: 'Backlog / Clarification Needed',
      filter: (t: ActionItem) => t.status === 'Incomplete' || t.status === 'Needs Clarification' || t.status === 'Missing Owner'
    },
    {
      id: 'pending_deadline',
      title: 'Missing Deadline',
      filter: (t: ActionItem) => t.status === 'Missing Deadline'
    },
    {
      id: 'in_progress',
      title: 'Assigned / In Progress',
      filter: (t: ActionItem) => t.status === 'Assigned'
    },
    {
      id: 'completed',
      title: 'Completed',
      filter: (t: ActionItem) => t.status === 'Completed'
    }
  ];

  const getLabelBadges = (task: ActionItem) => {
    const badges = [];

    if (task.priority === 'High') {
      badges.push({ text: 'High Priority', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' });
    }

    if (task.status === 'Missing Deadline') {
      badges.push({ text: 'Missing Deadline', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' });
    } else if (task.status === 'Missing Owner' || task.owner === 'Unassigned') {
      badges.push({ text: 'Missing Owner', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' });
    } else if (task.status === 'Incomplete') {
      badges.push({ text: 'Incomplete', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' });
    } else if (task.status === 'Assigned') {
      badges.push({ text: 'Assigned', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' });
    }

    return badges;
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Trello Board Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-600/20 border border-sky-500/30 text-sky-400">
            <Trello className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                Trello Kanban Board · Project Horizon
              </h3>
              <span className="text-[11px] font-mono text-sky-400 bg-sky-950/40 border border-sky-800/40 px-2 py-0.5 rounded">
                Auto-Card Sync
              </span>
            </div>
            <p className="text-xs text-slate-400">
              One card per action item with owners, deadlines, and clarification labels
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="font-mono text-slate-300">Total Cards: {tasks.length}</span>
          <span className="text-slate-600">·</span>
          <span className="text-emerald-400 font-mono">Zero Duplicates: Enforced</span>
        </div>
      </div>

      {/* Kanban Board View */}
      <div className="flex-1 p-5 overflow-x-auto bg-slate-950">
        <div className="flex gap-4 min-w-[900px] h-full items-start">
          {columns.map((col) => {
            const colTasks = tasks.filter(col.filter);

            return (
              <div 
                key={col.id} 
                className="flex-1 flex flex-col bg-slate-900/60 border border-slate-800 rounded-xl max-h-full overflow-hidden"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                  <h4 className="text-xs font-semibold text-slate-200">
                    {col.title}
                  </h4>
                  <span className="text-xs font-mono font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Cards Container */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3">
                  {colTasks.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-600 border border-dashed border-slate-800/60 rounded-lg">
                      No cards in this list
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.task_id}
                        className="p-3.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg shadow-sm space-y-2.5 transition-all text-left"
                      >
                        {/* Labels row */}
                        <div className="flex flex-wrap gap-1.5">
                          {getLabelBadges(task).map((badge, idx) => (
                            <span 
                              key={idx} 
                              className={`text-[10px] font-medium px-2 py-0.5 rounded border ${badge.color}`}
                            >
                              {badge.text}
                            </span>
                          ))}
                        </div>

                        {/* Card Title (Task Description) */}
                        <h5 className="text-xs font-semibold text-white leading-snug">
                          {task.task}
                        </h5>

                        {/* Metadata Details */}
                        <div className="space-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="text-slate-500">Owner:</span>
                            <span className={task.owner === 'Unassigned' ? 'text-amber-400 italic' : 'text-slate-200 font-medium'}>
                              {task.owner}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="text-slate-500">Deadline:</span>
                            <span className={task.deadline === 'Missing' ? 'text-amber-400 italic' : 'text-slate-200 font-mono'}>
                              {task.deadline}
                            </span>
                          </div>

                          {task.missing_information && task.missing_information.length > 0 && (
                            <div className="pt-1.5">
                              <span className="text-[10px] uppercase font-semibold text-amber-400 tracking-wider">
                                Required Clarification:
                              </span>
                              <p className="text-[11px] text-amber-300/90 italic mt-0.5 leading-snug">
                                {task.missing_information.join(' ')}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Task ID Footer */}
                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
                          <span>{task.task_id}</span>
                          <span>{task.created_date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
