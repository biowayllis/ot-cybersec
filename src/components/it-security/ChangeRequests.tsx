import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ChangeRequests = () => {
  const changes = [
    {
      id: "CHG-2847",
      title: "Deploy Security Updates - Web Servers",
      requester: "IT Security",
      status: "approved",
      priority: "high",
      scheduledDate: "2024-01-20",
    },
    {
      id: "CHG-2846",
      title: "Firewall Rule Update - DMZ",
      requester: "Network Team",
      status: "pending",
      priority: "medium",
      scheduledDate: "2024-01-22",
    },
    {
      id: "CHG-2845",
      title: "Active Directory Schema Change",
      requester: "IAM Team",
      status: "in-progress",
      priority: "critical",
      scheduledDate: "2024-01-18",
    },
    {
      id: "CHG-2844",
      title: "Certificate Renewal - Internal CA",
      requester: "PKI Team",
      status: "approved",
      priority: "high",
      scheduledDate: "2024-01-25",
    },
  ];

  const statusConfig: Record<string, { color: string; icon: any }> = {
    approved: { color: "bg-safe text-safe-foreground", icon: CheckCircle2 },
    pending: { color: "bg-medium text-medium-foreground", icon: Clock },
    "in-progress": { color: "bg-primary text-primary-foreground", icon: Clock },
  };

  const priorityConfig: Record<string, string> = {
    critical: "bg-critical text-critical-foreground",
    high: "bg-high text-high-foreground",
    medium: "bg-medium text-medium-foreground",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Change Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Change ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Scheduled</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {changes.map((change) => {
              const StatusIcon = statusConfig[change.status]?.icon;
              return (
                <TableRow key={change.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{change.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{change.title}</div>
                      <div className="text-xs text-muted-foreground">{change.requester}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[change.status]?.color}>
                      {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                      {change.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityConfig[change.priority]}>
                      {change.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{change.scheduledDate}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
