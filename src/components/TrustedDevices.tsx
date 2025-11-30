import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Shield, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  ShieldCheck 
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
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

interface Device {
  id: string;
  device_name: string | null;
  browser: string | null;
  browser_version: string | null;
  os: string | null;
  os_version: string | null;
  device_type: string | null;
  screen_resolution: string | null;
  is_trusted: boolean;
  last_used_at: string;
  first_seen_at: string;
}

const getDeviceIcon = (deviceType: string | null) => {
  switch (deviceType?.toLowerCase()) {
    case "mobile":
      return <Smartphone className="h-5 w-5" />;
    case "tablet":
      return <Tablet className="h-5 w-5" />;
    default:
      return <Monitor className="h-5 w-5" />;
  }
};

export const TrustedDevices = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: devices, isLoading } = useQuery({
    queryKey: ['user-devices', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_devices')
        .select('*')
        .eq('user_id', user.id)
        .order('last_used_at', { ascending: false });

      if (error) throw error;
      return data as Device[];
    },
    enabled: !!user,
  });

  const updateDeviceMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Device> }) => {
      const { error } = await supabase
        .from('user_devices')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-devices', user?.id] });
      toast.success("Device updated successfully");
      setEditingId(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update device");
    },
  });

  const deleteDeviceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_devices')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-devices', user?.id] });
      toast.success("Device removed successfully");
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove device");
    },
  });

  const handleStartEdit = (device: Device) => {
    setEditingId(device.id);
    setEditName(device.device_name || "");
  };

  const handleSaveEdit = (id: string) => {
    updateDeviceMutation.mutate({ id, updates: { device_name: editName } });
  };

  const handleToggleTrust = (device: Device) => {
    updateDeviceMutation.mutate({ 
      id: device.id, 
      updates: { is_trusted: !device.is_trusted } 
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Trusted Devices
          </CardTitle>
          <CardDescription>Manage your registered devices</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Trusted Devices
          </CardTitle>
          <CardDescription>
            Manage your registered devices and receive alerts for new device logins
          </CardDescription>
        </CardHeader>
        <CardContent>
          {devices && devices.length > 0 ? (
            <div className="space-y-3">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="mt-1 text-muted-foreground">
                    {getDeviceIcon(device.device_type)}
                  </div>

                  <div className="flex-1 space-y-2">
                    {editingId === device.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Device name"
                          className="max-w-xs"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSaveEdit(device.id)}
                          disabled={updateDeviceMutation.isPending}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {device.device_name || "Unnamed Device"}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(device)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>
                        {device.browser} {device.browser_version} on {device.os} {device.os_version}
                      </div>
                      {device.screen_resolution && (
                        <div className="text-xs">
                          Screen: {device.screen_resolution}
                        </div>
                      )}
                      <div className="text-xs">
                        Last used: {format(new Date(device.last_used_at), "PPpp")}
                      </div>
                      <div className="text-xs text-muted-foreground/70">
                        First seen: {format(new Date(device.first_seen_at), "PP")}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant={device.is_trusted ? "secondary" : "outline"}
                        onClick={() => handleToggleTrust(device)}
                        disabled={updateDeviceMutation.isPending}
                      >
                        {device.is_trusted ? (
                          <>
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Trusted
                          </>
                        ) : (
                          <>
                            <Shield className="h-3 w-3 mr-1" />
                            Mark as Trusted
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteId(device.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  {device.is_trusted && (
                    <Badge variant="secondary" className="mt-1">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Trusted
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No devices registered yet</p>
              <p className="text-xs mt-2">Devices will appear here after your next login</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Device?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this device? You'll need to log in again from this device to re-register it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteDeviceMutation.mutate(deleteId)}
              disabled={deleteDeviceMutation.isPending}
            >
              {deleteDeviceMutation.isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};