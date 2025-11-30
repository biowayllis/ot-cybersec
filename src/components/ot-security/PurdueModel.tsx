import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const PurdueModel = () => {
  const layers = [
    {
      level: "L3",
      name: "Site Operations",
      description: "MES, Historians, Engineering Workstations",
      assets: 47,
      alerts: 2,
      status: "safe",
    },
    {
      level: "L2",
      name: "Supervisory Control",
      description: "SCADA, HMI Servers",
      assets: 23,
      alerts: 1,
      status: "safe",
    },
    {
      level: "L1",
      name: "Basic Control",
      description: "PLC, DCS, RTU",
      assets: 189,
      alerts: 5,
      status: "medium",
    },
    {
      level: "L0",
      name: "Process",
      description: "Sensors, Actuators, Field Devices",
      assets: 847,
      alerts: 3,
      status: "safe",
    },
  ];

  const dmz = {
    name: "DMZ",
    description: "Demilitarized Zone - Data Diodes, Jump Hosts",
    assets: 12,
    alerts: 0,
    status: "safe",
  };

  const statusColors: Record<string, string> = {
    safe: "bg-safe/20 border-safe",
    medium: "bg-medium/20 border-medium",
    critical: "bg-critical/20 border-critical",
  };

  const statusTextColors: Record<string, string> = {
    safe: "text-safe",
    medium: "text-medium",
    critical: "text-critical",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Purdue Model - ICS Network Architecture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Enterprise Zone (implied above L3) */}
          <div className="text-center text-xs text-muted-foreground py-2 border-b border-dashed border-border">
            ↑ Enterprise Zone (Corporate IT Network) ↑
          </div>

          {/* DMZ */}
          <div
            className={`p-4 rounded-lg border-2 ${statusColors[dmz.status]} hover:shadow-lg transition-all cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-bold text-lg text-primary">{dmz.name}</div>
                <div className="text-xs text-muted-foreground">{dmz.description}</div>
              </div>
              <Badge className="bg-primary text-primary-foreground">
                {dmz.assets} Assets
              </Badge>
            </div>
            {dmz.alerts > 0 && (
              <div className="flex items-center gap-1 text-xs text-critical mt-2">
                <AlertCircle className="h-3 w-3" />
                <span>{dmz.alerts} Active Alerts</span>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-muted-foreground py-1">
            ↕ Firewall / Industrial DMZ ↕
          </div>

          {/* Purdue Levels */}
          {layers.map((layer, index) => (
            <div key={layer.level}>
              <div
                className={`p-4 rounded-lg border-2 ${statusColors[layer.status]} hover:shadow-lg transition-all cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-primary">{layer.level}</span>
                      <span className="font-semibold">{layer.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{layer.description}</div>
                  </div>
                  <Badge className={statusTextColors[layer.status]}>
                    {layer.assets} Assets
                  </Badge>
                </div>
                {layer.alerts > 0 && (
                  <div className="flex items-center gap-1 text-xs text-critical mt-2">
                    <AlertCircle className="h-3 w-3" />
                    <span>{layer.alerts} Active Alerts</span>
                  </div>
                )}
              </div>

              {index < layers.length - 1 && (
                <div className="text-center text-xs text-muted-foreground py-1">↕</div>
              )}
            </div>
          ))}

          <div className="text-center text-xs text-muted-foreground py-2 border-t border-dashed border-border mt-3">
            ↓ Physical Process ↓
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
