import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Server, Cloud, HardDrive } from "lucide-react";
import { AssetFilters } from "@/components/assets/AssetFilters";
import { AssetTable } from "@/components/assets/AssetTable";
import { AssetDetailModal } from "@/components/assets/AssetDetailModal";

interface Asset {
  id: string;
  name: string;
  type: string;
  category: string;
  location: string;
  zone: string;
  owner: string;
  criticality: string;
  vulnScore: number;
  patchLevel: number;
  compliance: string[];
  ip?: string;
  os?: string;
  lastSeen?: string;
  manufacturer?: string;
  model?: string;
}

const Assets = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    location: "all",
    zone: "all",
    owner: "all",
    criticality: "all",
  });

  // Mock data - comprehensive IT + OT assets
  const allAssets: Asset[] = [
    // IT Assets
    { id: "IT-SRV-001", name: "Exchange Server Primary", type: "Server", category: "Email Infrastructure", location: "Datacenter 1", zone: "Enterprise", owner: "IT Operations", criticality: "high", vulnScore: 7.2, patchLevel: 95, compliance: ["NIST", "ISO 27001", "SOC 2"], ip: "10.1.1.100", os: "Windows Server 2022", lastSeen: "2024-01-25 14:30" },
    { id: "IT-SRV-002", name: "SQL Database Cluster", type: "Server", category: "Database", location: "Datacenter 1", zone: "Enterprise", owner: "IT Operations", criticality: "critical", vulnScore: 8.9, patchLevel: 88, compliance: ["NIST", "ISO 27001", "PCI-DSS"], ip: "10.1.1.110", os: "Windows Server 2022", lastSeen: "2024-01-25 14:32" },
    { id: "IT-END-001", name: "Executive Laptop - CEO", type: "Endpoint", category: "Workstation", location: "Datacenter 1", zone: "Enterprise", owner: "IT Operations", criticality: "high", vulnScore: 4.5, patchLevel: 98, compliance: ["NIST", "ISO 27001"], ip: "10.1.2.45", os: "Windows 11 Pro", lastSeen: "2024-01-25 14:15" },
    { id: "IT-END-002", name: "Engineering Workstation Pool", type: "Endpoint", category: "Workstation Group", location: "Datacenter 1", zone: "Enterprise", owner: "Engineering", criticality: "medium", vulnScore: 5.1, patchLevel: 92, compliance: ["NIST", "ISO 27001"], lastSeen: "2024-01-25 14:20" },
    { id: "IT-CLD-001", name: "AWS EC2 Production Cluster", type: "Cloud", category: "Virtual Machines", location: "Cloud", zone: "Cloud", owner: "IT Operations", criticality: "critical", vulnScore: 6.3, patchLevel: 94, compliance: ["NIST", "ISO 27001", "SOC 2"], lastSeen: "2024-01-25 14:35" },
    { id: "IT-CLD-002", name: "Azure Storage Account", type: "Cloud", category: "Storage", location: "Cloud", zone: "Cloud", owner: "IT Operations", criticality: "high", vulnScore: 3.2, patchLevel: 100, compliance: ["NIST", "ISO 27001", "HIPAA"], lastSeen: "2024-01-25 14:33" },
    { id: "IT-NET-001", name: "Core Switch Stack", type: "Network Device", category: "Switch", location: "Datacenter 1", zone: "Enterprise", owner: "IT Operations", criticality: "critical", vulnScore: 7.8, patchLevel: 90, compliance: ["NIST", "ISO 27001"], ip: "10.1.0.1", lastSeen: "2024-01-25 14:35" },
    { id: "IT-NET-002", name: "Perimeter Firewall Cluster", type: "Network Device", category: "Firewall", location: "Datacenter 1", zone: "DMZ", owner: "Security Team", criticality: "critical", vulnScore: 8.1, patchLevel: 96, compliance: ["NIST", "ISO 27001", "PCI-DSS"], ip: "10.1.0.10", lastSeen: "2024-01-25 14:35" },
    
    // OT Assets
    { id: "OT-PLC-001", name: "Siemens S7-1500 PLC Line 1", type: "PLC", category: "Control System", location: "Plant Floor", zone: "Process Control", owner: "OT Operations", criticality: "critical", vulnScore: 9.2, patchLevel: 75, compliance: ["NERC CIP", "IEC 62443"], manufacturer: "Siemens", model: "S7-1500", ip: "192.168.100.10", lastSeen: "2024-01-25 14:30" },
    { id: "OT-PLC-002", name: "Allen-Bradley ControlLogix", type: "PLC", category: "Control System", location: "Plant Floor", zone: "Process Control", owner: "OT Operations", criticality: "critical", vulnScore: 8.7, patchLevel: 80, compliance: ["NERC CIP", "IEC 62443"], manufacturer: "Rockwell", model: "ControlLogix 5580", ip: "192.168.100.20", lastSeen: "2024-01-25 14:31" },
    { id: "OT-HMI-001", name: "SCADA HMI Station 1", type: "HMI", category: "Human Interface", location: "Control Room", zone: "SCADA", owner: "OT Operations", criticality: "high", vulnScore: 7.5, patchLevel: 85, compliance: ["NERC CIP", "IEC 62443"], ip: "192.168.50.100", os: "Windows 10 IoT LTSC", lastSeen: "2024-01-25 14:32" },
    { id: "OT-HMI-002", name: "SCADA HMI Station 2", type: "HMI", category: "Human Interface", location: "Control Room", zone: "SCADA", owner: "OT Operations", criticality: "high", vulnScore: 7.5, patchLevel: 85, compliance: ["NERC CIP", "IEC 62443"], ip: "192.168.50.101", os: "Windows 10 IoT LTSC", lastSeen: "2024-01-25 14:32" },
    { id: "OT-RTU-001", name: "Remote Terminal Unit - North", type: "RTU", category: "Remote Control", location: "Remote Sites", zone: "Control Systems", owner: "OT Operations", criticality: "critical", vulnScore: 8.3, patchLevel: 78, compliance: ["NERC CIP", "IEC 62443"], manufacturer: "Schneider Electric", model: "RTU-500", ip: "192.168.200.10", lastSeen: "2024-01-25 14:28" },
    { id: "OT-RTU-002", name: "Remote Terminal Unit - South", type: "RTU", category: "Remote Control", location: "Remote Sites", zone: "Control Systems", owner: "OT Operations", criticality: "critical", vulnScore: 8.3, patchLevel: 78, compliance: ["NERC CIP", "IEC 62443"], manufacturer: "Schneider Electric", model: "RTU-500", ip: "192.168.200.20", lastSeen: "2024-01-25 14:29" },
    { id: "OT-SRV-001", name: "SCADA Historian Server", type: "SCADA Server", category: "Data Historian", location: "Control Room", zone: "SCADA", owner: "OT Operations", criticality: "high", vulnScore: 6.8, patchLevel: 88, compliance: ["NERC CIP", "IEC 62443"], ip: "192.168.50.50", os: "Windows Server 2019", lastSeen: "2024-01-25 14:33" },
    { id: "OT-SRV-002", name: "OPC UA Gateway Server", type: "Gateway", category: "Protocol Converter", location: "Control Room", zone: "DMZ", owner: "OT Operations", criticality: "high", vulnScore: 7.1, patchLevel: 92, compliance: ["NERC CIP", "IEC 62443"], ip: "192.168.10.100", lastSeen: "2024-01-25 14:34" },
    { id: "OT-SIS-001", name: "Safety Instrumented System", type: "Safety System", category: "Emergency Shutdown", location: "Plant Floor", zone: "Safety Systems", owner: "Engineering", criticality: "critical", vulnScore: 5.2, patchLevel: 100, compliance: ["IEC 61511", "NERC CIP"], manufacturer: "Honeywell", model: "FSC SafetyManager", lastSeen: "2024-01-25 14:35" },
  ];

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    setFilters({
      type: "all",
      location: "all",
      zone: "all",
      owner: "all",
      criticality: "all",
    });
  };

  const filteredAssets = useMemo(() => {
    return allAssets.filter((asset) => {
      if (filters.type !== "all") {
        if (filters.type === "it" && !asset.id.startsWith("IT-")) return false;
        if (filters.type === "ot" && !asset.id.startsWith("OT-")) return false;
        if (filters.type === "critical" && asset.criticality !== "critical") return false;
        if (filters.type === "cloud" && asset.type !== "Cloud") return false;
        if (filters.type === "hardware" && !["Server", "Endpoint", "Network Device", "PLC", "RTU", "HMI", "SCADA Server", "Gateway", "Safety System"].includes(asset.type)) return false;
        if (filters.type === "software" && asset.category !== "Software") return false;
      }
      if (filters.location !== "all" && asset.location.toLowerCase().replace(/\s+/g, "-") !== filters.location) return false;
      if (filters.zone !== "all" && asset.zone.toLowerCase().replace(/\s+/g, "-") !== filters.zone) return false;
      if (filters.owner !== "all" && asset.owner.toLowerCase().replace(/\s+/g, "-") !== filters.owner) return false;
      if (filters.criticality !== "all" && asset.criticality !== filters.criticality) return false;
      return true;
    });
  }, [filters]);

  const activeFilterCount = Object.values(filters).filter(v => v !== "all").length;

  const stats = useMemo(() => {
    const itAssets = allAssets.filter(a => a.id.startsWith("IT-")).length;
    const otAssets = allAssets.filter(a => a.id.startsWith("OT-")).length;
    const criticalAssets = allAssets.filter(a => a.criticality === "critical").length;
    const avgVulnScore = (allAssets.reduce((sum, a) => sum + a.vulnScore, 0) / allAssets.length).toFixed(1);

    return [
      { label: "Total Assets", count: allAssets.length, icon: Database, color: "text-primary" },
      { label: "IT Assets", count: itAssets, icon: Server, color: "text-primary" },
      { label: "OT Assets", count: otAssets, icon: HardDrive, color: "text-high" },
      { label: "Critical Assets", count: criticalAssets, icon: Cloud, color: "text-critical" },
    ];
  }, []);

  const handleViewDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Unified Asset Management</h1>
          <p className="text-muted-foreground">
            Comprehensive IT + OT asset inventory with risk scoring and compliance tracking
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <stat.icon className="h-4 w-4" />
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.color}`}>
                  {stat.count}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <AssetFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredAssets.length}</span> of{" "}
            <span className="font-semibold text-foreground">{allAssets.length}</span> assets
          </p>
        </div>

        {/* Asset Table */}
        <AssetTable assets={filteredAssets} onViewDetails={handleViewDetails} />

        {/* Asset Detail Modal */}
        <AssetDetailModal
          asset={selectedAsset}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </div>
    </div>
  );
};

export default Assets;
