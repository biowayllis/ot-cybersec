import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Server, Cloud, Database, Lock, AlertTriangle, Wifi, HardDrive } from "lucide-react";
import { useState } from "react";

interface Zone {
  id: string;
  name: string;
  level: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  assets: Asset[];
}

interface Asset {
  id: string;
  name: string;
  type: string;
  icon: any;
  status: "secure" | "warning" | "critical";
}

interface Connection {
  from: string;
  to: string;
  type: "firewall" | "router" | "direct";
  bidirectional: boolean;
}

const zones: Zone[] = [
  {
    id: "enterprise",
    name: "Enterprise IT",
    level: "Level 5",
    x: 50,
    y: 50,
    width: 280,
    height: 200,
    color: "hsl(var(--primary))",
    assets: [
      { id: "erp", name: "ERP System", type: "Application", icon: Server, status: "secure" },
      { id: "db", name: "Database", type: "Database", icon: Database, status: "secure" },
      { id: "ad", name: "Active Directory", type: "Auth", icon: Lock, status: "secure" },
    ]
  },
  {
    id: "dmz",
    name: "DMZ / Level 3.5",
    level: "Demilitarized",
    x: 400,
    y: 50,
    width: 280,
    height: 200,
    color: "hsl(var(--accent))",
    assets: [
      { id: "fw1", name: "Enterprise Firewall", type: "Security", icon: Shield, status: "secure" },
      { id: "ids", name: "IDS/IPS", type: "Security", icon: AlertTriangle, status: "warning" },
      { id: "proxy", name: "Data Diode", type: "Security", icon: Lock, status: "secure" },
    ]
  },
  {
    id: "scada",
    name: "SCADA / HMI",
    level: "Level 3",
    x: 50,
    y: 300,
    width: 280,
    height: 180,
    color: "hsl(var(--chart-1))",
    assets: [
      { id: "hmi1", name: "HMI Station", type: "Interface", icon: Server, status: "secure" },
      { id: "historian", name: "Historian", type: "Database", icon: Database, status: "secure" },
      { id: "eng", name: "Engineering WS", type: "Workstation", icon: HardDrive, status: "warning" },
    ]
  },
  {
    id: "control",
    name: "Control Systems",
    level: "Level 2",
    x: 400,
    y: 300,
    width: 280,
    height: 180,
    color: "hsl(var(--chart-2))",
    assets: [
      { id: "plc1", name: "PLC-01", type: "Controller", icon: HardDrive, status: "secure" },
      { id: "plc2", name: "PLC-02", type: "Controller", icon: HardDrive, status: "critical" },
      { id: "rtu1", name: "RTU-01", type: "Remote Unit", icon: Wifi, status: "secure" },
    ]
  },
  {
    id: "field",
    name: "Field Devices",
    level: "Level 1-0",
    x: 225,
    y: 530,
    width: 280,
    height: 150,
    color: "hsl(var(--chart-3))",
    assets: [
      { id: "sensor1", name: "Temp Sensors", type: "Sensor", icon: Wifi, status: "secure" },
      { id: "actuator1", name: "Actuators", type: "Actuator", icon: Wifi, status: "secure" },
      { id: "motor1", name: "Motor Controls", type: "Equipment", icon: HardDrive, status: "warning" },
    ]
  },
  {
    id: "cloud",
    name: "Cloud Services",
    level: "External",
    x: 750,
    y: 175,
    width: 200,
    height: 150,
    color: "hsl(var(--secondary))",
    assets: [
      { id: "azure", name: "Azure Cloud", type: "Cloud", icon: Cloud, status: "secure" },
      { id: "backup", name: "Cloud Backup", type: "Storage", icon: Database, status: "secure" },
    ]
  },
];

const connections: Connection[] = [
  { from: "enterprise", to: "dmz", type: "firewall", bidirectional: true },
  { from: "dmz", to: "scada", type: "firewall", bidirectional: true },
  { from: "dmz", to: "cloud", type: "firewall", bidirectional: true },
  { from: "scada", to: "control", type: "router", bidirectional: true },
  { from: "control", to: "field", type: "direct", bidirectional: true },
];

