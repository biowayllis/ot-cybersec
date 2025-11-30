import { ComplianceMetrics } from "@/components/compliance/ComplianceMetrics";
import { ComplianceFrameworks } from "@/components/compliance/ComplianceFrameworks";
import { ControlEffectiveness } from "@/components/compliance/ControlEffectiveness";
import { AuditTrail } from "@/components/compliance/AuditTrail";

const Compliance = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Compliance & GRC</h1>
        <p className="text-muted-foreground">
          Framework mapping, control effectiveness tracking, and audit management
        </p>
      </div>

      <ComplianceMetrics />

      <ComplianceFrameworks />

      <ControlEffectiveness />

      <AuditTrail />
    </div>
  );
};

export default Compliance;
