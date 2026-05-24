import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { ShieldAlert } from 'lucide-react';

export const CloudArmorNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div 
      className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col gap-3 min-w-[180px] bg-white shadow-lg ${selected ? 'border-red-600 ring-4 ring-red-600/10' : 'border-gcp-gray-border hover:border-red-400'}`}
    >
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-lg shadow-red-600/20">
          <ShieldAlert size={20} />
        </div>
        <div>
          <span className="text-sm font-black text-gcp-gray-dark block tracking-tight">{data.label as string}</span>
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">WAF Policy</span>
        </div>
      </div>
      
      <div className="bg-red-50/50 p-2 rounded-lg border border-red-100/50 text-[9px] font-bold text-red-800 space-y-1">
        <div>• OWASP Top 10 Protected</div>
        <div>• Bot Management Enabled</div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
