import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Monitor, Smartphone, Tablet, LogOut, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface Session {
  id: string;
  device_id: string;
  session_token: string;
  is_revoked: boolean;
  last_active_at: string;
  created_at: string;
  user_devices: {
    device_name: string;
    browser: string;
    os: string;
    device_type: string;
    is_trusted: boolean;
  };
}

const getDeviceIcon = (deviceType: string) => {
  switch (deviceType?.toLowerCase()) {
    case "mobile":
      return Smartphone;
    case "tablet":
      return Tablet;
    default:
      return Monitor;
  }
};

export const SessionManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [showRevokeAll, setShowRevokeAll] = useState(false);

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["user-sessions"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentToken = session?.access_token;

      const { data, error } = await supabase
        .from("user_sessions")
        .select(`
          *,
          user_devices (
            device_name,
            browser,
            os,
            device_type,
            is_trusted
          )
        `)
        .eq("is_revoked", false)
        .order("last_active_at", { ascending: false });

      if (error) throw error;

      // Mark current session
      return data?.map((s: Session) => ({
        ...s,
        isCurrent: s.session_token === currentToken,
      })) || [];
    },
  });

  const revokeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const { data, error } = await supabase.functions.invoke("revoke-session", {
        body: { sessionId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-sessions"] });
      toast({
        title: "Session revoked",
        description: "The session has been successfully terminated.",
      });
      setRevokeId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const revokeAllOthersMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("revoke-session", {
        body: { revokeAllOthers: true },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-sessions"] });
      toast({
        title: "Sessions revoked",
        description: "All other sessions have been successfully terminated.",
      });
      setShowRevokeAll(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  const activeSessions = sessions?.filter((s: any) => !s.is_revoked) || [];
  const currentSession = activeSessions.find((s: any) => s.isCurrent);
  const otherSessions = activeSessions.filter((s: any) => !s.isCurrent);

  return (
    <>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Active Sessions</h3>
              <p className="text-sm text-muted-foreground">
                Manage your active sessions across all devices
              </p>
            </div>
            {otherSessions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRevokeAll(true)}
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out all other sessions
              </Button>
            )}
          </div>

          {activeSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active sessions found.</p>
          ) : (
            <div className="space-y-4">
              {currentSession && (
                <div className="border rounded-lg p-4 bg-accent/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {(() => {
                        const Icon = getDeviceIcon(currentSession.user_devices?.device_type);
                        return <Icon className="h-5 w-5 mt-1 text-primary" />;
                      })()}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {currentSession.user_devices?.device_name || "Unknown Device"}
                          </p>
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                            Current Session
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {currentSession.user_devices?.browser} · {currentSession.user_devices?.os}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last active: {format(new Date(currentSession.last_active_at), "PPp")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {otherSessions.map((session: any) => {
                const Icon = getDeviceIcon(session.user_devices?.device_type);
                return (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-1" />
                        <div>
                          <p className="font-medium">
                            {session.user_devices?.device_name || "Unknown Device"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {session.user_devices?.browser} · {session.user_devices?.os}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last active: {format(new Date(session.last_active_at), "PPp")}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRevokeId(session.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      <AlertDialog open={!!revokeId} onOpenChange={() => setRevokeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke this session? The device will be logged out immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => revokeId && revokeSessionMutation.mutate(revokeId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRevokeAll} onOpenChange={setShowRevokeAll}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Revoke All Other Sessions
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will log out all other devices except the current one. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => revokeAllOthersMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
