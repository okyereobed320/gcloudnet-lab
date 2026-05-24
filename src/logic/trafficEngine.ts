import type { NetworkState } from '../types/network';

export interface TrafficStep {
  nodeId: string;
  status: 'SUCCESS' | 'DROPPED' | 'FORWARDED';
  reason?: string;
}

export interface SimulationResult {
  isSuccess: boolean;
  steps: TrafficStep[];
  logs: string[];
}

export const simulateTraffic = (
  sourceId: string, 
  targetId: string, 
  state: NetworkState
): SimulationResult => {
  const logs: string[] = [];
  const steps: TrafficStep[] = [];
  
  const sourceNode = state.nodes.find(n => n.id === sourceId);
  const targetNode = state.nodes.find(n => n.id === targetId);

  if (!sourceNode || !targetNode) {
    return { isSuccess: false, steps, logs: ["Simulation failed: Source or target not found."] };
  }

  logs.push(`Starting traffic simulation: ${sourceNode.data.label} -> ${targetNode.data.label}`);
  steps.push({ nodeId: sourceId, status: 'FORWARDED' });

  // Find source VM
  const sourceVm = state.instances.find(i => i.id === sourceId);
  const targetVm = state.instances.find(i => i.id === targetId);

  // 1. Check Egress (Source)
  if (sourceVm) {
    const sourceSubnet = state.subnets.find(s => s.id === sourceVm.subnetId);
    const sourceVpc = state.vpcs.find(v => v.id === sourceSubnet?.vpcId);
    
    if (sourceVpc) {
      logs.push(`Checking egress from VPC: ${sourceVpc.name}`);
      // Simple egress check - GCP allows all egress by default
      steps.push({ nodeId: sourceVpc.id, status: 'FORWARDED' });
    }
  }

  // 2. Check Routing (Between VPCs)
  // For now, assume same VPC or peering
  const targetSubnet = state.subnets.find(s => s.id === targetVm?.subnetId);
  const targetVpc = state.vpcs.find(v => v.id === targetSubnet?.vpcId);

  if (!targetVpc) {
    // If target is an external IP (Load Balancer)
    const lb = state.loadBalancers.find(l => l.id === targetId);
    if (lb) {
      logs.push(`Traffic hitting External Load Balancer: ${lb.name}`);
      steps.push({ nodeId: targetId, status: 'SUCCESS' });
      return { isSuccess: true, steps, logs: [...logs, "Traffic successfully reached Load Balancer."] };
    }
  }

  // 3. Check Ingress (Target)
  if (targetVm && targetVpc) {
    logs.push(`Analyzing ingress to VPC: ${targetVpc.name}`);
    
    const ingressRules = targetVpc.firewallRules.filter(r => r.direction === 'INGRESS');
    const allowRule = ingressRules.find(rule => {
      if (rule.action !== 'ALLOW') return false;
      // Simple tag match
      return rule.targetTags.some(tag => targetVm.tags.includes(tag));
    });

    if (allowRule) {
      logs.push(`MATCH FOUND: Firewall rule '${allowRule.name}' allows traffic.`);
      steps.push({ nodeId: targetId, status: 'SUCCESS' });
      return { isSuccess: true, steps, logs: [...logs, "Success: Packets delivered to instance."] };
    } else {
      logs.push(`DROP: No matching ALLOW rule found. Implicit deny applied.`);
      steps.push({ nodeId: targetId, status: 'DROPPED', reason: 'Firewall Deny' });
      return { isSuccess: false, steps, logs: [...logs, "Failed: Traffic dropped by firewall."] };
    }
  }

  return { isSuccess: true, steps, logs: [...logs, "Simulation complete."] };
};
