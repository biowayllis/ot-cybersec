import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface StatusIndicatorProps {
  label: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  lastUpdate?: string;
}

const statusConfig = {
  online: {
    color: 'safe',
    bgClass: 'bg-safe/20',
    textClass: 'text-safe',
    dotClass: 'bg-safe animate-pulse'
  },
  offline: {
    color: 'muted',
    bgClass: 'bg-muted/20',
    textClass: 'text-muted-foreground',
    dotClass: 'bg-muted-foreground'
  },
  warning: {
    color: 'medium',
    bgClass: 'bg-medium/20',
    textClass: 'text-medium',
    dotClass: 'bg-medium animate-pulse'
  },
  error: {
    color: 'critical',
    bgClass: 'bg-critical/20',
    textClass: 'text-critical',
    dotClass: 'bg-critical animate-pulse'
  }
};

export const StatusIndicator = ({ label, status, lastUpdate }: StatusIndicatorProps) => {
  const config = statusConfig[status];
  
  return (
    <Card className={`${config.bgClass} border border-${config.color}/20`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${config.dotClass}`}></div>
            <span className="text-sm font-medium text-foreground">{label}</span>
          </div>
          
          <Badge variant="outline" className={`${config.textClass} border-current text-xs`}>
            {status.toUpperCase()}
          </Badge>
        </div>
        
        {lastUpdate && (
          <div className="mt-2 text-xs text-muted-foreground">
            Last updated: {lastUpdate}
          </div>
        )}
      </CardContent>
    </Card>
  );
};