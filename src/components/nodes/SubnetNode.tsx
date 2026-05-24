import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { LayoutGrid } from 'lucide-react';

export const SubnetNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div 
      className={`bg-white/80 backdrop-blur-md rounded-2xl border-2 p-6 min-w-[320px] min-h-[280px] transition-all duration-300 cursor-pointer relative shadow-lg ${selected ? 'border-gcp-blue ring-4 ring-gcp-blue/10 scale-[1.02]' : 'border-blue-100/50 hover:shadow-xl hover:border-blue-200'}`}
    >
      <Handle type="target" position={Position.Left} className="opacity-0" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30">
            <LayoutGrid size={20} />
          </div>
          <div>
            <span className="font-black text-base text-gcp-gray-dark tracking-tight">{data.label as string}</span>
            <div className="flex items-center gap-2 text-[10px] text-gcp-gray-text font-bold uppercase tracking-tighter mt-0.5">
              <span className="text-blue-600 bg-blue-50 px-1.5 rounded">{data.region as string}</span>
              <span className="opacity-30">•</span>
              <span className="font-mono bg-gcp-gray-bg px-1.5 rounded">{data.cidr as string}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-full border-2 border-dashed border-blue-50 rounded-xl bg-blue-50/20 p-4">
        {/* Children (Instances) */}
      </div>

      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
};
