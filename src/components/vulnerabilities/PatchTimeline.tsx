import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertCircle, Package } from "lucide-react";

export const PatchTimeline = () => {
  const timeline = [
    {
      id: "1",
      date: "2024-11-25",
      time: "14:30",
      status: "completed",
      title: "Windows Server Security Update",
      description: "KB5023773 deployed to 89 servers",
      cves: ["CVE-2024-5678", "CVE-2024-5679"],
    },
    {
      id: "2",
      date: "2024-11-24",
      time: "22:00",
      status: "in-progress",
      title: "Oracle Database Patch",
      description: "Critical update deployment in progress",
      cves: ["CVE-2024-9012"],
    },
    {
      id: "3",
      date: "2024-11-26",
      time: "02:00",
      status: "scheduled",
      title: "Cisco IOS Security Patch",
      description: "Scheduled maintenance window for network devices",
      cves: ["CVE-2024-7890"],
    },
    {
      id: "4",
      date: "2024-11-23",
      time: "16:45",
      status: "failed",
      title: "Apache HTTP Server Update",
      description: "Deployment failed on 3 servers - requires attention",
      cves: ["CVE-2024-1234"],
    },
    {
      id: "5",
      date: "2024-11-27",
      time: "03:00",
      status: "scheduled",
      title: "SAP NetWeaver Patch",
      description: "Planned deployment for ERP systems",
      cves: ["CVE-2024-3456"],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-safe" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-primary animate-pulse" />;
      case "scheduled":
        return <Package className="h-5 w-5 text-medium" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-critical" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-safe border-safe";
      case "in-progress":
        return "text-primary border-primary";
      case "scheduled":
        return "text-medium border-medium";
      case "failed":
        return "text-critical border-critical";
      default:
        return "text-muted-foreground border-muted";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patch Status Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-border" />
          
          {timeline.map((item) => (
            <div key={item.id} className="relative flex gap-4">
              <div className={`flex-shrink-0 z-10 rounded-full border-2 ${getStatusColor(item.status)} bg-background p-1.5`}>
                {getStatusIcon(item.status)}
              </div>
              
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {item.date} at {item.time}
                    </p>
                    <h4 className="font-semibold text-sm mt-1">{item.title}</h4>
                  </div>
                  <Badge variant="outline" className={`capitalize ${getStatusColor(item.status)}`}>
                    {item.status.replace("-", " ")}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {item.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {item.cves.map((cve) => (
                    <Badge key={cve} variant="secondary" className="text-xs">
                      {cve}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
