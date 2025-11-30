import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin } from "lucide-react";

interface ThreatLocation {
  country: string;
  count: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  coordinates: { x: number; y: number };
}

const mockThreatData: ThreatLocation[] = [
  { country: "Russia", count: 47, severity: "critical", coordinates: { x: 75, y: 25 } },
  { country: "China", count: 32, severity: "high", coordinates: { x: 80, y: 35 } },
  { country: "Iran", count: 18, severity: "high", coordinates: { x: 65, y: 40 } },
  { country: "Brazil", count: 12, severity: "medium", coordinates: { x: 30, y: 65 } },
  { country: "India", count: 8, severity: "low", coordinates: { x: 75, y: 45 } },
];

const severityColors = {
  critical: 'bg-critical',
  high: 'bg-high',
  medium: 'bg-medium',
  low: 'bg-low'
};

export const ThreatMap = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-primary" />
            <span>Global Threat Map</span>
          </CardTitle>
          <Badge variant="outline" className="text-primary border-primary/30">
            Real-time
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Simplified world map background */}
          <div className="h-64 bg-secondary/20 rounded-lg relative overflow-hidden border border-border">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
            
            {/* Threat indicators */}
            {mockThreatData.map((threat, index) => (
              <div
                key={threat.country}
                className="absolute group"
                style={{ 
                  left: `${threat.coordinates.x}%`, 
                  top: `${threat.coordinates.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className={`w-3 h-3 rounded-full ${severityColors[threat.severity]} animate-pulse-glow cursor-pointer transition-all duration-300 hover:scale-150`}></div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <div className="bg-popover border border-border rounded-lg p-2 text-xs whitespace-nowrap shadow-lg">
                    <div className="font-semibold text-foreground">{threat.country}</div>
                    <div className="text-muted-foreground">{threat.count} threats</div>
                    <div className={`text-${threat.severity} capitalize font-medium`}>
                      {threat.severity} severity
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-critical"></div>
              <span className="text-muted-foreground">Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-high"></div>
              <span className="text-muted-foreground">High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-medium"></div>
              <span className="text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-low"></div>
              <span className="text-muted-foreground">Low</span>
            </div>
          </div>
        </div>
        
        {/* Top threats list */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">Top Threat Sources</h4>
          <div className="space-y-2">
            {mockThreatData.slice(0, 3).map((threat) => (
              <div key={threat.country} className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{threat.country}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{threat.count} threats</span>
                  <Badge variant="outline" className={`text-${threat.severity} border-${threat.severity}/30`}>
                    {threat.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};