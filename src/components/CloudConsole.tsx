import React, { useState } from 'react';
import { Activity, Code, Copy, Check } from 'lucide-react';
import { useLab } from '../context/LabContext';

interface CloudConsoleProps {
  logs: {msg: string, type: 'info' | 'success' | 'error'}[];
  commands: string[];
}

export const CloudConsole: React.FC<CloudConsoleProps> = ({ logs, commands }) => {
  const { mode } = useLab();
  const [activeTab, setActiveTab] = useState<'LOGS' | 'CLI'>('LOGS');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(commands.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (mode !== 'SIMULATION') return null;

  return (
    <div className="bg-slate-900 border-t-2 border-gcp-blue h-72 flex flex-col shadow-2xl z-40">
      <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('LOGS')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${activeTab === 'LOGS' ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Activity size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Traffic Monitor</span>
          </button>
          <button 
            onClick={() => setActiveTab('CLI')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${activeTab === 'CLI' ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Code size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">GCloud CLI</span>
          </button>
        </div>

        {activeTab === 'CLI' && (
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-2 text-white/40 hover:text-white text-[10px] font-bold transition-colors"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied ? 'COPIED!' : 'COPY CODE'}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] custom-scrollbar bg-slate-900/50">
        {activeTab === 'LOGS' ? (
          <div className="space-y-1.5">
            {logs.length === 0 ? (
              <div className="text-white/10 flex flex-col items-center justify-center h-48 gap-3">
                <Activity size={32} className="opacity-5" />
                <span className="font-black tracking-widest uppercase opacity-20 text-[10px]">Awaiting traffic injection...</span>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={`flex gap-3 p-2 rounded-lg border animate-in fade-in duration-300 ${
                  log.type === 'success' ? 'text-green-400 bg-green-500/5 border-green-500/10' : 
                  log.type === 'error' ? 'text-red-400 bg-red-500/5 border-red-500/10' : 
                  'text-blue-300 bg-blue-500/5 border-blue-500/10'
                }`}>
                  <span className="opacity-30 font-black">[{i+1}]</span>
                  <span>{log.msg}</span>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-1 text-blue-300/80">
            {commands.length === 0 ? (
              <div className="text-white/10 flex flex-col items-center justify-center h-48 gap-3">
                <Code size={32} className="opacity-5" />
                <span className="font-black tracking-widest uppercase opacity-20 text-[10px]">Build something to see code...</span>
              </div>
            ) : (
              commands.map((cmd, i) => (
                <div key={i} className={cmd.startsWith('#') ? 'text-white/30 italic mt-4' : 'pl-4 border-l border-blue-500/20'}>
                  {cmd}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
