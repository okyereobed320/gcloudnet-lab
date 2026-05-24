import React from 'react';
import { Network, Server, Globe, Cpu, LayoutGrid, Lock, Zap, Share2, Info, Activity, ShieldAlert, Link2 } from 'lucide-react';

interface SidebarProps {
  isEducationMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isEducationMode }) => {
  const resourceGroups = [
    {
      title: 'Connectivity',
      icon: <Network size={14} />,
      items: [
        { id: 'vpc', name: 'Virtual Private Cloud', icon: <Globe size={18} />, color: 'text-purple-600 bg-purple-50', desc: 'Isolated network.' },
        { id: 'subnet', name: 'Regional Subnet', icon: <LayoutGrid size={18} />, color: 'text-blue-600 bg-blue-50', desc: 'Regional boundaries.' },
        { id: 'router', name: 'Cloud Router', icon: <Zap size={18} />, color: 'text-yellow-600 bg-yellow-50', desc: 'BGP dynamic routing.' },
        { id: 'nat', name: 'Cloud NAT', icon: <Activity size={18} />, color: 'text-orange-600 bg-orange-50', desc: 'Outbound IP translation.' },
        { id: 'vpn', name: 'Cloud VPN Gateway', icon: <Lock size={18} />, color: 'text-red-600 bg-red-50', desc: 'Secure site-to-site.' },
        { id: 'psc', name: 'Private Service Connect', icon: <Link2 size={18} />, color: 'text-cyan-600 bg-cyan-50', desc: 'Secure service access.' },
      ]
    },
    {
      title: 'Application Delivery',
      icon: <Server size={14} />,
      items: [
        { id: 'instance', name: 'Compute Instance', icon: <Cpu size={18} />, color: 'text-green-600 bg-green-50', desc: 'Virtual machines.' },
        { id: 'lb', name: 'Cloud Load Balancer', icon: <Share2 size={18} />, color: 'text-indigo-600 bg-indigo-50', desc: 'Traffic distribution.' },
        { id: 'armor', name: 'Cloud Armor (WAF)', icon: <ShieldAlert size={18} />, color: 'text-red-600 bg-red-50', desc: 'Edge security policy.' },
      ]
    }

  ];

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-white border-r border-gcp-gray-border flex flex-col shadow-sm z-40">
      <div className="p-4 border-b border-gcp-gray-border bg-gcp-gray-bg/50 flex items-center justify-between">
        <h2 className="text-[11px] font-bold text-gcp-gray-text uppercase tracking-widest">Resource Palette</h2>
        {isEducationMode && <div className="px-1.5 py-0.5 bg-blue-600 text-[8px] text-white font-bold rounded uppercase">Academy</div>}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {resourceGroups.map((group) => (
          <div key={group.title} className="py-4 px-3 border-b border-gcp-gray-border/50">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="text-gcp-gray-text opacity-70">{group.icon}</span>
              <h3 className="text-xs font-semibold text-gcp-gray-dark uppercase tracking-tight">{group.title}</h3>
            </div>
            
            <div className="space-y-1">
              {group.items.map((tool) => (
                <div key={tool.id} className="group flex flex-col">
                  <div
                    draggable
                    onDragStart={(event) => onDragStart(event, tool.id)}
                    className={`flex items-center gap-3 p-2 rounded border border-transparent cursor-grab active:cursor-grabbing hover:border-gcp-gray-border hover:bg-gcp-gray-bg transition-all`}
                  >
                    <div className={`p-1.5 rounded-md ${tool.color} group-hover:shadow-sm transition-all`}>
                      {tool.icon}
                    </div>
                    <span className="font-medium text-xs text-gcp-gray-dark">{tool.name}</span>
                  </div>
                  {isEducationMode && (
                    <div className="px-10 pb-2 flex items-start gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity h-0 group-hover:h-auto overflow-hidden">
                      <Info size={10} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-[10px] text-gcp-gray-text leading-tight">{tool.desc}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gcp-gray-border bg-gcp-gray-bg/30">
        <div className="flex items-center gap-2 text-[10px] text-gcp-gray-text leading-tight">
          <div className="w-1.5 h-1.5 rounded-full bg-gcp-blue animate-pulse" />
          {isEducationMode ? 'Drag to learn about GCP architecture' : 'Drag resources to build'}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
