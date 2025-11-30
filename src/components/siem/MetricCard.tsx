import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  status?: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  description?: string;
}

const statusConfig = {
  safe: { 
    bgClass: 'bg-safe/10 border-safe/20',
    textClass: 'text-safe',
    badgeClass: 'bg-safe/20 text-safe border-safe/30'
  },
  low: { 
    bgClass: 'bg-low/10 border-low/20',
    textClass: 'text-low',
    badgeClass: 'bg-low/20 text-low border-low/30'
  },
  medium: { 
    bgClass: 'bg-medium/10 border-medium/20',
    textClass: 'text-medium',
    badgeClass: 'bg-medium/20 text-medium border-medium/30'
  },
  high: { 
    bgClass: 'bg-high/10 border-high/20',
    textClass: 'text-high',
    badgeClass: 'bg-high/20 text-high border-high/30'
  },
  critical: { 
    bgClass: 'bg-critical/10 border-critical/20',
    textClass: 'text-critical',
    badgeClass: 'bg-critical/20 text-critical border-critical/30'
  }
};

export const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  status = 'safe',
  description 
}: MetricCardProps) => {
  const config = statusConfig[status];
  
  return (
    <Card className={`${config.bgClass} border hover:shadow-lg transition-all duration-300 animate-slide-up`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${config.textClass}`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <Badge className={config.badgeClass}>
              {status.toUpperCase()}
            </Badge>
            
            {trend && (
              <div className={`text-xs flex items-center ${
                trend.isPositive ? 'text-safe' : 'text-critical'
              }`}>
                <span>{trend.isPositive ? '↗' : '↙'}</span>
                <span className="ml-1">{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};