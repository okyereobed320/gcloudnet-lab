import React, { useCallback, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
  BackgroundVariant
} from '@xyflow/react';
import type { 
  Connection,
  Node,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  OnNodesDelete,
  OnEdgesDelete
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import type { NetworkState } from '../types/network';
import { VPCNode } from './nodes/VPCNode';
import { SubnetNode } from './nodes/SubnetNode';
import { InstanceNode } from './nodes/InstanceNode';
import { RouterNode } from './nodes/RouterNode';
import { NatNode } from './nodes/NatNode';
import { LoadBalancerNode } from './nodes/LoadBalancerNode';
import { VPNGatewayNode } from './nodes/VPNGatewayNode';
import { CloudArmorNode } from './nodes/CloudArmorNode';
import { PSCNode } from './nodes/PSCNode';
import { AnimatedEdge } from './AnimatedEdge';
import { useLab } from '../context/LabContext';

interface CanvasProps {
  state: NetworkState;
  setState: React.Dispatch<React.SetStateAction<NetworkState>>;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  isEducationMode: boolean;
  setSimulationLogs: React.Dispatch<React.SetStateAction<{msg: string, type: 'info' | 'success' | 'error'}[]>>;
}

const nodeTypes = {
  vpc: VPCNode,
  subnet: SubnetNode,
  instance: InstanceNode,
  router: RouterNode,
  nat: NatNode,
  lb: LoadBalancerNode,
  vpn: VPNGatewayNode,
  armor: CloudArmorNode,
  psc: PSCNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
};

const CanvasInner: React.FC<CanvasProps> = ({ 
  state, 
  setState, 
  selectedId, 
  setSelectedId
}) => {
  const { screenToFlowPosition, deleteElements } = useReactFlow();
  const { tool } = useLab();

  // Deletion logic
  const onNodesDelete: OnNodesDelete = useCallback(
    (deletedNodes) => {
      const deletedIds = deletedNodes.map((n) => n.id);
      setState((s) => ({
        ...s,
        vpcs: s.vpcs.filter((v) => !deletedIds.includes(v.id)),
        subnets: s.subnets.filter((sn) => !deletedIds.includes(sn.id)),
        instances: s.instances.filter((i) => !deletedIds.includes(i.id)),
        loadBalancers: s.loadBalancers?.filter((l) => !deletedIds.includes(l.id)) || [],
        vpnGateways: s.vpnGateways?.filter((v) => !deletedIds.includes(v.id)) || [],
      }));
    },
    [setState]
  );

  const onEdgesDelete: OnEdgesDelete = useCallback(
    (_deletedEdges) => {},
    []
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => setState((s) => ({ ...s, edges: addEdge(params, s.edges) })),
    [setState]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setState((s) => {
        const nextNodes = applyNodeChanges(changes, s.nodes);
        
        const selectionChange = changes.find(c => c.type === 'select');
        if (selectionChange && 'selected' in selectionChange && selectionChange.selected) {
          setSelectedId(selectionChange.id);
        } else if (selectionChange && 'selected' in selectionChange && !selectionChange.selected && selectedId === selectionChange.id) {
          setSelectedId(null);
        }

        return { ...s, nodes: nextNodes };
      });
    },
    [setState, setSelectedId, selectedId]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setState((s) => ({
        ...s,
        edges: applyEdgeChanges(changes, s.edges)
      }));
    },
    [setState]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (tool === 'DELETE') {
      deleteElements({ nodes: [node] });
    }
  }, [tool, deleteElements]);

  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: any) => {
    if (tool === 'DELETE') {
      deleteElements({ edges: [edge] });
    }
  }, [tool, deleteElements]);

  // Global Key Listener for Deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedNodes = state.nodes.filter(n => n.selected);
        const selectedEdges = state.edges.filter(e => e.selected);
        if (selectedNodes.length > 0 || selectedEdges.length > 0) {
          deleteElements({ nodes: selectedNodes, edges: selectedEdges });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.nodes, state.edges, deleteElements]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // IMPROVED NESTING LOGIC
      const potentialContainers = state.nodes.filter(node => {
        const { x, y } = node.position;
        const width = node.type === 'vpc' ? 700 : node.type === 'subnet' ? 320 : 0;
        const height = node.type === 'vpc' ? 500 : node.type === 'subnet' ? 280 : 0;
        
        if (width === 0) return false;

        let absX = x;
        let absY = y;
        if (node.parentId) {
          const parent = state.nodes.find(n => n.id === node.parentId);
          if (parent) {
            absX += parent.position.x;
            absY += parent.position.y;
          }
        }

        return (
          position.x >= absX &&
          position.x <= absX + width &&
          position.y >= absY &&
          position.y <= absY + height
        );
      });

      potentialContainers.sort((a, b) => {
        if (a.type === 'subnet' && b.type === 'vpc') return -1;
        if (a.type === 'vpc' && b.type === 'subnet') return 1;
        return 0;
      });

      const dropNode = potentialContainers.find(node => {
        if (type === 'subnet' && node.type !== 'vpc') return false;
        if (type === 'instance' && node.type !== 'subnet') return false;
        if (type === 'router' && node.type !== 'vpc') return false;
        if (type === 'nat' && node.type !== 'router') return false;
        if (type === 'vpn' && node.type !== 'vpc') return false;
        if (type === 'lb' && node.type !== 'vpc') return false;
        if (type === 'psc' && node.type !== 'vpc') return false;
        return true;
      });

      let dropNodeAbsX = dropNode?.position.x || 0;
      let dropNodeAbsY = dropNode?.position.y || 0;
      if (dropNode?.parentId) {
        const parent = state.nodes.find(n => n.id === dropNode.parentId);
        if (parent) {
          dropNodeAbsX += parent.position.x;
          dropNodeAbsY += parent.position.y;
        }
      }

      const newNodeId = `${type}-${Date.now()}`;
      const newNode: Node = {
        id: newNodeId,
        type,
        position: dropNode 
          ? { x: position.x - dropNodeAbsX, y: position.y - dropNodeAbsY }
          : position,
        parentId: dropNode?.id,
        data: { label: `${type}-${state.nodes.length + 1}` },
        extent: dropNode ? 'parent' : undefined,
      };

      if (type === 'instance') {
        newNode.data.internalIp = `10.0.1.${state.instances.length + 10}`;
        newNode.data.tags = ['http-server'];
      } else if (type === 'subnet') {
        newNode.data.region = 'us-central1';
        newNode.data.cidr = `10.0.${state.subnets.length + 1}.0/24`;
      } else if (type === 'router') {
        newNode.data.asn = 64512;
      } else if (type === 'lb') {
        newNode.data.ipAddress = `34.120.${state.loadBalancers?.length || 0}.5`;
        newNode.data.type = 'External HTTP(S)';
      } else if (type === 'vpn') {
        newNode.data.peerIp = '35.220.10.5';
      }

      setState((s) => {
        const nextState = { ...s, nodes: [...s.nodes, newNode] };
        
        if (type === 'vpc') {
          nextState.vpcs = [...s.vpcs, { id: newNodeId, name: newNode.data.label as string, firewallRules: [], routers: [], peering: [] }];
        } else if (type === 'subnet') {
          nextState.subnets = [...s.subnets, { id: newNodeId, name: newNode.data.label as string, vpcId: dropNode?.id || '', region: newNode.data.region as string, cidr: newNode.data.cidr as string, gatewayIp: `10.0.${s.subnets.length + 1}.1` }];
        } else if (type === 'instance') {
          nextState.instances = [...s.instances, { id: newNodeId, name: newNode.data.label as string, subnetId: dropNode?.id || '', internalIp: newNode.data.internalIp as string, tags: newNode.data.tags as string[], status: 'RUNNING' }];
        } else if (type === 'lb') {
          nextState.loadBalancers = [...(s.loadBalancers || []), { id: newNodeId, name: newNode.data.label as string, type: 'EXTERNAL', ipAddress: newNode.data.ipAddress as string, backendSubnetIds: [] }];
        } else if (type === 'vpn') {
          nextState.vpnGateways = [...(s.vpnGateways || []), { id: newNodeId, name: newNode.data.label as string, vpcId: dropNode?.id || '', region: 'us-central1', peerIp: newNode.data.peerIp as string }];
        }
        
        return nextState;
      });
    },
    [screenToFlowPosition, state.nodes, state.instances.length, state.subnets.length, state.loadBalancers?.length, setState]
  );

  return (
    <div className={`w-full h-full relative ${tool === 'DELETE' ? 'cursor-not-allowed' : tool === 'WIRE' ? 'cursor-crosshair' : 'cursor-default'}`} onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={state.nodes}
        edges={state.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={[15, 15]}
        fitView
      >
        <Background color="#cbd5e1" variant={BackgroundVariant.Dots} gap={15} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

const Canvas: React.FC<CanvasProps> = (props) => (
  <ReactFlowProvider>
    <CanvasInner {...props} />
  </ReactFlowProvider>
);

export default Canvas;
