import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Activity } from 'lucide-react';

export const NatNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div 
      className={`p-3 rounded-lg border-2 transition-all flex flex-col gap-2 min-w-[140px] ${selected ? 'bg-orange-50 border-orange-500 shadow-md' : 'bg-white border-gcp-gray-border'}`}
    >
      <Handle type="target" position={Position.Left} />
      
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-orange-50 text-orange-600 rounded">
          <Activity size={16} />
        </div>
        <span className="text-[10px] font-bold text-gcp-gray-dark truncate">{data.label as string}</span>
      </div>
      
      <div className="text-[9px] text-gcp-gray-text font-medium px-1">
        NAT IP: Auto
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};
