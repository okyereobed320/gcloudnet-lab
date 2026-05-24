import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Zap } from 'lucide-react';

export const RouterNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div 
      className={`p-3 rounded-lg border-2 transition-all flex flex-col gap-2 min-w-[140px] ${selected ? 'bg-yellow-50 border-yellow-500 shadow-md' : 'bg-white border-gcp-gray-border'}`}
    >
      <Handle type="target" position={Position.Left} />
      
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-yellow-50 text-yellow-600 rounded">
          <Zap size={16} />
        </div>
        <span className="text-[10px] font-bold text-gcp-gray-dark truncate">{data.label as string}</span>
      </div>
      
      <div className="text-[9px] text-gcp-gray-text font-medium px-1">
        ASN: {(data.asn as string) || '64512'}
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};
