import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, MapPin } from "lucide-react";

export interface Alert {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  source: string;
  location: string;
  description: string;
}

interface AlertCardProps {
  alert: Alert;
}

const severityConfig = {
  critical: { 
    color: 'critical',
    bgClass: 'bg-critical/10 border-critical/20',
    textClass: 'text-critical'
  },
  high: { 
    color: 'high',
    bgClass: 'bg-high/10 border-high/20',
    textClass: 'text-high'
  },
  medium: { 
    color: 'medium',
    bgClass: 'bg-medium/10 border-medium/20',
    textClass: 'text-medium'
  },
  low: { 
    color: 'low',
    bgClass: 'bg-low/10 border-low/20',
    textClass: 'text-low'
  }
};

export const AlertCard = ({ alert }: AlertCardProps) => {
  const config = severityConfig[alert.severity];
  
  return (
    <Card className={`${config.bgClass} border animate-slide-up hover:shadow-lg transition-all duration-300`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className={`h-5 w-5 ${config.textClass}`} />
            <CardTitle className="text-lg font-semibold text-foreground">{alert.title}</CardTitle>
          </div>
          <Badge variant="outline" className={`${config.textClass} border-current`}>
            {alert.severity.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4">{alert.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{alert.timestamp}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{alert.location}</span>
          </div>
          
          <div className="text-sm">
            <span className="text-muted-foreground">Source: </span>
            <span className="text-foreground font-medium">{alert.source}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};