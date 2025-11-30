import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const activeAlerts = [
  {
    id: 1,
    title: "Critical Vulnerability Detected",
    severity: "critical",
    source: "IT Security",
    timestamp: "2 minutes ago",
    status: "active",
    description: "CVE-2024-1234 detected on production servers",
    escalated: true,
  },
  {
    id: 2,
    title: "Unauthorized Access Attempt",
    severity: "high",
    source: "SIEM",
    timestamp: "15 minutes ago",
    status: "acknowledged",
    description: "Multiple failed login attempts from IP 192.168.1.100",
    escalated: false,
  },
  {
    id: 3,
    title: "ICS Protocol Anomaly",
    severity: "high",
    source: "OT Security",
    timestamp: "1 hour ago",
    status: "investigating",
    description: "Unusual Modbus traffic detected in Zone 2",
    escalated: true,
  },
  {
    id: 4,
    title: "Compliance Violation",
    severity: "medium",
    source: "GRC",
    timestamp: "3 hours ago",
    status: "active",
    description: "Missing patches detected on 12 devices",
    escalated: false,
  },
];

const severityConfig = {
  critical: { color: "bg-destructive text-destructive-foreground", icon: XCircle },
  high: { color: "bg-orange-500 text-white", icon: AlertTriangle },
  medium: { color: "bg-yellow-500 text-white", icon: AlertTriangle },
  low: { color: "bg-blue-500 text-white", icon: Bell },
};

const statusConfig = {
  active: { label: "Active", color: "bg-destructive" },
  acknowledged: { label: "Acknowledged", color: "bg-yellow-500" },
  investigating: { label: "Investigating", color: "bg-blue-500" },
  resolved: { label: "Resolved", color: "bg-green-500" },
};

export const AlertCenter = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Active Alerts
            </CardTitle>
            <CardDescription>Real-time security and compliance alerts</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Acknowledge All
            </Button>
            <Button variant="outline" size="sm">
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activeAlerts.map((alert) => {
              const SeverityIcon = severityConfig[alert.severity as keyof typeof severityConfig].icon;
              const severityColor = severityConfig[alert.severity as keyof typeof severityConfig].color;
              const statusColor = statusConfig[alert.status as keyof typeof statusConfig].color;
              const statusLabel = statusConfig[alert.status as keyof typeof statusConfig].label;

              return (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${severityColor}`}>
                    <SeverityIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{alert.title}</h4>
                          {alert.escalated && (
                            <Badge variant="destructive" className="text-xs">
                              Escalated
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {alert.description}
                        </p>
                      </div>
                      <Badge className={`${statusColor} text-white`}>
                        {statusLabel}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.timestamp}
                        </span>
                        <span>Source: {alert.source}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Acknowledge
                        </Button>
                        <Button size="sm" variant="outline">
                          Escalate
                        </Button>
                        <Button size="sm" variant="outline">
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
