import type { Node, Edge } from '@xyflow/react';

export type NetworkAction = 'ALLOW' | 'DENY';
export type Direction = 'INGRESS' | 'EGRESS';

export interface FirewallRule {
  id: string;
  name: string;
  priority: number;
  direction: Direction;
  action: NetworkAction;
  targetTags: string[];
  sourceRanges: string[];
  protocol: string;
  ports: string[];
}

export interface CloudArmorPolicy {
  id: string;
  name: string;
  rules: { priority: number; match: string; action: 'ALLOW' | 'DENY' }[];
}

export interface VMInstance {
  id: string;
  name: string;
  subnetId: string;
  internalIp: string;
  externalIp?: string;
  tags: string[];
  status: 'RUNNING' | 'STOPPED';
  isSharedVpcInstance?: boolean;
}

export interface CloudRouter {
  id: string;
  name: string;
  vpcId: string;
  region: string;
  asn: number;
  natGateways: string[]; 
}

export interface CloudNAT {
  id: string;
  name: string;
  routerId: string;
  natIpRanges: 'ALL_SUBNET_IP_RANGES' | 'LIST_OF_SUBNETS';
}

export interface VPCPeering {
  id: string;
  name: string;
  localVpcId: string;
  peerVpcId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Subnet {
  id: string;
  name: string;
  vpcId: string;
  region: string;
  cidr: string;
  gatewayIp: string;
  isShared?: boolean;
}

export interface VPC {
  id: string;
  name: string;
  firewallRules: FirewallRule[];
  routers: CloudRouter[];
  peering: VPCPeering[];
  isHostProjectVpc?: boolean;
}

export interface LoadBalancer {
  id: string;
  name: string;
  type: 'EXTERNAL' | 'INTERNAL';
  ipAddress: string;
  backendSubnetIds: string[];
  armorPolicyId?: string;
}

export interface VPNGateway {
  id: string;
  name: string;
  vpcId: string;
  region: string;
  peerIp: string;
}

export interface PrivateServiceConnect {
  id: string;
  name: string;
  serviceAttachment: string;
  consumerVpcId: string;
}

export interface NetworkState {
  nodes: Node[];
  edges: Edge[];
  vpcs: VPC[];
  subnets: Subnet[];
  instances: VMInstance[];
  nats: CloudNAT[];
  loadBalancers: LoadBalancer[];
  vpnGateways: VPNGateway[];
  cloudArmorPolicies: CloudArmorPolicy[];
  pscConnections: PrivateServiceConnect[];
}
