import { SIEMMetrics } from "@/components/siem/SIEMMetrics";
import { EventMonitoring } from "@/components/siem/EventMonitoring";
import { ThreatHunting } from "@/components/siem/ThreatHunting";
import { IncidentResponse } from "@/components/siem/IncidentResponse";
import { LogViewer } from "@/components/siem/LogViewer";
import { ThreatMap } from "@/components/siem/ThreatMap";

const SIEMOperations = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">SIEM + XDR Operations Center</h1>
        <p className="text-muted-foreground">
          Real-time security monitoring, threat hunting, and incident response
        </p>
      </div>

      <SIEMMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventMonitoring />
        <ThreatMap />
      </div>

      <ThreatHunting />

      <IncidentResponse />

      <LogViewer />
    </div>
  );
};

export default SIEMOperations;
