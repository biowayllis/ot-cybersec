import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ICSNDRAlerts = () => {
  const alerts = [
    {
      id: 1,
      title: "Unauthorized Modbus Communication",
      severity: "critical",
      zone: "Production Zone A",
      sourceIP: "192.168.100.47",
      destIP: "192.168.100.23",
      protocol: "Modbus TCP",
      timestamp: "4 min ago",
    },
    {
      id: 2,
      title: "PLC Firmware Change Detected",
      severity: "high",
      zone: "Production Zone B",
      sourceIP: "192.168.102.15",
      destIP: "192.168.102.89",
      protocol: "S7Comm",
      timestamp: "18 min ago",
    },
    {
      id: 3,
      title: "Abnormal DNP3 Traffic Pattern",
      severity: "medium",
      zone: "Utility Systems",
      sourceIP: "192.168.110.34",
      destIP: "192.168.110.12",
      protocol: "DNP3",
      timestamp: "27 min ago",
    },
    {
      id: 4,
      title: "Unknown Device on OT Network",
      severity: "high",
      zone: "Production Zone A",
      sourceIP: "192.168.100.254",
      destIP: "Broadcast",
      protocol: "ARP",
      timestamp: "35 min ago",
    },
  ];

  const severityColors: Record<string, string> = {
    critical: "bg-critical text-critical-foreground",
    high: "bg-high text-high-foreground",
    medium: "bg-medium text-medium-foreground",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-high" />
          ICS NDR Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-high shrink-0" />
                  <span className="font-medium">{alert.title}</span>
                </div>
                <Badge className={severityColors[alert.severity]}>
                  {alert.severity.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div>
                  <span className="text-muted-foreground">Zone: </span>
                  <span className="text-foreground">{alert.zone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Protocol: </span>
                  <span className="text-foreground">{alert.protocol}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Source: </span>
                  <span className="font-mono text-foreground">{alert.sourceIP}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Dest: </span>
                  <span className="font-mono text-foreground">{alert.destIP}</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">{alert.timestamp}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-critical/5 rounded border border-critical/20">
              <div className="text-lg font-bold text-critical">3</div>
              <div className="text-muted-foreground">Critical</div>
            </div>
            <div className="text-center p-2 bg-high/5 rounded border border-high/20">
              <div className="text-lg font-bold text-high">8</div>
              <div className="text-muted-foreground">High</div>
            </div>
            <div className="text-center p-2 bg-medium/5 rounded border border-medium/20">
              <div className="text-lg font-bold text-medium">14</div>
              <div className="text-muted-foreground">Medium</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
