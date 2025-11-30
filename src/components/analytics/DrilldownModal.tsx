import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Server, Users } from "lucide-react";

interface DrilldownData {
  date?: string;
  name?: string;
  metric: string;
  value: number;
  previous?: number;
  target?: number;
}

interface DrilldownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DrilldownData | null;
}

// Mock detailed breakdown data
const generateBreakdown = (data: DrilldownData) => {
  const baseValue = data.value;
  return {
    bySource: [
      { name: "External Scans", value: Math.floor(baseValue * 0.35), icon: Shield },
      { name: "Internal Audits", value: Math.floor(baseValue * 0.25), icon: Server },
      { name: "User Reports", value: Math.floor(baseValue * 0.2), icon: Users },
      { name: "Automated Detection", value: Math.floor(baseValue * 0.2), icon: AlertTriangle },
    ],
    bySeverity: [
      { name: "Critical", value: Math.floor(baseValue * 0.1), color: "destructive" },
      { name: "High", value: Math.floor(baseValue * 0.25), color: "destructive" },
      { name: "Medium", value: Math.floor(baseValue * 0.35), color: "secondary" },
      { name: "Low", value: Math.floor(baseValue * 0.3), color: "outline" },
    ],
    recentEvents: [
      { time: "2 hours ago", description: "New vulnerability detected in web server" },
      { time: "5 hours ago", description: "Patch applied to database cluster" },
      { time: "1 day ago", description: "Security scan completed" },
    ],
  };
};

export const DrilldownModal = ({ open, onOpenChange, data }: DrilldownModalProps) => {
  if (!data) return null;

  const breakdown = generateBreakdown(data);
  const change = data.previous ? ((data.value - data.previous) / data.previous) * 100 : 0;
  const isImproved = change < 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {data.date || data.name} - Detailed Breakdown
          </DialogTitle>
          <DialogDescription>
            Detailed analysis for {data.metric.replace(/-/g, " ")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Value Summary */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Current Value</p>
              <p className="text-3xl font-bold">{data.value.toFixed(1)}</p>
            </div>
            {data.previous && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">vs Previous</p>
                <div className="flex items-center gap-2">
                  {isImproved ? (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-destructive" />
                  )}
                  <span className={`font-semibold ${isImproved ? "text-green-500" : "text-destructive"}`}>
                    {Math.abs(change).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
            {data.target && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Target</p>
                <p className="text-xl font-semibold">{data.target}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Breakdown by Source */}
          <div>
            <h4 className="font-semibold mb-3">Breakdown by Source</h4>
            <div className="grid grid-cols-2 gap-3">
              {breakdown.bySource.map((item) => (
                <div key={item.name} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <item.icon className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-lg font-bold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Breakdown by Severity */}
          <div>
            <h4 className="font-semibold mb-3">Breakdown by Severity</h4>
            <div className="flex flex-wrap gap-2">
              {breakdown.bySeverity.map((item) => (
                <Badge
                  key={item.name}
                  variant={item.color as "destructive" | "secondary" | "outline" | "default"}
                  className="text-sm py-1 px-3"
                >
                  {item.name}: {item.value}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Recent Events */}
          <div>
            <h4 className="font-semibold mb-3">Recent Related Events</h4>
            <div className="space-y-2">
              {breakdown.recentEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-2 hover:bg-muted/30 rounded-lg">
                  <span className="text-xs text-muted-foreground whitespace-nowrap mt-0.5">
                    {event.time}
                  </span>
                  <p className="text-sm">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
