import type { NetworkState } from '../types/network';

export const generateGcloudCommands = (state: NetworkState): string[] => {
  const commands: string[] = [];

  // VPCs
  state.vpcs.forEach(vpc => {
    commands.push(`# Create VPC network`);
    commands.push(`gcloud compute networks create ${vpc.name} --subnet-mode=custom`);
  });

  // Subnets
  state.subnets.forEach(subnet => {
    commands.push(`# Create subnet`);
    commands.push(`gcloud compute networks subnets create ${subnet.name} \\
    --network=${state.vpcs.find(v => v.id === subnet.vpcId)?.name} \\
    --region=${subnet.region} \\
    --range=${subnet.cidr}`);
  });

  // Instances
  state.instances.forEach(instance => {
    const subnet = state.subnets.find(s => s.id === instance.subnetId);
    commands.push(`# Create VM instance`);
    commands.push(`gcloud compute instances create ${instance.name} \\
    --subnet=${subnet?.name} \\
    --tags=${instance.tags.join(',')} \\
    --zone=${subnet?.region}-a`);
  });

  // Firewall Rules
  state.vpcs.forEach(vpc => {
    vpc.firewallRules.forEach(rule => {
      commands.push(`# Create firewall rule`);
      commands.push(`gcloud compute firewall-rules create ${rule.name} \\
    --network=${vpc.name} \\
    --direction=${rule.direction} \\
    --priority=${rule.priority} \\
    --action=${rule.action} \\
    --rules=${rule.protocol}:${rule.ports.join(',')} \\
    --target-tags=${rule.targetTags.join(',')}`);
    });
  });

  return commands;
};
