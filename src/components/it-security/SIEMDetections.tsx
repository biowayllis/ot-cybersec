import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const SIEMDetections = () => {
  const detections = [
    {
      id: 1,
      title: "Brute Force Attack Detected",
      severity: "critical",
      source: "Active Directory",
      timestamp: "5 min ago",
      count: 47,
    },
    {
      id: 2,
      title: "Unusual Login Location",
      severity: "high",
      source: "Azure AD",
      timestamp: "12 min ago",
      count: 3,
    },
    {
      id: 3,
      title: "Privilege Escalation Attempt",
      severity: "high",
      source: "Windows Security",
      timestamp: "18 min ago",
      count: 1,
    },
    {
      id: 4,
      title: "Malware Signature Detected",
      severity: "critical",
      source: "Endpoint Protection",
      timestamp: "24 min ago",
      count: 2,
    },
    {
      id: 5,
      title: "Suspicious PowerShell Activity",
      severity: "medium",
      source: "EDR",
      timestamp: "31 min ago",
      count: 8,
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-high" />
            SIEM Detections (IT Pipeline)
          </CardTitle>
          <Badge variant="outline" className="text-high border-high">
            <TrendingUp className="h-3 w-3 mr-1" />
            +23% Today
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {detections.map((detection) => (
            <div
              key={detection.id}
              className="p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{detection.title}</span>
                    <Badge className="text-xs px-1.5 py-0">×{detection.count}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{detection.source}</span>
                    <span>•</span>
                    <span>{detection.timestamp}</span>
                  </div>
                </div>
                <Badge className={severityColors[detection.severity]}>
                  {detection.severity.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
