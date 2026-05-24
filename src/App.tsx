import React, { useState, useCallback } from 'react';
import type { NetworkState } from './types/network';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import PropertyInspector from './components/PropertyInspector';
import { LabAssistant } from './components/LabAssistant';
import { Toolbar } from './components/Toolbar';
import { TrafficAnalysis } from './components/TrafficAnalysis';
import { LabProvider, useLab } from './context/LabContext';
import { MissionProvider } from './context/MissionContext';
import { MissionControl } from './components/MissionControl';
import { simulateTraffic } from './logic/trafficEngine';
import { generateGcloudCommands } from './logic/gcloudGenerator';
import { CloudConsole } from './components/CloudConsole';
import { Cloud, Shield } from 'lucide-react';
import type { Node } from '@xyflow/react';

const AppInner: React.FC = () => {
  const { isEducationMode, setIsEducationMode } = useLab();
  const [state, setState] = useState<NetworkState>({
    nodes: [],
    edges: [],
    vpcs: [],
    subnets: [],
    instances: [],
    nats: [],
    loadBalancers: [],
    vpnGateways: [],
    cloudArmorPolicies: [],
    pscConnections: []
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [simulationLogs, setSimulationLogs] = useState<{msg: string, type: 'info' | 'success' | 'error'}[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const addVPC = () => {
    const id = `vpc-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'vpc',
      position: { x: 100, y: 100 },
      data: { label: `prod-vpc` },
    };
    setState(s => ({
      ...s,
      nodes: [...s.nodes, newNode],
      vpcs: [...s.vpcs, { id, name: newNode.data.label as string, firewallRules: [], routers: [], peering: [] }]
    }));
  };

  const runSimulation = useCallback((sourceId: string, targetId: string) => {
    if (!sourceId || !targetId) return;
    setIsSimulating(true);
    setSimulationLogs([{ msg: "GCP Logic Engine: Initializing path trace...", type: 'info' }]);
    
    setTimeout(() => {
      const result = simulateTraffic(sourceId, targetId, state);
      
      const newLogs = result.logs.map((log: string) => ({
        msg: log,
        type: (log.toLowerCase().includes('success') ? 'success' : log.toLowerCase().includes('failed') || log.toLowerCase().includes('drop') ? 'error' : 'info') as 'info' | 'success' | 'error'
      }));

      setSimulationLogs(prev => [...prev, ...newLogs]);
      setIsSimulating(false);
    }, 1000);
  }, [state]);

  const gcloudCommands = generateGcloudCommands(state);

  return (
    <MissionProvider state={state}>
      <div className="flex h-screen w-screen overflow-hidden bg-gcp-gray-bg text-gcp-gray-dark font-sans flex-col text-[13px]">
      {/* Brand Header */}
      <header className="h-14 bg-slate-900 text-white flex items-center px-6 z-50 justify-between shadow-xl relative shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
            <div className="bg-gcp-blue text-white p-1 rounded-lg">
              <Cloud size={20} fill="currentColor" />
            </div>
            <span>GCP<span className="text-white/80">LAB</span></span>
          </div>
          
          <div className="h-6 w-px bg-white/10" />

          {/* Scenario Selector */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Lab</span>
            <div className="bg-white/5 border border-white/10 rounded px-3 py-1 text-[11px] font-bold text-blue-400">
              {isEducationMode ? 'Guided Missions' : 'Custom Designer'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10 shadow-inner">
            <button 
              onClick={() => setIsEducationMode(true)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${isEducationMode ? 'bg-gcp-blue text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
            >
              LEARN
            </button>
            <button 
              onClick={() => setIsEducationMode(false)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${!isEducationMode ? 'bg-gcp-blue text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
            >
              BUILD
            </button>
          </div>
          
          <div className="h-8 w-px bg-white/10 mx-1" />

          <button 
            onClick={() => {
              setState({ nodes: [], edges: [], vpcs: [], subnets: [], instances: [], nats: [], loadBalancers: [], vpnGateways: [], cloudArmorPolicies: [], pscConnections: [] });
              setSimulationLogs([]);
            }}
            className="text-white/40 hover:text-red-400 p-2 rounded-xl hover:bg-white/5 transition-all"
            title="Reset Canvas"
          >
            <Shield size={20} />
          </button>
        </div>
      </header>

      {/* Packet Tracer Style Toolbar */}
      <Toolbar onAddVPC={addVPC} />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {isEducationMode ? <MissionControl /> : <Sidebar isEducationMode={isEducationMode} />}
        
        <main className="flex-1 relative overflow-hidden bg-slate-200 flex flex-col">
          <div className="flex-1 relative">
            <Canvas 
              state={state} 
              setState={setState} 
              selectedId={selectedId}
              setSelectedId={setSelectedId} 
              isEducationMode={isEducationMode}
              setSimulationLogs={setSimulationLogs}
            />
          </div>

          <CloudConsole logs={simulationLogs} commands={gcloudCommands} />
        </main>

        <aside className="w-80 flex flex-col border-l border-gcp-gray-border bg-white overflow-hidden shadow-2xl z-30 shrink-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-gcp-gray-bg/20">
            {/* Traffic Analysis (Now always visible or in dedicated section) */}
            <TrafficAnalysis state={state} onInject={runSimulation} isSimulating={isSimulating} />

            {selectedId ? (
              <PropertyInspector 
                selectedId={selectedId} 
                state={state} 
                setState={setState} 
                isEducationMode={isEducationMode}
              />
            ) : (
              <LabAssistant state={state} />
            )}
          </div>
        </aside>
      </div>
      </div>
    </MissionProvider>
  );
};

const App: React.FC = () => (
  <LabProvider>
    <AppInner />
  </LabProvider>
);

export default App;
