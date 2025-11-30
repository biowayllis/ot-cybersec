import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    email: {
      critical: true,
      high: true,
      medium: false,
      low: false,
    },
    sms: {
      critical: true,
      high: false,
      medium: false,
      low: false,
    },
    slack: {
      critical: true,
      high: true,
      medium: true,
      low: false,
    },
    teams: {
      critical: true,
      high: true,
      medium: false,
      low: false,
    },
  });

  const handleToggle = (channel: keyof typeof preferences, severity: string) => {
    setPreferences((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [severity]: !prev[channel][severity as keyof typeof prev.email],
      },
    }));
  };

  const handleSave = () => {
    toast.success("Notification preferences updated successfully");
  };

  const channels = [
    { key: "email", label: "Email", icon: Mail, color: "text-blue-500" },
    { key: "sms", label: "SMS", icon: Smartphone, color: "text-green-500" },
    { key: "slack", label: "Slack", icon: MessageSquare, color: "text-purple-500" },
    { key: "teams", label: "Teams", icon: MessageSquare, color: "text-blue-600" },
  ];

  const severityLevels = [
    { key: "critical", label: "Critical", color: "text-destructive" },
    { key: "high", label: "High", color: "text-orange-500" },
    { key: "medium", label: "Medium", color: "text-yellow-500" },
    { key: "low", label: "Low", color: "text-blue-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>Configure how you receive alerts by severity level</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <div key={channel.key} className="space-y-3">
              <div className="flex items-center gap-2 font-medium">
                <Icon className={`h-4 w-4 ${channel.color}`} />
                <span>{channel.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pl-6">
                {severityLevels.map((severity) => (
                  <div key={severity.key} className="flex items-center justify-between">
                    <Label htmlFor={`${channel.key}-${severity.key}`} className={severity.color}>
                      {severity.label}
                    </Label>
                    <Switch
                      id={`${channel.key}-${severity.key}`}
                      checked={preferences[channel.key as keyof typeof preferences][severity.key as keyof typeof preferences.email]}
                      onCheckedChange={() => handleToggle(channel.key as keyof typeof preferences, severity.key)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <Button onClick={handleSave} className="w-full">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
};
