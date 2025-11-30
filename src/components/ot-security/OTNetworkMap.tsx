import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const OTNetworkMap = () => {
  const zones = [
    {
      name: "Production Zone A",
      conduits: 3,
      assets: 342,
      security: "high",
      vlans: ["VLAN-100", "VLAN-101"],
    },
    {
      name: "Production Zone B",
      conduits: 2,
      assets: 287,
      security: "high",
      vlans: ["VLAN-102", "VLAN-103"],
    },
    {
      name: "Utility Systems",
      conduits: 2,
      assets: 156,
      security: "medium",
      vlans: ["VLAN-110"],
    },
    {
      name: "Safety Systems",
      conduits: 1,
      assets: 89,
      security: "critical",
      vlans: ["VLAN-120"],
    },
  ];

  const securityLevelConfig: Record<string, { color: string; bgClass: string }> = {
    critical: { color: "text-critical", bgClass: "bg-critical/10 border-critical/30" },
    high: { color: "text-safe", bgClass: "bg-safe/10 border-safe/30" },
    medium: { color: "text-medium", bgClass: "bg-medium/10 border-medium/30" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          OT Network Map - Zones & Conduits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {zones.map((zone) => {
            const config = securityLevelConfig[zone.security];
            return (
              <div
                key={zone.name}
                className={`p-4 rounded-lg border-2 ${config.bgClass} hover:shadow-md transition-all cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-lg">{zone.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {zone.assets} Assets
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {zone.conduits} Conduits
                      </span>
                    </div>
                  </div>
                  <Badge className={`${config.color} border-current`} variant="outline">
                    <Shield className="h-3 w-3 mr-1" />
                    {zone.security.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {zone.vlans.map((vlan) => (
                    <span
                      key={vlan}
                      className="text-xs px-2 py-1 rounded bg-background border border-border"
                    >
                      {vlan}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="pt-4 border-t border-border">
            <div className="text-sm font-medium mb-3">Network Segmentation Status</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-muted/30 rounded">
                <div className="text-lg font-bold text-safe">8</div>
                <div className="text-xs text-muted-foreground">Firewalls</div>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded">
                <div className="text-lg font-bold text-primary">12</div>
                <div className="text-xs text-muted-foreground">VLANs</div>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded">
                <div className="text-lg font-bold text-medium">3</div>
                <div className="text-xs text-muted-foreground">Data Diodes</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
