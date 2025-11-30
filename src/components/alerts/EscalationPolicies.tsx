import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Users, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const escalationPolicies = [
  {
    id: 1,
    name: "Critical Security Incidents",
    enabled: true,
    steps: [
      { level: 1, role: "SOC Analyst", timeout: 5, contacts: ["SMS", "Email", "Slack"] },
      { level: 2, role: "Security Manager", timeout: 15, contacts: ["SMS", "Email", "Teams"] },
      { level: 3, role: "CISO", timeout: 30, contacts: ["SMS", "Email"] },
    ],
  },
  {
    id: 2,
    name: "OT/ICS Anomalies",
    enabled: true,
    steps: [
      { level: 1, role: "OT Engineer", timeout: 10, contacts: ["SMS", "Slack"] },
      { level: 2, role: "OT Manager", timeout: 20, contacts: ["SMS", "Email"] },
      { level: 3, role: "Operations Director", timeout: 45, contacts: ["SMS", "Email", "Teams"] },
    ],
  },
  {
    id: 3,
    name: "Compliance Violations",
    enabled: false,
    steps: [
      { level: 1, role: "Compliance Officer", timeout: 30, contacts: ["Email", "Slack"] },
      { level: 2, role: "GRC Manager", timeout: 60, contacts: ["Email", "Teams"] },
    ],
  },
];

export const EscalationPolicies = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Escalation Policies
            </CardTitle>
            <CardDescription>Define alert escalation workflows and timeouts</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Policy
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {escalationPolicies.map((policy) => (
              <div
                key={policy.id}
                className="border border-border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{policy.name}</h4>
                    <Badge variant={policy.enabled ? "default" : "secondary"}>
                      {policy.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
                <div className="space-y-2">
                  {policy.steps.map((step) => (
                    <div
                      key={step.level}
                      className="flex items-center gap-4 text-sm p-2 bg-accent/30 rounded"
                    >
                      <Badge variant="outline" className="min-w-[60px]">
                        Level {step.level}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span className="font-medium">{step.role}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{step.timeout} min</span>
                      </div>
                      <div className="flex gap-1">
                        {step.contacts.map((contact) => (
                          <Badge key={contact} variant="secondary" className="text-xs">
                            {contact}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
