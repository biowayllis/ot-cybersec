import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const OTVulnerabilities = () => {
  const vulnerabilities = [
    {
      cve: "CVE-2024-0234",
      title: "Siemens SIMATIC Buffer Overflow",
      severity: "critical",
      cvss: 9.8,
      affectedDevices: 78,
      vendor: "Siemens",
      patchAvailable: true,
      icsAdvisory: "ICSA-24-012-01",
    },
    {
      cve: "CVE-2024-0187",
      title: "Rockwell ControlLogix Authentication Bypass",
      severity: "critical",
      cvss: 9.1,
      affectedDevices: 45,
      vendor: "Rockwell Automation",
      patchAvailable: true,
      icsAdvisory: "ICSA-24-008-02",
    },
    {
      cve: "CVE-2023-4521",
      title: "Schneider Modicon DoS Vulnerability",
      severity: "high",
      cvss: 7.5,
      affectedDevices: 34,
      vendor: "Schneider Electric",
      patchAvailable: false,
      icsAdvisory: "ICSA-23-329-04",
    },
    {
      cve: "CVE-2023-4398",
      title: "ABB RTU Remote Code Execution",
      severity: "critical",
      cvss: 9.8,
      affectedDevices: 23,
      vendor: "ABB",
      patchAvailable: true,
      icsAdvisory: "ICSA-23-311-01",
    },
  ];

  const severityColors: Record<string, string> = {
    critical: "bg-critical text-critical-foreground",
    high: "bg-high text-high-foreground",
  };

  const totalAffected = vulnerabilities.reduce((sum, v) => sum + v.affectedDevices, 0);
  const criticalCount = vulnerabilities.filter((v) => v.severity === "critical").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-critical" />
            OT Critical Vulnerabilities
          </div>
          <Badge className="bg-critical text-critical-foreground">
            {criticalCount} Critical
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {vulnerabilities.map((vuln) => (
          <div
            key={vuln.cve}
            className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-semibold text-primary">
                    {vuln.cve}
                  </span>
                  <Badge className={severityColors[vuln.severity]}>
                    {vuln.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-sm font-medium mb-1">{vuln.title}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-critical">{vuln.cvss}</div>
                <div className="text-xs text-muted-foreground">CVSS</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
              <div>
                <span className="text-muted-foreground">Vendor: </span>
                <span className="text-foreground">{vuln.vendor}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Affected: </span>
                <span className="font-semibold text-high">{vuln.affectedDevices} devices</span>
              </div>
              <div>
                <span className="text-muted-foreground">ICS Advisory: </span>
                <span className="font-mono text-foreground">{vuln.icsAdvisory}</span>
              </div>
              <div>
                {vuln.patchAvailable ? (
                  <Badge className="bg-safe text-safe-foreground">Patch Available</Badge>
                ) : (
                  <Badge className="bg-medium text-medium-foreground">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    No Patch
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Affected Devices:</span>
            <span className="text-xl font-bold text-critical">{totalAffected}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
