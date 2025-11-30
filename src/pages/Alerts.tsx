import { AlertCenter } from "@/components/alerts/AlertCenter";
import { NotificationPreferences } from "@/components/alerts/NotificationPreferences";
import { EscalationPolicies } from "@/components/alerts/EscalationPolicies";
import { IntegrationSettings } from "@/components/alerts/IntegrationSettings";

const Alerts = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Alert Management Center</h1>
        <p className="text-muted-foreground">
          Configure real-time notifications, escalation policies, and communication integrations
        </p>
      </div>

      <AlertCenter />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationPreferences />
        <EscalationPolicies />
      </div>

      <IntegrationSettings />
    </div>
  );
};

export default Alerts;
