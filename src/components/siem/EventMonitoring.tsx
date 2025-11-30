import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface SecurityEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  source: string;
  description: string;
  status: 'new' | 'investigating' | 'resolved';
}

const mockEvents: SecurityEvent[] = [
  {
    id: "evt_001",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    type: "Suspicious Login",
    severity: "critical",
    source: "Azure AD",
    description: "Multiple failed login attempts from unknown IP",
    status: "investigating"
  },
  {
    id: "evt_002",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    type: "Malware Detection",
    severity: "high",
    source: "EDR - Workstation-045",
    description: "Suspicious PowerShell execution detected",
    status: "new"
  },
  {
    id: "evt_003",
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    type: "Data Exfiltration",
    severity: "critical",
    source: "DLP - Cloud Storage",
    description: "Large file transfer to external location",
    status: "investigating"
  },
  {
    id: "evt_004",
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    type: "Policy Violation",
    severity: "medium",
    source: "Firewall - DMZ",
    description: "Unauthorized port access attempt",
    status: "resolved"
  },
  {
    id: "evt_005",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    type: "Privilege Escalation",
    severity: "high",
    source: "AD - Domain Controller",
    description: "Unusual admin account creation",
    status: "new"
  },
  {
    id: "evt_006",
    timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
    type: "Network Anomaly",
    severity: "medium",
    source: "IDS - OT Network",
    description: "Unexpected traffic pattern detected",
    status: "investigating"
  }
];

const severityConfig = {
  critical: { color: "critical", icon: AlertCircle },
  high: { color: "high", icon: AlertCircle },
  medium: { color: "medium", icon: Activity },
  low: { color: "low", icon: Activity },
  info: { color: "muted", icon: CheckCircle }
};

const statusConfig = {
  new: { label: "New", class: "bg-critical/10 text-critical border-critical/20" },
  investigating: { label: "Investigating", class: "bg-medium/10 text-medium border-medium/20" },
  resolved: { label: "Resolved", class: "bg-low/10 text-low border-low/20" }
};

export const EventMonitoring = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Real-Time Event Stream
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {mockEvents.map((event) => {
              const SeverityIcon = severityConfig[event.severity].icon;
              const statusStyle = statusConfig[event.status];
              
              return (
                <div
                  key={event.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <SeverityIcon className={`h-5 w-5 mt-0.5 text-${severityConfig[event.severity].color}`} />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{event.type}</h4>
                          <Badge variant="outline" className={`text-xs ${statusStyle.class}`}>
                            {statusStyle.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                          <span>Source: {event.source}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-${severityConfig[event.severity].color} border-current`}>
                      {event.severity.toUpperCase()}
                    </Badge>
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
