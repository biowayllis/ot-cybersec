import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Monitor, User, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const XDRAlerts = () => {
  const endpointAlerts = [
    {
      id: 1,
      device: "WKSTN-2847",
      alert: "Suspicious File Execution",
      severity: "high",
      user: "jdoe@icscore.com",
      time: "8 min ago",
    },
    {
      id: 2,
      device: "LAPTOP-1432",
      alert: "Ransomware Behavior Detected",
      severity: "critical",
      user: "asmith@icscore.com",
      time: "14 min ago",
    },
    {
      id: 3,
      device: "WKSTN-3291",
      alert: "Unauthorized USB Device",
      severity: "medium",
      user: "mjohnson@icscore.com",
      time: "22 min ago",
    },
  ];

  const identityAlerts = [
    {
      id: 1,
      user: "admin@icscore.com",
      alert: "Multiple Failed MFA Attempts",
      severity: "critical",
      location: "Unknown Location",
      time: "3 min ago",
    },
    {
      id: 2,
      user: "service_account",
      alert: "Unusual Access Pattern",
      severity: "high",
      location: "Cloud Console",
      time: "16 min ago",
    },
    {
      id: 3,
      user: "contractor@external.com",
      alert: "Access Outside Business Hours",
      severity: "medium",
      location: "VPN Gateway",
      time: "28 min ago",
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
          <Shield className="h-5 w-5 text-primary" />
          XDR Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="endpoint" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="endpoint" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Endpoint
            </TabsTrigger>
            <TabsTrigger value="identity" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Identity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="endpoint" className="space-y-3 mt-4">
            {endpointAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">{alert.alert}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Monitor className="h-3 w-3" />
                      <span>{alert.device}</span>
                      <span>•</span>
                      <span>{alert.user}</span>
                    </div>
                  </div>
                  <Badge className={severityColors[alert.severity]}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">{alert.time}</div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="identity" className="space-y-3 mt-4">
            {identityAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">{alert.alert}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{alert.user}</span>
                      <span>•</span>
                      <span>{alert.location}</span>
                    </div>
                  </div>
                  <Badge className={severityColors[alert.severity]}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">{alert.time}</div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
