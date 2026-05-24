import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Link2 } from 'lucide-react';

export const PSCNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div 
      className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col gap-3 min-w-[200px] bg-white shadow-lg ${selected ? 'border-cyan-500 ring-4 ring-cyan-500/10' : 'border-gcp-gray-border hover:border-cyan-400'}`}
    >
      <Handle type="target" position={Position.Left} />
      
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-cyan-500 text-white rounded-xl shadow-lg shadow-cyan-500/20">
          <Link2 size={20} />
        </div>
        <div>
          <span className="text-sm font-black text-gcp-gray-dark block tracking-tight">{data.label as string}</span>
          <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest text-[9px]">Private Service Connect</span>
        </div>
      </div>
      
      <div className="bg-cyan-50/50 p-2 rounded-lg border border-cyan-100/50">
        <div className="flex justify-between items-center text-[9px] font-bold text-gcp-gray-text uppercase">
          <span>Endpoint IP</span>
          <span className="font-mono text-cyan-700">{(data.ipAddress as string) || '10.128.0.50'}</span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};
