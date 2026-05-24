# GCLOUDnet Simulator v2.0

GCLOUDnet is a high-interactivity Google Cloud networking simulator inspired by Cisco Packet Tracer. It is designed to help engineers and students learn GCP networking through active building and step-by-step traffic simulation.

## 🚀 Quick Start Guide

### 1. The Workbench
- **Top Toolbar:** Switch between **Select** (default), **Wire** (connect nodes), **Delete** (trash tool), and **Note** (add annotations).
- **Left Sidebar:** Drag-and-drop GCP resources (Compute Instances, Load Balancers, VPN Gateways, etc.).
- **Right Panel:** Switches between the **Smart Lab Assistant** (topological insights) and the **Property Inspector** (resource configuration).

### 2. Building Your Topology
- **Provisioning:** Click **"Provision VPC"** in the top-left of the canvas to create a new global network.
- **Nesting:** Drag a **Subnet** onto a VPC, then drag a **Compute Instance** onto that Subnet. The nodes will automatically nest and stay grouped.
- **Wiring:** Select the **Wire Tool** (or press 'W') and click-and-drag between resource interfaces to define network paths.

### 3. Editing & Deleting
- **Configuration:** Click on any node to open its configuration in the Right Panel. You can edit Names, CIDR ranges, and Firewall Rules.
- **Deletion:** Select a resource and press the **Delete** or **Backspace** key. Alternatively, select the **Delete Tool** (Trash icon) and click on any node or wire to remove it.
- **Alignment:** All resources snap to a 15px grid for clean, professional designs.

### 4. Simulating Traffic
- **Setup:** Use the **Traffic Analysis** panel (top-right).
- **Injection:** Select a **Source Instance** and a **Destination Node**.
- **Execution:** Click **"Inject Packet"**.
- **Analysis:** 
  - Watch the **animated packet** travel across your edges.
  - Read the **GCLOUDnet Engine Console** (bottom) for a step-by-step logic breakdown (Firewall matches, routing decisions, etc.).

### 5. Learning Mode
- **Academy Mode:** Toggle "Academy" in the header to receive proactive tips and "Smart Assistant" warnings about common GCP misconfigurations (e.g., insecure SSH rules).

## 🛠 Tech Stack
- **Framework:** React + TypeScript + Vite
- **Canvas:** React Flow (XYFlow)
- **Styling:** Tailwind CSS + Glassmorphism
- **Icons:** Lucide React
