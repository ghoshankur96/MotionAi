import React, { useState } from 'react';
import { Assignment, WorksheetProblem, UserProfile } from '../types';
import { INITIAL_ASSIGNMENTS, MATH_PROBLEMS, MECHANICS_PROBLEMS } from '../data/engineeringData';
import { 
  GraduationCap, 
  BookOpen, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Upload, 
  Paperclip, 
  Send, 
  RotateCcw, 
  X, 
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';

interface GoogleClassroomViewProps {
  currentUser: UserProfile;
  assignments: Assignment[];
  onAddAssignment: (assignment: Assignment) => void;
  onTurnInAssignment: (assignmentId: string, responseText: string, fileName?: string) => void;
  onUnsubmitAssignment: (assignmentId: string) => void;
  onViewWorksheet: (problems: WorksheetProblem[], title: string) => void;
}

export const GoogleClassroomView: React.FC<GoogleClassroomViewProps> = ({
  currentUser,
  assignments,
  onAddAssignment,
  onTurnInAssignment,
  onUnsubmitAssignment,
  onViewWorksheet
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'Assigned' | 'Turned In' | 'Graded'>('ALL');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Turn-in state inside drawer
  const [studentResponse, setStudentResponse] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');

  // New assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<'Engineering Mathematics' | 'Engineering Mechanics'>('Engineering Mathematics');
  const [newModule, setNewModule] = useState('Module 1: Foundations');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('Friday, Nov 20, 2026, 11:59 PM');
  const [newPoints, setNewPoints] = useState(100);

  const filteredAssignments = assignments.filter((a) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'Turned In') return a.status === 'Turned In' || a.status === 'Turned In Late';
    return a.status === activeFilter;
  });

  const openTurnInModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setStudentResponse(assignment.submission?.student_response || '');
    setAttachedFileName(assignment.submission?.attached_file_name || '');
  };

  const handleTurnIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    onTurnInAssignment(
      selectedAssignment.id,
      studentResponse.trim() || 'Attached solution equations and verified derivation steps.',
      attachedFileName || `${currentUser.name.replace(' ', '_')}_Assignment_Submission.pdf`
    );
    setSelectedAssignment(null);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const chosenProblems = newSubject === 'Engineering Mathematics' ? MATH_PROBLEMS : MECHANICS_PROBLEMS;
    const assignment: Assignment = {
      id: `asg-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      module: newModule.trim() || 'Core Engineering Systems',
      description: newDescription.trim() || 'Solve the attached engineering problems with full step-by-step mathematical calculations and Free-Body Diagrams.',
      due_date: newDueDate,
      points: Number(newPoints) || 100,
      problems: chosenProblems,
      status: 'Assigned'
    };

    onAddAssignment(assignment);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FAF7F2] text-[#1A2621] border border-[#E6E0D5] rounded-2xl overflow-hidden shadow-xl">
      {/* Google Classroom Class Header Banner */}
      <div className="p-6 bg-[#1B5E43] text-white flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#A7F3D0] bg-[#144534] px-2.5 py-0.5 rounded-full border border-[#34D399]/30">
              Google Classroom Hub
            </span>
            <span className="text-xs text-[#D1FAE5]">Term: Fall 2026 · Section 04</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-1 text-white">
            ENGR 201: Engineering Mathematics & Applied Mechanics
          </h2>
          <p className="text-xs text-[#D1FAE5]/90 mt-1 max-w-xl">
            Course Lead: Prof. Alex Miller · Class Code: <span className="font-mono font-bold text-white bg-[#144534] px-2 py-0.5 rounded">eng-7x9q</span>
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#F3EFE6] text-[#144534] text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* Filter and Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 border-b border-[#E6E0D5] bg-[#F4EFE6]/70 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-[#EAE4D8] rounded-xl font-semibold">
          {(['ALL', 'Assigned', 'Turned In', 'Graded'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[#1B5E43] text-white shadow-sm'
                  : 'text-[#4A5D54] hover:text-[#1A2621]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-[#556960] font-medium">
          <span>Active Scholar: <strong className="text-[#144534]">{currentUser.name}</strong></span>
          <span>·</span>
          <span>Total Assignments: <strong className="text-[#144534]">{assignments.length}</strong></span>
        </div>
      </div>

      {/* Assignment List Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="p-12 text-center text-[#71857C]">
            <BookOpen className="w-10 h-10 text-[#A3B2AA] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-[#144534]">No assignments found in this filter</h4>
            <p className="text-xs text-[#556960] mt-1">Switch to 'ALL' or click 'Create Assignment' above.</p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-5 bg-[#FFFFFF] border border-[#E6E0D5] hover:border-[#1B5E43] rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Assignment Info */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                    assignment.status === 'Graded'
                      ? 'bg-[#DEF7EC] text-[#03543F] border border-[#84E1BC]'
                      : assignment.status === 'Turned In' || assignment.status === 'Turned In Late'
                      ? 'bg-[#E1EFFE] text-[#1E429F] border border-[#A4CAFE]'
                      : 'bg-[#FEF08A] text-[#854D0E] border border-[#FACC15]'
                  }`}>
                    {assignment.status}
                  </span>
                  <span className="text-xs text-[#556960] font-medium">
                    {assignment.subject} · {assignment.module}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#144534] leading-snug group-hover:text-[#1B5E43] transition-colors">
                  {assignment.title}
                </h3>

                <p className="text-xs text-[#4A5D54] line-clamp-2 leading-relaxed">
                  {assignment.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#556960] pt-1 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#1B5E43]" />
                    Due: <strong className="text-[#1A2621]">{assignment.due_date}</strong>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#D97706]" />
                    {assignment.points} points
                  </span>
                  <span>·</span>
                  <span className="text-[#1B5E43]">
                    {assignment.problems.length} engineering problems attached
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#EAE4D8]">
                <button
                  onClick={() => onViewWorksheet(assignment.problems, assignment.title)}
                  className="px-3.5 py-2 bg-[#F5F1E8] hover:bg-[#EAE4D8] text-[#144534] border border-[#DDD6C8] rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Worksheet</span>
                </button>

                <button
                  onClick={() => openTurnInModal(assignment)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                    assignment.status === 'Turned In' || assignment.status === 'Graded'
                      ? 'bg-[#144534] text-white hover:bg-[#0F382A]'
                      : 'bg-[#1B5E43] text-white hover:bg-[#144534]'
                  }`}
                >
                  {assignment.status === 'Turned In' || assignment.status === 'Graded' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>View Submission</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Turn In</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Turn In Drawer / Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-2xl bg-[#FFFFFF] border border-[#E6E0D5] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E6E0D5] bg-[#F5F1E8] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#1B5E43] font-bold">
                  {selectedAssignment.subject} · {selectedAssignment.points} Points
                </span>
                <h3 className="text-lg font-bold text-[#144534] mt-0.5">
                  {selectedAssignment.title}
                </h3>
                <p className="text-xs text-[#556960] mt-0.5">
                  Due: <span className="font-semibold text-[#1A2621]">{selectedAssignment.due_date}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-2 text-[#71857C] hover:text-[#1A2621] rounded-lg hover:bg-[#EAE4D8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#2D3F37]">
              {/* Instructions */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E6E0D5] rounded-xl space-y-2">
                <h4 className="font-bold text-[#144534] text-xs uppercase tracking-wider">
                  Assignment Instructions & Problems
                </h4>
                <p className="leading-relaxed text-[#4A5D54]">
                  {selectedAssignment.description}
                </p>
                <button
                  type="button"
                  onClick={() => onViewWorksheet(selectedAssignment.problems, selectedAssignment.title)}
                  className="text-xs font-bold text-[#1B5E43] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Preview {selectedAssignment.problems.length} Engineering Worksheet Problems</span>
                </button>
              </div>

              {/* Graded Feedback banner if graded */}
              {selectedAssignment.status === 'Graded' && selectedAssignment.submission?.grade && (
                <div className="p-4 bg-[#DEF7EC] border border-[#84E1BC] rounded-xl space-y-1 text-[#03543F]">
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>Grade Awarded:</span>
                    <span className="font-mono text-base">{selectedAssignment.submission.grade} / {selectedAssignment.points} (96%)</span>
                  </div>
                  <p className="text-xs italic text-[#046C4E]">
                    "{selectedAssignment.submission.feedback}"
                  </p>
                </div>
              )}

              {/* Submission Form */}
              {selectedAssignment.status === 'Turned In' || selectedAssignment.status === 'Graded' ? (
                <div className="p-4 bg-[#FAF8F5] border border-[#E6E0D5] rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1B5E43] flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-[#1B5E43]" />
                      Turned In on {selectedAssignment.submission?.submitted_at}
                    </span>
                    {selectedAssignment.status !== 'Graded' && (
                      <button
                        onClick={() => {
                          onUnsubmitAssignment(selectedAssignment.id);
                          setSelectedAssignment(null);
                        }}
                        className="text-xs text-[#C2410C] hover:underline font-bold cursor-pointer"
                      >
                        Unsubmit
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#556960] uppercase">
                      Your Written Solution Summary:
                    </label>
                    <p className="mt-1 p-2.5 bg-white border border-[#E6E0D5] rounded-lg text-xs font-mono text-[#1A2621]">
                      {selectedAssignment.submission?.student_response}
                    </p>
                  </div>

                  {selectedAssignment.submission?.attached_file_name && (
                    <div className="flex items-center gap-2 p-2.5 bg-white border border-[#E6E0D5] rounded-lg text-xs font-mono text-[#1B5E43]">
                      <Paperclip className="w-4 h-4 text-[#1B5E43]" />
                      <span>{selectedAssignment.submission.attached_file_name}</span>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleTurnIn} className="space-y-4">
                  <div>
                    <label className="font-bold text-[#144534] text-xs block mb-1">
                      Written Calculation / Solution Response:
                    </label>
                    <textarea
                      rows={4}
                      value={studentResponse}
                      onChange={(e) => setStudentResponse(e.target.value)}
                      placeholder="Enter your final values, characteristic roots, shear force equations, or mathematical answers here..."
                      className="w-full bg-[#FAF8F5] border border-[#DDD6C8] focus:border-[#1B5E43] focus:ring-1 focus:ring-[#1B5E43] focus:outline-none rounded-xl p-3 text-xs text-[#1A2621] font-mono leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#144534] text-xs block mb-1">
                      Attach Solution File (PDF, Handwritten Scan, TXT):
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={attachedFileName}
                        onChange={(e) => setAttachedFileName(e.target.value)}
                        placeholder="e.g. Rahul_Math201_ProblemSet4.pdf"
                        className="flex-1 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl px-3 py-2 text-xs font-mono text-[#1A2621]"
                      />
                      <button
                        type="button"
                        onClick={() => setAttachedFileName(`${currentUser.name.replace(' ', '_')}_Engineering_Worksheet.pdf`)}
                        className="px-3 py-2 bg-[#F5F1E8] hover:bg-[#EAE4D8] border border-[#DDD6C8] text-[#144534] rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Auto-Attach PDF Scan
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#1B5E43] hover:bg-[#144534] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Turn In Assignment (Hand In to Google Classroom)</span>
                  </button>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E6E0D5] bg-[#F5F1E8]/70 flex justify-end">
              <button
                onClick={() => setSelectedAssignment(null)}
                className="px-4 py-2 text-xs font-semibold text-[#556960] hover:text-[#1A2621] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-lg bg-[#FFFFFF] border border-[#E6E0D5] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#E6E0D5] bg-[#F5F1E8] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#144534]">Create New Assignment</h3>
                <p className="text-xs text-[#556960]">Publish engineering problem sheets to Google Classroom</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-[#71857C] hover:text-[#1A2621]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#2D3F37] block mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Problem Set 5: Fourier Transforms & Vibrations"
                  className="w-full bg-[#FAF8F5] border border-[#DDD6C8] focus:border-[#1B5E43] rounded-xl px-3 py-2 text-xs text-[#1A2621]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#2D3F37] block mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e: any) => setNewSubject(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl px-3 py-2 text-xs text-[#1A2621]"
                  >
                    <option value="Engineering Mathematics">Engineering Mathematics</option>
                    <option value="Engineering Mechanics">Engineering Mechanics</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#2D3F37] block mb-1">Total Points</label>
                  <input
                    type="number"
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl px-3 py-2 text-xs text-[#1A2621]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#2D3F37] block mb-1">Module / Topic</label>
                <input
                  type="text"
                  value={newModule}
                  onChange={(e) => setNewModule(e.target.value)}
                  placeholder="e.g. Module 3: Structural Statics"
                  className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl px-3 py-2 text-xs text-[#1A2621]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#2D3F37] block mb-1">Due Date & Time</label>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  placeholder="e.g. Friday, Nov 27, 2026, 11:59 PM"
                  className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl px-3 py-2 text-xs text-[#1A2621]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#2D3F37] block mb-1">Instructions & Rubric</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detailed instructions for students..."
                  className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl p-2.5 text-xs text-[#1A2621]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1B5E43] hover:bg-[#144534] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Publish Assignment to Class
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
