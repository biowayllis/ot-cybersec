import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const FirmwareTracking = () => {
  const firmwareStatus = [
    {
      vendor: "Siemens",
      deviceType: "PLC S7-1500",
      currentVersion: "V2.9.3",
      latestVersion: "V2.9.4",
      devices: 78,
      status: "outdated",
      criticalUpdate: false,
    },
    {
      vendor: "Allen-Bradley",
      deviceType: "ControlLogix 5580",
      currentVersion: "32.011",
      latestVersion: "32.013",
      devices: 45,
      status: "outdated",
      criticalUpdate: true,
    },
    {
      vendor: "Schneider",
      deviceType: "Modicon M580",
      currentVersion: "3.20",
      latestVersion: "3.20",
      devices: 34,
      status: "current",
      criticalUpdate: false,
    },
    {
      vendor: "ABB",
      deviceType: "RTU560",
      currentVersion: "12.4.2",
      latestVersion: "12.5.0",
      devices: 56,
      status: "outdated",
      criticalUpdate: false,
    },
  ];

  const summary = {
    current: firmwareStatus.filter((f) => f.status === "current").length,
    outdated: firmwareStatus.filter((f) => f.status === "outdated").length,
    criticalUpdates: firmwareStatus.filter((f) => f.criticalUpdate).length,
  };

  const complianceRate = (summary.current / firmwareStatus.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Firmware Version Tracking
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            {complianceRate.toFixed(0)}% Current
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {firmwareStatus.map((firmware, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              firmware.criticalUpdate
                ? "border-critical/30 bg-critical/5"
                : firmware.status === "current"
                ? "border-safe/30 bg-safe/5"
                : "border-medium/30 bg-medium/5"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold">{firmware.vendor}</div>
                <div className="text-xs text-muted-foreground">{firmware.deviceType}</div>
              </div>
              <div className="flex items-center gap-2">
                {firmware.criticalUpdate && (
                  <Badge className="bg-critical text-critical-foreground">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Critical
                  </Badge>
                )}
                {firmware.status === "current" ? (
                  <CheckCircle2 className="h-5 w-5 text-safe" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-medium" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs mb-2">
              <div>
                <span className="text-muted-foreground">Current: </span>
                <span className="font-mono text-foreground">{firmware.currentVersion}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Latest: </span>
                <span className="font-mono text-foreground">{firmware.latestVersion}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Devices: </span>
                <span className="font-semibold text-foreground">{firmware.devices}</span>
              </div>
            </div>

            {firmware.status === "outdated" && (
              <Progress value={85} className="h-1 mt-2" />
            )}
          </div>
        ))}

        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-safe/5 rounded border border-safe/20">
              <div className="text-lg font-bold text-safe">{summary.current}</div>
              <div className="text-xs text-muted-foreground">Current</div>
            </div>
            <div className="text-center p-2 bg-medium/5 rounded border border-medium/20">
              <div className="text-lg font-bold text-medium">{summary.outdated}</div>
              <div className="text-xs text-muted-foreground">Outdated</div>
            </div>
            <div className="text-center p-2 bg-critical/5 rounded border border-critical/20">
              <div className="text-lg font-bold text-critical">{summary.criticalUpdates}</div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
