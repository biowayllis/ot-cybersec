import { Card, CardContent } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

const metrics = [
  {
    label: "Events/Second",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Activity,
    color: "text-primary"
  },
  {
    label: "Active Alerts",
    value: "23",
    change: "-8%",
    trend: "down",
    icon: AlertTriangle,
    color: "text-critical"
  },
  {
    label: "Open Incidents",
    value: "4",
    change: "+2",
    trend: "up",
    icon: AlertTriangle,
    color: "text-high"
  },
  {
    label: "Resolved Today",
    value: "18",
    change: "+35%",
    trend: "up",
    icon: CheckCircle,
    color: "text-low"
  }
];

export const SIEMMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`h-4 w-4 ${metric.trend === 'up' ? 'text-low' : 'text-critical'}`} />
                    <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-low' : 'text-critical'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-primary/10`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
