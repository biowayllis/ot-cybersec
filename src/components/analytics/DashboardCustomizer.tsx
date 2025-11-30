import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Settings2, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const widgets = [
  { id: "cyber-posture", label: "Cyber Posture Score", category: "Security" },
  { id: "risk-heatmap", label: "Risk Heatmap", category: "Security" },
  { id: "asset-overview", label: "Asset Overview", category: "Assets" },
  { id: "vulnerability-trends", label: "Vulnerability Trends", category: "Vulnerabilities" },
  { id: "compliance-status", label: "Compliance Status", category: "Compliance" },
  { id: "threat-activity", label: "Threat Activity", category: "SIEM" },
  { id: "incident-timeline", label: "Incident Timeline", category: "SIEM" },
  { id: "patch-compliance", label: "Patch Compliance", category: "IT Security" },
  { id: "ot-network-map", label: "OT Network Map", category: "OT Security" },
  { id: "audit-trail", label: "Audit Trail", category: "Compliance" },
];

export const DashboardCustomizer = () => {
  const { toast } = useToast();
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([
    "cyber-posture",
    "risk-heatmap",
    "asset-overview",
    "vulnerability-trends",
  ]);

  const toggleWidget = (widgetId: string) => {
    setSelectedWidgets((prev) =>
      prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const handleSave = () => {
    toast({
      title: "Dashboard Saved",
      description: `Successfully saved configuration with ${selectedWidgets.length} widgets`,
    });
  };

  const categories = Array.from(new Set(widgets.map((w) => w.category)));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <CardTitle>Customize Dashboard</CardTitle>
          </div>
          <Button onClick={handleSave} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Layout
          </Button>
        </div>
        <CardDescription>
          Select widgets to display on your personalized dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map((category) => (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">{category}</h4>
            <div className="grid grid-cols-1 gap-3">
              {widgets
                .filter((w) => w.category === category)
                .map((widget) => (
                  <div key={widget.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={widget.id}
                      checked={selectedWidgets.includes(widget.id)}
                      onCheckedChange={() => toggleWidget(widget.id)}
                    />
                    <Label
                      htmlFor={widget.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {widget.label}
                    </Label>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
