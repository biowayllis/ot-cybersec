import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, TrendingUp } from "lucide-react";

const mockChartData = [
  { time: "00:00", threats: 12, blocked: 11, allowed: 1 },
  { time: "04:00", threats: 8, blocked: 7, allowed: 1 },
  { time: "08:00", threats: 25, blocked: 23, allowed: 2 },
  { time: "12:00", threats: 18, blocked: 16, allowed: 2 },
  { time: "16:00", threats: 32, blocked: 29, allowed: 3 },
  { time: "20:00", threats: 15, blocked: 14, allowed: 1 },
];

export const SecurityChart = () => {
  const maxValue = Math.max(...mockChartData.map(d => d.threats));
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart className="h-5 w-5 text-primary" />
            <span>Threat Activity (24h)</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-safe border-safe/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              98.2% Blocked
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <div className="h-40 flex items-end justify-between gap-2">
            {mockChartData.map((data, index) => (
              <div key={data.time} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center space-y-1 mb-2">
                  {/* Blocked threats bar */}
                  <div 
                    className="w-full bg-safe/80 rounded-t transition-all duration-500 hover:bg-safe"
                    style={{ 
                      height: `${(data.blocked / maxValue) * 120}px`,
                      minHeight: '4px'
                    }}
                  ></div>
                  
                  {/* Allowed threats bar */}
                  {data.allowed > 0 && (
                    <div 
                      className="w-full bg-critical/80 rounded-b transition-all duration-500 hover:bg-critical"
                      style={{ 
                        height: `${(data.allowed / maxValue) * 120}px`,
                        minHeight: '2px'
                      }}
                    ></div>
                  )}
                </div>
                
                <span className="text-xs text-muted-foreground">{data.time}</span>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-safe"></div>
              <span className="text-sm text-muted-foreground">Blocked</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-critical"></div>
              <span className="text-sm text-muted-foreground">Allowed</span>
            </div>
          </div>
          
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {mockChartData.reduce((sum, d) => sum + d.threats, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Threats</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-safe">
                {mockChartData.reduce((sum, d) => sum + d.blocked, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Blocked</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-critical">
                {mockChartData.reduce((sum, d) => sum + d.allowed, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Allowed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};