const statusColors = {
  secure: "hsl(var(--safe))",
  warning: "hsl(var(--medium))",
  critical: "hsl(var(--critical))",
};

export const NetworkTopology = () => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  const getConnectionPath = (from: string, to: string) => {
    const fromZone = zones.find(z => z.id === from);
    const toZone = zones.find(z => z.id === to);
    if (!fromZone || !toZone) return "";

    const fromX = fromZone.x + fromZone.width / 2;
    const fromY = fromZone.y + fromZone.height / 2;
    const toX = toZone.x + toZone.width / 2;
    const toY = toZone.y + toZone.height / 2;

    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;

    return `M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`;
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Network Topology</h2>
        <p className="text-sm text-muted-foreground">
          Purdue Model - IT/OT Convergence Architecture
        </p>
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        <Badge variant="outline" className="border-safe">
          <div className="w-2 h-2 rounded-full bg-safe mr-2" />
          Secure
        </Badge>
        <Badge variant="outline" className="border-medium">
          <div className="w-2 h-2 rounded-full bg-medium mr-2" />
          Warning
        </Badge>
        <Badge variant="outline" className="border-critical">
          <div className="w-2 h-2 rounded-full bg-critical mr-2" />
          Critical
        </Badge>
      </div>

      <div className="relative bg-muted/20 rounded-lg p-4 overflow-auto" style={{ minHeight: "750px" }}>
        <svg width="1000" height="750" className="absolute inset-0">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="hsl(var(--muted-foreground))"
                opacity="0.5"
              />
            </marker>
          </defs>

          {/* Connection lines */}
          <g>
            {connections.map((conn, idx) => (
              <g key={idx}>
                <path
                  d={getConnectionPath(conn.from, conn.to)}
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.3"
                  strokeDasharray={conn.type === "firewall" ? "5,5" : "none"}
                  markerEnd="url(#arrowhead)"
                />
                {conn.bidirectional && (
                  <path
                    d={getConnectionPath(conn.to, conn.from)}
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.2"
                    strokeDasharray={conn.type === "firewall" ? "5,5" : "none"}
                  />
                )}
              </g>
            ))}
          </g>
        </svg>

        {/* Zones and assets */}
        {zones.map((zone) => (
          <div
            key={zone.id}
            className={`absolute border-2 rounded-lg p-4 transition-all cursor-pointer ${
              selectedZone === zone.id ? "ring-2 ring-offset-2 shadow-lg" : ""
            }`}
            style={{
              left: zone.x,
              top: zone.y,
              width: zone.width,
              height: zone.height,
              borderColor: zone.color,
              backgroundColor: selectedZone === zone.id 
                ? `${zone.color}15` 
                : "hsl(var(--card))",
            }}
            onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
          >
            <div className="mb-3 pb-2 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{zone.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {zone.level}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              {zone.assets.map((asset) => {
                const Icon = asset.icon;
                const isHovered = hoveredAsset === asset.id;
                
                return (
                  <div
                    key={asset.id}
                    className={`flex items-center gap-2 p-2 rounded transition-all ${
                      isHovered ? "bg-accent shadow-sm scale-105" : "bg-muted/50"
                    }`}
                    onMouseEnter={() => setHoveredAsset(asset.id)}
                    onMouseLeave={() => setHoveredAsset(null)}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: statusColors[asset.status] }}
                    />
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{asset.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{asset.type}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedZone && (
        <div className="mt-4 p-4 bg-accent/50 rounded-lg">
          <h3 className="font-semibold mb-2">
            {zones.find(z => z.id === selectedZone)?.name} Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Security Level</p>
              <p className="font-medium">{zones.find(z => z.id === selectedZone)?.level}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Assets</p>
              <p className="font-medium">{zones.find(z => z.id === selectedZone)?.assets.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge variant="outline">Operational</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Segmentation</p>
              <Badge variant="outline">VLAN Isolated</Badge>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
