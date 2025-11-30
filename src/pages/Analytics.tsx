import { DashboardCustomizer } from "@/components/analytics/DashboardCustomizer";
import { ReportScheduler } from "@/components/analytics/ReportScheduler";
import { DataExport } from "@/components/analytics/DataExport";
import { AnalyticsWidgets } from "@/components/analytics/AnalyticsWidgets";
import { AdvancedReportBuilder } from "@/components/analytics/AdvancedReportBuilder";
import { TrendAnalytics } from "@/components/analytics/TrendAnalytics";
import { ComparativeAnalysis } from "@/components/analytics/ComparativeAnalysis";
import { CustomMetricsDashboard } from "@/components/analytics/CustomMetricsDashboard";
import { AutoRefreshControl } from "@/components/analytics/AutoRefreshControl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText, TrendingUp, Settings2 } from "lucide-react";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

const Analytics = () => {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated",
    });
  }, [toast]);

  const {
    interval,
    setInterval,
    lastRefresh,
    isRefreshing,
    triggerRefresh,
  } = useAutoRefresh(handleRefresh);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics & Reporting</h1>
          <p className="text-muted-foreground">
            Advanced analytics, customizable dashboards, and automated reporting
          </p>
        </div>
        <AutoRefreshControl
          interval={interval}
          onIntervalChange={setInterval}
          lastRefresh={lastRefresh}
          isRefreshing={isRefreshing}
          onManualRefresh={triggerRefresh}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trends</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="customize" className="gap-2">
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">Customize</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CustomMetricsDashboard key={`metrics-${refreshKey}`} />
          <AnalyticsWidgets key={`widgets-${refreshKey}`} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <TrendAnalytics key={`trends-${refreshKey}`} />
          <ComparativeAnalysis key={`comparison-${refreshKey}`} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdvancedReportBuilder />
            <DataExport />
          </div>
          <ReportScheduler />
        </TabsContent>

        <TabsContent value="customize" className="space-y-6">
          <DashboardCustomizer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
