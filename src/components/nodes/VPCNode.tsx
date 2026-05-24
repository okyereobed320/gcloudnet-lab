import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Globe } from 'lucide-react';

export const VPCNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div 
      className={`relative transition-all duration-300 min-w-[700px] min-h-[500px] bg-white/40 backdrop-blur-xl border-2 rounded-2xl overflow-hidden ${selected ? 'ring-4 ring-gcp-blue/20 border-gcp-blue shadow-2xl scale-[1.01]' : 'border-purple-200/50 shadow-xl'}`}
    >
      <Handle type="target" position={Position.Left} className="opacity-0" />
      
      {/* VPC Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl shadow-inner border border-white/30">
            <Globe size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{data.label as string}</h3>
            <div className="flex items-center gap-2 text-[10px] text-purple-100 font-bold uppercase tracking-widest mt-0.5">
              <span className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">Global Fabric</span>
              <span>Virtual Private Cloud</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />)}
        </div>
      </div>
      
      <div className="p-10 h-full">
        {/* React Flow children */}
      </div>

      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
};
