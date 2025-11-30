import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock, User } from "lucide-react";

interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'detection' | 'containment' | 'eradication' | 'recovery' | 'resolved';
  assignee: string;
  created: string;
  lastUpdate: string;
  progress: number;
  affectedAssets: number;
}

const mockIncidents: Incident[] = [
  {
    id: "INC-2024-001",
    title: "Ransomware Attack - Production Network",
    severity: "critical",
    status: "containment",
    assignee: "SOC Team Alpha",
    created: "2024-01-15 08:30",
    lastUpdate: "2024-01-15 14:45",
    progress: 45,
    affectedAssets: 12
  },
  {
    id: "INC-2024-002",
    title: "Data Exfiltration Attempt",
    severity: "high",
    status: "eradication",
    assignee: "IR Team Bravo",
    created: "2024-01-14 22:15",
    lastUpdate: "2024-01-15 13:20",
    progress: 75,
    affectedAssets: 3
  },
  {
    id: "INC-2024-003",
    title: "Phishing Campaign",
    severity: "medium",
    status: "recovery",
    assignee: "Security Operations",
    created: "2024-01-13 15:45",
    lastUpdate: "2024-01-15 11:30",
    progress: 90,
    affectedAssets: 28
  },
  {
    id: "INC-2024-004",
    title: "Unauthorized Access - Admin Portal",
    severity: "high",
    status: "detection",
    assignee: "SOC Team Alpha",
    created: "2024-01-15 10:20",
    lastUpdate: "2024-01-15 14:10",
    progress: 20,
    affectedAssets: 1
  }
];

const statusConfig = {
  detection: { label: "Detection", color: "bg-critical/10 text-critical border-critical/20" },
  containment: { label: "Containment", color: "bg-high/10 text-high border-high/20" },
  eradication: { label: "Eradication", color: "bg-medium/10 text-medium border-medium/20" },
  recovery: { label: "Recovery", color: "bg-low/10 text-low border-low/20" },
  resolved: { label: "Resolved", color: "bg-muted/10 text-muted-foreground border-muted/20" }
};

const severityConfig = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low"
};

export const IncidentResponse = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Incident Response Workflows
          </CardTitle>
          <Button size="sm">
            Create Incident
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockIncidents.map((incident) => (
            <div
              key={incident.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{incident.title}</h4>
                      <Badge variant="outline" className={`text-${severityConfig[incident.severity]} border-current`}>
                        {incident.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Incident ID: {incident.id}</p>
                  </div>
                  <Badge variant="outline" className={statusConfig[incident.status].color}>
                    {statusConfig[incident.status].label}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{incident.progress}%</span>
                  </div>
                  <Progress value={incident.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{incident.assignee}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{incident.affectedAssets} affected assets</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Created: {incident.created}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    <span>Updated: {incident.lastUpdate}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Update Status
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
