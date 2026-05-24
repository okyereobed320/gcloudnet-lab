import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { ShieldCheck } from 'lucide-react';

export const VPNGatewayNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div 
      className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col gap-3 min-w-[200px] bg-white shadow-lg ${selected ? 'border-red-500 ring-4 ring-red-500/10' : 'border-gcp-gray-border hover:border-red-400'}`}
    >
      <Handle type="target" position={Position.Left} />
      
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/20">
          <ShieldCheck size={20} />
        </div>
        <div>
          <span className="text-sm font-black text-gcp-gray-dark block tracking-tight">{data.label as string}</span>
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">HA VPN Gateway</span>
        </div>
      </div>
      
      <div className="bg-red-50/50 p-2 rounded-lg border border-red-100/50">
        <div className="flex justify-between items-center text-[9px] font-bold text-gcp-gray-text uppercase">
          <span>Peer IP</span>
          <span className="font-mono text-red-700">{(data.peerIp as string) || '35.220.10.5'}</span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};
