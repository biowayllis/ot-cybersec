import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle2
} from "lucide-react";

const customMetrics = [
  {
    id: 1,
    name: "Mean Time to Detect (MTTD)",
    value: "2.4 hours",
    target: "< 4 hours",
    progress: 85,
    trend: "down",
    trendValue: "-18%",
    status: "on-track",
    icon: Clock,
  },
  {
    id: 2,
    name: "Mean Time to Respond (MTTR)",
    value: "4.2 hours",
    target: "< 6 hours",
    progress: 72,
    trend: "down",
    trendValue: "-12%",
    status: "on-track",
    icon: Shield,
  },
  {
    id: 3,
    name: "Vulnerability Remediation Rate",
    value: "78%",
    target: "> 85%",
    progress: 78,
    trend: "up",
    trendValue: "+5%",
    status: "needs-attention",
    icon: Target,
  },
  {
    id: 4,
    name: "Security Awareness Score",
    value: "92%",
    target: "> 90%",
    progress: 92,
    trend: "up",
    trendValue: "+3%",
    status: "on-track",
    icon: CheckCircle2,
  },
  {
    id: 5,
    name: "Critical Asset Coverage",
    value: "96%",
    target: "> 95%",
    progress: 96,
    trend: "up",
    trendValue: "+2%",
    status: "on-track",
    icon: Shield,
  },
  {
    id: 6,
    name: "False Positive Rate",
    value: "8.2%",
    target: "< 10%",
    progress: 82,
    trend: "down",
    trendValue: "-4%",
    status: "on-track",
    icon: AlertTriangle,
  },
];

const statusColors: Record<string, string> = {
  "on-track": "bg-green-500/10 text-green-500 border-green-500/20",
  "needs-attention": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "critical": "bg-destructive/10 text-destructive border-destructive/20",
};

const statusLabels: Record<string, string> = {
  "on-track": "On Track",
  "needs-attention": "Needs Attention",
  "critical": "Critical",
};

export const CustomMetricsDashboard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <CardTitle>Custom Security Metrics</CardTitle>
          </div>
          <Button variant="outline" size="sm">
            Configure Metrics
          </Button>
        </div>
        <CardDescription>
          Track custom KPIs and security metrics against organizational targets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customMetrics.map((metric) => (
            <div
              key={metric.id}
              className="p-4 border rounded-lg space-y-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <metric.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{metric.name}</span>
                </div>
                <Badge variant="outline" className={statusColors[metric.status]}>
                  {statusLabels[metric.status]}
                </Badge>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{metric.value}</span>
                <div className="flex items-center gap-1">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-green-500" />
                  )}
                  <span className="text-xs text-green-500">{metric.trendValue}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress to target</span>
                  <span>Target: {metric.target}</span>
                </div>
                <Progress value={metric.progress} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
