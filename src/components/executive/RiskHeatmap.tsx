import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const RiskHeatmap = () => {
  const riskData = [
    { category: "Network", critical: 2, high: 5, medium: 12, low: 8 },
    { category: "Endpoints", critical: 1, high: 8, medium: 15, low: 22 },
    { category: "OT/ICS", critical: 3, high: 6, medium: 9, low: 4 },
    { category: "Cloud", critical: 0, high: 4, medium: 11, low: 18 },
    { category: "Applications", critical: 1, high: 7, medium: 14, low: 25 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-high" />
          Risk Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {riskData.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="text-sm font-medium">{item.category}</div>
              <div className="flex gap-1 h-6">
                {item.critical > 0 && (
                  <div 
                    className="bg-critical rounded flex items-center justify-center text-xs text-critical-foreground font-medium"
                    style={{ width: `${(item.critical / 30) * 100}%` }}
                  >
                    {item.critical}
                  </div>
                )}
                {item.high > 0 && (
                  <div 
                    className="bg-high rounded flex items-center justify-center text-xs text-high-foreground font-medium"
                    style={{ width: `${(item.high / 30) * 100}%` }}
                  >
                    {item.high}
                  </div>
                )}
                {item.medium > 0 && (
                  <div 
                    className="bg-medium rounded flex items-center justify-center text-xs text-medium-foreground font-medium"
                    style={{ width: `${(item.medium / 30) * 100}%` }}
                  >
                    {item.medium}
                  </div>
                )}
                {item.low > 0 && (
                  <div 
                    className="bg-low rounded flex items-center justify-center text-xs text-low-foreground font-medium"
                    style={{ width: `${(item.low / 30) * 100}%` }}
                  >
                    {item.low}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-4 mt-4 pt-4 border-t border-border text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-critical"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-high"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-medium"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-low"></div>
            <span>Low</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
