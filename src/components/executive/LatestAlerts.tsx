import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const LatestAlerts = () => {
  const alerts = [
    {
      id: 1,
      title: "Suspicious Network Traffic Detected",
      severity: "critical",
      source: "XDR - Network",
      time: "2 min ago",
    },
    {
      id: 2,
      title: "Unauthorized OT Access Attempt",
      severity: "high",
      source: "ICS Monitor",
      time: "15 min ago",
    },
    {
      id: 3,
      title: "Failed Authentication - Multiple Users",
      severity: "high",
      source: "SIEM",
      time: "32 min ago",
    },
    {
      id: 4,
      title: "Patch Compliance Deviation",
      severity: "medium",
      source: "Patch Management",
      time: "1 hour ago",
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
          <AlertTriangle className="h-5 w-5 text-high" />
          Latest SIEM/XDR Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-sm font-medium">{alert.title}</span>
                <Badge className={severityColors[alert.severity]}>
                  {alert.severity.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{alert.source}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {alert.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
