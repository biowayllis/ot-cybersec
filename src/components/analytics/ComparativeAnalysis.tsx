import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitCompare, ArrowUp, ArrowDown, Equal, Download, Loader2 } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ReferenceLine } from "recharts";
import { usePdfExport } from "@/hooks/usePdfExport";
import { DrilldownModal } from "./DrilldownModal";
import { useChartAnnotations } from "@/hooks/useChartAnnotations";
import { ChartAnnotationsControl, AnnotationList } from "./ChartAnnotations";
import { AnnotationDialog } from "./AnnotationDialog";

const comparisonDimensions = [
  { id: "department", label: "By Department" },
  { id: "severity", label: "By Severity" },
  { id: "asset-type", label: "By Asset Type" },
  { id: "region", label: "By Region" },
];

const comparisonMetrics = [
  { id: "vulnerabilities", label: "Vulnerabilities" },
  { id: "incidents", label: "Incidents" },
  { id: "compliance", label: "Compliance Score" },
  { id: "risk-score", label: "Risk Score" },
];

// Mock data for different dimensions
const mockData: Record<string, any[]> = {
  department: [
    { name: "Engineering", current: 45, previous: 52, target: 30 },
    { name: "Finance", current: 22, previous: 28, target: 20 },
    { name: "Operations", current: 38, previous: 35, target: 25 },
    { name: "HR", current: 15, previous: 18, target: 15 },
    { name: "Sales", current: 28, previous: 32, target: 25 },
  ],
  severity: [
    { name: "Critical", current: 8, previous: 12, target: 5 },
    { name: "High", current: 25, previous: 30, target: 20 },
    { name: "Medium", current: 48, previous: 45, target: 40 },
    { name: "Low", current: 67, previous: 58, target: 50 },
  ],
  "asset-type": [
    { name: "Servers", current: 32, previous: 38, target: 25 },
    { name: "Workstations", current: 56, previous: 62, target: 45 },
    { name: "Network Devices", current: 18, previous: 22, target: 15 },
    { name: "IoT Devices", current: 42, previous: 35, target: 30 },
  ],
  region: [
    { name: "North America", current: 45, previous: 52, target: 40 },
    { name: "Europe", current: 38, previous: 42, target: 35 },
    { name: "Asia Pacific", current: 55, previous: 48, target: 45 },
    { name: "Latin America", current: 28, previous: 32, target: 25 },
  ],
};

const chartConfig = {
  current: {
    label: "Current Period",
    color: "hsl(var(--primary))",
  },
  previous: {
    label: "Previous Period",
    color: "hsl(var(--muted-foreground))",
  },
  target: {
    label: "Target",
    color: "hsl(142 76% 36%)",
  },
};

export const ComparativeAnalysis = () => {
  const [dimension, setDimension] = useState("department");
  const [metric, setMetric] = useState("vulnerabilities");
  const [drilldownOpen, setDrilldownOpen] = useState(false);
  const [drilldownData, setDrilldownData] = useState<any>(null);
  const [annotationDialogOpen, setAnnotationDialogOpen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const { exportToPdf, isExporting } = usePdfExport();
  const { annotations, showAnnotations, addAnnotation, removeAnnotation, toggleShare, toggleAnnotations, currentUserId } = useChartAnnotations("comparative-analysis");

  const data = mockData[dimension] || mockData.department;

  // Calculate summary stats
  const totalCurrent = data.reduce((sum, item) => sum + item.current, 0);
  const totalPrevious = data.reduce((sum, item) => sum + item.previous, 0);
  const totalTarget = data.reduce((sum, item) => sum + item.target, 0);
  const changePercent = ((totalCurrent - totalPrevious) / totalPrevious) * 100;
  const targetVariance = ((totalCurrent - totalTarget) / totalTarget) * 100;

  const handleChartClick = useCallback((chartData: any) => {
    if (chartData?.activePayload?.[0]) {
      const payload = chartData.activePayload[0].payload;
      setDrilldownData({
        name: payload.name,
        metric: metric,
        value: payload.current,
        previous: payload.previous,
        target: payload.target,
      });
      setDrilldownOpen(true);
    }
  }, [metric]);

  const handleExport = () => {
    const dimensionLabel = comparisonDimensions.find(d => d.id === dimension)?.label || dimension;
    const metricLabel = comparisonMetrics.find(m => m.id === metric)?.label || metric;
    exportToPdf(chartRef, {
      filename: `comparative-analysis-${metric}-${dimension}`,
      title: `${metricLabel} - Comparative Analysis (${dimensionLabel})`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-primary" />
            <CardTitle>Comparative Analysis</CardTitle>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {comparisonMetrics.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dimension} onValueChange={setDimension}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {comparisonDimensions.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.label}
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
          Compare metrics across different dimensions and time periods
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="bg-background p-4 rounded-lg">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Period-over-Period</p>
              <div className="flex items-center gap-2">
                {changePercent < 0 ? (
                  <ArrowDown className="h-4 w-4 text-green-500" />
                ) : changePercent > 0 ? (
                  <ArrowUp className="h-4 w-4 text-destructive" />
                ) : (
                  <Equal className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-xl font-bold">
                  {Math.abs(changePercent).toFixed(1)}%
                </span>
                <Badge variant={changePercent <= 0 ? "default" : "destructive"}>
                  {changePercent <= 0 ? "Improved" : "Increased"}
                </Badge>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">vs Target</p>
              <div className="flex items-center gap-2">
                {targetVariance <= 0 ? (
                  <ArrowDown className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowUp className="h-4 w-4 text-destructive" />
                )}
                <span className="text-xl font-bold">
                  {Math.abs(targetVariance).toFixed(1)}%
                </span>
                <Badge variant={targetVariance <= 0 ? "default" : "secondary"}>
                  {targetVariance <= 0 ? "On Track" : "Above Target"}
                </Badge>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Current</p>
              <span className="text-xl font-bold">{totalCurrent}</span>
              <span className="text-sm text-muted-foreground ml-2">
                (Target: {totalTarget})
              </span>
            </div>
          </div>

          {/* Chart */}
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart 
              data={data} 
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              onClick={handleChartClick}
              className="cursor-pointer"
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="name"
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
              <Legend />
              <Bar dataKey="previous" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="current" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="hsl(142 76% 36%)" radius={[4, 4, 0, 0]} />
              {showAnnotations &&
                annotations
                  .filter((a) => a.type === "alert" || a.type === "milestone")
                  .map((annotation, idx) => (
                    <ReferenceLine
                      key={annotation.id}
                      y={30 + idx * 15}
                      stroke={annotation.color}
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      label={{
                        value: annotation.label,
                        position: "right",
                        fill: annotation.color,
                        fontSize: 10,
                      }}
                    />
                  ))}
            </BarChart>
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
