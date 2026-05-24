import React from 'react';
import type { NetworkState } from '../types/network';
import { Sparkles, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

interface LabAssistantProps {
  state: NetworkState;
}

export const LabAssistant: React.FC<LabAssistantProps> = ({ state }) => {
  const issues: { title: string, desc: string, type: 'warning' | 'tip' | 'success' }[] = [];

  // Analysis Logic
  const instances = state.instances;
  const vpcs = state.vpcs;

  // Check 1: Insecure SSH
  const insecureRules = vpcs.some(v => v.firewallRules.some(r => r.ports.includes('22') && r.sourceRanges.includes('0.0.0.0/0')));
  if (insecureRules) {
    issues.push({
      title: 'Security Risk: SSH Open to World',
      desc: 'One or more firewall rules allow SSH (Port 22) from any IP. Restrict this to your specific IP for better security.',
      type: 'warning'
    });
  }

  // Check 2: Instances without Subnet
  const unattachedInstances = instances.filter(i => !i.subnetId);
  if (unattachedInstances.length > 0) {
    issues.push({
      title: 'Architecture: Orphaned Instances',
      desc: `${unattachedInstances.length} instance(s) are not attached to a subnet. They will not have network connectivity.`,
      type: 'warning'
    });
  }

  // Check 3: Private Instances needing NAT
  const unattachedPsc = instances.length > 0 && state.pscConnections.length === 0;
  if (unattachedPsc) {
    issues.push({
      title: 'Connectivity: Private Access',
      desc: 'Consider using Private Service Connect (PSC) to access Google APIs without traversing the public internet.',
      type: 'tip'
    });
  }

  // Check 4: Cloud Armor for Load Balancer
  const unprotectedLb = state.loadBalancers.some(l => !l.armorPolicyId);
  if (unprotectedLb) {
    issues.push({
      title: 'Security: Unprotected LB',
      desc: 'One or more Load Balancers do not have a Cloud Armor policy attached. This leaves your backend vulnerable to L7 attacks.',
      type: 'warning'
    });
  }

  // Check 5: Shared VPC Host
  const hostVpc = vpcs.find(v => v.isHostProjectVpc);
  if (!hostVpc && vpcs.length > 1) {
    issues.push({
      title: 'Architecture: Shared VPC',
      desc: 'With multiple networks, consider a Shared VPC architecture to centralize network administration.',
      type: 'tip'
    });
  }

  if (issues.length === 0 && instances.length > 0) {
    issues.push({
      title: 'Architecture Verified',
      desc: 'Your networking topology follows basic GCP best practices.',
      type: 'success'
    });
  }

  return (
    <div className="flex flex-col h-full bg-white/50 backdrop-blur-md rounded-2xl border border-gcp-gray-border overflow-hidden shadow-xl">
      <div className="bg-gcp-blue px-4 py-3 flex items-center gap-2">
        <Sparkles size={16} className="text-white animate-pulse" />
        <h3 className="text-xs font-black text-white uppercase tracking-widest">Smart Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {issues.length === 0 && instances.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
            <Lightbulb size={32} className="mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-tighter">Awaiting Deployment</p>
            <p className="text-[9px]">Add resources to trigger topology analysis.</p>
          </div>
        ) : (
          issues.map((issue, i) => (
            <div key={i} className={`p-3 rounded-xl border animate-in slide-in-from-right duration-500 delay-${i*100} ${
              issue.type === 'warning' ? 'bg-red-50 border-red-100 text-red-900' :
              issue.type === 'success' ? 'bg-green-50 border-green-100 text-green-900' :
              'bg-blue-50 border-blue-100 text-blue-900'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {issue.type === 'warning' ? <AlertTriangle size={14} className="text-red-500" /> : 
                 issue.type === 'success' ? <CheckCircle size={14} className="text-green-500" /> : 
                 <Lightbulb size={14} className="text-blue-500" />}
                <span className="text-[11px] font-black uppercase tracking-tight">{issue.title}</span>
              </div>
              <p className="text-[10px] leading-relaxed opacity-80">{issue.desc}</p>
            </div>
          ))
        )}
      </div>
      
      <div className="p-3 bg-gcp-gray-bg border-t border-gcp-gray-border text-[9px] text-gcp-gray-text font-bold italic text-center">
        GCLOUDnet Analysis Engine v1.0
      </div>
    </div>
  );
};
