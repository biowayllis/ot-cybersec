import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Target, Shield, AlertTriangle } from "lucide-react";

const metricsData = [
  {
    title: "Security Events",
    value: "14,287",
    change: "+12.3%",
    trend: "up",
    description: "Last 7 days",
    icon: Activity,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Threat Detection Rate",
    value: "98.7%",
    change: "+2.1%",
    trend: "up",
    description: "vs. last month",
    icon: Target,
    color: "text-safe",
    bgColor: "bg-safe/10",
  },
  {
    title: "Critical Vulnerabilities",
    value: "23",
    change: "-8 resolved",
    trend: "down",
    description: "Active patches",
    icon: AlertTriangle,
    color: "text-critical",
    bgColor: "bg-critical/10",
  },
  {
    title: "Compliance Score",
    value: "87%",
    change: "+5%",
    trend: "up",
    description: "Across all frameworks",
    icon: Shield,
    color: "text-safe",
    bgColor: "bg-safe/10",
  },
];

const recentInsights = [
  {
    title: "Unusual Login Activity Detected",
    description: "15 failed login attempts from foreign IP addresses",
    time: "2 hours ago",
    severity: "high",
  },
  {
    title: "Patch Compliance Improving",
    description: "OT systems patch compliance increased to 78%",
    time: "5 hours ago",
    severity: "medium",
  },
  {
    title: "New Vulnerability Disclosure",
    description: "CVE-2024-1234 affects 12 assets in production",
    time: "1 day ago",
    severity: "critical",
  },
  {
    title: "Quarterly Audit Scheduled",
    description: "ISO 27001 audit begins in 14 days",
    time: "2 days ago",
    severity: "low",
  },
];

const severityColors: Record<string, string> = {
  critical: "bg-critical/10 text-critical border-critical/20",
  high: "bg-medium/10 text-medium border-medium/20",
  medium: "bg-primary/10 text-primary border-primary/20",
  low: "bg-safe/10 text-safe border-safe/20",
};

export const AnalyticsWidgets = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricsData.map((metric) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
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
                  <div className="flex items-center gap-1 mt-1">
                    <TrendIcon
                      className={`h-3 w-3 ${
                        metric.trend === "up" ? "text-safe" : "text-medium"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        metric.trend === "up" ? "text-safe" : "text-medium"
                      }`}
                    >
                      {metric.change}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      {metric.description}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Insights & Alerts</CardTitle>
          <CardDescription>
            AI-powered analytics and security intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentInsights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${severityColors[insight.severity]}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                    <p className="text-sm opacity-90">{insight.description}</p>
                  </div>
                  <span className="text-xs opacity-70 whitespace-nowrap">
                    {insight.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
