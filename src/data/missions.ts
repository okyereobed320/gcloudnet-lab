import type { Mission } from '../types/mission';

export const MISSIONS: Mission[] = [
  {
    id: 'intro-vpc',
    title: 'Mission 1: The Foundation',
    description: 'Every GCP project needs a network. Your first task is to create a Virtual Private Cloud (VPC) and a regional subnet.',
    learningResources: [
      {
        title: 'What is a VPC?',
        content: 'A VPC is a global virtual network that is isolated from other networks in the cloud. It provides connectivity for your VM instances and other resources.'
      },
      {
        title: 'Subnets & Regions',
        content: 'Subnets are regional resources. They divide your VPC into smaller network segments, each with its own IP range (CIDR).'
      }
    ],
    objectives: [
      {
        id: 'create-vpc',
        task: 'Create a VPC network named "prod-vpc"',
        hint: 'Drag a VPC resource from the Connectivity palette onto the canvas and rename it.',
        isCompleted: false,
        validationFn: (state) => state.vpcs.some(v => v.name.toLowerCase().includes('prod'))
      },
      {
        id: 'create-subnet',
        task: 'Add a Subnet named "web-subnet" inside the VPC',
        hint: 'Drag a Subnet resource into the VPC container.',
        isCompleted: false,
        validationFn: (state) => state.subnets.some(s => s.name.toLowerCase().includes('web'))
      }
    ],
    nextMissionId: 'secure-vm'
  },
  {
    id: 'secure-vm',
    title: 'Mission 2: Secure Your Server',
    description: 'You have a network, but it is empty! Deploy a VM instance and learn how to allow traffic through the firewall.',
    learningResources: [
      {
        title: 'Firewall Rules',
        content: 'By default, all incoming traffic to a VM is denied. You must create firewall rules to allow specific traffic (like HTTP on port 80).'
      }
    ],
    objectives: [
      {
        id: 'create-vm',
        task: 'Deploy a Compute Instance named "web-server" in the subnet',
        hint: 'Drag a Compute Instance into the "web-subnet".',
        isCompleted: false,
        validationFn: (state) => state.instances.some(i => i.name.toLowerCase().includes('server'))
      },
      {
        id: 'allow-http',
        task: 'Create a Firewall Rule to allow port 80 (HTTP)',
        hint: 'Select the VPC and add a rule for port 80 with the tag "http-server".',
        isCompleted: false,
        validationFn: (state) => state.vpcs.some(v => v.firewallRules.some(r => r.ports.includes('80') && r.action === 'ALLOW'))
      }
    ],
    nextMissionId: 'nat-setup'
  },
  {
    id: 'nat-setup',
    title: 'Mission 3: Private Subnet Connectivity',
    description: 'Security best practice: Keep your databases in a private subnet with no external IP. Use Cloud NAT to allow them to download updates from the internet.',
    learningResources: [
      {
        title: 'Cloud NAT',
        content: 'Cloud NAT allows Google Cloud resources without external IP addresses to create outbound connections to the internet.'
      },
      {
        title: 'Cloud Router',
        content: 'Cloud NAT is a regional resource associated with a Cloud Router. It doesn\'t use a proxy but instead uses a pool of IP addresses.'
      }
    ],
    objectives: [
      {
        id: 'create-db-subnet',
        task: 'Create a "db-subnet" (10.0.2.0/24)',
        hint: 'Add another subnet to your VPC for backend resources.',
        isCompleted: false,
        validationFn: (state) => state.subnets.some(s => s.name.toLowerCase().includes('db') && s.cidr.includes('10.0.2'))
      },
      {
        id: 'setup-nat',
        task: 'Setup Cloud Router & Cloud NAT for the VPC',
        hint: 'Drag a Cloud Router into the VPC and add a Cloud NAT resource.',
        isCompleted: false,
        validationFn: (state) => (state.vpcs[0]?.routers?.length || 0) > 0 || state.nats?.length > 0
      }
    ],
    nextMissionId: 'load-balancer'
  },
  {
    id: 'load-balancer',
    title: 'Mission 4: High Availability with LB',
    description: 'Scale your application! Use a Global HTTP(S) Load Balancer to distribute traffic across your web servers.',
    learningResources: [
      {
        title: 'Global Load Balancing',
        content: 'Google Cloud HTTP(S) Load Balancing is a proxy-based, Layer 7 load balancer that enables you to run and scale your services behind a single external IP address.'
      }
    ],
    objectives: [
      {
        id: 'create-lb',
        task: 'Deploy an External HTTP(S) Load Balancer',
        hint: 'Drag a Load Balancer resource and ensure it targets your web servers.',
        isCompleted: false,
        validationFn: (state) => (state.loadBalancers?.length || 0) > 0
      },
      {
        id: 'enable-armor',
        task: 'Apply a Cloud Armor Security Policy',
        hint: 'Add a Cloud Armor policy and link it to your Load Balancer for DDoS protection.',
        isCompleted: false,
        validationFn: (state) => (state.cloudArmorPolicies?.length || 0) > 0
      }
    ]
  }
];
