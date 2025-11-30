import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, Calendar, Download, Loader2 } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
import { usePdfExport } from "@/hooks/usePdfExport";
import { DrilldownModal } from "./DrilldownModal";
import { useChartAnnotations } from "@/hooks/useChartAnnotations";
import { ChartAnnotationsControl, AnnotationList } from "./ChartAnnotations";
import { AnnotationDialog } from "./AnnotationDialog";

const timeRanges = [
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
  { id: "90d", label: "Last 90 Days" },
  { id: "1y", label: "Last Year" },
];

const trendMetrics = [
  { id: "security-score", label: "Security Score", color: "hsl(var(--primary))" },
  { id: "vulnerabilities", label: "Open Vulnerabilities", color: "hsl(var(--destructive))" },
  { id: "incidents", label: "Security Incidents", color: "hsl(38 92% 50%)" },
  { id: "compliance", label: "Compliance Rate", color: "hsl(142 76% 36%)" },
];

// Mock data generator
const generateTrendData = (days: number) => {
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      "security-score": 70 + Math.random() * 20,
      vulnerabilities: Math.floor(50 + Math.random() * 30),
      incidents: Math.floor(5 + Math.random() * 10),
      compliance: 85 + Math.random() * 10,
    });
  }
  return data;
};

const calculateTrend = (data: any[], metric: string) => {
  if (data.length < 2) return { value: 0, direction: "neutral" };
  const first = data[0][metric];
  const last = data[data.length - 1][metric];
  const change = ((last - first) / first) * 100;
  return {
    value: Math.abs(change).toFixed(1),
    direction: change > 1 ? "up" : change < -1 ? "down" : "neutral",
  };
};

export const TrendAnalytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("security-score");
  const [drilldownOpen, setDrilldownOpen] = useState(false);
  const [drilldownData, setDrilldownData] = useState<any>(null);
  const [annotationDialogOpen, setAnnotationDialogOpen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const { exportToPdf, isExporting } = usePdfExport();
  const { annotations, showAnnotations, addAnnotation, removeAnnotation, toggleShare, toggleAnnotations, currentUserId } = useChartAnnotations("trend-analytics");

  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365;
  const data = generateTrendData(days);
  const trend = calculateTrend(data, selectedMetric);
  const metricConfig = trendMetrics.find((m) => m.id === selectedMetric);

  const handleChartClick = useCallback((chartData: any) => {
    if (chartData?.activePayload?.[0]) {
      const payload = chartData.activePayload[0].payload;
      setDrilldownData({
        date: payload.date,
        metric: selectedMetric,
        value: payload[selectedMetric],
      });
      setDrilldownOpen(true);
    }
  }, [selectedMetric]);

  const chartConfig = {
    [selectedMetric]: {
      label: metricConfig?.label,
      color: metricConfig?.color,
    },
  };

  const handleExport = () => {
    const timeRangeLabel = timeRanges.find(t => t.id === timeRange)?.label || timeRange;
    exportToPdf(chartRef, {
      filename: `trend-analysis-${selectedMetric}`,
      title: `${metricConfig?.label} - Trend Analysis (${timeRangeLabel})`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Trend Analysis</CardTitle>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {trendMetrics.map((metric) => (
                  <SelectItem key={metric.id} value={metric.id}>
                    {metric.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.id} value={range.id}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export PDF
            </Button>
            <ChartAnnotationsControl
              annotations={annotations}
              showAnnotations={showAnnotations}
              onToggle={toggleAnnotations}
              onAdd={() => setAnnotationDialogOpen(true)}
              onRemove={removeAnnotation}
            />
          </div>
        </div>
        <CardDescription>
          Track key security metrics over time to identify patterns and improvements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="bg-background p-4 rounded-lg">
          {/* Trend Summary */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              {trend.direction === "up" ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : trend.direction === "down" ? (
                <TrendingDown className="h-5 w-5 text-destructive" />
              ) : (
                <Minus className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="text-2xl font-bold">{trend.value}%</span>
            </div>
            <span className="text-muted-foreground">
              {trend.direction === "up"
                ? "increase"
                : trend.direction === "down"
                ? "decrease"
                : "no change"}{" "}
              over the selected period
            </span>
          </div>

          {/* Chart */}
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart 
              data={data} 
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              onClick={handleChartClick}
              className="cursor-pointer"
            >
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metricConfig?.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={metricConfig?.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={metricConfig?.color}
                strokeWidth={2}
                fill="url(#colorMetric)"
              />
              {showAnnotations &&
                annotations.map((annotation) => (
                  <ReferenceLine
                    key={annotation.id}
                    x={annotation.date}
                    stroke={annotation.color}
                    strokeDasharray="3 3"
                    strokeWidth={2}
                    label={{
                      value: annotation.label,
                      position: "top",
                      fill: annotation.color,
                      fontSize: 10,
                    }}
                  />
                ))}
            </AreaChart>
          </ChartContainer>
          {showAnnotations && (
            <AnnotationList 
              annotations={annotations} 
              onRemove={removeAnnotation} 
              onToggleShare={toggleShare}
              currentUserId={currentUserId}
            />
          )}
          <p className="text-xs text-muted-foreground text-center mt-2">
            Click on chart to view detailed breakdown
          </p>
        </div>
      </CardContent>

      <DrilldownModal
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        data={drilldownData}
      />

      <AnnotationDialog
        open={annotationDialogOpen}
        onOpenChange={setAnnotationDialogOpen}
        onAdd={addAnnotation}
      />
    </Card>
  );
};
