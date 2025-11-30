import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, AlertTriangle, CheckCircle2, XCircle, Activity } from "lucide-react";

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

interface AssetDetailModalProps {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AssetDetailModal = ({ asset, open, onOpenChange }: AssetDetailModalProps) => {
  if (!asset) return null;

  const getCriticalityColor = (criticality: string) => {
    const colors: Record<string, string> = {
      critical: "bg-critical text-critical-foreground",
      high: "bg-high text-high-foreground",
      medium: "bg-medium text-medium-foreground",
      low: "bg-safe text-safe-foreground",
    };
    return colors[criticality] || "bg-muted text-muted-foreground";
  };

  const vulnerabilityHistory = [
    { date: "2024-01-15", cve: "CVE-2024-0234", severity: "Critical", status: "Patched" },
    { date: "2024-01-10", cve: "CVE-2024-0198", severity: "High", status: "Patched" },
    { date: "2023-12-20", cve: "CVE-2023-9876", severity: "Medium", status: "Mitigated" },
    { date: "2023-12-01", cve: "CVE-2023-8765", severity: "High", status: "Patched" },
  ];

  const patchHistory = [
    { date: "2024-01-20", patch: "Security Update KB5034441", status: "Installed" },
    { date: "2024-01-15", patch: "Cumulative Update KB5034203", status: "Installed" },
    { date: "2024-01-05", patch: "Security Update KB5033920", status: "Installed" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <span>{asset.name}</span>
            </div>
            <Badge className={getCriticalityColor(asset.criticality)}>
              {asset.criticality.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
            <TabsTrigger value="patches">Patches</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Asset Properties</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Asset ID:</span>
                  <span className="ml-2 font-mono">{asset.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-2 font-medium">{asset.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <span className="ml-2">{asset.category}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <span className="ml-2">{asset.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Zone:</span>
                  <span className="ml-2">{asset.zone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="ml-2">{asset.owner}</span>
                </div>
                {asset.ip && (
                  <div>
                    <span className="text-muted-foreground">IP Address:</span>
                    <span className="ml-2 font-mono">{asset.ip}</span>
                  </div>
                )}
                {asset.os && (
                  <div>
                    <span className="text-muted-foreground">OS:</span>
                    <span className="ml-2">{asset.os}</span>
                  </div>
                )}
                {asset.manufacturer && (
                  <div>
                    <span className="text-muted-foreground">Manufacturer:</span>
                    <span className="ml-2">{asset.manufacturer}</span>
                  </div>
                )}
                {asset.model && (
                  <div>
                    <span className="text-muted-foreground">Model:</span>
                    <span className="ml-2">{asset.model}</span>
                  </div>
                )}
                {asset.lastSeen && (
                  <div>
                    <span className="text-muted-foreground">Last Seen:</span>
                    <span className="ml-2">{asset.lastSeen}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Risk Indicators</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg border border-border">
                  <div className="text-3xl font-bold text-critical mb-1">{asset.vulnScore}</div>
                  <div className="text-xs text-muted-foreground">Vulnerability Score</div>
                </div>
                <div className="text-center p-4 rounded-lg border border-border">
                  <div className="text-3xl font-bold text-safe mb-1">{asset.patchLevel}%</div>
                  <div className="text-xs text-muted-foreground">Patch Compliance</div>
                </div>
                <div className="text-center p-4 rounded-lg border border-border">
                  <div className="text-3xl font-bold text-primary mb-1">{asset.compliance.length}</div>
                  <div className="text-xs text-muted-foreground">Frameworks Mapped</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vulnerabilities" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Vulnerability History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {vulnerabilityHistory.map((vuln, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-semibold">{vuln.cve}</span>
                        <Badge className={
                          vuln.severity === "Critical" ? "bg-critical text-critical-foreground" :
                          vuln.severity === "High" ? "bg-high text-high-foreground" :
                          "bg-medium text-medium-foreground"
                        }>
                          {vuln.severity}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{vuln.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {vuln.status === "Patched" ? (
                        <CheckCircle2 className="h-4 w-4 text-safe" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-medium" />
                      )}
                      <span className="text-sm">{vuln.status}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patches" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Patch History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {patchHistory.map((patch, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-1">{patch.patch}</div>
                      <div className="text-xs text-muted-foreground">{patch.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-safe" />
                      <span className="text-sm text-safe">{patch.status}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Compliance Framework Mappings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {asset.compliance.map((framework, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{framework}</span>
                      <Badge className="bg-safe text-safe-foreground">Compliant</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      All required controls and documentation verified
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};