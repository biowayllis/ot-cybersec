import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Shield, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const OTPatchReadiness = () => {
  const readinessScore = 78;

  const vendors = [
    {
      name: "Siemens",
      validated: 12,
      testing: 3,
      pendingVendor: 2,
      readiness: 71,
    },
    {
      name: "Rockwell Automation",
      validated: 8,
      testing: 2,
      pendingVendor: 1,
      readiness: 73,
    },
    {
      name: "Schneider Electric",
      validated: 10,
      testing: 1,
      pendingVendor: 0,
      readiness: 91,
    },
    {
      name: "ABB",
      validated: 6,
      testing: 4,
      pendingVendor: 3,
      readiness: 46,
    },
  ];

  const patchStatus = [
    {
      label: "Vendor Validated",
      count: 36,
      icon: CheckCircle2,
      color: "text-safe",
    },
    {
      label: "In OT Testing",
      count: 10,
      icon: Clock,
      color: "text-medium",
    },
    {
      label: "Pending Vendor",
      count: 6,
      icon: XCircle,
      color: "text-high",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          OT Patch Readiness Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
          <div className="text-5xl font-bold text-primary mb-2">{readinessScore}%</div>
          <div className="text-sm text-muted-foreground">OT Patch Readiness</div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <Shield className="h-4 w-4 text-safe" />
            <span className="text-xs text-muted-foreground">Vendor-Validated Patches Ready</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm font-medium mb-3">Vendor Validation Status</div>
          {vendors.map((vendor) => (
            <div key={vendor.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{vendor.name}</span>
                <span className="text-sm text-muted-foreground">{vendor.readiness}%</span>
              </div>

              <Progress value={vendor.readiness} className="h-2" />

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-safe">
                  <CheckCircle2 className="h-3 w-3 inline mr-1" />
                  {vendor.validated} Validated
                </div>
                <div className="text-medium">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {vendor.testing} Testing
                </div>
                <div className="text-high">
                  <XCircle className="h-3 w-3 inline mr-1" />
                  {vendor.pendingVendor} Pending
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border space-y-3">
          <div className="text-sm font-medium">Overall Patch Status</div>
          {patchStatus.map((status) => {
            const StatusIcon = status.icon;
            return (
              <div
                key={status.label}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <StatusIcon className={`h-4 w-4 ${status.color}`} />
                  <span className="text-sm">{status.label}</span>
                </div>
                <Badge className={status.color}>{status.count}</Badge>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border bg-medium/5 rounded-lg p-3">
          <div className="flex items-start gap-2 text-xs">
            <Clock className="h-4 w-4 text-medium shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-medium mb-1">Next OT Testing Window</div>
              <div className="text-muted-foreground">
                Scheduled: <span className="text-foreground">Feb 5, 2024 - 04:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
