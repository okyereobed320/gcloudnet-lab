import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Cpu } from 'lucide-react';

export const InstanceNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div 
      className={`p-5 rounded-2xl border-2 transition-all duration-300 group flex flex-col gap-4 relative overflow-hidden min-w-[180px] bg-white shadow-md ${selected ? 'ring-4 ring-gcp-green/10 border-gcp-green shadow-xl translate-y-[-4px]' : 'border-gcp-gray-border hover:border-gcp-green/40 hover:shadow-lg'}`}
    >
      <Handle type="target" position={Position.Left} className="opacity-0" />
      
      <div className="flex items-start justify-between">
        <div className="p-2.5 bg-gcp-green text-white rounded-xl shadow-lg shadow-gcp-green/20">
          <Cpu size={20} />
        </div>
        <div className="flex items-center gap-1.5 bg-gcp-green-light px-2 py-1 rounded-full border border-gcp-green/10">
          <div className="w-1.5 h-1.5 rounded-full bg-gcp-green animate-pulse" />
          <span className="text-[10px] font-black text-gcp-green uppercase tracking-tighter">Running</span>
        </div>
      </div>
      
      <div>
        <span className="text-sm font-black text-gcp-gray-dark block truncate tracking-tight">{data.label as string}</span>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[10px] text-gcp-gray-text font-mono font-bold bg-gcp-gray-bg px-2 py-0.5 rounded-md border border-gcp-gray-border/30">
            {data.internalIp as string}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gcp-gray-bg">
        {(data.tags as string[] || []).map(tag => (
          <span key={tag} className="px-2.5 py-1 bg-blue-50 text-gcp-blue rounded-lg text-[9px] font-bold border border-blue-100/50 transition-colors hover:bg-blue-100">
            #{tag}
          </span>
        ))}
      </div>

      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
};
