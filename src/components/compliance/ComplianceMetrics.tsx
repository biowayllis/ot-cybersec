import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

export const ComplianceMetrics = () => {
  const metrics = [
    {
      title: "Overall Compliance",
      value: "87%",
      change: "+3% from last quarter",
      icon: Shield,
      color: "text-safe",
      bgColor: "bg-safe/10",
    },
    {
      title: "Controls Passed",
      value: "342",
      change: "Out of 394 total",
      icon: CheckCircle2,
      color: "text-safe",
      bgColor: "bg-safe/10",
    },
    {
      title: "Gaps Identified",
      value: "52",
      change: "Requires attention",
      icon: AlertTriangle,
      color: "text-medium",
      bgColor: "bg-medium/10",
    },
    {
      title: "Pending Audits",
      value: "7",
      change: "Next audit in 14 days",
      icon: Clock,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.change}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
