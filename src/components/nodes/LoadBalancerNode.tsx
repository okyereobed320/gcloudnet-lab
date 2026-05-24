import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Share2 } from 'lucide-react';

export const LoadBalancerNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div 
      className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col gap-3 min-w-[200px] bg-white shadow-lg ${selected ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-gcp-gray-border hover:border-indigo-400'}`}
    >
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20">
          <Share2 size={20} />
        </div>
        <div>
          <span className="text-sm font-black text-gcp-gray-dark block tracking-tight">{data.label as string}</span>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{(data.type as string) || 'External HTTP(S)'}</span>
        </div>
      </div>
      
      <div className="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/50">
        <div className="flex justify-between items-center text-[9px] font-bold text-gcp-gray-text uppercase">
          <span>IP Address</span>
          <span className="font-mono text-indigo-700">{(data.ipAddress as string) || '34.120.5.12'}</span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
