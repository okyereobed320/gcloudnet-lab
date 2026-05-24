import React from 'react';
import type { NetworkState, FirewallRule, Subnet } from '../types/network';
import { Cpu, Globe, Activity, GraduationCap, Share2, Lock, ShieldAlert, Link2 } from 'lucide-react';

interface PropertyInspectorProps {
  selectedId: string | null;
  state: NetworkState;
  setState: React.Dispatch<React.SetStateAction<NetworkState>>;
  isEducationMode: boolean;
}

const PropertyInspector: React.FC<PropertyInspectorProps> = ({ selectedId, state, setState, isEducationMode }) => {
  if (!selectedId) return null;

  const instance = state.instances.find(i => i.id === selectedId);
  const vpc = state.vpcs.find(v => v.id === selectedId);
  const subnet = state.subnets.find(s => s.id === selectedId);
  const lb = state.loadBalancers?.find(l => l.id === selectedId);
  const vpn = state.vpnGateways?.find(v => v.id === selectedId);
  const armor = state.cloudArmorPolicies?.find(a => a.id === selectedId);
  const psc = state.pscConnections?.find(p => p.id === selectedId);

  const updateInstanceName = (newName: string) => {
    setState((prev: NetworkState) => ({
      ...prev,
      instances: prev.instances.map(i => i.id === selectedId ? { ...i, name: newName } : i),
      nodes: prev.nodes.map(n => n.id === selectedId ? { ...n, data: { ...n.data, label: newName } } : n)
    }));
  };

  const updateVpcName = (newName: string) => {
    setState((prev: NetworkState) => ({
      ...prev,
      vpcs: prev.vpcs.map(v => v.id === selectedId ? { ...v, name: newName } : v),
      nodes: prev.nodes.map(n => n.id === selectedId ? { ...n, data: { ...n.data, label: newName } } : n)
    }));
  };

  const updateSubnet = (updates: Partial<Subnet>) => {
    setState((prev: NetworkState) => ({
      ...prev,
      subnets: prev.subnets.map(s => s.id === selectedId ? { ...s, ...updates } : s),
      nodes: prev.nodes.map(n => n.id === selectedId ? { ...n, data: { ...n.data, ...updates, label: updates.name || (n.data.label as string) } } : n)
    }));
  };

  const updateFirewallRule = (vpcId: string, ruleId: string, updates: Partial<FirewallRule>) => {
    setState((prev: NetworkState) => ({
      ...prev,
      vpcs: prev.vpcs.map(v => v.id === vpcId ? {
        ...v,
        firewallRules: v.firewallRules.map(r => r.id === ruleId ? { ...r, ...updates } : r)
      } : v)
    }));
  };

  const addFirewallRule = (vpcId: string) => {
    const newRule: FirewallRule = {
      id: `rule-${Date.now()}`,
      name: `allow-custom-${Date.now().toString().slice(-4)}`,
      priority: 1000,
      direction: 'INGRESS',
      action: 'ALLOW',
      targetTags: ['http-server'],
      sourceRanges: ['0.0.0.0/0'],
      protocol: 'tcp',
      ports: ['80'],
    };

    setState((prev: NetworkState) => ({
      ...prev,
      vpcs: prev.vpcs.map(v => v.id === vpcId ? { ...v, firewallRules: [...v.firewallRules, newRule] } : v)
    }));
  };

  const deleteFirewallRule = (vpcId: string, ruleId: string) => {
    setState((prev: NetworkState) => ({
      ...prev,
      vpcs: prev.vpcs.map(v => v.id === vpcId ? { ...v, firewallRules: v.firewallRules.filter(r => r.id !== ruleId) } : v)
    }));
  };

  const AcademyInsight: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-[11px] animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold uppercase tracking-wider text-[9px]">
        <GraduationCap size={14} />
        <span>Academy Insight: {title}</span>
      </div>
      <div className="text-blue-900 leading-relaxed opacity-80">
        {children}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right duration-300">
      {instance && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-600 text-white rounded-xl shadow-lg">
              <Cpu size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest block">Compute Engine</span>
              <h3 className="text-sm font-black text-gcp-gray-dark leading-none tracking-tight">{instance.name}</h3>
            </div>
          </div>
          
          <section className="space-y-4">
            <h4 className="text-[11px] font-black text-gcp-gray-text uppercase tracking-widest border-b border-gcp-gray-border pb-2">Properties</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-gcp-gray-text uppercase mb-1">Instance Name</label>
                <input 
                  type="text" 
                  value={instance.name}
                  onChange={(e) => updateInstanceName(e.target.value)}
                  className="w-full text-xs font-bold border border-gcp-gray-border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gcp-blue outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="py-2 px-3 bg-gcp-gray-bg rounded-lg border border-gcp-gray-border/50">
                  <span className="text-[9px] font-black text-gcp-gray-text uppercase block mb-1">Internal IP</span>
                  <span className="text-[10px] font-mono font-black text-gcp-gray-dark">{instance.internalIp}</span>
                </div>
                <div className="py-2 px-3 bg-gcp-gray-bg rounded-lg border border-gcp-gray-border/50">
                  <span className="text-[9px] font-black text-gcp-gray-text uppercase block mb-1">Status</span>
                  <span className="text-[10px] font-black text-green-600">● {instance.status}</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gcp-gray-text uppercase mb-1">Network Tags (Comma separated)</label>
                <input 
                  type="text" 
                  value={instance.tags.join(', ')}
                  onChange={(e) => {
                    const newTags = e.target.value.split(',').map(t => t.trim()).filter(t => t !== '');
                    setState((prev: NetworkState) => ({
                      ...prev,
                      instances: prev.instances.map(i => i.id === selectedId ? { ...i, tags: newTags } : i)
                    }));
                  }}
                  className="w-full text-xs font-bold border border-gcp-gray-border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gcp-blue outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {isEducationMode && (
            <AcademyInsight title="Internal IP">
              Resources in a VPC use **Internal IPs** to communicate securely. This traffic never leaves the private network, reducing costs and increasing security.
            </AcademyInsight>
          )}
        </div>
      )}

      {vpc && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600 text-white rounded-xl shadow-lg">
              <Globe size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest block">VPC Network</span>
              <h3 className="text-sm font-black text-gcp-gray-dark leading-none tracking-tight">{vpc.name}</h3>
            </div>
          </div>

          <section className="space-y-4">
            <h4 className="text-[11px] font-black text-gcp-gray-text uppercase tracking-widest border-b border-gcp-gray-border pb-2">Configuration</h4>
            <div>
              <label className="block text-[10px] font-black text-gcp-gray-text uppercase mb-1">Network Name</label>
              <input 
                type="text" 
                value={vpc.name}
                onChange={(e) => updateVpcName(e.target.value)}
                className="w-full text-xs font-bold border border-gcp-gray-border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gcp-blue outline-none transition-all"
              />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-gcp-gray-border pb-2">
              <h4 className="text-[11px] font-black text-gcp-gray-text uppercase tracking-widest">Firewall Policies</h4>
              <button 
                onClick={() => addFirewallRule(vpc.id)}
                className="text-[10px] font-black text-gcp-blue hover:underline"
              >
                + ADD RULE
              </button>
            </div>

            <div className="space-y-3">
              {vpc.firewallRules.map(rule => (
                <div key={rule.id} className="p-3 bg-white border border-gcp-gray-border rounded-xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <input 
                      type="text"
                      value={rule.name}
                      onChange={(e) => updateFirewallRule(vpc.id, rule.id, { name: e.target.value })}
                      className="text-[10px] font-black text-gcp-gray-dark bg-transparent outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 w-2/3"
                    />
                    <div className="flex items-center gap-2">
                      <select 
                        value={rule.action}
                        onChange={(e) => updateFirewallRule(vpc.id, rule.id, { action: e.target.value as 'ALLOW' | 'DENY' })}
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-full outline-none appearance-none cursor-pointer ${rule.action === 'ALLOW' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        <option value="ALLOW">ALLOW</option>
                        <option value="DENY">DENY</option>
                      </select>
                      <button 
                        onClick={() => deleteFirewallRule(vpc.id, rule.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Activity size={10} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[8px] font-black text-gcp-gray-text uppercase block mb-0.5">Protocols/Ports</label>
                      <input 
                        type="text"
                        value={rule.ports.join(',')}
                        onChange={(e) => updateFirewallRule(vpc.id, rule.id, { ports: e.target.value.split(',').map(p => p.trim()) })}
                        placeholder="e.g. 80,443"
                        className="w-full text-[9px] font-bold border border-gcp-gray-border rounded px-1.5 py-1 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-black text-gcp-gray-text uppercase block mb-0.5">Target Tags</label>
                      <input 
                        type="text"
                        value={rule.targetTags.join(',')}
                        onChange={(e) => updateFirewallRule(vpc.id, rule.id, { targetTags: e.target.value.split(',').map(t => t.trim()) })}
                        placeholder="e.g. web-server"
                        className="w-full text-[9px] font-bold border border-gcp-gray-border rounded px-1.5 py-1 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {subnet && (
        <div className="space-y-6">
           <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg">
              <Activity size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Regional Subnet</span>
              <h3 className="text-sm font-black text-gcp-gray-dark leading-none tracking-tight">{subnet.name}</h3>
            </div>
          </div>

          <section className="space-y-4">
            <h4 className="text-[11px] font-black text-gcp-gray-text uppercase tracking-widest border-b border-gcp-gray-border pb-2">Network Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-gcp-gray-text uppercase mb-1">Subnet Name</label>
                <input 
                  type="text" 
                  value={subnet.name}
                  onChange={(e) => updateSubnet({ name: e.target.value })}
                  className="w-full text-xs font-bold border border-gcp-gray-border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gcp-blue outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gcp-gray-text uppercase mb-1">IP Range (CIDR)</label>
                <input 
                  type="text" 
                  value={subnet.cidr}
                  onChange={(e) => updateSubnet({ cidr: e.target.value })}
                  className="w-full text-xs font-mono font-black border border-gcp-gray-border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gcp-blue outline-none transition-all"
                />
              </div>
            </div>
          </section>
        </div>
      )}

      {lb && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg">
              <Share2 size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">Cloud Load Balancer</span>
              <h3 className="text-sm font-black text-gcp-gray-dark leading-none tracking-tight">{lb.name}</h3>
            </div>
          </div>
          
          <section className="space-y-4">
            <h4 className="text-[11px] font-black text-gcp-gray-text uppercase tracking-widest border-b border-gcp-gray-border pb-2">Properties</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-gcp-gray-text uppercase mb-1">Balancer Name</label>
                <input 
                  type="text" 
                  value={lb.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setState((prev: NetworkState) => ({
                      ...prev,
                      loadBalancers: prev.loadBalancers.map(l => l.id === selectedId ? { ...l, name: newName } : l),
                      nodes: prev.nodes.map(n => n.id === selectedId ? { ...n, data: { ...n.data, label: newName } } : n)
                    }));
                  }}
                  className="w-full text-xs font-bold border border-gcp-gray-border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gcp-blue outline-none transition-all"
                />
              </div>
              <div className="py-2 px-3 bg-gcp-gray-bg rounded-lg border border-gcp-gray-border/50">
                <span className="text-[9px] font-black text-gcp-gray-text uppercase block mb-1">Frontend IP</span>
                <span className="text-[10px] font-mono font-black text-indigo-600">{lb.ipAddress}</span>
              </div>
            </div>
          </section>
        </div>
      )}

      {vpn && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-lg">
              <Lock size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block">Cloud VPN Gateway</span>
              <h3 className="text-sm font-black text-gcp-gray-dark leading-none tracking-tight">{vpn.name}</h3>
            </div>
          </div>
          
          <section className="space-y-4">
            <h4 className="text-[11px] font-black text-gcp-gray-text uppercase tracking-widest border-b border-gcp-gray-border pb-2">Properties</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-gcp-gray-text uppercase mb-1">Gateway Name</label>
                <input 
                  type="text" 
                  value={vpn.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setState((prev: NetworkState) => ({
                      ...prev,
                      vpnGateways: prev.vpnGateways.map(v => v.id === selectedId ? { ...v, name: newName } : v),
                      nodes: prev.nodes.map(n => n.id === selectedId ? { ...n, data: { ...n.data, label: newName } } : n)
                    }));
                  }}
                  className="w-full text-xs font-bold border border-gcp-gray-border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gcp-blue outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gcp-gray-text uppercase mb-1">Peer IP Address</label>
                <input 
                  type="text" 
                  value={vpn.peerIp}
                  onChange={(e) => {
                    const newIp = e.target.value;
                    setState((prev: NetworkState) => ({
                      ...prev,
                      vpnGateways: prev.vpnGateways.map(v => v.id === selectedId ? { ...v, peerIp: newIp } : v)
                    }));
                  }}
                  className="w-full text-xs font-mono font-bold border border-gcp-gray-border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gcp-blue outline-none transition-all"
                />
              </div>
            </div>
          </section>
        </div>
      )}

      {armor && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-lg">
              <ShieldAlert size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block">Cloud Armor</span>
              <h3 className="text-sm font-black text-gcp-gray-dark leading-none tracking-tight">{armor.name}</h3>
            </div>
          </div>
          
          <section className="space-y-4">
            <h4 className="text-[11px] font-black text-gcp-gray-text uppercase tracking-widest border-b border-gcp-gray-border pb-2">Properties</h4>
            <div>
              <label className="block text-[10px] font-black text-gcp-gray-text uppercase mb-1">Policy Name</label>
              <input 
                type="text" 
                value={armor.name}
                onChange={(e) => {
                  const newName = e.target.value;
                  setState((prev: NetworkState) => ({
                    ...prev,
                    cloudArmorPolicies: prev.cloudArmorPolicies?.map(a => a.id === selectedId ? { ...a, name: newName } : a) || [],
                    nodes: prev.nodes.map(n => n.id === selectedId ? { ...n, data: { ...n.data, label: newName } } : n)
                  }));
                }}
                className="w-full text-xs font-bold border border-gcp-gray-border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gcp-blue outline-none transition-all"
              />
            </div>
            <p className="text-[10px] text-gcp-gray-text leading-relaxed bg-red-50 p-2 rounded border border-red-100">
              This policy is currently protecting your external HTTP(S) load balancers from L7 DDoS attacks.
            </p>
          </section>
        </div>
      )}

      {psc && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-600 text-white rounded-xl shadow-lg">
              <Link2 size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest block">PSC Endpoint</span>
              <h3 className="text-sm font-black text-gcp-gray-dark leading-none tracking-tight">{psc.name}</h3>
            </div>
          </div>
          
          <section className="space-y-4">
            <h4 className="text-[11px] font-black text-gcp-gray-text uppercase tracking-widest border-b border-gcp-gray-border pb-2">Properties</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-gcp-gray-text uppercase mb-1">Endpoint Name</label>
                <input 
                  type="text" 
                  value={psc.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setState((prev: NetworkState) => ({
                      ...prev,
                      pscConnections: prev.pscConnections?.map(p => p.id === selectedId ? { ...p, name: newName } : p) || [],
                      nodes: prev.nodes.map(n => n.id === selectedId ? { ...n, data: { ...n.data, label: newName } } : n)
                    }));
                  }}
                  className="w-full text-xs font-bold border border-gcp-gray-border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gcp-blue outline-none transition-all"
                />
              </div>
              <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-black text-cyan-800 uppercase">Service</span>
                  <span className="font-bold text-cyan-600">{psc.serviceAttachment}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default PropertyInspector;
