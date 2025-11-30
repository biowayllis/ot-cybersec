import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Monitor, Cloud, HardDrive } from "lucide-react";

export const ITAssetOverview = () => {
  const assets = [
    { 
      label: "Servers", 
      count: 342, 
      icon: Server, 
      status: "safe",
      details: "Physical & Virtual" 
    },
    { 
      label: "Endpoints", 
      count: 2147, 
      icon: Monitor, 
      status: "safe",
      details: "Workstations & Laptops" 
    },
    { 
      label: "Cloud Resources", 
      count: 289, 
      icon: Cloud, 
      status: "medium",
      details: "AWS, Azure, GCP" 
    },
    { 
      label: "Network Devices", 
      count: 69, 
      icon: HardDrive, 
      status: "safe",
      details: "Switches, Routers, FW" 
    },
  ];

  const statusColors: Record<string, string> = {
    safe: "text-safe",
    medium: "text-medium",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {assets.map((asset) => (
        <Card key={asset.label} className="border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <asset.icon className="h-4 w-4" />
              {asset.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${statusColors[asset.status]}`}>
              {asset.count.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{asset.details}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
