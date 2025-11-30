import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, XCircle, AlertCircle, ExternalLink } from "lucide-react";

export const ControlEffectiveness = () => {
  const controls = [
    {
      id: "AC-1",
      name: "Access Control Policy and Procedures",
      framework: "NIST 800-53",
      status: "effective",
      effectiveness: 94,
      lastTested: "2024-01-15",
      owner: "Security Team",
    },
    {
      id: "IA-2",
      name: "Identification and Authentication",
      framework: "NIST 800-53",
      status: "effective",
      effectiveness: 91,
      lastTested: "2024-01-10",
      owner: "IT Operations",
    },
    {
      id: "SR-2.1",
      name: "Security Levels for Zones",
      framework: "IEC 62443",
      status: "partial",
      effectiveness: 68,
      lastTested: "2024-01-08",
      owner: "OT Security",
    },
    {
      id: "A.8.2",
      name: "Information Classification",
      framework: "ISO 27001",
      status: "effective",
      effectiveness: 88,
      lastTested: "2024-01-12",
      owner: "Data Governance",
    },
    {
      id: "IR-4",
      name: "Incident Handling",
      framework: "NIST 800-53",
      status: "ineffective",
      effectiveness: 45,
      lastTested: "2024-01-05",
      owner: "SOC Team",
    },
    {
      id: "SC-7",
      name: "Boundary Protection",
      framework: "NIST 800-53",
      status: "effective",
      effectiveness: 92,
      lastTested: "2024-01-14",
      owner: "Network Security",
    },
    {
      id: "TSA-3.2",
      name: "Network Segmentation",
      framework: "TSA Pipeline",
      status: "partial",
      effectiveness: 72,
      lastTested: "2024-01-09",
      owner: "Infrastructure",
    },
    {
      id: "A.12.6",
      name: "Technical Vulnerability Management",
      framework: "ISO 27001",
      status: "effective",
      effectiveness: 86,
      lastTested: "2024-01-11",
      owner: "Vulnerability Mgmt",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "effective":
        return <CheckCircle2 className="h-4 w-4 text-safe" />;
      case "partial":
        return <AlertCircle className="h-4 w-4 text-medium" />;
      case "ineffective":
        return <XCircle className="h-4 w-4 text-critical" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "effective":
        return <Badge variant="default" className="bg-safe text-safe-foreground">Effective</Badge>;
      case "partial":
        return <Badge variant="secondary" className="bg-medium text-medium-foreground">Partial</Badge>;
      case "ineffective":
        return <Badge variant="destructive">Ineffective</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Control Effectiveness
          </span>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Control ID</TableHead>
              <TableHead>Control Name</TableHead>
              <TableHead>Framework</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Effectiveness</TableHead>
              <TableHead>Last Tested</TableHead>
              <TableHead>Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {controls.map((control) => (
              <TableRow key={control.id}>
                <TableCell className="font-mono text-sm font-medium">
                  {control.id}
                </TableCell>
                <TableCell className="font-medium">{control.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {control.framework}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(control.status)}
                    {getStatusBadge(control.status)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{control.effectiveness}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {control.lastTested}
                </TableCell>
                <TableCell className="text-sm">{control.owner}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
