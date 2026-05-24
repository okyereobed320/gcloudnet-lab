import React from 'react';
import { MousePointer2, Share2, Trash2, StickyNote, Play, StepForward, Activity } from 'lucide-react';
import { useLab } from '../context/LabContext';
import type { ToolType } from '../context/LabContext';

interface ToolbarProps {
  onAddVPC: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onAddVPC }) => {
  const { tool, setTool, mode, setMode } = useLab();

  const tools: { id: ToolType; icon: any; label: string }[] = [
    { id: 'SELECT', icon: <MousePointer2 size={18} />, label: 'Select (V)' },
    { id: 'WIRE', icon: <Share2 size={18} />, label: 'Wire (W)' },
    { id: 'DELETE', icon: <Trash2 size={18} />, label: 'Delete (D)' },
    { id: 'NOTE', icon: <StickyNote size={18} />, label: 'Note (N)' },
  ];

  return (
    <div className="h-14 bg-white border-b border-gcp-gray-border flex items-center justify-between px-6 z-40 shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        {/* Simulation Toggle */}
        <div className="flex items-center gap-1 bg-gcp-gray-bg rounded-xl p-1 border border-gcp-gray-border">
          <button
            onClick={() => setMode('REALTIME')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[11px] font-black transition-all ${
              mode === 'REALTIME' 
              ? 'bg-white text-gcp-blue shadow-md' 
              : 'text-gcp-gray-text hover:text-gcp-gray-dark'
            }`}
          >
            <Activity size={14} />
            REALTIME
          </button>
          <button
            onClick={() => setMode('SIMULATION')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[11px] font-black transition-all ${
              mode === 'SIMULATION' 
              ? 'bg-white text-blue-600 shadow-md' 
              : 'text-gcp-gray-text hover:text-gcp-gray-dark'
            }`}
          >
            <Play size={14} />
            SIMULATION
          </button>
        </div>

        <div className="h-8 w-px bg-gcp-gray-border mx-1" />

        <button 
          onClick={onAddVPC}
          className="gcp-button-primary bg-gradient-to-r from-purple-600 to-indigo-600 py-1.5 h-9 px-5 shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest border-none"
        >
          <Share2 size={16} />
          Provision VPC
        </button>
      </div>

      {/* Tool Palette */}
      <div className="flex items-center gap-2">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            title={t.label}
            className={`p-2.5 rounded-xl border transition-all ${
              tool === t.id
                ? 'bg-gcp-blue text-white border-gcp-blue shadow-lg scale-110'
                : 'bg-white text-gcp-gray-text border-gcp-gray-border hover:bg-gcp-gray-bg'
            }`}
          >
            {t.icon}
          </button>
        ))}
      </div>

      {/* Simulation Controls (Visible in SIM mode) */}
      <div className={`flex items-center gap-3 transition-opacity duration-300 ${mode === 'SIMULATION' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="h-8 w-px bg-gcp-gray-border mx-2" />
        <button className="p-2 text-gcp-gray-text hover:text-gcp-blue hover:bg-gcp-blue-light rounded-lg transition-all" title="Step Back">
          <StepForward size={18} className="rotate-180" />
        </button>
        <button className="p-2 bg-gcp-blue text-white rounded-lg shadow-md hover:bg-gcp-blue-hover transition-all" title="Play Simulation">
          <Play size={18} />
        </button>
        <button className="p-2 text-gcp-gray-text hover:text-gcp-blue hover:bg-gcp-blue-light rounded-lg transition-all" title="Step Forward">
          <StepForward size={18} />
        </button>
      </div>
    </div>
  );
};
