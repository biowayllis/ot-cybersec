import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileSpreadsheet, FileText, File } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const exportOptions = [
  { value: "executive", label: "Executive Summary" },
  { value: "security", label: "Security Posture Report" },
  { value: "compliance", label: "Compliance Report" },
  { value: "vulnerability", label: "Vulnerability Report" },
  { value: "incident", label: "Incident Response Report" },
  { value: "asset", label: "Asset Inventory Report" },
];

const formatOptions = [
  { value: "pdf", label: "PDF Document", icon: FileText },
  { value: "csv", label: "CSV Spreadsheet", icon: FileSpreadsheet },
  { value: "excel", label: "Excel Workbook", icon: FileSpreadsheet },
  { value: "json", label: "JSON Data", icon: File },
];

export const DataExport = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState("executive");
  const [format, setFormat] = useState("pdf");

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: `Generating ${exportOptions.find(o => o.value === reportType)?.label} in ${format.toUpperCase()} format...`,
    });

    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your report has been downloaded successfully",
      });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          <CardTitle>Export Reports</CardTitle>
        </div>
        <CardDescription>
          Download reports in multiple formats for offline analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="report-type">Report Type</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger id="report-type">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              {exportOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="format">Export Format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger id="format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {formatOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 space-y-3">
          <Button onClick={handleExport} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              Quick PDF
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <FileSpreadsheet className="h-3 w-3 mr-1" />
              Quick CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
