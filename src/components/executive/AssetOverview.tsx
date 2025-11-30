import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Monitor, Server } from "lucide-react";

export const AssetOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            IT Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">2,847</div>
          <p className="text-xs text-muted-foreground mt-1">Servers, endpoints, cloud</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Server className="h-4 w-4" />
            OT Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-medium">1,234</div>
          <p className="text-xs text-muted-foreground mt-1">PLC, RTU, HMI, SCADA</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Database className="h-4 w-4" />
            Total Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">4,081</div>
          <p className="text-xs text-muted-foreground mt-1">Across all environments</p>
        </CardContent>
      </Card>
    </div>
  );
};
