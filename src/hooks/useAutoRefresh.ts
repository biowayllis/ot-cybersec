import { useState, useEffect, useCallback } from "react";

export type RefreshInterval = "off" | "30s" | "1m" | "5m";

const intervalToMs: Record<RefreshInterval, number | null> = {
  off: null,
  "30s": 30000,
  "1m": 60000,
  "5m": 300000,
};

export const useAutoRefresh = (onRefresh: () => void, defaultInterval: RefreshInterval = "off") => {
  const [interval, setInterval] = useState<RefreshInterval>(defaultInterval);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const triggerRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      setLastRefresh(new Date());
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  useEffect(() => {
    const ms = intervalToMs[interval];
    if (!ms) return;

    const timer = window.setInterval(() => {
      triggerRefresh();
    }, ms);

    return () => window.clearInterval(timer);
  }, [interval, triggerRefresh]);

  return {
    interval,
    setInterval,
    lastRefresh,
    isRefreshing,
    triggerRefresh,
  };
};
