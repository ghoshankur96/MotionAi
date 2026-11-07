import React, { useState } from 'react';
import { COMPLETE_N8N_WORKFLOW_JSON } from '../data/workflowData';
import { X, Copy, Check, Download, FileJson, Key, HelpCircle } from 'lucide-react';

interface WorkflowExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkflowExportModal: React.FC<WorkflowExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'json' | 'env' | 'guide'>('json');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(COMPLETE_N8N_WORKFLOW_JSON, null, 2);

  const envTemplate = `# Environment Variables for n8n Meeting-to-Action Bot
# Save as .env in your n8n directory or configure in n8n UI -> Settings -> Variables

# 1. Telegram Bot API
# Obtained from @BotFather on Telegram
TELEGRAM_BOT_TOKEN="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
# Target Telegram Group Chat ID for team broadcast notifications (prefixed with -100 for supergroups)
TELEGRAM_GROUP_CHAT_ID="-1001928374650"

# 2. OpenAI API
# OpenAI API Key for GPT-4o analysis
OPENAI_API_KEY="sk-proj-your-openai-api-key-here"

# 3. Google Sheets Integration
# Google Spreadsheet ID from sheet URL (docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit)
GOOGLE_SHEET_ID="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
# Tab Name (defaults to 'Tasks')
GOOGLE_SHEET_NAME="Tasks"

# 4. Trello Integration (Optional if dual sync enabled)
TRELLO_API_KEY="your-trello-api-key"
TRELLO_OAUTH_TOKEN="your-trello-oauth-token"
TRELLO_BOARD_ID="your-trello-board-id"
TRELLO_LIST_ID="your-trello-list-id"
`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meeting-to-action-automation-workflow.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileJson className="w-5 h-5 text-indigo-400" />
              <span>Importable n8n Workflow JSON & Configuration</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Production-ready, modular n8n workflow matching all 15 nodes and error recovery specifications
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(activeTab === 'json' ? jsonString : envTemplate)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : activeTab === 'json' ? 'Copy Workflow JSON' : 'Copy .env Template'}</span>
            </button>

            {activeTab === 'json' && (
              <button
                onClick={downloadJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-800 bg-slate-950/40 text-xs font-medium">
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'json'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            workflow.json (Import Ready)
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'env'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            .env Variables Template
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Import Instructions
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'json' && (
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-indigo-200/90 overflow-x-auto leading-relaxed max-h-[58vh]">
              <code>{jsonString}</code>
            </pre>
          )}

          {activeTab === 'env' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Configure these environment variables in your n8n instance or load them via Docker <code className="text-indigo-300 font-mono">.env</code> file. No secrets are hardcoded.
              </p>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-amber-200/90 overflow-x-auto leading-relaxed">
                <code>{envTemplate}</code>
              </pre>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-sm font-semibold text-white">How to Import into n8n:</h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 mt-2">
                  <li>Open your n8n workspace (Desktop app, n8n Cloud, or Docker).</li>
                  <li>Click on <strong>Workflows</strong> in the left sidebar, then click the <strong>+ Add Workflow</strong> button.</li>
                  <li>Click the three dots (<code className="font-mono">...</code>) in the top-right corner of the canvas and select <strong>Import from File</strong> or paste the JSON directly.</li>
                  <li>Upload the downloaded <code className="text-indigo-400 font-mono">meeting-to-action-automation-workflow.json</code>.</li>
                  <li>Connect your credentials:
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-slate-400">
                      <li><strong>Telegram Bot API</strong>: Add credential with your BotFather token.</li>
                      <li><strong>OpenAI</strong>: Add OpenAI account credentials.</li>
                      <li><strong>Google Sheets</strong>: Add Google OAuth2 or Service Account credential.</li>
                    </ul>
                  </li>
                  <li>Set the workflow toggle to <strong>Active</strong>. The bot is now live!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400">
          <span>Schema: n8n workflow v1.0 · 15 Connected Nodes</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
