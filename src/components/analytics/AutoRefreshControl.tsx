import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, Clock } from "lucide-react";
import { type RefreshInterval } from "@/hooks/useAutoRefresh";
import { cn } from "@/lib/utils";

interface AutoRefreshControlProps {
  interval: RefreshInterval;
  onIntervalChange: (interval: RefreshInterval) => void;
  lastRefresh: Date;
  isRefreshing: boolean;
  onManualRefresh: () => void;
}

const intervalOptions: { value: RefreshInterval; label: string }[] = [
  { value: "off", label: "Auto-refresh off" },
  { value: "30s", label: "Every 30 seconds" },
  { value: "1m", label: "Every 1 minute" },
  { value: "5m", label: "Every 5 minutes" },
];

export const AutoRefreshControl = ({
  interval,
  onIntervalChange,
  lastRefresh,
  isRefreshing,
  onManualRefresh,
}: AutoRefreshControlProps) => {
  const formatLastRefresh = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Last updated: {formatLastRefresh(lastRefresh)}</span>
      </div>
      
      <Select value={interval} onValueChange={(value) => onIntervalChange(value as RefreshInterval)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {intervalOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={onManualRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
        Refresh
      </Button>
    </div>
  );
};
