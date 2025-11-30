import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Filter } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  ip?: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:32:18",
    level: "critical",
    source: "Firewall",
    message: "Multiple failed authentication attempts detected",
    ip: "192.168.1.100"
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:31:45",
    level: "warning",
    source: "IDS",
    message: "Suspicious network activity from external source",
    ip: "203.0.113.0"
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:30:22",
    level: "info",
    source: "Access Control",
    message: "User login successful",
    ip: "10.0.0.50"
  },
  {
    id: "4",
    timestamp: "2024-01-15 14:29:15",
    level: "error",
    source: "Antivirus",
    message: "Malware signature detected and quarantined",
    ip: "172.16.0.25"
  },
  {
    id: "5",
    timestamp: "2024-01-15 14:28:03",
    level: "info",
    source: "VPN",
    message: "VPN connection established",
    ip: "198.51.100.0"
  }
];

const levelConfig = {
  info: { bgClass: 'bg-primary/10', textClass: 'text-primary', badgeClass: 'bg-primary/20 text-primary' },
  warning: { bgClass: 'bg-medium/10', textClass: 'text-medium', badgeClass: 'bg-medium/20 text-medium' },
  error: { bgClass: 'bg-high/10', textClass: 'text-high', badgeClass: 'bg-high/20 text-high' },
  critical: { bgClass: 'bg-critical/10', textClass: 'text-critical', badgeClass: 'bg-critical/20 text-critical' }
};

export const LogViewer = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Terminal className="h-5 w-5 text-primary" />
            <span>Security Logs</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-primary border-primary/30">
              <Filter className="h-3 w-3 mr-1" />
              All Levels
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-2">
            {mockLogs.map((log) => {
              const config = levelConfig[log.level];
              return (
                <div 
                  key={log.id} 
                  className={`p-3 rounded-lg border ${config.bgClass} border-${log.level}/20 animate-slide-up hover:shadow-sm transition-all duration-200`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={`${config.badgeClass} border-0 text-xs`}>
                        {log.level.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium text-foreground">{log.source}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                  </div>
                  
                  <p className="text-sm text-foreground mb-2">{log.message}</p>
                  
                  {log.ip && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="font-mono bg-secondary/50 px-2 py-1 rounded">
                        {log.ip}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
          <span>Showing {mockLogs.length} recent entries</span>
          <span className="text-primary cursor-pointer hover:underline">View all logs →</span>
        </div>
      </CardContent>
    </Card>
  );
};