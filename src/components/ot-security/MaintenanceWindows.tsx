import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const MaintenanceWindows = () => {
  const windows = [
    {
      zone: "Production Zone A",
      scheduledDate: "2024-01-28",
      time: "02:00 - 06:00",
      type: "Planned Outage",
      status: "scheduled",
      affectedAssets: 342,
      activities: ["Firmware Updates", "Network Maintenance"],
    },
    {
      zone: "Production Zone B",
      scheduledDate: "2024-01-29",
      time: "01:00 - 05:00",
      type: "Patch Deployment",
      status: "scheduled",
      affectedAssets: 287,
      activities: ["PLC Patches", "SCADA Updates"],
    },
    {
      zone: "Utility Systems",
      scheduledDate: "2024-01-25",
      time: "03:00 - 04:30",
      type: "Security Update",
      status: "completed",
      affectedAssets: 156,
      activities: ["Security Patches"],
    },
    {
      zone: "Safety Systems",
      scheduledDate: "2024-02-05",
      time: "04:00 - 08:00",
      type: "Major Upgrade",
      status: "pending-approval",
      affectedAssets: 89,
      activities: ["Firmware Upgrade", "Configuration Backup"],
    },
  ];

  const statusConfig: Record<string, { color: string; icon: any; bgClass: string }> = {
    scheduled: {
      color: "text-primary",
      icon: Calendar,
      bgClass: "bg-primary/10 border-primary/20",
    },
    completed: {
      color: "text-safe",
      icon: CheckCircle2,
      bgClass: "bg-safe/10 border-safe/20",
    },
    "pending-approval": {
      color: "text-medium",
      icon: AlertCircle,
      bgClass: "bg-medium/10 border-medium/20",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Maintenance Window Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {windows.map((window, index) => {
          const config = statusConfig[window.status];
          const StatusIcon = config.icon;
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${config.bgClass}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="font-semibold mb-1">{window.zone}</div>
                  <div className="text-xs text-muted-foreground">{window.type}</div>
                </div>
                <Badge className={`${config.color} border-current`} variant="outline">
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {window.status.replace("-", " ")}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Date:</span>
                  <span className="text-foreground font-medium">{window.scheduledDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Time:</span>
                  <span className="text-foreground font-medium">{window.time}</span>
                </div>
              </div>

              <div className="mb-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Affected Assets: <span className="text-foreground font-semibold">{window.affectedAssets}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {window.activities.map((activity, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded bg-background border border-border"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-primary/5 rounded border border-primary/20">
              <div className="text-lg font-bold text-primary">2</div>
              <div className="text-muted-foreground">Scheduled</div>
            </div>
            <div className="text-center p-2 bg-safe/5 rounded border border-safe/20">
              <div className="text-lg font-bold text-safe">1</div>
              <div className="text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-2 bg-medium/5 rounded border border-medium/20">
              <div className="text-lg font-bold text-medium">1</div>
              <div className="text-muted-foreground">Pending</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
