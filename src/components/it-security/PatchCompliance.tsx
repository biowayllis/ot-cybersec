import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const PatchCompliance = () => {
  const overallCompliance = 87;
  
  const categories = [
    {
      name: "Operating Systems",
      compliant: 1847,
      pending: 142,
      overdue: 23,
      compliance: 93,
    },
    {
      name: "Applications",
      compliant: 2341,
      pending: 287,
      overdue: 51,
      compliance: 87,
    },
    {
      name: "Security Software",
      compliant: 2784,
      pending: 89,
      overdue: 8,
      compliance: 97,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Patch Compliance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
          <div className="text-5xl font-bold text-primary mb-2">{overallCompliance}%</div>
          <div className="text-sm text-muted-foreground">Overall IT Patch Compliance</div>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{category.name}</span>
                <span className="text-sm text-muted-foreground">{category.compliance}%</span>
              </div>
              
              <Progress value={category.compliance} className="h-2" />
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1 text-safe">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{category.compliant} Compliant</span>
                </div>
                <div className="flex items-center gap-1 text-medium">
                  <Clock className="h-3 w-3" />
                  <span>{category.pending} Pending</span>
                </div>
                <div className="flex items-center gap-1 text-critical">
                  <AlertCircle className="h-3 w-3" />
                  <span>{category.overdue} Overdue</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">Upcoming Patch Windows</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm p-2 rounded bg-muted/30">
              <span>Production Servers</span>
              <span className="text-primary font-medium">Sat, 11:00 PM</span>
            </div>
            <div className="flex items-center justify-between text-sm p-2 rounded bg-muted/30">
              <span>Workstations</span>
              <span className="text-primary font-medium">Sun, 02:00 AM</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
