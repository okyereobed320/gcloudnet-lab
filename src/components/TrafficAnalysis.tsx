import React, { useState } from 'react';
import type { NetworkState } from '../types/network';
import { Activity, Play, Info } from 'lucide-react';

interface TrafficAnalysisProps {
  state: NetworkState;
  onInject: (sourceId: string, targetId: string) => void;
  isSimulating: boolean;
}

export const TrafficAnalysis: React.FC<TrafficAnalysisProps> = ({ state, onInject, isSimulating }) => {
  const [sourceId, setSourceId] = useState<string>('');
  const [targetId, setTargetId] = useState<string>('');

  const instances = state.nodes.filter(n => n.type === 'instance');
  const allNodes = state.nodes;

  return (
    <div className="flex flex-col gap-5 p-5 bg-white rounded-2xl border border-gcp-gray-border shadow-sm">
      <div className="flex items-center gap-2 text-gcp-blue border-b border-gcp-gray-border pb-3">
        <Activity size={18} className={isSimulating ? 'animate-pulse' : ''} />
        <h3 className="font-black text-xs uppercase tracking-widest">Traffic Analysis</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[9px] font-black text-gcp-gray-text uppercase mb-1.5 tracking-tighter flex items-center gap-1">
            Source Virtual Machine
            <Info size={10} className="opacity-40" />
          </label>
          <select 
            value={sourceId} 
            onChange={(e) => setSourceId(e.target.value)}
            className="w-full text-xs font-bold border border-gcp-gray-border rounded-lg p-2.5 bg-gcp-gray-bg/50 outline-none focus:ring-2 focus:ring-gcp-blue transition-all"
          >
            <option value="">Select Source...</option>
            {instances.map(n => (
              <option key={n.id} value={n.id}>{n.data.label as string} ({n.id.split('-')[0]})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[9px] font-black text-gcp-gray-text uppercase mb-1.5 tracking-tighter flex items-center gap-1">
            Destination Resource
            <Info size={10} className="opacity-40" />
          </label>
          <select 
            value={targetId} 
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full text-xs font-bold border border-gcp-gray-border rounded-lg p-2.5 bg-gcp-gray-bg/50 outline-none focus:ring-2 focus:ring-gcp-blue transition-all"
          >
            <option value="">Select Destination...</option>
            {allNodes.map(n => (
              <option key={n.id} value={n.id}>{n.data.label as string} ({n.type})</option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => onInject(sourceId, targetId)}
          disabled={!sourceId || !targetId || isSimulating}
          className={`w-full py-3 rounded-xl font-black text-[11px] transition-all flex items-center justify-center gap-2 shadow-lg tracking-widest ${
            !sourceId || !targetId || isSimulating
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200'
            : 'bg-gcp-blue text-white hover:bg-gcp-blue-hover hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isSimulating ? (
            <>
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              RUNNING ENGINE...
            </>
          ) : (
            <>
              <Play size={14} fill="currentColor" />
              INJECT PACKET
            </>
          )}
        </button>
      </div>

      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
        <p className="text-[10px] text-blue-900 leading-relaxed font-medium">
          <strong>Tip:</strong> Connectivity is evaluated based on Firewall Rules, Routing Tables, and IAM permissions (simulated).
        </p>
      </div>
    </div>
  );
};
