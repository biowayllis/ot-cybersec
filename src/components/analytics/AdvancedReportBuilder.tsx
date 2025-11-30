import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, X, Play, Save, FolderOpen, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const dataSources = [
  { id: "security-events", label: "Security Events" },
  { id: "vulnerabilities", label: "Vulnerabilities" },
  { id: "assets", label: "Asset Inventory" },
  { id: "compliance", label: "Compliance Data" },
  { id: "incidents", label: "Incident Reports" },
  { id: "user-activity", label: "User Activity" },
];

const metrics = [
  { id: "count", label: "Count" },
  { id: "sum", label: "Sum" },
  { id: "average", label: "Average" },
  { id: "min", label: "Minimum" },
  { id: "max", label: "Maximum" },
  { id: "trend", label: "Trend %" },
];

const groupByOptions = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "severity", label: "Severity" },
  { id: "category", label: "Category" },
  { id: "department", label: "Department" },
  { id: "asset-type", label: "Asset Type" },
];

const filterFields = [
  { id: "severity", label: "Severity", options: ["Critical", "High", "Medium", "Low", "Info"] },
  { id: "status", label: "Status", options: ["Open", "In Progress", "Resolved", "Closed"] },
  { id: "category", label: "Category", options: ["Network", "Application", "Infrastructure", "User"] },
];

interface Filter {
  field: string;
  values: string[];
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string | null;
  data_source: string;
  metrics: string[];
  group_by: string | null;
  filters: Filter[];
  is_default: boolean;
  created_at: string;
}

export const AdvancedReportBuilder = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [dataSource, setDataSource] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);

  // Fetch templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['report-templates', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('report_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        filters: (item.filters || []) as unknown as Filter[],
      })) as ReportTemplate[];
    },
    enabled: !!user,
  });

  // Save template mutation
  const saveTemplateMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from('report_templates')
        .insert([{
          user_id: user.id,
          name: reportName,
          description: reportDescription || null,
          data_source: dataSource,
          metrics: selectedMetrics,
          group_by: groupBy || null,
          filters: JSON.parse(JSON.stringify(filters)),
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-templates'] });
      toast({
        title: "Template Saved",
        description: `"${reportName}" template saved successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error Saving Template",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const { error } = await supabase
        .from('report_templates')
        .delete()
        .eq('id', templateId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-templates'] });
      toast({
        title: "Template Deleted",
        description: "Template removed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Deleting Template",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const loadTemplate = (template: ReportTemplate) => {
    setReportName(template.name);
    setReportDescription(template.description || "");
    setDataSource(template.data_source);
    setSelectedMetrics(template.metrics);
    setGroupBy(template.group_by || "");
    setFilters(template.filters);
    setLoadDialogOpen(false);
    toast({
      title: "Template Loaded",
      description: `"${template.name}" configuration loaded`,
    });
  };

  const clearForm = () => {
    setReportName("");
    setReportDescription("");
    setDataSource("");
    setSelectedMetrics([]);
    setGroupBy("");
    setFilters([]);
  };

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId)
        ? prev.filter((id) => id !== metricId)
        : [...prev, metricId]
    );
  };

  const addFilter = (field: string) => {
    if (!filters.find((f) => f.field === field)) {
      setFilters([...filters, { field, values: [] }]);
    }
    setShowAddFilter(false);
  };

  const removeFilter = (field: string) => {
    setFilters(filters.filter((f) => f.field !== field));
  };

  const toggleFilterValue = (field: string, value: string) => {
    setFilters((prev) =>
      prev.map((f) =>
        f.field === field
          ? {
              ...f,
              values: f.values.includes(value)
                ? f.values.filter((v) => v !== value)
                : [...f.values, value],
            }
          : f
      )
    );
  };

  const handleRunReport = () => {
    if (!reportName || !dataSource || selectedMetrics.length === 0) {
      toast({
        title: "Missing Configuration",
        description: "Please fill in report name, data source, and at least one metric",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Report Running",
      description: `Generating "${reportName}" report...`,
    });
  };

  const handleSaveTemplate = () => {
    if (!reportName) {
      toast({
        title: "Report Name Required",
        description: "Please enter a name for the report template",
        variant: "destructive",
      });
      return;
    }
    if (!dataSource) {
      toast({
        title: "Data Source Required",
        description: "Please select a data source",
        variant: "destructive",
      });
      return;
    }
    if (selectedMetrics.length === 0) {
      toast({
        title: "Metrics Required",
        description: "Please select at least one metric",
        variant: "destructive",
      });
      return;
    }
    saveTemplateMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Advanced Report Builder</CardTitle>
          </div>
          <div className="flex gap-2">
            <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Load Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Load Report Template</DialogTitle>
                  <DialogDescription>
                    Select a saved template to load its configuration
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {templatesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : templates && templates.length > 0 ? (
                    templates.map((template) => (
                      <div
                        key={template.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => loadTemplate(template)}
                        >
                          <p className="font-medium">{template.name}</p>
                          {template.description && (
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          )}
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {dataSources.find(d => d.id === template.data_source)?.label || template.data_source}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {template.metrics.length} metrics
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTemplateMutation.mutate(template.id);
                          }}
                          disabled={deleteTemplateMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No saved templates</p>
                      <p className="text-sm">Create and save a template to see it here</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm" onClick={clearForm}>
              Clear
            </Button>
          </div>
        </div>
        <CardDescription>
          Create custom reports with flexible data sources, metrics, and filters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-name">Report Name</Label>
            <Input
              id="report-name"
              placeholder="Enter report name..."
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-desc">Description (Optional)</Label>
            <Input
              id="report-desc"
              placeholder="Brief description..."
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Data Source */}
        <div className="space-y-2">
          <Label>Data Source</Label>
          <Select value={dataSource} onValueChange={setDataSource}>
            <SelectTrigger>
              <SelectValue placeholder="Select data source" />
            </SelectTrigger>
            <SelectContent>
              {dataSources.map((source) => (
                <SelectItem key={source.id} value={source.id}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Metrics */}
        <div className="space-y-2">
          <Label>Metrics</Label>
          <div className="flex flex-wrap gap-2">
            {metrics.map((metric) => (
              <div key={metric.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`metric-${metric.id}`}
                  checked={selectedMetrics.includes(metric.id)}
                  onCheckedChange={() => toggleMetric(metric.id)}
                />
                <Label htmlFor={`metric-${metric.id}`} className="text-sm cursor-pointer">
                  {metric.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Group By */}
        <div className="space-y-2">
          <Label>Group By</Label>
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger>
              <SelectValue placeholder="Select grouping" />
            </SelectTrigger>
            <SelectContent>
              {groupByOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Filters</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddFilter(!showAddFilter)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Filter
            </Button>
          </div>

          {showAddFilter && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
              {filterFields
                .filter((f) => !filters.find((filter) => filter.field === f.id))
                .map((field) => (
                  <Button
                    key={field.id}
                    variant="secondary"
                    size="sm"
                    onClick={() => addFilter(field.id)}
                  >
                    {field.label}
                  </Button>
                ))}
            </div>
          )}

          {filters.map((filter) => {
            const fieldConfig = filterFields.find((f) => f.id === filter.field);
            return (
              <div
                key={filter.field}
                className="p-3 border rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{fieldConfig?.label}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(filter.field)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {fieldConfig?.options.map((option) => (
                    <Badge
                      key={option}
                      variant={filter.values.includes(option) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleFilterValue(filter.field, option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleRunReport} className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Run Report
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSaveTemplate}
            disabled={saveTemplateMutation.isPending}
          >
            {saveTemplateMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
