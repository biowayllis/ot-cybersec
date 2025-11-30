import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Bell } from "lucide-react";

export const VendorAdvisories = () => {
  const advisories = [
    {
      id: "1",
      vendor: "Microsoft",
      title: "November 2024 Security Updates",
      severity: "Critical",
      publishDate: "2024-11-21",
      cveCount: 14,
      summary: "Multiple vulnerabilities in Windows Server and Office products requiring immediate attention.",
      url: "#",
    },
    {
      id: "2",
      vendor: "Cisco",
      title: "IOS XE Software Security Advisory",
      severity: "High",
      publishDate: "2024-11-19",
      cveCount: 3,
      summary: "Buffer overflow vulnerabilities affecting IOS XE routers and switches.",
      url: "#",
    },
    {
      id: "3",
      vendor: "Oracle",
      title: "Critical Patch Update - Q4 2024",
      severity: "High",
      publishDate: "2024-11-17",
      cveCount: 8,
      summary: "Security fixes for Database, WebLogic, and Java SE components.",
      url: "#",
    },
    {
      id: "4",
      vendor: "VMware",
      title: "vCenter Server Security Update",
      severity: "Critical",
      publishDate: "2024-11-15",
      cveCount: 2,
      summary: "Remote code execution vulnerabilities in vCenter Server.",
      url: "#",
    },
    {
      id: "5",
      vendor: "SAP",
      title: "Security Patch Day - November 2024",
      severity: "Medium",
      publishDate: "2024-11-14",
      cveCount: 12,
      summary: "Various security improvements across SAP product portfolio.",
      url: "#",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-critical text-critical-foreground";
      case "high":
        return "bg-high text-high-foreground";
      case "medium":
        return "bg-medium text-medium-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Vendor Security Advisories
          </span>
          <Button variant="outline" size="sm">
            Subscribe to Alerts
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {advisories.map((advisory) => (
            <div
              key={advisory.id}
              className="p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-semibold">
                      {advisory.vendor}
                    </Badge>
                    <Badge className={getSeverityColor(advisory.severity)}>
                      {advisory.severity}
                    </Badge>
                    <Badge variant="secondary">
                      {advisory.cveCount} CVEs
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm">{advisory.title}</h4>
                  <p className="text-xs text-muted-foreground">{advisory.summary}</p>
                  <p className="text-xs text-muted-foreground">
                    Published: {advisory.publishDate}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
