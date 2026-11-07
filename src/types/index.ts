export type TaskStatus = 
  | 'Assigned' 
  | 'Missing Owner' 
  | 'Missing Deadline' 
  | 'Needs Clarification' 
  | 'Incomplete' 
  | 'Completed';

export interface ActionItem {
  task_id: string;
  meeting_title: string;
  task: string;
  owner: string;
  deadline: string;
  deadline_status: 'Explicit' | 'Missing';
  priority: 'High' | 'Medium' | 'Low';
  status: TaskStatus;
  missing_information: string[];
  created_date: string;
  updated_date?: string;
  scheduled_time?: string;
  estimated_duration_min?: number;
  time_remaining_sec?: number;
  is_timer_running?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  avatarUrl?: string;
  tasksCompleted: number;
  tasksPending: number;
  tasksOverdue: number;
  onTimeRate: number;
  joinedDate: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  type: 'meeting' | 'deep_work' | 'review' | 'deadline';
  startTime: string;
  endTime: string;
  durationMinutes: number;
  associatedTaskId?: string;
  isCompleted: boolean;
  status: 'upcoming' | 'in_progress' | 'completed' | 'overdue';
}

export interface WorkNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'time_warning' | 'time_ended' | 'task_assigned' | 'clarification_needed';
  taskId?: string;
  read: boolean;
}

export interface WorksheetProblem {
  problem_id: string;
  category: 'Engineering Mathematics' | 'Engineering Mechanics';
  topic: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  problem_statement: string;
  given_data: string;
  governing_formula: string;
  solution_answer: string;
  points: number;
  status: 'Unsolved' | 'Attempted' | 'Verified';
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  module: string;
  description: string;
  due_date: string;
  points: number;
  problems: WorksheetProblem[];
  status: 'Assigned' | 'Turned In' | 'Turned In Late' | 'Graded' | 'Missing';
  submission?: {
    submitted_at: string;
    student_response: string;
    attached_file_name?: string;
    grade?: number;
    feedback?: string;
  };
}

export interface ExecutionLogItem {
  id: string;
  timestamp: string;
  nodeName: string;
  status: 'running' | 'success' | 'warning' | 'error';
  durationMs: number;
  inputSummary: string;
  outputSummary: string;
}

export interface TelegramMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  type?: 'text' | 'document' | 'summary' | 'error';
  fileName?: string;
  fileSize?: string;
}

