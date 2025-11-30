import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardList, User, FileText, Shield, AlertTriangle } from "lucide-react";

export const AuditTrail = () => {
  const auditEvents = [
    {
      id: 1,
      timestamp: "2024-01-15 14:23:45",
      user: "admin@company.com",
      action: "Control Assessment Completed",
      target: "NIST 800-53 AC-1",
      status: "passed",
      details: "Access Control Policy review completed successfully",
      icon: FileText,
    },
    {
      id: 2,
      timestamp: "2024-01-15 13:15:22",
      user: "auditor@company.com",
      action: "Framework Mapping Updated",
      target: "IEC 62443",
      status: "modified",
      details: "Added 12 new control mappings to existing policies",
      icon: Shield,
    },
    {
      id: 3,
      timestamp: "2024-01-15 11:47:18",
      user: "security.team@company.com",
      action: "Gap Identified",
      target: "NIST 800-53 IR-4",
      status: "failed",
      details: "Incident response procedures require documentation update",
      icon: AlertTriangle,
    },
    {
      id: 4,
      timestamp: "2024-01-15 10:32:09",
      user: "compliance@company.com",
      action: "Audit Report Generated",
      target: "ISO 27001 Q1 2024",
      status: "completed",
      details: "Quarterly compliance report generated and distributed",
      icon: ClipboardList,
    },
    {
      id: 5,
      timestamp: "2024-01-15 09:18:33",
      user: "admin@company.com",
      action: "Control Effectiveness Updated",
      target: "TSA Pipeline SC-7",
      status: "modified",
      details: "Effectiveness score updated from 68% to 72%",
      icon: FileText,
    },
    {
      id: 6,
      timestamp: "2024-01-14 16:45:12",
      user: "security.team@company.com",
      action: "Evidence Uploaded",
      target: "NIST CSF - Protect",
      status: "completed",
      details: "Network segmentation documentation uploaded for review",
      icon: Shield,
    },
    {
      id: 7,
      timestamp: "2024-01-14 15:22:47",
      user: "auditor@company.com",
      action: "Control Test Scheduled",
      target: "ISO 27001 A.12.6",
      status: "scheduled",
      details: "Vulnerability management control test scheduled for 2024-01-20",
      icon: ClipboardList,
    },
    {
      id: 8,
      timestamp: "2024-01-14 13:08:29",
      user: "compliance@company.com",
      action: "Policy Review Completed",
      target: "IEC 62443 SR-2.1",
      status: "passed",
      details: "Security level definitions reviewed and approved",
      icon: FileText,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
      case "completed":
        return <Badge variant="default" className="bg-safe text-safe-foreground text-xs">Completed</Badge>;
      case "modified":
      case "scheduled":
        return <Badge variant="secondary" className="text-xs">Modified</Badge>;
      case "failed":
        return <Badge variant="destructive" className="text-xs">Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Audit Trail
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {auditEvents.map((event) => {
              const Icon = event.icon;
              return (
                <div
                  key={event.id}
                  className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">{event.action}</h4>
                      {getStatusBadge(event.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{event.details}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {event.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {event.target}
                      </span>
                      <span>{event.timestamp}</span>
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
