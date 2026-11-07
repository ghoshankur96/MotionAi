import React, { useState } from 'react';
import { 
  OPENAI_SYSTEM_PROMPT, 
  SAMPLE_TRANSCRIPT 
} from '../data/workflowData';
import { 
  BookOpen, 
  Bot, 
  Cpu, 
  Table2, 
  Trello, 
  ShieldAlert, 
  Copy, 
  Check, 
  Layers, 
  Key, 
  Hash,
  Send
} from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'prompt' | 'telegram' | 'integrations' | 'errors'>('architecture');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const copyPrompt = () => {
    navigator.clipboard.writeText(OPENAI_SYSTEM_PROMPT);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Automation Bot Engineering Specifications & Deployment Manual
            </h3>
            <p className="text-xs text-slate-400">
              Complete node-by-node documentation, credentials setup, and idempotency guarantees
            </p>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveSection('architecture')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSection === 'architecture' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Architecture
          </button>
          <button
            onClick={() => setActiveSection('prompt')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSection === 'prompt' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            OpenAI Prompt
          </button>
          <button
            onClick={() => setActiveSection('telegram')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSection === 'telegram' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Telegram Setup
          </button>
          <button
            onClick={() => setActiveSection('integrations')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSection === 'integrations' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sheets & Trello
          </button>
          <button
            onClick={() => setActiveSection('errors')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSection === 'errors' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Error Handling
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed max-w-5xl mx-auto">
        {activeSection === 'architecture' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>15-Node n8n Workflow Topology</span>
              </h4>
              <p className="text-slate-300">
                The workflow executes end-to-end automatically whenever a Telegram user sends a transcript or uploads a <code className="text-indigo-300 font-mono">.txt</code> document:
              </p>
              <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg font-mono text-[11px] text-slate-300 space-y-1">
                <p>1. <strong>Telegram Trigger</strong>: Listens for incoming message and document updates.</p>
                <p>2. <strong>Input Type Detection</strong>: Distinguishes between text messages and document attachments.</p>
                <p>3. <strong>Message / TXT Extraction</strong>: Downloads .txt payload or extracts raw text.</p>
                <p>4. <strong>Input Validation</strong>: Verifies minimum length, format, and &lt;=50k character cap.</p>
                <p>4b. <strong>Telegram Error Reply</strong>: Direct error reporting branch for malformed inputs.</p>
                <p>5. <strong>Transcript Processing</strong>: Strips zero-width characters and normalizes line endings.</p>
                <p>6. <strong>OpenAI Meeting Analysis</strong>: Executes GPT-4o inference with JSON Mode.</p>
                <p>7. <strong>JSON Parsing</strong>: Catches parsing errors and repairs unescaped quotes.</p>
                <p>8. <strong>Output Validation</strong>: Validates meeting title and enforces allowed status enums.</p>
                <p>9. <strong>Action Item Extraction</strong>: Computes deterministic stable Task IDs.</p>
                <p>10. <strong>Duplicate Detection</strong>: Matches existing tasks in Google Sheets/Trello.</p>
                <p>11. <strong>Sheets & Trello Sync</strong>: Upserts records into Google Sheets and creates Trello cards.</p>
                <p>12. <strong>Incomplete Task Detection</strong>: Segregates missing deadlines/owners for clarification.</p>
                <p>13. <strong>Meeting Summary Generation</strong>: Builds the structured Telegram announcement template.</p>
                <p>14. <strong>Telegram Group Notification</strong>: Broadcasts final summary to team channel.</p>
                <p>15. <strong>Execution Logging</strong>: Records audit log entry with timestamp and status.</p>
              </div>
            </div>

            {/* Sample Transcript Analysis Requirement */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-semibold text-white">
                Official Sample Transcript Verification
              </h4>
              <p className="text-slate-400">
                The sample transcript strictly extracts into these 3 mandated task entities without hallucinating unstated dates:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">TASK 1</span>
                  <p className="font-semibold text-white">Frontend development</p>
                  <p className="text-slate-400">Owner: <span className="text-slate-200">Rahul</span></p>
                  <p className="text-slate-400">Deadline: <span className="text-slate-200">Friday</span></p>
                  <p className="text-emerald-400 font-medium">Status: Assigned</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded">TASK 2</span>
                  <p className="font-semibold text-white">Backend integration</p>
                  <p className="text-slate-400">Owner: <span className="text-slate-200">Priya</span></p>
                  <p className="text-slate-400">Deadline: <span className="text-amber-400 italic">Missing</span></p>
                  <p className="text-amber-400 font-medium">Status: Missing Deadline</p>
                  <p className="text-[11px] text-slate-500">Clarification: What is the deadline?</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded">TASK 3</span>
                  <p className="font-semibold text-white">Project documentation</p>
                  <p className="text-slate-400">Owner: <span className="text-rose-400 italic">Unassigned</span></p>
                  <p className="text-slate-400">Deadline: <span className="text-rose-400 italic">Missing</span></p>
                  <p className="text-rose-400 font-medium">Status: Incomplete</p>
                  <p className="text-[11px] text-slate-500">Clarification: Who owns this and what is its deadline?</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'prompt' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">OpenAI System Prompt</h4>
                <p className="text-xs text-slate-400">Enforces implicit ownership, unassigned detection, and JSON schema output.</p>
              </div>
              <button
                onClick={copyPrompt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? 'Copied' : 'Copy System Prompt'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-indigo-200/90 overflow-x-auto leading-relaxed max-h-96">
              <code>{OPENAI_SYSTEM_PROMPT}</code>
            </pre>
          </div>
        )}

        {activeSection === 'telegram' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400" />
                <span>Telegram Bot Configuration Guide</span>
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>Open Telegram and message <strong>@BotFather</strong>.</li>
                <li>Send <code className="text-sky-300 font-mono">/newbot</code> and follow the prompts to name your bot (e.g., <code className="text-sky-300 font-mono">MeetingToActionBot</code>).</li>
                <li>Copy the generated API Token and set it as <code className="text-indigo-300 font-mono">TELEGRAM_BOT_TOKEN</code>.</li>
                <li>In BotFather, send <code className="text-sky-300 font-mono">/setprivacy</code>, select your bot, and set it to <strong>Disabled</strong> so the bot can read messages in groups.</li>
                <li>Add the bot as an administrator to your team discussion group.</li>
                <li>Obtain the group's Chat ID (using <code className="font-mono">https://api.telegram.org/bot&lt;token&gt;/getUpdates</code>) and assign it to <code className="text-indigo-300 font-mono">TELEGRAM_GROUP_CHAT_ID</code>.</li>
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="text-sm font-semibold text-white">Broadcast Message Template</h4>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-slate-300 text-[11px] leading-relaxed">
{`📋 MEETING SUMMARY
Meeting: Sprint Sync & Feature Alignment
Date: Friday, Nov 7, 2026

✅ ASSIGNED TASKS
• Frontend development — Owner: Rahul | Deadline: Friday | Status: Assigned

⚠️ INCOMPLETE TASKS
• Backend integration — Owner: Priya | Deadline: Not specified | Status: Missing Deadline
• Project documentation — Owner: Unassigned | Deadline: Not specified | Status: Incomplete

❓ CLARIFICATION REQUIRED
• What is the deadline for backend integration?
• Who will handle project documentation?
• What is the deadline for project documentation?

📌 NEXT ACTION
Please confirm the missing information so the task records can be updated.`}
              </pre>
            </div>
          </div>
        )}

        {activeSection === 'integrations' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Table2 className="w-4 h-4 text-emerald-400" />
                <span>Google Sheets Configuration</span>
              </h4>
              <p className="text-slate-300">
                Create a spreadsheet with a tab named <code className="text-emerald-400 font-mono">Tasks</code> and the following 9 columns in row 1:
              </p>
              <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                <span className="p-2 bg-slate-950 rounded border border-slate-800">1. Task ID</span>
                <span className="p-2 bg-slate-950 rounded border border-slate-800">2. Meeting Title</span>
                <span className="p-2 bg-slate-950 rounded border border-slate-800">3. Task Description</span>
                <span className="p-2 bg-slate-950 rounded border border-slate-800">4. Assigned Owner</span>
                <span className="p-2 bg-slate-950 rounded border border-slate-800">5. Deadline</span>
                <span className="p-2 bg-slate-950 rounded border border-slate-800">6. Priority</span>
                <span className="p-2 bg-slate-950 rounded border border-slate-800">7. Task Status</span>
                <span className="p-2 bg-slate-950 rounded border border-slate-800">8. Missing Information</span>
                <span className="p-2 bg-slate-950 rounded border border-slate-800">9. Created Date</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-400" />
                <span>Deterministic Duplicate Prevention Algorithm</span>
              </h4>
              <p className="text-slate-300">
                To prevent duplicate tasks when a transcript is re-processed or when a user provides clarifications, the system derives an idempotent Task ID:
              </p>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-indigo-300 text-[11px]">
{`const meetingSlug = slugify(meetingTitle).slice(0, 4); // "SPRI"
const taskSlug = slugify(taskDescription).slice(0, 6);   // "FRONT"
const stableHash = hash4(meetingTitle + '_' + taskDescription); // "7B1A"
const taskId = \`\${meetingSlug}-\${taskSlug}-\${stableHash}\`; // "SPRI-FRONT-7B1A"`}
              </pre>
              <p className="text-slate-400 text-[11px]">
                When Google Sheets or Trello is updated, the node uses <code className="text-indigo-400 font-mono">Task ID</code> as the key column to match existing rows and perform an <strong>UPDATE</strong> instead of an INSERT.
              </p>
            </div>
          </div>
        )}

        {activeSection === 'errors' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Error Handling & Reliability Matrix</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2 pr-4">Failure Point</th>
                      <th className="py-2 pr-4">Detection Mechanism</th>
                      <th className="py-2">Automated Recovery Route</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    <tr>
                      <td className="py-2.5 pr-4 font-semibold text-white">Empty Message</td>
                      <td className="py-2.5 pr-4 text-slate-400">Node 4 length check &lt; 20 chars</td>
                      <td className="py-2.5 text-amber-300">Replies to sender on Telegram explaining missing content.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-semibold text-white">Unsupported File</td>
                      <td className="py-2.5 pr-4 text-slate-400">MIME check in Node 3</td>
                      <td className="py-2.5 text-amber-300">Rejects upload and alerts user that only .txt documents are supported.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-semibold text-white">Excessive Size</td>
                      <td className="py-2.5 pr-4 text-slate-400">Length check &gt; 50,000 chars</td>
                      <td className="py-2.5 text-amber-300">Notifies user of limit to protect OpenAI token window.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-semibold text-white">Malformed AI JSON</td>
                      <td className="py-2.5 pr-4 text-slate-400">Node 7 JSON.parse try/catch</td>
                      <td className="py-2.5 text-emerald-300">Strips markdown backticks & repairs JSON before retry.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-semibold text-white">API Rate Limit (429)</td>
                      <td className="py-2.5 pr-4 text-slate-400">OpenAI node HTTP status</td>
                      <td className="py-2.5 text-sky-300">Exponential backoff retry (up to 3 attempts).</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-semibold text-white">Sheet API Failure</td>
                      <td className="py-2.5 pr-4 text-slate-400">Google Sheets OAuth exception</td>
                      <td className="py-2.5 text-rose-300">Logs error to audit log, sends alert to Telegram admin.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
