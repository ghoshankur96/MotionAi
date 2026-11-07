import React, { useState } from 'react';
import { ExecutionLogItem } from '../types';
import { Terminal, ShieldCheck, AlertTriangle, XCircle, Search, Trash2, Eye } from 'lucide-react';

interface ExecutionLogsViewProps {
  logs: ExecutionLogItem[];
  onClearLogs: () => void;
}

export const ExecutionLogsView: React.FC<ExecutionLogsViewProps> = ({ logs, onClearLogs }) => {
  const [selectedLog, setSelectedLog] = useState<ExecutionLogItem | null>(null);
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(log => 
    log.nodeName.toLowerCase().includes(search.toLowerCase()) ||
    log.id.toLowerCase().includes(search.toLowerCase()) ||
    log.outputSummary.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: ExecutionLogItem['status']) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
            <ShieldCheck className="w-3 h-3" />
            SUCCESS
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3" />
            WARNING
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded">
            <XCircle className="w-3 h-3" />
            ERROR
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded">
            RUNNING
          </span>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              n8n Pipeline Execution Audit Logs
            </h3>
            <p className="text-xs text-slate-400">
              Granular node-by-node execution records, latency telemetry, and payload verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClearLogs}
            disabled={logs.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-300 disabled:opacity-40 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 py-2.5 border-b border-slate-800/80 bg-slate-900/40 flex items-center gap-2">
        <Search className="w-3.5 h-3.5 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter execution logs by Node, ID, or output..."
          className="w-full max-w-sm bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-md px-2.5 py-1 text-xs text-slate-200 placeholder:text-slate-500 font-sans"
        />
      </div>

      {/* Log Table */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="h-full min-h-[250px] flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <Terminal className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-xs">No execution logs recorded yet. Run a meeting transcript to trigger pipeline executions.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="px-4 py-3">Execution ID</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Node Name</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Output Summary</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-indigo-300 whitespace-nowrap">
                    {log.id}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                    {log.nodeName}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300 tabular-nums whitespace-nowrap">
                    {log.durationMs}ms
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusBadge(log.status)}
                  </td>
                  <td className="px-4 py-3 text-slate-300 max-w-md truncate">
                    {log.outputSummary}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-mono hover:underline cursor-pointer"
                    >
                      View JSON
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-indigo-400">{selectedLog.id}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{selectedLog.nodeName}</h4>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Input Summary</label>
                <pre className="mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-slate-300 text-[11px] overflow-x-auto">
                  {selectedLog.inputSummary}
                </pre>
              </div>

              <div>
                <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Output Payload</label>
                <pre className="mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-emerald-300 text-[11px] overflow-x-auto max-h-60">
                  {selectedLog.outputSummary}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
