import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, Cpu, Monitor, Server } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const OTAssetBreakdown = () => {
  const assetTypes = [
    {
      type: "PLC",
      name: "Programmable Logic Controllers",
      count: 189,
      icon: Cpu,
      color: "text-primary",
      vendors: ["Siemens", "Allen-Bradley", "Schneider"],
      percentage: 42,
    },
    {
      type: "RTU",
      name: "Remote Terminal Units",
      count: 87,
      icon: Factory,
      color: "text-safe",
      vendors: ["ABB", "Schneider", "Siemens"],
      percentage: 19,
    },
    {
      type: "HMI",
      name: "Human-Machine Interfaces",
      count: 134,
      icon: Monitor,
      color: "text-medium",
      vendors: ["Wonderware", "Ignition", "WinCC"],
      percentage: 30,
    },
    {
      type: "SCADA",
      name: "SCADA Servers & Historians",
      count: 41,
      icon: Server,
      color: "text-high",
      vendors: ["OSIsoft PI", "GE iFIX", "Citect"],
      percentage: 9,
    },
  ];

  const total = assetTypes.reduce((sum, asset) => sum + asset.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Factory className="h-5 w-5 text-primary" />
            OT Assets by Type
          </div>
          <div className="text-sm font-normal text-muted-foreground">
            Total: <span className="text-foreground font-semibold">{total}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {assetTypes.map((asset) => (
          <div key={asset.type} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${asset.color}`}>
                  <asset.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{asset.type}</div>
                  <div className="text-xs text-muted-foreground">{asset.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{asset.count}</div>
                <div className="text-xs text-muted-foreground">{asset.percentage}%</div>
              </div>
            </div>

            <Progress value={asset.percentage} className="h-2" />

            <div className="flex flex-wrap gap-1">
              {asset.vendors.map((vendor) => (
                <span
                  key={vendor}
                  className="text-xs px-2 py-1 rounded bg-muted/50 text-muted-foreground"
                >
                  {vendor}
                </span>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-sm text-muted-foreground mb-1">Critical Assets</div>
              <div className="text-2xl font-bold text-primary">284</div>
            </div>
            <div className="text-center p-3 bg-safe/5 rounded-lg border border-safe/20">
              <div className="text-sm text-muted-foreground mb-1">Active Devices</div>
              <div className="text-2xl font-bold text-safe">{total}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
