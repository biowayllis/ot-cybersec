import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Mail, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const scheduledReports = [
  {
    id: 1,
    name: "Weekly Security Summary",
    frequency: "Weekly",
    schedule: "Monday 9:00 AM",
    recipients: "security-team@icscore.com",
    format: "PDF",
    status: "active",
  },
  {
    id: 2,
    name: "Monthly Compliance Report",
    frequency: "Monthly",
    schedule: "1st of month, 8:00 AM",
    recipients: "compliance@icscore.com",
    format: "Excel",
    status: "active",
  },
  {
    id: 3,
    name: "Daily Threat Intelligence",
    frequency: "Daily",
    schedule: "7:00 AM",
    recipients: "soc-team@icscore.com",
    format: "PDF",
    status: "active",
  },
  {
    id: 4,
    name: "Quarterly Executive Report",
    frequency: "Quarterly",
    schedule: "1st of quarter, 9:00 AM",
    recipients: "executives@icscore.com",
    format: "PDF",
    status: "paused",
  },
];

export const ReportScheduler = () => {
  const { toast } = useToast();

  const handleDelete = (reportName: string) => {
    toast({
      title: "Report Deleted",
      description: `"${reportName}" has been removed from scheduled reports`,
    });
  };

  const handleNewSchedule = () => {
    toast({
      title: "Coming Soon",
      description: "Report scheduling wizard will open here",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>Scheduled Reports</CardTitle>
          </div>
          <Button onClick={handleNewSchedule} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Schedule
          </Button>
        </div>
        <CardDescription>
          Automated report generation and distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scheduledReports.map((report) => (
            <div
              key={report.id}
              className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{report.name}</h4>
                  <Badge variant={report.status === "active" ? "default" : "secondary"}>
                    {report.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{report.frequency} - {report.schedule}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{report.recipients}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Format:</span>
                    <span>{report.format}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(report.name)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
