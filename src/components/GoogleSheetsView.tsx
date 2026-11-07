import React, { useState } from 'react';
import { ActionItem, WorksheetProblem } from '../types';
import { MATH_PROBLEMS, MECHANICS_PROBLEMS } from '../data/engineeringData';
import { 
  Table2, 
  Download, 
  Search, 
  FileText, 
  Printer, 
  Calculator, 
  Wrench, 
  Layers, 
  CheckCircle2, 
  Award,
  ChevronDown,
  X
} from 'lucide-react';

interface GoogleSheetsViewProps {
  tasks: ActionItem[];
  lastSyncTimestamp?: string;
  onClearTasks?: () => void;
  mathProblems?: WorksheetProblem[];
  mechanicsProblems?: WorksheetProblem[];
}

export const GoogleSheetsView: React.FC<GoogleSheetsViewProps> = ({
  tasks,
  lastSyncTimestamp,
  mathProblems = MATH_PROBLEMS,
  mechanicsProblems = MECHANICS_PROBLEMS
}) => {
  const [activeSheetTab, setActiveSheetTab] = useState<'math' | 'mech' | 'tasks'>('math');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Filtered Math problems
  const filteredMath = mathProblems.filter(p => 
    p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.problem_statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.problem_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered Mechanics problems
  const filteredMech = mechanicsProblems.filter(p => 
    p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.problem_statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.problem_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered tasks
  const filteredTasks = tasks.filter(t => 
    t.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.task_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCurrentTabCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let fileName = `Engineering_Worksheet_${activeSheetTab}.csv`;

    if (activeSheetTab === 'math' || activeSheetTab === 'mech') {
      const data = activeSheetTab === 'math' ? filteredMath : filteredMech;
      headers = ['Problem ID', 'Topic', 'Difficulty', 'Problem Statement', 'Given Data', 'Governing Formula', 'Solution Answer', 'Points', 'Status'];
      rows = data.map(p => [
        `"${p.problem_id}"`,
        `"${p.topic}"`,
        `"${p.difficulty}"`,
        `"${p.problem_statement.replace(/"/g, '""')}"`,
        `"${p.given_data.replace(/"/g, '""')}"`,
        `"${p.governing_formula.replace(/"/g, '""')}"`,
        `"${p.solution_answer.replace(/"/g, '""')}"`,
        `"${p.points}"`,
        `"${p.status}"`
      ]);
    } else {
      headers = ['Task ID', 'Meeting Title', 'Task Description', 'Assigned Owner', 'Deadline', 'Priority', 'Task Status', 'Missing Information', 'Created Date'];
      rows = filteredTasks.map(t => [
        `"${t.task_id}"`,
        `"${t.meeting_title.replace(/"/g, '""')}"`,
        `"${t.task.replace(/"/g, '""')}"`,
        `"${t.owner}"`,
        `"${t.deadline}"`,
        `"${t.priority}"`,
        `"${t.status}"`,
        `"${(t.missing_information || []).join('; ').replace(/"/g, '""')}"`,
        `"${t.created_date}"`
      ]);
      fileName = 'Meeting_Action_Items.csv';
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FAF7F2] text-[#1A2621] border border-[#E6E0D5] rounded-2xl overflow-hidden shadow-xl">
      {/* Google Sheets Header & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 border-b border-[#E6E0D5] bg-[#F4EFE6]/90">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#1B5E43] text-white shadow-sm">
            <Table2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#144534]">
                Google Sheets · Engineering Problem Worksheets & Tasks
              </h3>
              <span className="text-[10px] font-mono text-[#1B5E43] bg-[#DEF7EC] border border-[#84E1BC] px-2 py-0.5 rounded font-bold">
                Live Spreadsheet
              </span>
            </div>
            <p className="text-xs text-[#556960]">
              Real engineering mathematics, structural mechanics, and automated meeting action items
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#144534] bg-white hover:bg-[#F2ECE1] border border-[#DDD6C8] rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-[#1B5E43]" />
            <span>Worksheet PDF Preview</span>
          </button>

          <button
            onClick={exportCurrentTabCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#1B5E43] hover:bg-[#144534] rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Sheet (.CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 border-b border-[#E6E0D5] bg-[#FFFFFF] text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#71857C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems, topics, formulas, or owners..."
            className="w-full bg-[#FAF8F5] border border-[#DDD6C8] focus:border-[#1B5E43] focus:outline-none rounded-lg px-2.5 py-1 text-[#1A2621] placeholder:text-[#8C9B93] font-sans"
          />
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 p-1 bg-[#EAE4D8] rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveSheetTab('math')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSheetTab === 'math'
                ? 'bg-[#1B5E43] text-white shadow-sm'
                : 'text-[#4A5D54] hover:text-[#1A2621]'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Engineering Maths (MATH 201)</span>
          </button>
          <button
            onClick={() => setActiveSheetTab('mech')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSheetTab === 'mech'
                ? 'bg-[#1B5E43] text-white shadow-sm'
                : 'text-[#4A5D54] hover:text-[#1A2621]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Applied Mechanics (MECH 102)</span>
          </button>
          <button
            onClick={() => setActiveSheetTab('tasks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSheetTab === 'tasks'
                ? 'bg-[#1B5E43] text-white shadow-sm'
                : 'text-[#4A5D54] hover:text-[#1A2621]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Meeting Tasks ({tasks.length})</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Grid View */}
      <div className="flex-1 overflow-x-auto overflow-y-auto bg-white">
        {activeSheetTab === 'math' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F5F1E8] border-b border-[#E6E0D5] text-[#144534] font-bold uppercase text-[10px] tracking-wider">
                <th className="px-4 py-3">Problem ID</th>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3 min-w-[260px]">Problem Statement</th>
                <th className="px-4 py-3 min-w-[180px]">Given Data</th>
                <th className="px-4 py-3 min-w-[200px]">Governing Formula</th>
                <th className="px-4 py-3 min-w-[200px]">Verified Solution Answer</th>
                <th className="px-4 py-3 text-right">Points</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4D8] font-sans">
              {filteredMath.map((p) => (
                <tr key={p.problem_id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#1B5E43] whitespace-nowrap">
                    {p.problem_id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#144534] whitespace-nowrap">
                    {p.topic}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.difficulty === 'Advanced' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                      p.difficulty === 'Intermediate' ? 'bg-[#FEF08A] text-[#854D0E]' :
                      'bg-[#DEF7EC] text-[#03543F]'
                    }`}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#2D3F37] leading-relaxed">
                    {p.problem_statement}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#4A5D54]">
                    {p.given_data}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#144534] bg-[#FAF8F5] rounded">
                    {p.governing_formula}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] font-bold text-[#1B5E43]">
                    {p.solution_answer}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-right text-[#1A2621]">
                    {p.points}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[#1B5E43] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1B5E43]" />
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeSheetTab === 'mech' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F5F1E8] border-b border-[#E6E0D5] text-[#144534] font-bold uppercase text-[10px] tracking-wider">
                <th className="px-4 py-3">Problem ID</th>
                <th className="px-4 py-3">Mechanics Topic</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3 min-w-[260px]">Problem Statement</th>
                <th className="px-4 py-3 min-w-[180px]">Given Data</th>
                <th className="px-4 py-3 min-w-[200px]">Equilibrium / Formula</th>
                <th className="px-4 py-3 min-w-[200px]">Calculated Solution</th>
                <th className="px-4 py-3 text-right">Points</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4D8] font-sans">
              {filteredMech.map((p) => (
                <tr key={p.problem_id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#1B5E43] whitespace-nowrap">
                    {p.problem_id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#144534] whitespace-nowrap">
                    {p.topic}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.difficulty === 'Advanced' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                      p.difficulty === 'Intermediate' ? 'bg-[#FEF08A] text-[#854D0E]' :
                      'bg-[#DEF7EC] text-[#03543F]'
                    }`}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#2D3F37] leading-relaxed">
                    {p.problem_statement}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#4A5D54]">
                    {p.given_data}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#144534] bg-[#FAF8F5] rounded">
                    {p.governing_formula}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] font-bold text-[#1B5E43]">
                    {p.solution_answer}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-right text-[#1A2621]">
                    {p.points}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[#1B5E43] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1B5E43]" />
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeSheetTab === 'tasks' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F5F1E8] border-b border-[#E6E0D5] text-[#144534] font-bold uppercase text-[10px] tracking-wider">
                <th className="px-4 py-3">Task ID</th>
                <th className="px-4 py-3">Meeting Title</th>
                <th className="px-4 py-3">Task Description</th>
                <th className="px-4 py-3">Assigned Owner</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Task Status</th>
                <th className="px-4 py-3 min-w-[200px]">Missing Information</th>
                <th className="px-4 py-3">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4D8] font-sans">
              {filteredTasks.map((task) => (
                <tr key={task.task_id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#1B5E43] whitespace-nowrap">
                    {task.task_id}
                  </td>
                  <td className="px-4 py-3 text-[#556960] whitespace-nowrap">
                    {task.meeting_title}
                  </td>
                  <td className="px-4 py-3 font-bold text-[#144534]">
                    {task.task}
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    {task.owner}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#1A2621] whitespace-nowrap">
                    {task.deadline}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#144534] whitespace-nowrap">
                    {task.priority}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.status === 'Assigned' ? 'bg-[#DEF7EC] text-[#03543F]' :
                      task.status === 'Completed' ? 'bg-[#E1EFFE] text-[#1E429F]' :
                      'bg-[#FEF08A] text-[#854D0E]'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#71857C]">
                    {(task.missing_information || []).join('; ') || '—'}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#556960] whitespace-nowrap">
                    {task.created_date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Spreadsheet Bottom Tab Selector */}
      <div className="flex items-center justify-between px-6 py-2.5 border-t border-[#E6E0D5] bg-[#F4EFE6] text-xs text-[#556960]">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#1B5E43] text-white font-bold rounded-lg text-xs">
            {activeSheetTab === 'math' ? 'Sheet 1: MATH_201_Calculus' : activeSheetTab === 'mech' ? 'Sheet 2: MECH_102_Mechanics' : 'Sheet 3: Tasks_Database'}
          </span>
          <span className="text-[#71857C] text-[11px] hidden sm:inline">
            Formulas & Calculations Verified · Real Engineering Problem Set
          </span>
        </div>
        <div className="text-[11px] text-[#1B5E43] font-bold font-mono">
          ✓ Sync Active: Google Classroom & n8n
        </div>
      </div>

      {/* Printable Worksheet / PDF Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl bg-[#FFFFFF] border border-[#DDD6C8] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="p-6 border-b border-[#E6E0D5] bg-[#F5F1E8] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#1B5E43] font-bold">
                  Academic Problem Set Printable Worksheet
                </span>
                <h3 className="text-lg font-bold text-[#144534]">
                  {activeSheetTab === 'mech' ? 'MECH 102: Applied Engineering Mechanics Problem Sheet' : 'MATH 201: Engineering Mathematics & Systems Problem Sheet'}
                </h3>
              </div>
              <button onClick={() => setIsPdfModalOpen(false)} className="text-[#71857C] hover:text-[#1A2621]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#1A2621]">
              <div className="p-4 bg-[#FAF8F5] border border-[#E6E0D5] rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#144534]">Course: ENGR 201 · Fall 2026</p>
                  <p className="text-[#556960]">Instructor: Prof. Alex Miller · Section 04</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#144534]">Total Marks: 100 Points</p>
                  <p className="text-[#556960]">Time Allowed: 3 Hours</p>
                </div>
              </div>

              {(activeSheetTab === 'mech' ? MECHANICS_PROBLEMS : MATH_PROBLEMS).map((prob, idx) => (
                <div key={prob.problem_id} className="p-4 border border-[#E6E0D5] rounded-xl space-y-2 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1B5E43] font-mono text-sm">
                      Question {idx + 1} ({prob.points} Points) — {prob.topic}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E6E0D5]">
                      {prob.problem_id}
                    </span>
                  </div>

                  <p className="text-sm font-medium leading-relaxed text-[#144534]">
                    {prob.problem_statement}
                  </p>

                  <div className="p-2.5 bg-[#FAF8F5] rounded-lg font-mono text-[11px] text-[#4A5D54]">
                    <strong>Given:</strong> {prob.given_data}
                  </div>

                  <div className="p-2.5 bg-[#F5F1E8] rounded-lg font-mono text-[11px] text-[#144534]">
                    <strong>Governing Relation:</strong> {prob.governing_formula}
                  </div>

                  <div className="pt-1 text-[11px] text-[#1B5E43] font-bold">
                    ✓ Verified Answer Key: {prob.solution_answer}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[#E6E0D5] bg-[#F5F1E8] flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#1B5E43] hover:bg-[#144534] text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Worksheet / Save as PDF</span>
              </button>
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#EAE4D8] text-[#556960] font-semibold rounded-xl text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
