import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, Smartphone, Check, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const integrations = [
  {
    id: "slack",
    name: "Slack",
    icon: MessageSquare,
    color: "text-purple-500",
    connected: true,
    config: { webhook: "https://hooks.slack.com/services/...", channel: "#security-alerts" },
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    icon: MessageSquare,
    color: "text-blue-600",
    connected: true,
    config: { webhook: "https://outlook.office.com/webhook/...", channel: "Security Team" },
  },
  {
    id: "email",
    name: "Email SMTP",
    icon: Mail,
    color: "text-blue-500",
    connected: true,
    config: { server: "smtp.company.com", port: "587", from: "alerts@company.com" },
  },
  {
    id: "sms",
    name: "SMS Gateway",
    icon: Smartphone,
    color: "text-green-500",
    connected: false,
    config: { provider: "Twilio", apiKey: "" },
  },
];

export const IntegrationSettings = () => {
  const [showConfig, setShowConfig] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    toast.success(`${id} integration configured successfully`);
    setShowConfig(null);
  };

  const handleTest = (name: string) => {
    toast.success(`Test alert sent to ${name}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Integration Settings
        </CardTitle>
        <CardDescription>Configure communication channels for alert delivery</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <div
                key={integration.id}
                className="border border-border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-accent rounded-lg`}>
                      <Icon className={`h-5 w-5 ${integration.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{integration.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {integration.connected ? "Connected" : "Not configured"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={integration.connected ? "default" : "secondary"}>
                    {integration.connected ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </>
                    ) : (
                      "Inactive"
                    )}
                  </Badge>
                </div>

                {showConfig === integration.id ? (
                  <div className="space-y-3 pt-2">
                    {Object.entries(integration.config).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <Label htmlFor={`${integration.id}-${key}`} className="text-xs capitalize">
                          {key}
                        </Label>
                        <Input
                          id={`${integration.id}-${key}`}
                          defaultValue={value}
                          placeholder={`Enter ${key}`}
                          className="h-8"
                        />
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleConnect(integration.name)}
                        className="flex-1"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowConfig(null)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowConfig(integration.id)}
                      className="flex-1"
                    >
                      Configure
                    </Button>
                    {integration.connected && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTest(integration.name)}
                        className="flex-1"
                      >
                        Test
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
