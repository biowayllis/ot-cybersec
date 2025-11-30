import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AuditLogEntry {
  id: string;
  event_type: string;
  event_details: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  success: boolean;
  created_at: string;
}

const getEventIcon = (eventType: string, success: boolean) => {
  if (!success) return <XCircle className="h-4 w-4 text-destructive" />;
  
  switch (eventType) {
    case "login":
    case "signup":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "logout":
      return <Shield className="h-4 w-4 text-muted-foreground" />;
    case "password_change":
    case "2fa_enabled":
    case "2fa_disabled":
    case "2fa_setup":
      return <Shield className="h-4 w-4 text-primary" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  }
};

const getEventLabel = (eventType: string) => {
  const labels: Record<string, string> = {
    login: "Login",
    login_failed: "Login Failed",
    logout: "Logout",
    signup: "Account Created",
    password_change: "Password Changed",
    "2fa_setup": "2FA Setup Initiated",
    "2fa_enabled": "2FA Enabled",
    "2fa_disabled": "2FA Disabled",
    "2fa_verified": "2FA Verified",
    "2fa_verification_failed": "2FA Verification Failed",
  };
  return labels[eventType] || eventType;
};

export const SecurityAuditLog = () => {
  const { user } = useAuth();

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['security-audit-log', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as AuditLogEntry[];
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Activity Log
          </CardTitle>
          <CardDescription>Recent security events on your account</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Activity Log
        </CardTitle>
        <CardDescription>
          Recent authentication and security events (last 50 entries)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {auditLogs && auditLogs.length > 0 ? (
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="mt-0.5">
                    {getEventIcon(log.event_type, log.success)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm">
                        {getEventLabel(log.event_type)}
                      </span>
                      <Badge variant={log.success ? "secondary" : "destructive"} className="text-xs">
                        {log.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <div>
                        {format(new Date(log.created_at), "PPpp")}
                      </div>
                      {log.ip_address && (
                        <div className="flex items-center gap-1">
                          <span className="font-mono">{log.ip_address}</span>
                        </div>
                      )}
                      {log.event_details && Object.keys(log.event_details).length > 0 && (
                        <div className="text-muted-foreground/80">
                          {Object.entries(log.event_details).map(([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No security events recorded yet</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};